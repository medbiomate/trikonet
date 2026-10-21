import test from 'node:test';import assert from 'node:assert/strict';
import {renderEmployerDirectory} from './employer-directory.js';import {injectInitialEmployers} from './employer-list-ssr.js';
for(const query of ['', 'q=clinic&location=Dubai'])test('initial and browser directory share markup '+query,()=>{
 const params=new URLSearchParams(query),record={slug:'clinic',title:'Clinic',categories:[],locations:[],openJobs:0,logo:''};
 const browser=renderEmployerDirectory({data:{employers:[record],counts:{employer:1}},queryParams:params});
 const server=injectInitialEmployers('<div id="app"></div><style></style>',[record],params);
 assert.ok(server.includes(browser));assert.ok(server.includes('emp-naukri-card'));assert.ok(!server.includes('initial-employer-grid'));
});
test('industry and category links clear prior company search and reset page',()=>{
 const html=renderEmployerDirectory({data:{employers:[],counts:{employer:0}},queryParams:new URLSearchParams('q=old-company&page=3&location=Dubai')});
 const links=[...html.matchAll(/href="([^"]+)" class="(?:emp-top-hiring-card|emp-filter-row)/g)].map(m=>m[1]).filter(h=>h.includes('category='));
 assert.ok(links.length>5);
 for(const href of links){const params=new URL(href.replaceAll('&amp;','&'),'https://trikonet.com').searchParams;assert.equal(params.has('q'),false);assert.equal(params.has('page'),false);assert.equal(params.get('location'),'Dubai');}
});
