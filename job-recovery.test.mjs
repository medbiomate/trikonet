import test from 'node:test';
import assert from 'node:assert/strict';
import {renderInitialJob,injectInitialJob} from './job-ssr.mjs';
import {protectJobNavigation} from './job-navigation.js';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const record={slug:'sample',title:'Nurse',company:'Hospital',description:'<p>Care for patients.</p><script>alert(1)</script><img src=x onerror=alert(2)>',applyUrl:'https://example.com/apply',status:'publish'};
test('job description and application link are delivered without needing client JavaScript',()=>{
 const html=injectInitialJob(readFileSync(new URL('./index.html',import.meta.url),'utf8'),record,'/job/sample');
 assert.match(html,/<h1>Nurse<\/h1>/);assert.match(html,/Care for patients/);assert.match(html,/href="https:\/\/example.com\/apply"/);
 assert.doesNotMatch(html,/id="page-preloader"|classList.add\('page-loading'\)/);
 assert.match(html,/data-server-rendered="job"/);
});
test('server preview cannot execute scripts or event attributes from descriptions',()=>{
 const html=renderInitialJob(record,'/job/sample');
 assert.doesNotMatch(html,/<script>|onerror=|alert\(1\)|alert\(2\)/);
});
test('job and Apply links cannot trigger full-screen vignette ads',()=>{
 const links=['/jobs','/job/sample','/jobs/sample','/employer/hospital','/category/nurse','https://example.com/apply','https://other.com/job/test'].map(href=>({href,attributes:{},getAttribute(){return href;},classList:{contains:()=>href.endsWith('/apply')},setAttribute(key,value){this.attributes[key]=value;}}));
 const original=globalThis.location;globalThis.location={origin:'https://www.trikonet.com'};
 try {protectJobNavigation({querySelectorAll:()=>links});} finally {globalThis.location=original;}
 for(const link of links.slice(0,6))assert.equal(link.attributes['data-google-vignette'],'false');
 assert.equal(links[6].attributes['data-google-vignette'],undefined);
});
test('startup failure preserves server-rendered jobs and removes both loaders',()=>{
 const s=readFileSync(new URL('./bootstrap.js',import.meta.url),'utf8');
 const removals=[];const app={hasAttribute:()=>true,replaceChildren(){assert.fail('must preserve job');},removeAttribute:name=>removals.push(name)};
 const c=vm.createContext({console:{warn(){}},document:{getElementById:id=>id==='app'?app:{remove:()=>removals.push(id)},documentElement:{classList:{remove:name=>removals.push(name)}}}});
 vm.runInContext(s.slice(s.indexOf('export function'),s.indexOf('const timeout')).replace('export function','function'),c);
 c.showLoadingRecovery(Error('module failed'));assert.ok(removals.includes('page-preloader'));assert.ok(removals.includes('seo-loading'));assert.ok(removals.includes('inert'));
});
