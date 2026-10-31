import test from 'node:test';
import assert from 'node:assert/strict';
import {recentEmployerPage} from './recent-employers.js';
import {renderEmployerDirectory} from './employer-directory.js';
test('recent companies merge local edits before sorting and pagination; updates do not change added date',async()=>{
 const imported=[{slug:'old',title:{rendered:'Old'},date:'2025-01-01',updatedAt:'2027-01-01'},{slug:'new',title:{rendered:'New'},date:'2026-10-01'},{slug:'unknown',title:'Unknown'}];
 const local=[{slug:'latest',title:'Latest',createdAt:'2026-10-31'},{slug:'old',title:'Old edited',createdAt:'2025-01-01'},{slug:'draft',title:'Draft',createdAt:'2026-11-01',status:'draft'}];
 const read=async path=>path.startsWith('/api/wp/')?imported:local;
 const first=await recentEmployerPage(read,new URLSearchParams('sort=recent'),2);
 assert.deepEqual(first.employers.map(e=>e.slug),['latest','new']);assert.equal(first.total,4);
 const second=await recentEmployerPage(read,new URLSearchParams('sort=recent&page=2'),2);
 assert.deepEqual(second.employers.map(e=>e.slug),['old','unknown']);
});
test('recent filter retains search and resets page in menu',async()=>{
 const params=new URLSearchParams('sort=recent&page=3&q=clinic&location=Dubai');
 const html=renderEmployerDirectory({data:{employers:[],counts:{employer:0}},queryParams:params});
 assert.match(html,/sort=recent[^"\n]*" selected>Recently Added/);
 const result=await recentEmployerPage(async path=>path.startsWith('/api/wp/')?[]:[{slug:'clinic',title:'Clinic',locations:['Dubai'],createdAt:'2026-10-31'},{slug:'other',title:'Other',locations:['Dubai']}],new URLSearchParams('sort=recent&q=clinic&location=Dubai'));
 assert.equal(result.total,1);assert.equal(result.employers[0].slug,'clinic');
});
