import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
for(const folder of ['./','../backend/public/admin-web/'])test(`preloaded runtime matches executed module URL: ${folder}`,()=>{
 const source=name=>readFileSync(new URL(folder+name,import.meta.url),'utf8');
 const preload=source('index.html').match(/href="(?:\/admin-web)?\/(app.js\?v=[^"]+)"/)[1];
 assert.equal(preload,source('bootstrap.js').match(/import\('\.\/(app.js\?v=[^']+)'/)[1]);
 const navigation=source('bootstrap.js').match(/from '(\.\/job-navigation.js[^']*)'/)[1];
 assert.ok(source('app.js').includes(`from '${navigation}'`));
});
