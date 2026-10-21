import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
test('slow module startup keeps the page alive instead of replacing it with a false failure',()=>{
 let timeout,replacements=0;
 const source=readFileSync(new URL('./bootstrap.js',import.meta.url),'utf8').replace(/^import .*\n/,'').replace('export function','function').replace(/import\('\.\/app\.js[^']*'\)/,"new Promise(()=>{})");
 const context={initJobNavigation(){},document:{getElementById(){return {textContent:'',hasAttribute:()=>false,querySelector:()=>null,replaceChildren(){replacements++;}};}},console,Promise,setTimeout(fn){timeout=fn;},clearTimeout(){}};
 vm.runInNewContext(source,context);timeout();assert.equal(replacements,0);
});
