import test from 'node:test';
import assert from 'node:assert/strict';
import {categorySuggestions} from './category-picker.js';
const options=Array.from({length:12},(_,i)=>({value:String(i),label:`Category ${i}`}));
test('category dropdown never exceeds five suggestions',()=>{assert.equal(categorySuggestions(options,'').length,5);assert.equal(categorySuggestions(options,'category').length,5);});
test('search finds categories outside initial five suggestions',()=>{assert.deepEqual(categorySuggestions(options,'Category 9'),[options[9]]);assert.deepEqual(categorySuggestions(options,'missing'),[]);});
test('search ignores case and ranks prefix matches first',()=>{const records=[{label:'Special Nurse Jobs'},{label:'Nurse Jobs'}];assert.equal(categorySuggestions(records,' NURSE ')[0].label,'Nurse Jobs');});
