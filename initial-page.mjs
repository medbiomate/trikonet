import {renderSiteHeader} from './site-header.js';
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function initialPage(path='/') {
 const home=path==='/';
 const title=home?'Find your next career move in the UAE':path==='/jobs'?'Jobs in UAE':'Explore Trikonet';
 return renderSiteHeader({path})+`<main data-loading-shell class="wrap" style="padding-top:48px;padding-bottom:60px"><h1>${escape(title)}</h1><p>Discover jobs and employers across the UAE.</p><form action="/jobs" method="get" style="display:flex;flex-wrap:wrap;gap:12px;max-width:760px"><label style="flex:1;min-width:200px"><span>Job title or keyword</span><input name="q" placeholder="Search jobs" style="display:block;width:100%;padding:14px;border:1px solid #ddd;border-radius:8px"></label><button class="primary" style="align-self:end">Find Jobs</button></form><p><a href="/jobs" data-google-vignette="false">Browse jobs</a> · <a href="/employers">Browse employers</a></p><p id="initial-loading-status" role="status">Latest content is on its way. You can search or browse now.</p></main>`;
}
