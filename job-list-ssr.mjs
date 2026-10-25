import {renderSiteHeader} from './site-header.js';
import {publicJobPath} from './job-urls.js';
const esc=value=>String(value?.rendered??value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function renderInitialJobs(jobs,{path='/jobs',category='',query='',total=jobs.length,page=1,search=''}={}) {
 const pages=Math.ceil(total/10);
 const pageLink=value=>{const params=new URLSearchParams(search);params.set('page',value);return `${path}?${params}`;};
 const pagination=pages>1?`<nav class="data-pagination" aria-label="Pagination"><div class="pagination-info">Page ${page} of ${pages}</div><div class="pagination-controls">${page>1?`<a class="pagination-btn pagination-prev" href="${esc(pageLink(page-1))}">Previous</a>`:''}${page<pages?`<a class="pagination-btn pagination-next" href="${esc(pageLink(page+1))}">Next</a>`:''}</div></nav>`:'';
 const title=query?`Jobs matching “${query}”`:category?`${category.replace(/ jobs$/i,'')} Jobs`:'Jobs in UAE';
 return renderSiteHeader({path})+`<main class="nurse-results-page"><section class="nurse-results-hero"><div class="wrap"><h1>${esc(title)}</h1><form action="/jobs" method="get" class="searchbar"><label class="field"><input name="q" value="${esc(query)}" placeholder="Job title, skills or company" aria-label="Search jobs"></label>${category?`<input type="hidden" name="category" value="${esc(category)}">`:''}<button class="primary">Find Jobs</button></form></div></section><section class="wrap" style="padding-top:24px;padding-bottom:40px"><div class="nurse-job-list">${jobs.map(job=>{
 const company=job.company||job.metas?._job_employer_name||'';
 const location=(job.locations||Object.values(job.metas?._job_location||{})).join(', ');
 return `<article class="nurse-job-card standard-job-card"><div class="nurse-card-top">${job.logo || job.metas?._job_logo ? `<div class="nurse-card-logo"><img src="${esc(job.logo || job.metas._job_logo)}" alt="${esc(company)}" width="80" height="80" style="object-fit:contain"></div>` : ''}<div class="nurse-card-info"><a class="nurse-job-title-link" data-google-vignette="false" href="${esc(publicJobPath(job))}"><h2>${esc(job.title)}</h2></a><p>${esc(company)}</p><p>${esc(location)}</p><p class="nurse-job-excerpt">${esc(job.excerpt).slice(0,280)}</p></div></div><div class="nurse-card-footer"><a class="nurse-view-job-btn" data-google-vignette="false" href="${esc(publicJobPath(job))}">View Job →</a></div></article>`;
 }).join('')}</div>${!jobs.length?'<p>No jobs match these filters.</p>':''}${pagination}</section></main>`;
}
export function injectInitialJobs(html,jobs,options) {
 const start=html.indexOf('<div id="app">'),end=html.indexOf('<style>',start);
 if(start<0||end<0)return html;
 return html.slice(0,start)+`<div id="app" data-server-rendered="jobs">${renderInitialJobs(jobs,options)}</div><script id="initial-job-list" data-total="${Number(options?.total ?? jobs.length)}" type="application/json">${JSON.stringify(jobs).replace(/</g,'\\u003c')}</script>`+html.slice(end);
}
