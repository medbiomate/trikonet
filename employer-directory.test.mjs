import test from 'node:test';import assert from 'node:assert/strict';
import {renderEmployerDirectory} from './employer-directory.js';import {injectInitialEmployers} from './employer-list-ssr.js';
for(const query of ['', 'q=clinic&location=Dubai'])test('initial and browser directory share markup '+query,()=>{
 const params=new URLSearchParams(query),record={slug:'clinic',title:'Clinic',categories:[],locations:[],openJobs:0,logo:''};
 const browser=renderEmployerDirectory({data:{employers:[record],counts:{employer:1}},queryParams:params});
 const server=injectInitialEmployers('<div id="app"></div><style></style>',[record],params);
 assert.ok(server.includes(browser));assert.ok(server.includes('emp-naukri-card'));assert.ok(!server.includes('initial-employer-grid'));
});
