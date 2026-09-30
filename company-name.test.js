import test from 'node:test';
import assert from 'node:assert/strict';
import {formatCompanyName} from './company-name.js';
test('uppercase and lowercase input render identically in title case',()=>{
  assert.equal(formatCompanyName('SMART SCIENCE GATE INFORMATION TECHNOLOGY'),'Smart Science Gate Information Technology');
  assert.equal(formatCompanyName('smart science gate information technology'),'Smart Science Gate Information Technology');
});
test('acronyms, punctuation and whitespace are retained appropriately',()=>{
  assert.equal(formatCompanyName('  gems   westminster school - sharjah llc '),'GEMS Westminster School - Sharjah LLC');
  assert.equal(formatCompanyName("nmc healthcare's it services"),"NMC Healthcare's IT Services");
});
