import test from 'node:test';
import assert from 'node:assert/strict';
import {initialPage} from './initial-page.mjs';
test('homepage sends actual shared hero with native search and no temporary screen',()=>{
 const html=initialPage('/');assert.match(html,/hero-minimal-title/);assert.match(html,/action="\/jobs" method="GET"/);assert.match(html,/hero-team-640.webp/);assert.ok(!html.includes('data-loading-shell'));assert.ok(!html.includes('on its way'));
});
test('pages with no server content receive a loading skeleton without an empty result message',()=>{
 for(const [path,label] of [['/jobs','Loading jobs'],['/login','Loading page'],['/employers','Loading companies']]){
  const html=initialPage(path);
  assert.ok(html.includes(`aria-label="${label}"`));
  assert.match(html,/jobs-skeleton-card/);
  assert.doesNotMatch(html,/No jobs match|No companies found/);
 }
});

test('homepage categories and footer are usable before JavaScript or APIs load',()=>{
 const html=initialPage('/');
 assert.match(html,/Popular Job Categories/);
 assert.match(html,/href="\/category\/nurse-jobs"/);
 assert.match(html,/<footer/);
 assert.doesNotMatch(html,/3148 open positions/);
});
