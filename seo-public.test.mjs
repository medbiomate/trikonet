import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { renderSeoLanding, seoHead } from './seo-public.js';

const page = {title:'Nurse Jobs in Dubai',h1:'Nurse Jobs in Dubai',slug:'nurse-jobs-in-dubai',category:'Nurse',location:'Dubai',seoTitle:'Nurse vacancies | Trikonet',metaDescription:'Find current Nurse vacancies.',indexingStatus:'Index',introContent:'<script>not executable</script>'};
test('public content escapes manual fields and renders current listings', () => {
  const html=renderSeoLanding({page,jobs:[{slug:'nurse-test',title:'Registered Nurse',description:'Care &nbsp; duties'}],total:1});
  assert.match(html,/Showing 1–1 of 1 active jobs/);
  assert.match(html,/href="\/job\/nurse-test"/);
  assert.match(html,/Care duties/);
  assert.match(html,/&lt;script&gt;/);
  assert.doesNotMatch(html,/<script>/);
  assert.match(seoHead({...page,indexingStatus:'Noindex'}),/noindex,follow/);
});

test('frontend server delivers crawlable SEO metadata, noindex and real draft 404', async () => {
  const api=http.createServer((req,res)=>{
    res.setHeader('Content-Type','application/json');
    const job={id:18345,slug:'accountant-dubai-company-18345',publicPath:'/jobs/accountant-dubai-company-18345',title:'Accountant',status:'publish',company:'Company',createdAt:'2026-10-02T00:00:00Z'};
    if(req.url.startsWith('/api/wp/employer')){if(req.url.includes('q=api-failure')){res.writeHead(503);return res.end('{}');}return res.end('[]');}
    if(req.url.startsWith('/api/public/jobs'))return res.end('[]');
    if(req.url.startsWith('/api/job-url')) {
      const requested=new URL(req.url,'http://test').searchParams.get('path');
      if(requested.includes('missing')){res.writeHead(404);return res.end('{}');}
      return res.end(JSON.stringify({slug:job.slug,publicPath:job.publicPath,job}));
    }
    if(req.url.startsWith('/api/local/jobs/'))return res.end(JSON.stringify(job));

    if(req.url==='/sitemap-seo-job-pages.xml'){res.setHeader('Content-Type','application/xml');return res.end('<urlset><url><loc>https://www.trikonet.com/nurse-jobs-in-dubai</loc></url></urlset>');}
    if(req.url.includes('/missing-page')){res.writeHead(404);return res.end('{}');}
    if(req.url.includes('/draft-page')){res.writeHead(404);return res.end(JSON.stringify({seoPage:true}));}
    if(req.url.includes('/unavailable-page')){res.writeHead(503);return res.end(JSON.stringify({error:'Unavailable'}));}
    if(req.url.includes('/noindex-page'))return res.end(JSON.stringify({page:{...page,slug:'noindex-page',indexingStatus:'Noindex'},jobs:[],total:0,links:[]}));
    return res.end(JSON.stringify({page,jobs:[],total:0,links:[]}));
  });
  api.listen(0,'127.0.0.1');await once(api,'listening');
  const socket=http.createServer();socket.listen(0,'127.0.0.1');await once(socket,'listening');const port=socket.address().port;await new Promise(resolve=>socket.close(resolve));
  const child=spawn(process.execPath,['server.js'],{cwd:new URL('.',import.meta.url),env:{...process.env,HOST:'127.0.0.1',PORT:String(port),TRIKONET_API_BASE:`http://127.0.0.1:${api.address().port}`},stdio:['ignore','pipe','pipe']});
  try {
    await Promise.race([once(child.stdout,'data'),once(child,'exit').then(()=>{throw Error('Preview server exited early');})]);
    const origin=`http://127.0.0.1:${port}`;
    const response=await fetch(`${origin}/${page.slug}`),html=await response.text();
    assert.equal(response.status,200);assert.match(html,/<h1>Nurse Jobs in Dubai<\/h1>/);
    assert.match(html,/<title>Nurse vacancies \| Trikonet<\/title>/);
    assert.match(html,/rel="canonical" href="https:\/\/www.trikonet.com\/nurse-jobs-in-dubai"/);
    const noindex=await fetch(`${origin}/noindex-page`);assert.equal(noindex.status,200);assert.equal(noindex.headers.get('x-robots-tag'),'noindex,follow');
    assert.match(await noindex.text(),/name="robots" content="noindex,follow"/);
    const draft=await fetch(`${origin}/draft-page`);assert.equal(draft.status,404);assert.equal(draft.headers.get('x-robots-tag'),'noindex');
    const unavailable=await fetch(`${origin}/unavailable-page`);assert.equal(unavailable.status,503);assert.equal(unavailable.headers.get('retry-after'),'120');assert.equal(unavailable.headers.get('x-robots-tag'),null);
    const migrated=await fetch(`${origin}/job/old-accountant`,{redirect:'manual'});
    assert.equal(migrated.status,301);assert.equal(migrated.headers.get('location'),'/jobs/accountant-dubai-company-18345');
    const clean=await fetch(`${origin}/jobs/accountant-dubai-company-18345`);
    assert.equal(clean.status,200);const cleanHtml=await clean.text();
    assert.match(cleanHtml,/canonical.*https:\/\/www.trikonet.com\/jobs\/accountant-dubai-company-18345/);
    assert.match(cleanHtml,/id="job-url-data"/);
    const embedded = cleanHtml.match(/<script id="public-content-data" type="application\/json">([\s\S]*?)<\/script>/);
    assert.ok(embedded);assert.equal(JSON.parse(embedded[1]).title,'Accountant');
    assert.equal((await fetch(`${origin}/jobs/missing-999`)).status,404);
    assert.equal((await fetch(`${origin}/missing-page`)).status,404);
    assert.equal((await fetch(`${origin}/employers?q=api-failure`)).status,503);
    const filtered=await fetch(`${origin}/employers?q=Hospital`);assert.equal(filtered.status,200);assert.equal(filtered.headers.get('x-robots-tag'),'noindex,follow');assert.match(await filtered.text(),/No employers match these filters/);
    assert.equal((await fetch(`${origin}/jobs?page=9999`)).status,404);
    const migratedCategory=await fetch(`${origin}/job-category/mathematics-teacher-jobs`,{redirect:'manual'});assert.equal(migratedCategory.status,301);assert.equal(migratedCategory.headers.get('location'),'/category/mathematics-teacher-jobs');
    const legacyMap=await fetch(`${origin}/sitemap_index.xml`,{redirect:'manual'});
    assert.equal(legacyMap.status,301);assert.equal(legacyMap.headers.get('location'),'/sitemap.xml');
    const home=await fetch(`${origin}/`);const homeHtml=await home.text();
    assert.match(homeHtml,/media="print" onload="this.media='all'" href="\/detail.css/);
    assert.match(homeHtml,/hero-team-640.webp/);
    assert.equal((await fetch(`${origin}/unknown/nested/path`)).status,404);
    const employers=await fetch(`${origin}/employers?utm_source=test`);
    assert.match(await employers.text(),/rel="canonical" href="https:\/\/www.trikonet.com\/employers"/);
    const alias=await fetch(`${origin}/job-list?q=nurse`,{redirect:'manual'});
    assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),'/jobs?q=nurse');
    const sitemap=await fetch(`${origin}/sitemap-seo-job-pages.xml`);assert.equal(sitemap.status,200);assert.match(await sitemap.text(),/nurse-jobs-in-dubai/);
  } finally {child.kill();await new Promise(resolve=>api.close(resolve));}
});
