import test from 'node:test';
import assert from 'node:assert/strict';
import {renderCategoryLinks} from './category-links.js';
test('links exclude low counts and current page, have no displayed counts, preserve URLs',()=>{
 const html=renderCategoryLinks([{slug:'current',title:'Current',activeJobCount:20,pageType:'main_category'},{slug:'low',title:'Low',activeJobCount:19,pageType:'main_category'},{slug:'category/healthcare',title:'Healthcare Jobs',activeJobCount:25,href:'/category/healthcare',pageType:'main_category'}],{slug:'current',categoriesOnly:true});
 assert.match(html,/href="\/category\/healthcare"/);assert.doesNotMatch(html,/Current|Low|25/);assert.match(html,/Explore Jobs by Category/);
});
test('main directory is capped, stable and ranked; related threshold stays ten',()=>{
 const pages=Array.from({length:35},(_,i)=>({slug:`c-${i}`,title:`Category ${i}`,activeJobCount:20+i,pageType:'main_category'}));
 const html=renderCategoryLinks(pages,{categoriesOnly:true,limit:28});
 assert.equal((html.match(/<a href=/g)||[]).length,28);
 assert.match(html,/View All Job Categories/);
 assert.ok(html.indexOf('Category 34')<html.indexOf('Category 33'));
 assert.equal(html,renderCategoryLinks([...pages].reverse(),{categoriesOnly:true,limit:28}));
 assert.match(renderCategoryLinks([{slug:'destination',title:'Existing destination',activeJobCount:10}]),/Existing destination/);
});
