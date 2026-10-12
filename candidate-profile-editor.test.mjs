import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createCandidateProfile } from './candidate-profile-editor.js';
const original = execFileSync('git', ['show', '39404a7:app.js'], {cwd: new URL('.', import.meta.url)}).toString();
const block = original.slice(original.indexOf('const CANDIDATE_QUALIFICATION_LEVELS'), original.indexOf('function memberCollectionKey'));
const escapeAttr = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('lazy editor preserves complete profile markup and reads current account identity', () => {
  let user = {name:'Candidate',email:'test@example.com', profile:{name:'Candidate',phone:'+971 555',skills:['Excel'],licenses:['DHA'],locations:['Dubai']}};
  const context = vm.createContext({currentUser:user,escapeAttr});
  vm.runInContext(block,context);
  const editor = createCandidateProfile({getCurrentUser:()=>user,escapeAttr,calculateCandidateCompletion:context.calculateCandidateCompletion});
  assert.equal(editor.candidateProfileWorkspace(user.profile),context.candidateProfileWorkspace(user.profile));
  user = {name:'Changed',profileLoadError:true};context.currentUser=user;
  assert.equal(editor.candidateProfileWorkspace({}),context.candidateProfileWorkspace({}));
});

test('page metadata starts without waiting for related links and preserves both results', async () => {
  const source=readFileSync(new URL('./app.js',import.meta.url),'utf8');
  const block=source.slice(source.indexOf('async function loadSeoPages()'),source.indexOf('const defaultTopCategories'));
  const calls=[];let releaseLinks;
  const context=vm.createContext({path:'/category/healthcare',seoPagePayload:null,seoInternalLinks:[],URLSearchParams,AbortSignal,
    document:{getElementById:()=>null},location:{search:'',hash:''},history:{replaceState(){}},
    fetch:async url=>{calls.push(url);if(url==='/api/job-category-links')return new Promise(resolve=>{releaseLinks=()=>resolve({ok:true,json:async()=>[{slug:'related'}]})});return {ok:true,json:async()=>({page:{slug:'healthcare-jobs'}})};}});
  vm.runInContext(block,context);
  const pending=context.loadSeoPages();
  assert.equal(calls.length,2);
  releaseLinks();await pending;
  assert.equal(context.seoPagePayload.page.slug,'healthcare-jobs');
  assert.equal(context.seoInternalLinks[0].slug,'related');
});
