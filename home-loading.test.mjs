import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('./app.js', import.meta.url), 'utf8');
test('pending homepage content does not enter the blocking render loads', async () => {
  const start = source.indexOf('if(isCvAppRoute || path.startsWith');
  const end = source.indexOf('const adminSessionReady', start);
  const calls = [];
  const context = vm.createContext({path:'/',MEMBER_PATHS:[],isCvAppRoute:false,initialLoads:[],Promise,
    loadTopEmployers(){calls.push('companies');return new Promise(()=>{});},
    loadConnectedContent(){calls.push('articles');return new Promise(()=>{});}});
  vm.runInContext(source.slice(start,end),context);
  assert.deepEqual(calls,['companies','articles']);
  assert.equal(context.initialLoads.length,0);
  await Promise.all(context.initialLoads);
});
test('homepage refresh keeps search and navigation nodes and initializes articles once', async () => {
  let release;
  const removed = [], rendered = [], calls = [];
  const sections = new Map(['.home-categories-section','.featured-companies-section','.recent-section'].map(selector => [selector, {querySelector(){return null;},set outerHTML(value){removed.push(selector);rendered.push(value);}}]));
  const context = vm.createContext({homeContentReady:new Promise(resolve=>release=resolve),Map,console,
    homeWidgets:()=>[{type:'hero'},{type:'categories',settings:{}},{type:'top-companies',settings:{}},{type:'articles',settings:{}}],
    homeCategories:()=> 'categories',homeTopCompanies:()=> 'companies',articleSection:()=> 'articles',
    document:{querySelectorAll(selector){assert.ok(selector.startsWith('main '));return [sections.get(selector.slice(5))];}},
    initRecentArticlesAutoSlider(){calls.push('slider');}});
  vm.runInContext(source.slice(source.lastIndexOf('if (homeContentReady) {'),source.indexOf('// Supplemental sections')),context);
  assert.equal(rendered.length,0);
  release();await context.homeContentReady;await Promise.resolve();
  assert.deepEqual(rendered,['categories','companies','articles']);
  assert.deepEqual(calls,['slider']);
});
