import type {Quote} from './market';

export function validateOrder(q:Quote,inputMint:string,outputMint:string,amount:string):Quote {
 // Jupiter returns usable prices with an empty transaction when wallet funding
 // prevents transaction construction. Keep those prices, but never a signable tx.
 const quoteOnly=q.transaction===''&&Number.isInteger(q.errorCode);
 if(q.error||(q.errorMessage&&!quoteOnly)||!q.outAmount||!/^\d+$/.test(q.outAmount)||BigInt(q.outAmount)<=BigInt(0)) {
  throw new Error(q.errorMessage||q.error||'No executable route is available for this amount.');
 }
 if(q.inputMint!==inputMint||q.outputMint!==outputMint||q.inAmount!==amount) {
  throw new Error('The quote did not match the requested trade.');
 }
 if(q.errorCode!==undefined&&!quoteOnly)throw new Error(q.errorMessage||'The provider returned an invalid transaction response.');
 return q;
}
