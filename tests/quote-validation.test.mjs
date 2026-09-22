import test from 'node:test';
import assert from 'node:assert/strict';
import {validateOrder} from '../lib/quote-validation.ts';

const order={inputMint:'USDC',outputMint:'STOCK',inAmount:'1000000',outAmount:'950',transaction:null,requestId:'test',router:'metis'};
const validate=q=>validateOrder(q,'USDC','STOCK','1000000');

test('unfunded wallet retains valid pricing without a signable transaction',()=>{
 for(const router of ['metis','jupiterz','dflow','okx']) {
  for(const errorCode of [1,2,3]) {
   const result=validate({...order,router,transaction:'',errorCode,errorMessage:'Insufficient funds',error:'Insufficient funds'});
   assert.equal(result.outAmount,'950');
   assert.equal(result.transaction,'');
   assert.equal(result.errorMessage,'Insufficient funds');
  }
 }
});
test('disconnected and funded wallet quotes remain available',()=>{
 assert.equal(validate(order).transaction,null);
 assert.equal(validate({...order,transaction:'encoded-transaction'}).transaction,'encoded-transaction');
});
test('funding warning cannot bypass amount and mint validation',()=>{
 const warning={...order,transaction:'',errorCode:1,errorMessage:'Insufficient funds'};
 for(const change of [{outAmount:'0'},{outAmount:'bad'},{inAmount:'2000000'},{outputMint:'OTHER'},{inputMint:'OTHER'}]) {
  assert.throws(()=>validate({...warning,...change}));
 }
});
test('fatal errors and inconsistent signable error responses fail closed',()=>{
 assert.throws(()=>validate({...order,error:'No route'}));
 assert.throws(()=>validate({...order,transaction:'',errorCode:1,errorMessage:'Insufficient funds',error:'Unrelated provider failure'}));
 assert.throws(()=>validate({...order,errorMessage:'No route'}));
 assert.throws(()=>validate({...order,transaction:'encoded',errorCode:1,errorMessage:'Insufficient funds'}));
});
