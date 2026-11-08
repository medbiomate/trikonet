import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchContentResponse} from './content-record.js';
test('failed API response is released before the one allowed retry',async()=>{
  const events=[];
  const result=await fetchContentResponse(async()=>{
    events.push('fetch');
    return events.length===1?{status:503,body:{cancel:async()=>events.push('cancel')}}:{status:200};
  },'https://example.test/job');
  assert.equal(result.status,200);assert.deepEqual(events,['fetch','cancel','fetch']);
});
test('a final 503 is returned to the caller without a retry storm',async()=>{
  let calls=0;
  const result=await fetchContentResponse(async()=>{calls++;return {status:503};},'https://example.test/job');
  assert.equal(result.status,503);assert.equal(calls,2);
});
