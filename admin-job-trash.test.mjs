import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('./admin.js',import.meta.url),'utf8');
const helper=source.slice(source.indexOf('  async function trashJob('),source.indexOf('  async function handleBulkDelete('));
function harness(ok){
 const ctx=vm.createContext({fetch:async()=>({ok,status:500,json:async()=>({error:'Server unavailable'})}),jobsController:{abort(){}},jobsRequest:0,jobPageCache:{clear(){ctx.cleared=true;}},localJobs:[{slug:'a'}],remoteJobs:[{slug:'a'}],pageJobs:[{slug:'a'}]});
 vm.runInContext(helper,ctx);return ctx;
}
test('successful trash removes cached rows and invalidates pending pages',async()=>{
 const c=harness(true);await vm.runInContext("trashJob('a')",c);
 assert.equal(c.cleared,true);assert.equal(c.pageJobs.length,0);assert.equal(c.jobsRequest,1);
});
test('failed trash retains rows and cache',async()=>{
 const c=harness(false);await assert.rejects(vm.runInContext("trashJob('a')",c),/Server unavailable/);
 assert.equal(c.pageJobs.length,1);assert.equal(c.cleared,undefined);
});
