import test from 'node:test';
import assert from 'node:assert/strict';
import {initialPage} from './initial-page.mjs';
test('homepage sends actual shared hero with native search and no temporary screen',()=>{
 const html=initialPage('/');assert.match(html,/hero-minimal-title/);assert.match(html,/action="\/jobs" method="GET"/);assert.match(html,/hero-team-640.webp/);assert.ok(!html.includes('data-loading-shell'));assert.ok(!html.includes('on its way'));
});
test('other routes never receive a substitute search screen',()=>{for(const path of ['/jobs','/login','/employers'])assert.equal(initialPage(path),'');});
