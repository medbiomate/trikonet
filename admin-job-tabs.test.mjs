import test from 'node:test';
import assert from 'node:assert/strict';
import {openJobTabs} from './admin-job-tabs.js';
test('requested count opens separate detached editors',()=>{
 const tabs=[];
 assert.deepEqual(openJobTabs(3,'https://trikonet.com',()=>{const tab={opener:{},location:{}};tabs.push(tab);return tab;}),{opened:3,requested:3});
 assert.equal(new Set(tabs).size,3);
 for(const tab of tabs){assert.equal(tab.opener,null);assert.equal(tab.location.href,'https://trikonet.com/admin#job-new');}
});
test('blocked pop-ups report the remaining count without looping',()=>{
 let calls=0;
 assert.deepEqual(openJobTabs(5,'https://trikonet.com',()=>++calls===1?{location:{}}:null),{opened:1,requested:5});assert.equal(calls,2);
});
test('invalid counts never open a window',()=>{
 for(const count of [0,11,-1,1.5,'invalid'])assert.throws(()=>openJobTabs(count,'https://trikonet.com',()=>{throw Error('should not open');}),RangeError);
});
