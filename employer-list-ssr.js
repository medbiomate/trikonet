import {renderSiteHeader} from './site-header.js';
import {renderSiteFooter} from './site-footer.js';
import {renderEmployerDirectory} from './employer-directory.js';
export function injectInitialEmployers(html,employers,params=new URLSearchParams()) {
 const start=html.indexOf('<div id="app">'),end=html.indexOf('<style>',start);
 if(start<0||end<0)return html;
 const names=value=>Array.isArray(value)?value:Object.values(value||{});
 const records=employers.map(item=>{const m=item.metas||{};return {...item,title:item.title?.rendered??item.title??'',logo:item.logo||m._employer_logo||m._employer_featured_image_img||m._employer_featured_image||'',categories:names(item.categories||m._employer_category),locations:names(item.locations||m._employer_location),openJobs:Number(item.openJobs||m._employer_open_jobs)||0};});
 const content=renderSiteHeader({path:'/employers'})+renderEmployerDirectory({data:{employers:records,counts:{employer:records.length}},queryParams:params,currentPage:Number(params.get('page'))||1,pageSize:12})+renderSiteFooter();
 return html.slice(0,start)+`<div id="app" data-server-rendered="employers">${content}</div>`+html.slice(end);
}
