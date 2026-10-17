import test from 'node:test';
import assert from 'node:assert/strict';
import {initialPage} from './initial-page.mjs';
for(const path of ['/','/jobs','/login'])test(`initial ${path} has native links and a working GET search`,()=>{
 const html=initialPage(path);assert.match(html,/action="\/jobs" method="get"/);assert.match(html,/name="q"/);assert.match(html,/href="\/employers"/);assert.ok(!html.includes('inert'));assert.ok(!html.includes('page-preloader'));
});
