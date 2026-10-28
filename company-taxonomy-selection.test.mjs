import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
for(const file of ['./admin.js','../backend/public/admin.js']){
 const source=fs.readFileSync(new URL(file,import.meta.url),'utf8');const start=source.indexOf('  function companyTermsWithSelection(');const end=source.indexOf('  function renderEmployerGutenbergChecklists(',start);const context=vm.createContext({});vm.runInContext(source.slice(start,end),context);
 test(`${file}: company selections survive before remote taxonomy loading and after refresh`,()=>{
  const initial=context.companyTermsWithSelection([],new Set(['Medical Clinic','Dubai']));assert.deepEqual(Array.from(initial,t=>t.name),['Medical Clinic','Dubai']);
  const refreshed=context.companyTermsWithSelection([{name:'Medical Clinic',slug:'medical-clinic'}],new Set(['Medical Clinic','Custom industry']));assert.deepEqual(Array.from(refreshed,t=>t.name),['Medical Clinic','Custom industry']);
 });
}
