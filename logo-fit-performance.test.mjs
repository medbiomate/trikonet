import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./app.js',import.meta.url),'utf8');
const start=source.indexOf('function fitEmployerLogos()');
const fitter=source.slice(start,source.indexOf('\nfunction render()',start));
function image(width=100,height=100) {
 const listeners=new Set(),classes=new Set();
 return {complete:false,naturalWidth:width,naturalHeight:height,dataset:{},style:{},parentElement:{style:{}},src:'https://example.com/logo.png',classList:{add:value=>classes.add(value),contains:value=>classes.has(value)},classes,
 addEventListener(type,fn){if(type==='load')listeners.add(fn);},get pending(){return listeners.size;},
 load(){this.complete=true;for(const fn of [...listeners]){listeners.delete(fn);fn();}}
 };
}
function context(images,pixels) {
 let scans=0,visits=0,probes=0;
 const canvas={width:0,height:0,getContext:()=>({drawImage(){},getImageData:()=>({data:pixels})})};
 const sandbox={URL,location:{href:'https://www.trikonet.com/jobs'},document:{querySelectorAll(){scans++;visits+=images.length;return images;},createElement:()=>canvas},Image:class {constructor(){probes++;this.naturalWidth=200;this.naturalHeight=100;}set src(value){this.requested=value;this.onload();}}};
 vm.createContext(sandbox);vm.runInContext(fitter,sandbox);
 return {run:()=>sandbox.fitEmployerLogos(),stats:()=>({scans,visits,probes})};
}
test('sequential lazy logo loads fit only the completed image without rescanning the page',()=>{
 const images=Array.from({length:40},()=>image());const fixture=context(images);
 fixture.run();assert.ok(images.every(item=>item.pending===1));
 for(const item of images)item.load();
 assert.deepEqual(fixture.stats(),{scans:1,visits:40,probes:0});
});
test('repeated setup binds one pending handler per image and leaves lazy sources untouched',()=>{
 const item=image();const fixture=context([item]);fixture.run();fixture.run();fixture.run();
 assert.equal(item.pending,1);assert.equal(item.src,'https://example.com/logo.png');assert.equal(item.complete,false);
 item.load();assert.equal(item.pending,0);assert.equal(item.dataset.logoFitWaiting,undefined);
});
test('non-square logo keeps existing crop calculation and preserves the original source',()=>{
 const item=image(200,100);const pixels=new Uint8ClampedArray(200*100*4);
 for(let y=0;y<100;y++)for(let x=0;x<200;x++){
  const offset=(y*200+x)*4;const ink=x>=80&&x<120&&y>=40&&y<60;
  pixels[offset]=pixels[offset+1]=pixels[offset+2]=ink?0:255;pixels[offset+3]=255;
 }
 const fixture=context([item],pixels);fixture.run();item.load();
 assert.equal(fixture.stats().probes,1);assert.ok(item.classes.has('is-trimmed-logo'));
 assert.equal(item.style.width,`${200/46*100}%`);assert.equal(item.style.height,`${100/46*100}%`);
 assert.equal(item.src,'https://example.com/logo.png');
 fixture.run();assert.equal(fixture.stats().probes,1);
});

test('job detail logos also trim padding in square uploads',()=>{
 const item=image(100,100);item.classes.add('detail-logo');
 const pixels=new Uint8ClampedArray(200*100*4);
 for(let y=0;y<100;y++)for(let x=0;x<200;x++){
  const offset=(y*200+x)*4;const ink=x>=80&&x<120&&y>=40&&y<60;
  pixels[offset]=pixels[offset+1]=pixels[offset+2]=ink?0:255;pixels[offset+3]=255;
 }
 const fixture=context([item],pixels);fixture.run();item.load();
 assert.ok(item.classes.has('is-trimmed-logo'));
 assert.equal(item.src,'https://example.com/logo.png');
});
