import {renderSiteHeader} from './site-header.js';
import {renderSiteFooter} from './site-footer.js';
import {formatCompanyName} from './company-name.js';
const escape=value=>String(value?.rendered??value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function injectInitialEmployers(html,employers) {
 const start=html.indexOf('<div id="app">'),end=html.indexOf('<style>',start);
 if(start<0||end<0)return html;
 const cards=employers.map(item=>{
  const title=formatCompanyName(item.title?.rendered??item.title??'');
  const m=item.metas||{},logo=item.logo||m._employer_logo||m._employer_featured_image_img||m._employer_featured_image||'';
  const safeLogo=/^(?:https?:\/\/|\/[^/])/.test(String(logo))?logo:'';
  return `<article class="initial-employer-card"><a href="/employer/${encodeURIComponent(item.slug)}">${safeLogo?`<img src="${escape(safeLogo)}" alt="" loading="lazy">`:`<span class="initial-employer-monogram">${escape(title.slice(0,1))}</span>`}<h2>${escape(title)}</h2><span class="initial-employer-link">View Company →</span></a></article>`;
 }).join('');
 const css=`<style>.initial-employers{max-width:1200px;margin:0 auto;padding:56px 24px 72px;color:#172033}.initial-employers h1{font-size:36px;line-height:1.2;margin:0 0 12px}.initial-employers>p{color:#64748b;margin:0 0 28px}.initial-employer-search{display:flex;gap:12px;margin:0 0 32px;max-width:720px}.initial-employer-search input{flex:1;min-width:0;padding:14px 16px;border:1px solid #dbe2ec;border-radius:10px;font:inherit;background:white}.initial-employer-search button{padding:14px 22px;border:0;border-radius:10px;background:#b9180c;color:white;font:inherit;cursor:pointer}.initial-employer-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.initial-employer-card{background:white;border:1px solid #e3e8ef;border-radius:16px;padding:28px;box-shadow:0 4px 16px #10204006}.initial-employer-card a{display:block;text-decoration:none;color:inherit}.initial-employer-card img,.initial-employer-monogram{width:72px;height:72px;object-fit:contain;margin-bottom:18px}.initial-employer-monogram{display:flex;align-items:center;justify-content:center;background:#f1f5f9;border-radius:12px;font-size:28px;color:#64748b}.initial-employer-card h2{font-size:19px;line-height:1.4;margin:0 0 18px}.initial-employer-link{color:#b9180c;font-size:14px;font-weight:600}@media(max-width:800px){.initial-employer-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:500px){.initial-employer-grid{grid-template-columns:1fr}.initial-employers{padding:32px 18px}.initial-employers h1{font-size:28px}.initial-employer-search{flex-wrap:wrap}}</style>`;
 const content=renderSiteHeader({path:'/employers'})+css+`<main class="initial-employers"><h1>Explore Employers in UAE</h1><p>Discover companies and find your next career opportunity.</p><form class="initial-employer-search" action="/employers" method="get"><input name="q" aria-label="Company name" placeholder="Search by company name…"><button>Search Employers</button></form><div class="initial-employer-grid">${cards||'<p>No employers match these filters. <a href="/employers">Browse all employers</a></p>'}</div></main>`+renderSiteFooter();
 return html.slice(0,start)+`<div id="app" data-server-rendered="employers">${content}</div>`+html.slice(end);
}
