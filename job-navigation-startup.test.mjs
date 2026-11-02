import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
test('navigation core installs before advertising and visible content',()=>{
 const html=read('./index.html');
 const early=html.indexOf('src="/job-navigation-core.js');
 assert.ok(early>0 && early<html.indexOf('googletagmanager.com'));
 assert.ok(early<html.indexOf('<body>'));
});
test('first render waits for the active gesture before replacing the server links',()=>{
 const app=read('./app.js');
 assert.match(app,/await waitForJobNavigationIdle\(\);\s*document.querySelector\('#app'\).innerHTML=render\(\)/);
});
