import test from 'node:test';
import assert from 'node:assert/strict';
import {publicJobPage} from './public-job-page.js';
test('saved jobs continue across pages without skipping imported jobs',async()=>{
 const local=Array.from({length:16},(_,i)=>({slug:`local-${i}`}));
 const remote=[local[0],...Array.from({length:120},(_,i)=>({slug:`remote-${i}`}))];
 const fetcher=async(p,s,excluded)=>remote.filter(j=>!excluded.includes(j.slug)).slice((p-1)*s,p*s);
 const pages=[];for(let p=1;p<=3;p++)pages.push(...await publicJobPage(local,p,10,fetcher));
 assert.deepEqual(pages.map(j=>j.slug),[...local,...remote.slice(1,15)].map(j=>j.slug));
 assert.equal(new Set(pages.map(j=>j.slug)).size,30);
});
