import test from 'node:test';
import assert from 'node:assert/strict';
import {socialHead,logoFor} from './social-preview.js';
test('job and employer share metadata use the logo and canonical URL',()=>{
 for(const type of ['job_listing','employer']){
 const html=socialHead({title:'NMC & Healthcare'},type,'/employer/nmc','https://media.trikonet.com/images/nmc.png');
 assert.match(html,/property="og:image" content="https:\/\/media.trikonet.com\/images\/nmc.png"/);
 assert.match(html,/twitter:image/);assert.match(html,/NMC &amp; Healthcare/);
 }
 assert.equal(logoFor({metas:{_job_logo:'job.png'}},'job_listing'),'job.png');
 assert.equal(logoFor({metas:{_employer_logo:'employer.png'}},'employer'),'employer.png');
});
test('embedded data URLs do not enter crawler metadata',()=>assert.doesNotMatch(socialHead({title:'Job'},'job_listing','/job/test','data:image/png;base64,test'),/og:image"/));
