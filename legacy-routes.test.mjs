import test from 'node:test';
import assert from 'node:assert/strict';
import {legacyDestination,isFilteredListing} from './legacy-routes.js';
import {injectInitialEmployers} from './employer-list-ssr.js';
const terms={categories:[{slug:'nurse',name:'Nurse Jobs'}],employerCategories:[{slug:'medical-laboratory',name:'Medical Laboratory'}]};
test('legacy archive redirects require a real matching taxonomy',()=>{
 assert.equal(legacyDestination('/job-category/nurse',new URLSearchParams(),terms),'/category/nurse');
 assert.equal(legacyDestination('/job-category/not-real',new URLSearchParams(),terms),null);
 assert.equal(legacyDestination('/employer-category/medical-laboratory',new URLSearchParams(),terms),'/employers?category=Medical+Laboratory');
 assert.equal(legacyDestination('/employers/page/305',new URLSearchParams('q=test'),terms),'/employers?q=test&page=305');
});
test('filters excluded while clean directories and pagination remain eligible',()=>{
 assert.ok(isFilteredListing('/employers',new URLSearchParams('q=Hospital')));
 assert.ok(isFilteredListing('/nurse-jobs-in-uae',new URLSearchParams('location=Dubai')));
 assert.equal(isFilteredListing('/employers',new URLSearchParams('page=2')),false);
});
test('employer HTML includes meaningful content and safe names without JavaScript',()=>{
 const shell='<head></head><div id="app"></div><style></style>';
 assert.match(injectInitialEmployers(shell,[]),/No employers match these filters/);
 const result=injectInitialEmployers(shell,[{slug:'hospital',title:{rendered:'Hospital <script>'}}]);
 assert.match(result,/href="\/employer\/hospital"/);assert.doesNotMatch(result,/<script>/);
});
