import test from 'node:test';
import assert from 'node:assert/strict';
import {createCandidateProfile,websiteProfileSections} from './website-profile.js';
import {candidateProfileFields,updateCandidateProfile} from '../backend/candidate-profile.mjs';
import {applyAccountProfile} from '../backend/account-identity.mjs';
const escapeAttr=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
test('website sections expose every saved app profile field',()=>{
 const keys=new Set(websiteProfileSections.flatMap(section=>section.keys));keys.add('photo');
 for(const key of candidateProfileFields)assert.ok(keys.has(key),key);
});
test('profile cards render app education, languages and awards with escaped content',()=>{
 const user={name:'Candidate',email:'account@example.com',profile:{name:'<script>bad</script>',educationEntries:[{course:'Engineering',institution:'College'}],accomplishments:[{title:'Award',organization:'Organization'}],licenses:['DHA'],licenseDetails:{DHA:{number:'123'}},languages:['English'],languageDetails:{English:{abilities:['Speak','Read'],level:'Native'}},skills:['Excel','Planning']}};
 const editor=createCandidateProfile({getCurrentUser:()=>user,escapeAttr,calculateCandidateCompletion:()=>80});
 const html=editor.candidateProfileWorkspace(user.profile);
 for(const text of ['Engineering','College','Organization','English','Native','Speak','Read','123','Excel','Planning','80%'])assert.ok(html.includes(text),text);
 assert.ok(!html.includes('<script>'));assert.ok(!html.includes('Verified Candidate'));
 for(const section of websiteProfileSections)assert.ok(html.includes(`data-profile-edit="${section.id}"`));
});
test('saving one section keeps all other app data and account identity',()=>{
 const user={id:'candidate-1',name:'Name',email:'registered@example.com',profile:{name:'Name',skills:['Excel'],educationEntries:[{id:'ed1',course:'Engineering'}],nationality:'India'}};
 const updated=applyAccountProfile(user,{nationality:'UAE',email:'other@example.com',profileUpdatedAt:100},updateCandidateProfile);
 assert.equal(updated.nationality,'UAE');assert.deepEqual(updated.skills,['Excel']);assert.equal(updated.educationEntries[0].course,'Engineering');assert.equal(updated.email,'registered@example.com');assert.equal(user.id,'candidate-1');
});
