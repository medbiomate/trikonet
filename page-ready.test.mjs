import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source = (await readFile(new URL('./page-ready.js',import.meta.url),'utf8')).replace('export async function','async function');
function setup(fonts) {
 let revealed=false,removed=false,timeout;
 const app={querySelectorAll:()=>assert.fail('image downloads must not block reveal'),removeAttribute:()=>{}};
 const context=vm.createContext({Promise,setTimeout:(callback,delay)=>{assert.equal(delay,150);timeout=callback;return 1;},clearTimeout(){},requestAnimationFrame:callback=>callback(),window:{clearTimeout(){}},document:{fonts,getElementById:id=>id==='app'?app:{remove:()=>removed=true},documentElement:{classList:{remove:()=>revealed=true}}}});
 vm.runInContext(source,context);
 return {context,get revealed(){return revealed;},get removed(){return removed;},timeout:()=>timeout()};
}
test('ready fonts reveal immediately without waiting for images',async()=>{
 const state=setup({ready:Promise.resolve()});await state.context.revealPage();assert.ok(state.revealed);assert.ok(state.removed);
});
test('slow fonts add at most 150ms of settling time',async()=>{
 const state=setup({ready:new Promise(()=>{})});const pending=state.context.revealPage();assert.equal(state.revealed,false);state.timeout();await pending;assert.ok(state.revealed);
});
