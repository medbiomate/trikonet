import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./admin.js',import.meta.url),'utf8');
function setup(fetch){
 const handlers={};
 const user={id:'editor-id',username:'editor',email:'editor@example.com',role:'Content Editor',serverBacked:true};
 const context=vm.createContext({users:[user],fetch,canDeleteUser:u=>u.role!=='Administrator',saveUsers(){},renderUserRows(){},location:{hash:''},window:{addEventListener(){}},confirm:()=>true,alert(){},showAdminNotice(){},document:{getElementById:id=>({value:'delete',addEventListener:(_,fn)=>handlers[id]=fn}),querySelectorAll:()=>[{value:user.id}]}});
 vm.runInContext(source.slice(source.indexOf('  let userMutationVersion ='),source.indexOf('  function fillUser(')),context);
 vm.runInContext(source.slice(source.indexOf('  // Bulk actions for users'),source.indexOf('  // User form submission')),context);
 return {context,handlers,user};
}
test('bulk deletion persists to the server before removing the row',async()=>{
 const requests=[];const {context,handlers}=setup(async(url,options)=>{requests.push({url,...options});return {ok:true,status:200,json:async()=>({ok:true})};});
 await handlers['btn-apply-user-bulk']();
 assert.equal(requests.length,1);assert.equal(requests[0].method,'DELETE');assert.equal(requests[0].url,'/api/admin/users/editor-id');assert.equal(context.users.length,0);
});
test('failed deletion keeps the user and permits retry',async()=>{
 const {context,user}=setup(async()=>{throw new Error('Network failed');});
 await assert.rejects(context.deleteAdminUser(user),/Network failed/);assert.equal(context.users.length,1);
 await assert.rejects(context.deleteAdminUser(user),/Network failed/);
});
test('server rejection keeps user and exposes its error',async()=>{
 const {context,user}=setup(async()=>({ok:false,status:403,json:async()=>({error:'Administrator access required'})}));
 await assert.rejects(context.deleteAdminUser(user),/Administrator access required/);assert.equal(context.users.length,1);
});
test('refresh removes cached server accounts absent from the server',async()=>{
 const {context}=setup(async()=>({ok:true,json:async()=>[]}));
 await context.syncServerAdminUsers();assert.equal(context.users.length,0);
});
test('a stale refresh cannot resurrect an account deleted while it was loading',async()=>{
 let release;const {context,user}=setup(async(_,options)=>options?.method==='DELETE'?{ok:true,status:200,json:async()=>({ok:true})}:new Promise(resolve=>{release=()=>resolve({ok:true,json:async()=>[user]});}));
 const pending=context.syncServerAdminUsers();await context.deleteAdminUser(user);release();await pending;assert.equal(context.users.length,0);
});
test('protected accounts cannot be deleted',async()=>{
 const {context}=setup(async()=>{throw new Error('must not call server');});
 await assert.rejects(context.deleteAdminUser({id:'admin',role:'Administrator'}),/cannot be deleted/);
});
