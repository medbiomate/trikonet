import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./admin.js',import.meta.url),'utf8');
const start=source.indexOf('  let candidateRefreshing=false;');
const end=source.indexOf('  function candidateRefreshToolbar',start);
test('fresh candidates replace stale rows without saving accounts back to server',async()=>{
 const live=[{id:'new',createdAt:'2026-10-17'}];const saves=[];
 const context=vm.createContext({candidates:[{id:'old'}],candidateSavedIds:[],candidatesLoaded:false,candidateLoadError:false,candidatePage:4,document:{getElementById:()=>null},fetch:async()=>({ok:true,json:async()=>live}),saveCandidates:persist=>saves.push(persist),renderCandidateRows(){}});
 vm.runInContext(source.slice(start,end),context);await context.refreshCandidateAccounts();
 assert.equal(context.candidates,live);assert.equal(context.candidatesLoaded,true);assert.equal(context.candidatePage,1);assert.deepEqual(saves,[false]);
});
test('failed refresh preserves data and reports failure',async()=>{
 const context=vm.createContext({candidates:[{id:'existing'}],candidateLoadError:false,document:{getElementById:()=>null},fetch:async()=>{throw Error('offline')},renderCandidateRows(){}});
 vm.runInContext(source.slice(start,end),context);await context.refreshCandidateAccounts();
 assert.equal(context.candidates[0].id,'existing');assert.equal(context.candidateLoadError,true);
});
