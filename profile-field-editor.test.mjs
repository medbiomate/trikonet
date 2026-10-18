import test from 'node:test';
import assert from 'node:assert/strict';
import {createProfileField} from './profile-field-editor.js';
import {profileFieldOptions} from './profile-field-options.js';
class Element{
 constructor(tag){this.tagName=tag.toUpperCase();if(tag==='textarea')Object.defineProperty(this,'type',{get:()=> 'textarea'});this.children=[];this.attributes={};this.events={};this.value='';}
 append(...children){this.children.push(...children);}
 replaceChildren(...children){this.children=children;}
 setAttribute(key,value){this.attributes[key]=value;}
 removeAttribute(key){delete this.attributes[key];}
 addEventListener(key,fn){this.events[key]=fn;}
 get dataset(){return this.data??={};}
}
function withDom(run){const original=globalThis.document;globalThis.document={createElement:tag=>new Element(tag)};try{return run();}finally{globalThis.document=original;}}
test('app choices use dropdowns and preserve stored values outside the preset list',()=>withDom(()=>{
 for(const key of ['industry','gender','availability','workType','shiftPreference','visaStatus','qualification']){
  const field=createProfileField('Existing choice',()=>{},key);const select=field.children[1];assert.equal(select.tagName,'SELECT');assert.equal(select.value,'Existing choice');assert.ok(select.children.some(option=>option.value==='Existing choice'));
 }
 assert.deepEqual(profileFieldOptions.locations,['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain','Al Ain']);
}));
test('location multi-select adds and removes choices without blank text rows',()=>withDom(()=>{
 let saved;const field=createProfileField(['Dubai'],value=>saved=value,'locations');assert.equal(field.tagName,'FIELDSET');
 const grid=field.children[2];assert.ok(grid.children.every(control=>control.tagName==='BUTTON'));
 grid.children.find(button=>button.textContent==='Abu Dhabi').onclick();assert.deepEqual(saved,['Dubai','Abu Dhabi']);
 grid.children.find(button=>button.textContent==='Dubai').onclick();assert.deepEqual(saved,['Abu Dhabi']);
}));
test('dates and photo use native date and file controls',()=>withDom(()=>{
 assert.equal(createProfileField('1990-01-01',()=>{},'dateOfBirth').children[1].type,'date');
 const field=createProfileField('',()=>{},'photo');const upload=field.children.find(control=>control.type==='file');assert.ok(upload);assert.equal(upload.accept,'image/jpeg,image/png,image/webp');
}));
test('language abilities use multi-select and proficiency uses app dropdown choices',()=>withDom(()=>{
 const field=createProfileField({English:{abilities:['Read'],level:'Native'}},()=>{},'languageDetails');
 const inner=field.children[1].children[0].children[0];
 const rows=inner.children[1].children;
 assert.equal(rows[0].children[0].tagName,'FIELDSET');
 assert.equal(rows[1].children[0].children[1].tagName,'SELECT');
 assert.ok(rows[1].children[0].children[1].children.some(option=>option.value==='Native'));
}));

test('multiline fields render without assigning the read-only textarea type',()=>withDom(()=>{
 for(const key of ['summary','description','address','permanentAddress','education','workExperience']){
  const field=createProfileField('',()=>{},key);assert.equal(field.children[1].tagName,'TEXTAREA');
 }
}));
