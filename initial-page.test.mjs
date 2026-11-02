import test from 'node:test';
import assert from 'node:assert/strict';
import {initialPage} from './initial-page.mjs';
test('homepage sends actual shared hero with native search and no temporary screen',()=>{
 const html=initialPage('/');assert.match(html,/hero-minimal-title/);assert.match(html,/action="\/jobs" method="GET"/);assert.match(html,/hero-team-640.webp/);assert.ok(!html.includes('data-loading-shell'));assert.ok(!html.includes('on its way'));
});
test('other routes never receive a substitute search screen',()=>{for(const path of ['/jobs','/login','/employers'])assert.equal(initialPage(path),'');});

test('homepage categories and footer are usable before JavaScript or APIs load',()=>{
 const html=initialPage('/');
 assert.match(html,/Popular Job Categories/);
 assert.match(html,/href="\/category\/nurse-jobs"/);
 assert.match(html,/<footer/);
 assert.doesNotMatch(html,/3148 open positions/);
});
