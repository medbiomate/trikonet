import test from 'node:test';
import assert from 'node:assert/strict';
import {reconcileJobSitemap,cleanSitemapIndex} from './sitemap-policy.js';
test('withdrawn jobs disappear; changed jobs have one canonical sitemap URL',()=>{
  const xml='<urlset><url><loc>https://www.trikonet.com/job/old</loc></url><url><loc>https://www.trikonet.com/job/removed</loc></url></urlset>';
  const result=reconcileJobSitemap(xml,[{slug:'new',urlAliases:['/job/old'],publicPath:'/jobs/new',status:'publish'},{slug:'removed',status:'draft'}]);
  assert.doesNotMatch(result,/\/old|\/removed/);assert.match(result,/https:\/\/www.trikonet.com\/jobs\/new/);
  assert.equal((result.match(/<url>/g)||[]).length,1);
});
test('sitemap index excludes filter variants with another canonical',()=>{
  const xml='<sitemapindex><sitemap><loc>https://www.trikonet.com/sitemap-jobs.xml</loc></sitemap><sitemap><loc>https://www.trikonet.com/sitemap-employer-locations.xml</loc></sitemap></sitemapindex>';
  assert.doesNotMatch(cleanSitemapIndex(xml),/employer-locations/);assert.match(cleanSitemapIndex(xml),/sitemap-jobs/);
});
