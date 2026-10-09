import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source = (await readFile(new URL('./page-ready.js',import.meta.url),'utf8')).replace('export async function','async function');
test('keeps content hidden until fonts and visible images settle, ignores offscreen lazy images',async()=>{
 let fontReady, imageReady, revealed=false, removed=false;
 const image={complete:false,getBoundingClientRect:()=>({width:100,height:100,top:0,bottom:100}),addEventListener:(name,callback)=>{if(name==='load')imageReady=callback;}};
 const offscreen={complete:false,getBoundingClientRect:()=>({width:100,height:100,top:2000,bottom:2100}),addEventListener:()=>assert.fail('offscreen image must not block')};
 const app={querySelectorAll:()=>[image,offscreen],removeAttribute:()=>{}};
 const context=vm.createContext({Promise,Array,innerHeight:800,setTimeout,clearTimeout,requestAnimationFrame:callback=>callback(),window:{clearTimeout},document:{fonts:{ready:new Promise(resolve=>fontReady=resolve)},getElementById:id=>id==='app'?app:{remove:()=>removed=true},documentElement:{classList:{remove:()=>revealed=true}}}});
 vm.runInContext(source,context); const pending=context.revealPage();
 assert.equal(revealed,false);fontReady(); await Promise.resolve();assert.equal(revealed,false);
 imageReady(); await pending;assert.equal(revealed,true);assert.equal(removed,true);
});
