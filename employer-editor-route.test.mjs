import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
for (const file of ['./admin.js','../backend/public/admin.js']) {
 const source=fs.readFileSync(new URL(file,import.meta.url),'utf8');
 const start=source.indexOf('  async function handleRoute()');
 const code=source.slice(start,source.indexOf("  window.addEventListener('hashchange', handleRoute);",start));
 test(`${file}: exact employer editor loads full authenticated record including recovery copy`,async()=>{
  const item={title:'Insights Psychology DMCC',slug:'autosave-employer-one',local:true,description:'Saved full profile',logo:'/uploaded.png',categories:['Healthcare'],locations:['Dubai']};
  let filled,path,view;
  const sandbox={location:{hash:'#employer-editor/autosave-employer-one'},fetch:async url=>{path=url;return{ok:true,json:async()=>item};},fillEmployer:e=>{filled=e;},switchView:v=>{view=v;},showAdminNotice:()=>{throw Error('Unexpected failure');}};
  vm.createContext(sandbox);vm.runInContext(code,sandbox);await sandbox.handleRoute();
  assert.equal(path,'/api/admin/employer-record/autosave-employer-one');assert.equal(filled,item);assert.equal(filled.description,'Saved full profile');assert.equal(view,'employer-edit');
 });
 test(`${file}: failed employer read never opens an empty form`,async()=>{
  let notice,view;
  const sandbox={location:{hash:'#employer-editor/missing'},fetch:async()=>({ok:false}),fillEmployer:()=>{throw Error('Must not clear form');},switchView:v=>{view=v;},showAdminNotice:m=>{notice=m;}};
  vm.createContext(sandbox);vm.runInContext(code,sandbox);await sandbox.handleRoute();
  assert.equal(view,'employers');assert.match(notice,/Unable to load/);
 });
}
