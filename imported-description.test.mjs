import test from 'node:test';import assert from 'node:assert/strict';
import {normalizeImportedDescription as normalize} from './imported-description.js';
test('encoded paragraphs and bullets display as formatting in Visual mode',()=>{
 assert.equal(normalize('&lt;p&gt;&lt;strong&gt;About&lt;/strong&gt;&lt;/p&gt;&lt;ul&gt;&lt;li&gt;Care&lt;/li&gt;&lt;/ul&gt;'),'<p><strong>About</strong></p><ul><li>Care</li></ul>');
 assert.equal(normalize('&amp;lt;p&amp;gt;Text&amp;lt;/p&amp;gt;'),'<p>Text</p>');
});
test('decoding never enables source scripts or event handlers',()=>{
 const result=normalize('&lt;p onclick=&quot;bad()&quot;&gt;Care&lt;/p&gt;&lt;script&gt;bad()&lt;/script&gt;');assert.equal(result,'<p>Care</p>');
 assert.equal(normalize('<p>One &amp; two</p>'),'<p>One &amp; two</p>');
});
