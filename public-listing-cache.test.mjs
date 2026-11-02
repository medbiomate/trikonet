import test from 'node:test';import assert from 'node:assert/strict';import {createPublicListingCache} from './public-listing-cache.mjs';
test('shares in-flight reads and isolates caller mutations',async()=>{let calls=0,done;const read=createPublicListingCache(async()=>{calls++;await new Promise(resolve=>{done=resolve});return{ok:true,json:async()=>[{title:'job'}]}});const a=read('public'),b=read('public');done();const [one,two]=await Promise.all([a,b]);one[0].title='changed';assert.equal(two[0].title,'job');assert.equal((await read('public'))[0].title,'job');assert.equal(calls,1)});
test('serves recent stale public data while refreshing, then expires on failure',async()=>{let time=0,calls=0;const read=createPublicListingCache(async()=>{calls++;if(calls>1)throw Error('offline');return{ok:true,json:async()=>[1]}},{now:()=>time,ttl:10,stale:100});await read('public');time=20;assert.deepEqual(await read('public'),[1]);time=200;await assert.rejects(read('public'),/offline/)});
test('large responses are not retained and total cached bytes stay bounded',async()=>{
 let calls=0;const read=createPublicListingCache(async url=>{calls++;return {ok:true,json:async()=>url==='large'?'x'.repeat(1000):'x'.repeat(30)};},{maxBytes:80});
 await read('large');await read('large');assert.equal(calls,2);
 await read('a');await read('b');await read('c');const before=calls;await read('a');assert.equal(calls,before+1);
});
