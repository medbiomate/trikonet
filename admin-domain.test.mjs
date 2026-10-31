import test from 'node:test';import assert from 'node:assert/strict';
import {adminDomainRedirect,isPublicAdminLogin} from './admin-domain.mjs';
test('public admin pages redirect to API host without changing account API',()=>{
 for(const path of ['/admin-login','/admin-login/','/admin-portal','/trikonet-admin-access']){assert.equal(isPublicAdminLogin(path),true);assert.equal(adminDomainRedirect(path),null);}
 assert.equal(adminDomainRedirect('/admin','?editor=abc'),'https://api.trikonet.com/admin?editor=abc');
 for(const path of ['/jobs','/api/admin/login','/administrator'])assert.equal(adminDomainRedirect(path),null);
});
