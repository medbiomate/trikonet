import {renderSiteHeader} from './site-header.js';
import {publicJobPath} from './job-urls.js';
const esc=value=>String(value?.rendered??value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function renderJobFallback(jobs,{path='/jobs',category='',query='',total=jobs.length,page=1,search=''}={}) {
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
export function renderListingSkeleton(path='/jobs', label='Loading jobs') {
 const bar=(width='100%')=>`<span class="jobs-skeleton-bar" style="width:${width}"></span>`;
 const cards=Array.from({length:5},()=>`<div class="jobs-skeleton-card"><div class="jobs-skeleton-row"><span class="jobs-skeleton-logo"></span><div class="jobs-skeleton-copy">${bar('65%')}${bar('40%')}${bar('50%')}</div></div>${bar()}${bar('85%')}<div class="jobs-skeleton-row">${bar('25%')}${bar('25%')}</div></div>`).join('');
 return `<style>
 .jobs-loading-shell{max-width:1250px;margin:auto;padding:32px 20px 48px}
 .jobs-skeleton-bar,.jobs-skeleton-logo{display:block;background:#e8edf3;border-radius:7px;animation:jobs-skeleton-pulse 1.6s ease-in-out infinite}
 .jobs-skeleton-bar{height:16px;margin:12px 0}.jobs-skeleton-logo{width:64px;height:64px;border-radius:14px;flex-shrink:0}
 .jobs-skeleton-hero{padding:28px;background:#f3f5f8;border-radius:18px;margin-bottom:28px}.jobs-skeleton-hero>.jobs-skeleton-bar:first-child{height:30px}.jobs-skeleton-hero>.jobs-skeleton-bar:last-child{height:52px;margin-top:24px}
 .jobs-skeleton-layout{display:grid;grid-template-columns:250px minmax(0,1fr);gap:28px}.jobs-skeleton-card,.jobs-skeleton-filters{background:#fff;border:1px solid #e1e6ed;border-radius:16px;padding:24px;margin-bottom:16px}
 .jobs-skeleton-row{display:flex;gap:16px;align-items:center}.jobs-skeleton-copy{flex:1;min-width:0}.jobs-skeleton-filters{align-self:start}
 @keyframes jobs-skeleton-pulse{50%{opacity:.45}}
 @media(max-width:850px){.jobs-loading-shell{padding:20px 16px}.jobs-skeleton-layout{grid-template-columns:1fr}.jobs-skeleton-filters{display:none}.jobs-skeleton-card{padding:20px}}
 @media(prefers-reduced-motion:reduce){.jobs-skeleton-bar,.jobs-skeleton-logo{animation:none}}
 </style>${renderSiteHeader({path:path})}<main class="jobs-loading-shell" role="status" aria-label="${esc(label)}" aria-busy="true"><div aria-hidden="true"><div class="jobs-skeleton-hero">${bar('35%')}${bar()}</div><div class="jobs-skeleton-layout"><aside class="jobs-skeleton-filters">${Array.from({length:9},()=>bar('80%')).join('')}</aside><div>${cards}</div></div></div></main>`;
}
export function renderInitialJobs(jobs,options={}) {
 return `${renderListingSkeleton(options.path)}<div class="jobs-loading-fallback" hidden>${renderJobFallback(jobs,options)}</div><noscript><style>#app>.topbar:has(~.jobs-loading-shell),.jobs-loading-shell{display:none!important}.jobs-loading-fallback[hidden]{display:block!important}</style></noscript><script>(()=>{const app=document.getElementById('app');const restore=()=>{const fallback=app?.querySelector('.jobs-loading-fallback');if(fallback)app.replaceChildren(...fallback.childNodes)};window.addEventListener('trikonet:failed',restore,{once:true});setTimeout(restore,12000)})()</script>`;
}
export function injectInitialJobs(html,jobs,options) {
 const start=html.indexOf('<div id="app">'),end=html.indexOf('<style>',start);
 if(start<0||end<0)return html;
 return html.slice(0,start)+`<div id="app" data-server-rendered="jobs">${renderInitialJobs(jobs,options)}</div><script id="initial-job-list" data-total="${Number(options?.total ?? jobs.length)}" type="application/json">${JSON.stringify(jobs).replace(/</g,'\\u003c')}</script>`+html.slice(end);
}
