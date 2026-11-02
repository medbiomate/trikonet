import test from 'node:test';
import assert from 'node:assert/strict';
import {createApplyDockState} from './apply-dock-state.js';
test('tiny reversals and layout jitter do not hide the visible dock',()=>{
 const next=createApplyDockState();
 assert.equal(next({y:500,companyBottom:10}),false);
 assert.equal(next({y:540,companyBottom:-30}),true);
 for(const y of [538,540,535,541,539])assert.equal(next({y,companyBottom:-30}),true);
 assert.equal(next({y:490,companyBottom:-30}),false);
 assert.equal(next({y:495,companyBottom:-30}),false);
 assert.equal(next({y:525,companyBottom:-30}),true);
});
test('returning to company or desktop restores inline Apply',()=>{
 const next=createApplyDockState();
 assert.equal(next({y:600,companyBottom:-50}),true);
 assert.equal(next({y:601,companyBottom:25}),false);
 assert.equal(next({y:650,companyBottom:-30}),true);
 assert.equal(next({y:650,companyBottom:-30,mobile:false}),false);
});
