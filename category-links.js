const escape = value => String(value || '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderCategoryLinks(links,{category='',slug='',categoriesOnly=false}={}) {
  const unique=new Map();
  for(const page of links || []) {
    if(page.activeJobCount<20 || page.slug===slug || (category && page.category!==category) || (categoriesOnly && page.pageType!=='main_category'))continue;
    const href=page.href || `/${page.slug}`;
    if(!href.startsWith('/') || href.startsWith('//'))continue;
    unique.set(href,page);
  }
  if(!unique.size)return '';
  return `<section class="wrap job-category-links"><h2>${categoriesOnly?'Explore Jobs by Category':'Related Job Categories'}</h2><nav aria-label="${categoriesOnly?'Job categories':'Related job categories'}" class="job-category-links-grid">${[...unique].map(([href,page])=>`<a href="${escape(href)}">${escape(page.title)}<span aria-hidden="true">→</span></a>`).join('')}</nav></section>`;
}
