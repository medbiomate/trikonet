import test from 'node:test';import assert from 'node:assert/strict';
import {adminDomainRedirect} from './admin-domain.mjs';
test('public admin pages redirect to API host without changing account API',()=>{
 assert.equal(adminDomainRedirect('/admin-login'),'https://api.trikonet.com/admin-login');
 assert.equal(adminDomainRedirect('/admin','?editor=abc'),'https://api.trikonet.com/admin?editor=abc');
 for(const path of ['/jobs','/api/admin/login','/administrator'])assert.equal(adminDomainRedirect(path),null);
});
