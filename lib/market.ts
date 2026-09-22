export const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export type Stock = { name:string; symbol:string; description:string; image:string; external_url:string; contract_address:string; markPrice:number; markValuation:number; tokenPrice:number; impliedValuation:number; supply:number };
export type Quote = { inAmount:string; outAmount:string; inputMint:string; outputMint:string; transaction:string|null; requestId:string; router:string; priceImpact?:number; priceImpactPct?:string; feeBps:number; signatureFeeLamports:number; prioritizationFeeLamports:number; rentFeeLamports:number; errorMessage?:string; error?:string; routePlan?:{swapInfo:{label:string}}[] };
export type Preview = { stock:Stock; amount:number; tokens:number; exitUsdc:number; entryPrice:number; entryValuation:number; premium:number; roundTrip:number; decimals:number; uiMultiplier:number; multiplierValidUntil:number|null; buy:Quote; sell:Quote; quotedAt:string; catalogFetchedAt:string; };
export const money=(n:number,digits=2)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:digits}).format(n);
export const compact=(n:number)=>'$'+new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:2}).format(n);
export const percent=(n:number)=>(n>0?'+':'')+n.toFixed(2)+'%';
export const company=(s:Stock)=>s.name.replace(/ PreStocks$/,'');
