import test from 'node:test';
import assert from 'node:assert/strict';
import {tokenDisplayConfig,displayTokenAmount} from '../lib/token-units.ts';
const scaled=(multiplier,newMultiplier,effective)=>({decimals:9,extensions:[{extension:'scaledUiAmountConfig',state:{multiplier,newMultiplier,newMultiplierEffectiveTimestamp:effective}}]});
test('SpaceX fivefold display scaling corrects the entry price without changing the raw sell amount',()=>{
 const raw='165348000';
 const units=tokenDisplayConfig(scaled('1','5',1781065800),1790040000);
 assert.equal(units.multiplier,5);
 const tokens=displayTokenAmount(raw,units.decimals,units.multiplier);
 assert.ok(Math.abs(tokens-0.82674)<1e-12);
 assert.equal((100/tokens).toFixed(2),'120.96');
 assert.equal(raw,'165348000');
});
test('fractional multiplier is applied to quoted and confirmed amounts identically',()=>{
 const config=tokenDisplayConfig(scaled('1','1.5',100),200);
 const raw='57149000';
 assert.equal(displayTokenAmount(raw,config.decimals,config.multiplier),0.0857235);
});
test('scheduled multiplier takes effect at its timestamp, with a cache expiry before activation',()=>{
 const info=scaled('2','5',200);
 assert.deepEqual(tokenDisplayConfig(info,199),{decimals:9,multiplier:2,validUntil:200000});
 assert.deepEqual(tokenDisplayConfig(info,200),{decimals:9,multiplier:5,validUntil:null});
});
test('ordinary mint has no display scaling',()=>{
 assert.deepEqual(tokenDisplayConfig({decimals:6},200),{decimals:6,multiplier:1,validUntil:null});
 assert.equal(displayTokenAmount('100000000',6,1),100);
});
test('malformed or unsupported mint settings fail closed',()=>{
 for(const info of [scaled('1','0',100),scaled('1','NaN',100),{decimals:9,extensions:[{extension:'scaledUiAmountConfig'}]},{decimals:9,extensions:[{extension:'interestBearingConfig'}]},{decimals:-1}])assert.throws(()=>tokenDisplayConfig(info,200));
 assert.throws(()=>displayTokenAmount('NaN',9,5));
});
