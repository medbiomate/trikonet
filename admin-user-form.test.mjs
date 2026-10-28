import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('./admin.js', import.meta.url), 'utf8');

test('new user defaults to an available role', () => {
  const fields = {};
  const context = vm.createContext({ document: { getElementById(id) {
    return fields[id] ||= id === 'admin-user-form' ? { reset() {} } : {};
  } } });
  const start = source.indexOf('  function fillUser(');
  const end = source.indexOf('  // Password generator', start);
  vm.runInContext(`${source.slice(start, end)}; fillUser({});`, context);
  assert.equal(fields['user-role'].value, 'Editor');
});

test('creating a user submits the selected role despite the native form role property', async () => {
  let submit, request, saved = false;
  const values = { userId: '', username: 'new-editor', email: 'editor@example.com', firstName: 'New', lastName: 'Editor', website: '', role: 'Content Editor', status: 'active', password: 'test-password-123', bio: '' };
  const form = { dataset: {}, setAttribute() {}, removeAttribute() {}, role: '', elements: { namedItem: name => ({ value: values[name] }) }, reset() {} };
  const context = vm.createContext({
    setTimeout: () => 1, clearTimeout() {}, userMutationVersion: 0, renderUserRows() {},
    document: { getElementById: () => ({style: {}, addEventListener: (_, handler) => { submit = handler; } }) },
    users: [], signedInAdminUsername: () => 'admin',
    fetch: async (url, options) => { request = JSON.parse(options.body); return { ok: true, status: 200, text: async () => JSON.stringify({ ...request, id: 'new-id' }) }; },
    saveUsers: () => { saved = true; }, showAdminNotice() {},
    alert: message => { throw new Error(message); }, location: {},
  });
  const start = source.indexOf('  // User form submission');
  const end = source.indexOf('  // Click delegation for user edit / delete', start);
  vm.runInContext(source.slice(start, end), context);
  await submit({ target: form, preventDefault() {} });
  assert.equal(request.role, 'Content Editor');
  assert.equal(request.username, 'new-editor');
  assert.equal(saved, true);
  assert.equal(context.location.hash, 'users');
});

test('pending save shows progress, prevents duplicates, then renders success immediately', async () => {
  let submit, release, requests = 0, renders = 0;
  const status = {style:{}};
  const button = {textContent:'Add New User',disabled:false};
  const values = {userId:'',username:'editor',email:'editor@example.com',firstName:'',lastName:'',website:'',role:'Content Editor',status:'active',password:'test-password',bio:''};
  const form = {dataset:{},setAttribute(){},removeAttribute(){},elements:{namedItem:name=>({value:values[name]})},reset(){}};
  const context = vm.createContext({
    document:{getElementById:id=>id==='admin-user-form'?{addEventListener:(_,handler)=>{submit=handler;}}:id==='btn-submit-user'?button:status},
    users:[],userMutationVersion:0,signedInAdminUsername:()=> 'admin',
    fetch:async()=>{requests++;return new Promise(resolve=>{release=()=>resolve({ok:true,status:200,text:async()=>JSON.stringify({id:'new-user'})});});},
    setTimeout:()=>1,clearTimeout(){},saveUsers(){},renderUserRows(){renders++;},showAdminNotice(){},location:{},alert(message){throw new Error(message);}
  });
  const start=source.indexOf('  // User form submission');
  vm.runInContext(source.slice(start,source.indexOf('  // Click delegation for user edit / delete',start)),context);
  const pending=submit({target:form,preventDefault(){}});
  assert.equal(button.disabled,true);assert.equal(button.textContent,'Creating user…');assert.match(status.textContent,/Saving user/);
  await submit({target:form,preventDefault(){}});assert.equal(requests,1);
  release();await pending;
  assert.equal(button.disabled,false);assert.match(status.textContent,/saved successfully/);assert.equal(renders,1);assert.equal(context.location.hash,'users');
});
