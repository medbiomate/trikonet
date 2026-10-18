const escape=value=>String(value?.rendered??value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function injectInitialEmployers(html,employers) {
  const start=html.indexOf('<div id="app">'),end=html.indexOf('<style>',start);
  if(start<0||end<0)return html;
  const cards=employers.map(item=>`<article><h2><a href="/employer/${encodeURIComponent(item.slug)}">${escape(item.title)}</a></h2></article>`).join('');
  const content=`<main><h1>Employers in UAE</h1><form action="/employers" method="get"><label>Company name <input name="q"></label><button>Search employers</button></form>${cards||'<p>No employers match these filters. Try a different company name, location or category.</p><a href="/employers">Browse all employers</a>'}</main>`;
  return html.slice(0,start)+`<div id="app" data-server-rendered="employers">${content}</div>`+html.slice(end);
}
