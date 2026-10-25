import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createJobLogoResolver} from './job-employer-logo.js';
const response = (data, status=200) => ({ok:status===200,status,json:async()=>data});
test('matches exact employer name despite a different slug and shares card lookups',async()=>{
 const requests=[];
 const resolve=createJobLogoResolver(async url=>{
  requests.push(url);
  if(url.includes('/local/'))return response(null,404);
  return response([{title:{rendered:'Shifa Al Jazeera UAE'},slug:'shifaaljazeera',logo:'/shifa.png'}, {title:{rendered:'Shifa Al Jazeera Medical Group UAE'},logo:'/other.png'}]);
 });
 const jobs=await resolve([{company:'Shifa Al Jazeera UAE'},{company:'Shifa Al Jazeera UAE'}]);
 assert.equal(jobs[0].logo,'/shifa.png');assert.equal(jobs[1].employerSlug,'shifaaljazeera');
 assert.equal(requests.length,2);assert.ok(!requests.some(url=>url.includes('undefined')));
});
test('preserves explicit logos and rejects ambiguous matches',async()=>{
 const job={company:'Example',logo:'/custom.png'};
 const resolve=createJobLogoResolver(async url=>url.includes('/local/')?response(null,404):response([{title:'Example',logo:'/one.png'},{title:'Example',logo:'/two.png'}]));
 assert.equal((await resolve([job]))[0],job);
 assert.equal((await resolve([{company:'Example'}]))[0].logo,undefined);
});
test('temporary errors preserve jobs and can be retried',async()=>{
 let fail=true;
 const resolve=createJobLogoResolver(async url=>{
  if(url.includes('/local/'))return response(null,404);
  if(fail)throw Error('offline');
  return response([{title:'Example',slug:'example',logo:'/logo.png'}]);
 });
 const job={company:'Example'};
 assert.equal((await resolve([job]))[0],job);fail=false;
 assert.equal((await resolve([job]))[0].logo,'/logo.png');
});
test('a stale employer slug cannot replace the displayed company logo',async()=>{
 const resolve=createJobLogoResolver(async url=>{
  if(url.includes('/local/'))return response(null,404);
  if(url.includes('slug='))return response([{title:'Wrong Company',logo:'/wrong.png'}]);
  return response([{title:'Shifa',slug:'shifa',logo:'/shifa.png'}]);
 });
 assert.equal((await resolve([{company:'Shifa',local:true,employerSlug:'wrong-company',metas:{_job_logo:'/wrong.png'}}]))[0].logo,'/shifa.png');
});
