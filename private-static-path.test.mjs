import test from 'node:test';
import assert from 'node:assert/strict';
import {isPrivateStaticPath} from './private-static-path.mjs';
test('private account snapshots and server files are never static assets',()=>{
  for(const path of ['/data/local-db.json','/data/jobs.json','/.env','/.git/config','/assets/.secret','/server.js','/package.json','/package-lock.json','/http-resilience.mjs','/example.test.js','/node_modules/mysql2/package.json','/scripts/export.js'])assert.ok(isPrivateStaticPath(path),path);
});
test('public pages, browser code, manifest and ads verification remain accessible',()=>{
  for(const path of ['/','/jobs','/job/example','/app.js','/bootstrap.js','/assets/logo-black.png','/manifest.json','/app-ads.txt','/sitemap.xml','/_health/live'])assert.equal(isPrivateStaticPath(path),false,path);
});
