import test from 'node:test';
import assert from 'node:assert/strict';
import {renderCategoryLinks} from './category-links.js';
test('links exclude low counts and current page, have no displayed counts, preserve URLs',()=>{
 const html=renderCategoryLinks([{slug:'current',title:'Current',activeJobCount:20},{slug:'low',title:'Low',activeJobCount:19},{slug:'category/healthcare',title:'Healthcare Jobs',activeJobCount:25,href:'/category/healthcare'}],{slug:'current'});
 assert.match(html,/href="\/category\/healthcare"/);assert.doesNotMatch(html,/Current|Low|25/);assert.match(html,/Related Job Categories/);
});
