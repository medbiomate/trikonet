import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./admin.js',import.meta.url),'utf8');
const block=source.slice(source.indexOf('  function populateEmployerDropdown()'),source.indexOf('  function renderEmployerComboboxItems('));
test('company selector excludes recovery drafts and retains saved company identity',()=>{
 const context=vm.createContext({employerDataset:[],allEmployers:()=>[
  {title:'Good Care',slug:'autosave-employer-1',autosaved:true},
  {title:'Good Care',slug:'good-care',logo:'saved.webp'},
  {title:'GOOD CARE',slug:'imported-good-care'},
  {title:'Another',slug:'autosave-employer-2'}],allJobs:()=>[
  {company:'Draft Company',employerSlug:'autosave-employer-3'},
  {company:'Draft Job Company',autosaved:true},
  {company:'Other Company',employerSlug:'other-company'}],
  document:{getElementById:()=>null},renderEmployerComboboxItems(){}});
 vm.runInContext(block+';populateEmployerDropdown()',context);
 assert.deepEqual(JSON.parse(JSON.stringify(context.employerDataset)),[
  {title:'Good Care',slug:'good-care',logo:'saved.webp'},
  {title:'Other Company',slug:'other-company',logo:''}]);
});
test('company return flow uses saved dataset without undefined reload function',()=>{
 assert.doesNotMatch(source,/await loadEmployers\(\)/);
 assert.match(source,/renderEmployerRows\(\);\s+populateEmployerDropdown\(\);/);
});
