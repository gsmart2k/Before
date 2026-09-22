import { USDC, type Stock, type Quote, type Preview } from './market';
import {tokenDisplayConfig,displayTokenAmount} from './token-units';
let catalogCache:{stocks:Stock[];fetchedAt:string;expires:number}|undefined;
const mintCache=new Map<string,{decimals:number;multiplier:number;validUntil:number|null;expires:number}>();
const delay=(ms:number)=>new Promise(r=>setTimeout(r,ms));
async function json(url:string,init?:RequestInit):Promise<any>{
 for(let attempt=0;attempt<3;attempt++){
  const r=await fetch(url,{...init,signal:AbortSignal.timeout(18000)});
  if(r.status===429&&attempt<2){await delay(2200*(attempt+1));continue;}
  if(!r.ok)throw new Error(r.status===429?'Quote service is busy. Wait a few seconds and try again.':`Market data provider returned ${r.status}. Please retry.`);
  return r.json();
 }
 throw new Error('Market data is temporarily unavailable.');
}
export async function catalog(){
 if(catalogCache&&catalogCache.expires>Date.now())return catalogCache;
 const data=await json('https://prestocks.com/api/prestocks');
 if(!Array.isArray(data))throw new Error('PreStocks returned an unexpected catalog.');
 const stocks=data.filter((s:any)=>s.contract_address&&s.symbol&&[s.markPrice,s.markValuation,s.tokenPrice,s.impliedValuation].every((n:any)=>typeof n==='number'&&Number.isFinite(n)&&n>0)) as Stock[];
 if(!stocks.length)throw new Error('No verified PreStocks assets are available.');
 catalogCache={stocks,fetchedAt:new Date().toISOString(),expires:Date.now()+30000};return catalogCache;
}
export async function tokenUnits(mint:string){
 const cached=mintCache.get(mint);
 if(cached&&cached.expires>Date.now())return cached;
 const init={method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'getAccountInfo',params:[mint,{encoding:'jsonParsed',commitment:'confirmed'}]})};
 let data;
 try{data=await json('https://solana-rpc.publicnode.com',init);}catch{try{data=await json('https://api.mainnet-beta.solana.com',init);}catch{throw new Error('On-chain token display settings are temporarily unavailable. Please retry.');}}
 const account=data.result?.value,parsed=account?.data?.parsed;
 if(data.error||parsed?.type!=='mint'||!parsed.info?.isInitialized||!['TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb','TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'].includes(account.owner))throw new Error('On-chain token display settings could not be verified. Please retry.');
 const config=tokenDisplayConfig(parsed.info,Date.now()/1000);
 const value={...config,expires:Math.min(Date.now()+30000,config.validUntil??Infinity)};
 mintCache.set(mint,value);return value;
}
async function order(inputMint:string,outputMint:string,amount:string,taker?:string):Promise<Quote>{
 const params=new URLSearchParams({inputMint,outputMint,amount});if(taker)params.set('taker',taker);
 const q=await json('https://api.jup.ag/swap/v2/order?'+params);
 if(q.errorMessage||q.error||!q.outAmount||BigInt(q.outAmount)<=BigInt(0))throw new Error(q.errorMessage||q.error||'No executable route is available for this amount.');
 if(q.inputMint!==inputMint||q.outputMint!==outputMint||q.inAmount!==amount)throw new Error('The quote did not match the requested trade.');
 return q;
}
export async function preview(mint:string,amount:number,taker?:string):Promise<Preview>{
 if(!Number.isFinite(amount)||amount<1||amount>10000||Math.abs(amount*100-Math.round(amount*100))>0.0001)throw new Error('Enter an amount from 1 to 10,000 USDC, with at most two decimal places.');
 if(taker&&!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(taker))throw new Error('Invalid wallet address.');
 const c=await catalog();const stock=c.stocks.find(s=>s.contract_address===mint);if(!stock)throw new Error('Only verified PreStocks tokens are supported.');
 const units=await tokenUnits(mint);const precision=units.decimals;
 const quoteStartedAt=new Date().toISOString();
 const buy=await order(USDC,mint,String(Math.round(amount*1e6)),taker);await delay(2100);
 const sell=await order(mint,USDC,buy.outAmount);
 const tokens=displayTokenAmount(buy.outAmount,precision,units.multiplier),exitUsdc=Number(sell.outAmount)/1e6,entryPrice=amount/tokens;
 return {stock,amount,tokens,exitUsdc,entryPrice,entryValuation:stock.markValuation*(entryPrice/stock.markPrice),premium:(entryPrice/stock.markPrice-1)*100,roundTrip:amount-exitUsdc,decimals:precision,uiMultiplier:units.multiplier,multiplierValidUntil:units.validUntil,buy,sell,quotedAt:quoteStartedAt,catalogFetchedAt:c.fetchedAt};
}
export async function execute(signedTransaction:string,requestId:string){
 if(typeof signedTransaction!=='string'||signedTransaction.length>20000||! /^[A-Za-z0-9+/=]+$/.test(signedTransaction)||typeof requestId!=='string'||requestId.length>100)throw new Error('Invalid signed transaction.');
 return json('https://api.jup.ag/swap/v2/execute',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({signedTransaction,requestId})});
}
export function errorResponse(e:unknown){return Response.json({error:e instanceof Error?e.message:'Unable to load market data.'},{status:503,headers:{'Cache-Control':'no-store'}});}
