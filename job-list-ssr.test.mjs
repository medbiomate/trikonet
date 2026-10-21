import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {injectInitialJobs} from './job-list-ssr.mjs';
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
test('first HTML contains actual job titles and links before JavaScript',()=>{
 const output=injectInitialJobs(html,[{slug:'nurse',title:'Registered Nurse',company:'Hospital',publicPath:'/jobs/nurse',excerpt:'Patient care',locations:['Dubai']}],{path:'/jobs'});
 assert.match(output,/data-server-rendered="jobs"/);assert.match(output,/Registered Nurse/);assert.match(output,/class="nurse-view-job-btn"[^>]*href="\/jobs\/nurse"/);assert.match(output,/id="initial-job-list"/);assert.doesNotMatch(output,/Explore Jobs by Category/);
});
test('untrusted titles and JSON cannot inject executable markup',()=>{
 const output=injectInitialJobs(html,[{slug:'safe',title:'<script>alert(1)</script>',excerpt:'<img src=x onerror=alert(2)>'}],{path:'/category/nurse',category:'Nurse'});
 assert.doesNotMatch(output,/<script>alert\(1\)<\/script>|<img src=x/);assert.match(output,/\\u003cscript/);
});
test('browser reuses server results without another listing download',()=>{
 const source=readFileSync(new URL('./app.js',import.meta.url),'utf8');const start=source.indexOf('async function loadLocalJobs()');const section=source.slice(start,source.indexOf('async function loadLocalEmployers',start));assert.ok(section.indexOf("getElementById('initial-job-list')")<section.indexOf('await fetch'));assert.match(section,/JSON.parse\(embedded.textContent\).map\(mapJob\);return/);
});
test('pagination preserves filters and supports first, middle and last pages',()=>{
 const jobs=[{slug:'sample',title:'Sample'}];
 const render=page=>injectInitialJobs(html,jobs,{path:'/jobs',total:25,page,search:'?q=nurse&location=Dubai'});
 const first=render(1);assert.match(first,/pagination-next/);assert.match(first,/q=nurse&amp;location=Dubai&amp;page=2/);assert.doesNotMatch(first,/pagination-prev/);
 const middle=render(2);assert.match(middle,/pagination-prev/);assert.match(middle,/page=3/);
 const last=render(3);assert.match(last,/pagination-prev/);assert.doesNotMatch(last,/pagination-next/);
 assert.doesNotMatch(injectInitialJobs(html,jobs,{total:1}),/aria-label="Pagination"/);
});
test('client waits for listing count before replacing server pagination',()=>{
 const source=readFileSync(new URL('./app.js',import.meta.url),'utf8');
 assert.match(source,/initialLoads.push\(loadCounts\(\).then\(loadLocalJobs\),loadDirectoryTaxonomies\(\)\)/);
});
