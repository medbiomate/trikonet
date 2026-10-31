import test from 'node:test';
import assert from 'node:assert/strict';
import {jobEditorUrls} from './job-editor-launcher.js';
test('multiple jobs get distinct URLs using existing new-job route',()=>{
 let id=0;const urls=jobEditorUrls('https://trikonet.com/admin?q=nurse#jobs',3,()=>`job-${++id}`);
 assert.equal(new Set(urls).size,3);
 for(const value of urls){const url=new URL(value);assert.equal(url.pathname,'/admin');assert.equal(url.hash,'#job-new');assert.equal(url.searchParams.has('q'),false);assert.ok(url.searchParams.get('editor'));}
});
test('one editor is supported and invalid counts rejected',()=>{
 assert.equal(jobEditorUrls('https://trikonet.com/admin',1,()=> 'one').length,1);
 for(const count of [0,-1,11,1.5,NaN])assert.throws(()=>jobEditorUrls('https://trikonet.com/admin',count));
});
test('separate launches always get fresh editor identities',()=>{
 let n=0;const id=()=>String(++n);
 const first=jobEditorUrls('https://trikonet.com/admin#job-new',1,id)[0];
 const second=jobEditorUrls(first,1,id)[0];assert.notEqual(first,second);
});
