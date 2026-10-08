import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./app.js',import.meta.url),'utf8');
const start=source.indexOf('async function loadAccount()');
const end=source.indexOf('\n}',start)+2;
const functionSource=source.slice(start,end);
test('website loads saved app profile separately from the login session',async()=>{
 const calls=[];const profile={name:'Saved Name',phone:'+971555123456',skills:'Excel'};
 const context=vm.createContext({currentUser:null,path:'/account',fetch:async url=>{calls.push(url);return {ok:true,json:async()=>url.endsWith('/me')?{user:{userId:'a',name:'Session Name'}}:{profile,completionPercentage:70}}}});
 await vm.runInContext(functionSource+';loadAccount()',context);
 assert.deepEqual(calls,['/api/auth/me','/api/candidate/profile']);
 assert.equal(context.currentUser.profile.phone,profile.phone);
 assert.equal(context.currentUser.completionPercentage,70);
 assert.equal(context.currentUser.id,'a');
});
test('profile fetch failure prevents rendering an empty editable profile',async()=>{
 const context=vm.createContext({currentUser:null,path:'/account',fetch:async url=>({ok:url.endsWith('/me'),json:async()=>({user:{userId:'a'}})})});
 await vm.runInContext(functionSource+';loadAccount()',context);
 assert.equal(context.currentUser.profileLoadError,true);
 assert.match(source,/if\(currentUser\?\.profileLoadError\)return/);
});
