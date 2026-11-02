import test from 'node:test';
import assert from 'node:assert/strict';
import {withOptionalBudget} from './optional-work.js';
test('stalled optional data does not hold the page response',async()=>{
 const fallback={title:'Readable job'};
 assert.equal(await withOptionalBudget(new Promise(()=>{}),fallback,10),fallback);
});
test('ready data is preserved; failed branding keeps original content',async()=>{
 const job={logo:'/logo.png'};
 assert.equal(await withOptionalBudget(Promise.resolve(job),null),job);
 assert.equal(await withOptionalBudget(Promise.reject(Error('offline')),'original'),'original');
});
