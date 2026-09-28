import { renderJobDetail, renderEmployerDetail } from './detail-pages.js?v=3.9';
import { renderAdmin, initAdmin } from './admin.js?v=9.6';
const seed = {
  jobs:[
    {id:1,title:'Corporate Accounting Manager',company:'Bateel International',category:'Accountant, Accounting or Finance',location:'Dubai',type:'Full Time',date:'September 22, 2026',slug:'corporate-accounting-manager'},
    {id:2,title:'Consultant, Ophthalmology',company:'Danat Al Emarat Hospital for Women & Children',category:'Consultant doctor Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 22, 2026',slug:'consultant-ophthalmology'},
    {id:3,title:'Consultant, Maternal and Fetal Medicine',company:'Danat Al Emarat Hospital for Women & Children',category:'Consultant doctor Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 22, 2026',slug:'consultant-maternal-and-fetal-medicine'},
    {id:4,title:'Registered Nurse',company:'Amana Healthcare',category:'HealthCare, Nurse Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 22, 2026',slug:'registered-nurse'}
  ],
  employers:[],
  posts:[
    {title:'Job Loss Insurance UAE: The Secret Salary Backup You Didn’t Know',slug:'job-loss-insurance-uae-iloe-guide',category:'blog',categoryName:'Insurance',date:'September 26, 2025',excerpt:'Imagine waking up one morning in the UAE to find that your company has closed its doors.',featuredImage:'/uploads/media/34983.jpg',author:'Athira Susan James',authorRole:'Written By',authorImage:'/assets/athira-susan-james.png',reviewer:'Mayur Kacholiya',reviewerRole:'Reviewed by:',reviewerImage:'/assets/mayur-kacholiya.png'},
    {title:'How to Manage Work-Related Stress',slug:'ips-to-manage-work-related-stress',category:'blog',categoryName:'Health',date:'September 8, 2025',excerpt:'Work-related stress has become an inevitable part of modern life, impacting productivity and mental wellbeing.',featuredImage:'/uploads/media/15727.jpg',author:'Athira Susan James',authorRole:'Written By',authorImage:'/assets/athira-susan-james.png',reviewer:'Mayur Kacholiya',reviewerRole:'Reviewed by:',reviewerImage:'/assets/mayur-kacholiya.png'},
    {title:'Importance of Taking Regular Breaks During Work Hours',slug:'regular-breaks-at-work',category:'blog',categoryName:'Health',date:'September 8, 2025',excerpt:'In the hustle of modern work culture, regular breaks help sustain focus and energy.',featuredImage:'/uploads/media/15736.jpg',author:'Athira Susan James',authorRole:'Written By',authorImage:'/assets/athira-susan-james.png',reviewer:'Mayur Kacholiya',reviewerRole:'Reviewed by:',reviewerImage:'/assets/mayur-kacholiya.png'}
  ],
  pages:{about:{title:'About Us',content:'Welcome to Trikonet! We are Konets, and this is not just a job portal—we’re your gateway to limitless career opportunities in the UAE and beyond.'}}
};
const store = {get(){try{return JSON.parse(localStorage.getItem('trikonetCMS'))||structuredClone(seed)}catch{return structuredClone(seed)}},set(v){localStorage.setItem('trikonetCMS',JSON.stringify(v))},reset(){localStorage.removeItem('trikonetCMS');location.reload()}};
const data=store.get(), path=location.pathname.replace(/\/$/,'')||'/';
data.counts={job_listing:0,employer:0,post:0};
data.taxonomies={types:[],categories:[],locations:[],tags:[],employerCategories:[],employerLocations:[]};
const queryParams=new URLSearchParams(location.search),currentPage=Math.max(Number(queryParams.get('page'))||1,1),pageSize=30;
const escapeAttr=value=>String(value||'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const icons={search:'⌕',pin:'⌖',bag:'▣'};
let wpRecord=null,wpEmployer=null,profileJobs=[],currentUser=null,emailCampaigns=[];
async function loadAccount(){try{const response=await fetch('/api/auth/me');if(response.ok){currentUser=(await response.json()).user;const campaigns=await fetch('/api/email-campaigns');if(campaigns.ok)emailCampaigns=await campaigns.json()}}catch{}}
async function loadWordPressRecord(){const match=path.match(/^\/(job|employer)\/([^/]+)$/);if(!match)return;const type=match[1]==='job'?'job_listing':'employer',slug=match[2];try{const response=await fetch(`/api/wp/${type}?slug=${encodeURIComponent(slug)}`);if(response.ok){const records=await response.json();wpRecord=records[0]||null}if(!wpRecord){const localResponse=await fetch(`/api/local/${type==='job_listing'?'jobs':'employers'}/${encodeURIComponent(slug)}`);if(localResponse.ok)wpRecord=await localResponse.json()}if(type==='job_listing'&&wpRecord?.metas?._job_employer_url){const employerSlug=new URL(wpRecord.metas._job_employer_url).pathname.split('/').filter(Boolean).pop();const employerResponse=await fetch(`/api/wp/employer?slug=${encodeURIComponent(employerSlug)}`);if(employerResponse.ok)wpEmployer=(await employerResponse.json())[0]||null}else if(type==='employer'&&wpRecord?.id){const jobsResponse=await fetch(`/api/wp/job_listing?employer_id=${wpRecord.id}&per_page=100`);if(jobsResponse.ok)profileJobs=(await jobsResponse.json()).map(mapJob)}}catch{wpRecord=null}}
const fieldValues=value=>value&&typeof value==='object'?Object.values(value).join(', '):'';
export function formatJobDate(value) {
  if (!value) return '';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === 'invalid date') return '';
    if (/^[A-Za-z]+\s+\d{1,2},\s+\d{4}$/.test(trimmed)) return trimmed;
  }
  let d = new Date(value);
  if (isNaN(d.getTime())) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      d = new Date(`${value.slice(0, 10)}T00:00:00`);
    }
  }
  if (isNaN(d.getTime())) {
    return '';
  }
  const formatted = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return formatted === 'Invalid Date' ? '' : formatted;
}
export function resolveJobDate(record) {
  if (!record) return '';
  const m = record.metas || {};
  let target = '';
  if (record.updatedDate) {
    target = record.updatedDate;
  } else if (record.updatedAt && record.createdAt && record.updatedAt !== record.createdAt) {
    target = record.updatedAt;
  } else if (record.modified && record.date && record.modified !== record.date) {
    target = record.modified;
  } else {
    target = record.publishedDate || record.postedDate || record.date || record.createdAt || m._job_posted_date || '';
  }
  return formatJobDate(target);
}
export function resolveJobDeadline(record) {
  if (!record) return '';
  const m = record.metas || {};
  const explicit = record.deadline || record.expiryDate || m._job_application_deadline_date || m._job_expiry_date;
  if (explicit) {
    const formatted = formatJobDate(explicit);
    if (formatted) return formatted;
  }
  const base = resolveJobDate(record) || record.publishedDate || record.date || new Date();
  let d = new Date(base);
  if (isNaN(d.getTime())) d = new Date();
  d.setDate(d.getDate() + 365);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
function mapJob(record){
  const m=record.metas||{};
  const date=resolveJobDate(record);
  const deadline=resolveJobDeadline(record);
  const rawExcerpt=record.excerpt?.rendered||record.content?.rendered||record.excerpt||'';
  const cleanExcerpt=rawExcerpt.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,160);
  return {
    id:record.id,
    title:record.title?.rendered||record.title||'',
    company:m._job_employer_name||record.company||'',
    category:fieldValues(m._job_category)||(record.categories||[]).join(', ')||record.category||'',
    location:fieldValues(m._job_location)||(record.locations||[]).join(', ')||record.location||'',
    type:fieldValues(m._job_type)||(record.types||[]).join(', ')||record.type||'',
    date:date,
    deadline:deadline,
    expiryDate:deadline,
    slug:record.slug,
    logo:m._job_logo||record.logo||'',
    employerUrl:m._job_employer_url||record.employerUrl||'',
    excerpt:cleanExcerpt,
    source:record.local?'local':'database',
    local:!!record.local
  };
}
async function loadLocalJobs(){
  try{
    const pageLimit = path === '/nurse-jobs-in-uae' ? 20 : pageSize;
    const filters=new URLSearchParams({per_page:String(pageLimit),page:String(currentPage)});
    if(path==='/nurse-jobs-in-uae'&&!queryParams.get('q'))filters.set('q','nurse');
    for(const key of ['q','location','category','job_type']){
      const val=queryParams.get(key);
      if(val&&val!=='Country or City'&&val!=='All Categories')filters.set(key,val);
    }
    const [wpResponse,localResponse]=await Promise.all([fetch(`/api/wp/job_listing?${filters}`),fetch('/api/local/jobs')]);
    const wp=wpResponse.ok?await wpResponse.json():[],local=localResponse.ok?await localResponse.json():[];
    const qTerm=queryParams.get('q')||(path==='/nurse-jobs-in-uae'?'nurse':'');
    const localFiltered=local.filter(job=>(!qTerm||job.title?.toLowerCase().includes(qTerm.toLowerCase())||(job.categories||[]).some(c=>c.toLowerCase().includes(qTerm.toLowerCase())))&&(!queryParams.get('location')||queryParams.get('location')==='Country or City'||(job.locations||[]).includes(queryParams.get('location')))&&(!queryParams.get('category')||queryParams.get('category')==='All Categories'||(job.categories||[]).some(c=>c.toLowerCase().includes(queryParams.get('category').toLowerCase())))&&(!queryParams.get('job_type')||(job.types||[]).includes(queryParams.get('job_type'))));
    data.jobs=[...(currentPage===1?localFiltered.map(mapJob):[]),...wp.map(mapJob)];
  }catch{data.jobs=[]}
}
async function loadLocalEmployers(){try{const filters=new URLSearchParams({per_page:String(pageSize),page:String(currentPage)});for(const key of ['q','location','category'])if(queryParams.get(key))filters.set(key,queryParams.get(key));const response=await fetch(`/api/wp/employer?${filters}`);const wp=response.ok?await response.json():[];data.employers=wp.map(record=>{const m=record.metas||{};return {title:record.title?.rendered||'',slug:record.slug,description:record.content?.rendered||'',logo:m._employer_logo||m._employer_featured_image_img||m._employer_featured_image||'',categories:Object.values(m._employer_category||{}),locations:Object.values(m._employer_location||{}),email:m._employer_email||'',phone:m._employer_phone||'',website:m._employer_website||'',openJobs:Number(m._employer_open_jobs)||0,source:'database'}})}catch{data.employers=[]}}
async function loadCounts(){
  try{
    const response=await fetch('/api/wp/counts');
    if(response.ok)data.counts=await response.json();
    if(path==='/nurse-jobs-in-uae'){
      const filters=new URLSearchParams();
      filters.set('type','job_listing');
      filters.set('q',queryParams.get('q')||'nurse');
      for(const key of ['location','category','job_type']){
        const val=queryParams.get(key);
        if(val&&val!=='Country or City'&&val!=='All Categories')filters.set(key,val);
      }
      const filtered=await fetch(`/api/wp/count?${filters}`);
      if(filtered.ok)data.counts.nurse=(await filtered.json()).total;
    }else if((path==='/employers'||path==='/jobs')&&[...queryParams].some(([key])=>['q','location','category','job_type'].includes(key))){
      const filters=new URLSearchParams(queryParams);
      filters.set('type',path==='/employers'?'employer':'job_listing');
      filters.delete('page');
      const filtered=await fetch(`/api/wp/count?${filters}`);
      if(filtered.ok)data.counts[path==='/employers'?'employer':'job_listing']=(await filtered.json()).total;
    }
  }catch{}
}
async function loadConnectedContent(){try{const [taxonomyResponse,postsResponse,pagesResponse]=await Promise.all([fetch('/api/wp/taxonomies'),fetch('/api/wp/posts?per_page=30'),fetch('/api/wp/pages?per_page=100')]);if(taxonomyResponse.ok)data.taxonomies=await taxonomyResponse.json();if(postsResponse.ok){const posts=await postsResponse.json();if(posts.length)data.posts=posts.map(post=>{const cat=post.metas?._post_category?Object.values(post.metas._post_category).join(', '):'Career';const authorName=(post.author_display_name||(post.author_name&&post.author_name!=='Trikonet'?post.author_name:''))||'Athira Susan James';return {id:post.id,title:post.title?.rendered||'',slug:post.slug,category:'blog',categoryName:cat,date:new Date(`${post.date}Z`).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),excerpt:(post.excerpt?.rendered||'').replace(/<[^>]+>/g,'').trim(),content:post.content?.rendered||'',featuredImage:post.featured_image||'',author:authorName,authorRole:'Written By',authorImage:post.author_avatar||'/assets/athira-susan-james.png',authorLink:'#',reviewer:post.reviewer_name||'Mayur Kacholiya',reviewerRole:'Reviewed by:',reviewerImage:post.reviewer_avatar||'/assets/mayur-kacholiya.png',reviewerLink:'#'}})}if(pagesResponse.ok){const pages=await pagesResponse.json();data.connectedPages=Object.fromEntries(pages.map(page=>[page.slug,page]))}}catch{}}
const siteChrome=(()=>{try{return JSON.parse(localStorage.getItem('trikonet_site_chrome')||'{}')}catch{return {}}})();
document.documentElement.style.setProperty('--footer-title-size',`${Number(siteChrome.footerTitleSize)||18}px`);
const chromeMenu=(value,fallback)=>String(value||fallback).split('\n').map(line=>{const [label,url,depth]=line.split('|').map(v=>v.trim());return [label,url,Number(depth)||0]}).filter(item=>item[0]&&item[1]);
function renderHeaderMenu(items){const groups=[];items.forEach(([label,url,depth])=>{if(depth&&groups.length)groups[groups.length-1].children.push([label,url]);else groups.push({label,url,children:[]})});return groups.map(item=>item.children.length?`<div class="nav-dropdown"><a href="${escapeAttr(item.url)}">${escapeAttr(item.label)} <span>⌄</span></a><div class="nav-submenu">${item.children.map(([label,url])=>`<a href="${escapeAttr(url)}">${escapeAttr(label)}</a>`).join('')}</div></div>`:`<a href="${escapeAttr(item.url)}">${escapeAttr(item.label)}</a>`).join('')}
function header(){const nurseHeader=path==='/nurse-jobs-in-uae',menu=chromeMenu(siteChrome.headerMenu,'Home | /\nBlogs | /blog\nJobs | /jobs\nEmployers List | /employers\nContact Us | /contact\nAbout Us | /about');return `<header class="topbar${nurseHeader?' nurse-page-header':''} site-header-${escapeAttr(siteChrome.headerLayout||'classic')}" style="background:${escapeAttr(siteChrome.headerBg||'transparent')};color:${escapeAttr(siteChrome.headerText||'#202124')}"><div class="wrap nav"><a class="brand" href="/"><img src="${escapeAttr(siteChrome.headerLogo||'/assets/logo-black.png')}" alt="Trikonet logo"></a><button class="hamb" aria-label="Open navigation">☰</button><nav class="links">${renderHeaderMenu(menu)}</nav>${currentUser?`<a class="outline" href="/email-campaigns">Email campaigns</a><button class="outline" id="logoutBtn">Logout</button>`:`<a class="outline" href="/login-register" style="border-color:${escapeAttr(siteChrome.headerAccent||'#b00008')};color:${escapeAttr(siteChrome.headerAccent||'#b00008')}">Login / Register</a>`}<a class="outline" href="/submit-job" style="border-color:${escapeAttr(siteChrome.headerAccent||'#b00008')};color:${escapeAttr(siteChrome.headerAccent||'#b00008')}">Add Job</a></div></header>`}
function footer(){const menu=chromeMenu(siteChrome.footerMenu,'About Us | /about\nContact Us | /contact\nTerms | /terms\nFAQ | /faq\nPrivacy Policy | /privacy-policy'),candidateMenu=chromeMenu(siteChrome.footerCandidateMenu,'Browse Jobs | /jobs\nJob Alerts | /alerts-jobs'),employerMenu=chromeMenu(siteChrome.footerEmployerMenu,'Employers List | /employers\nSubmit Job | /submit-job'),links=items=>items.map(([label,url])=>`<a href="${escapeAttr(url)}" style="color:${escapeAttr(siteChrome.footerLink||'#979797')}">${escapeAttr(label)}</a>`).join('');return `<footer class="footer site-footer-${escapeAttr(siteChrome.footerLayout||'columns')}" style="background:${escapeAttr(siteChrome.footerBg||'#202124')};color:${escapeAttr(siteChrome.footerText||'#ffffff')}"><div class="wrap footer-grid"><div><img src="${escapeAttr(siteChrome.footerLogo||'/assets/logo-white.png')}" alt="Trikonet"><p>${escapeAttr(siteChrome.footerEmail||'info@trikonet.com')}</p></div><div><h2>${escapeAttr(siteChrome.footerExploreTitle||'Explore')}</h2>${links(menu)}</div><div><h2>${escapeAttr(siteChrome.footerCandidateTitle||'For Candidates')}</h2>${links(candidateMenu)}</div><div><h2>${escapeAttr(siteChrome.footerEmployerTitle||'For Employers')}</h2>${links(employerMenu)}</div></div><div class="wrap footer-bottom">${escapeAttr(siteChrome.footerCopyright||'© 2026 Trikonet. All Right Reserved.')}</div></footer>`}
const optionList=(items,placeholder,selected)=>`<option>${placeholder}</option>${(items||[]).map(item=>`<option value="${escapeAttr(item.name)}"${selected===item.name?' selected':''}>${item.name}</option>`).join('')}`;
function searchBar(settings={}){const action=settings.action||(path==='/nurse-jobs-in-uae'?'/nurse-jobs-in-uae':'/jobs'),locationLabel=settings.location||'Country or City',categoryLabel=settings.category||'All Categories',selectedLocation=queryParams.get('location')||locationLabel,selectedCategory=queryParams.get('category')||categoryLabel;return `<form class="searchbar" action="${escapeAttr(action)}"><label class="field"><b>${icons.search}</b><input name="q" value="${escapeAttr(queryParams.get('q'))}" placeholder="${escapeAttr(settings.keyword||'Job Title, Keywords')}" aria-label="Job title"></label><label class="field"><b>${icons.pin}</b><select name="location" aria-label="Location">${optionList(data.taxonomies.locations,locationLabel,selectedLocation)}</select></label><label class="field"><select name="category" aria-label="Category">${optionList(data.taxonomies.categories,categoryLabel,selectedCategory)}</select></label><button class="primary">${escapeAttr(settings.button||'Find Jobs')}</button></form>`}
const homeSectionAttrs=s=>`${s.className?` ${escapeAttr(s.className)}`:''}" style="${s.background?`background:${escapeAttr(s.background)};`:''}${s.textColor?`color:${escapeAttr(s.textColor)};`:''}`;
function homeHero(s={}){return `<section class="hero${homeSectionAttrs(s)}"><div class="wrap"><h1>${escapeAttr(s.title||'Trying to Connect')}</h1>${searchBar(s)}${s.image&&s.image!=='/assets/hero.webp'?`<img class="home-custom-hero-image" src="${escapeAttr(s.image)}" alt="${escapeAttr(s.alt||'')}">`:''}</div></section>`}
function homeCategories(s={}){const cats=[...(data.taxonomies.categories||[])].sort((a,b)=>b.count-a.count).slice(0,9);return `<section class="section${homeSectionAttrs(s)}"><div class="wrap"><div class="section-title"><h2>${escapeAttr(s.title||'Popular Job Categories')}</h2><p>${escapeAttr(s.subtitle||'Find Your Perfect Job Here')}</p></div><div class="category-grid">${cats.map((c,i)=>`<a class="category" href="/jobs?category=${encodeURIComponent(c.name)}"><span class="cat-icon">${['✚','◫','⌂','▤','⚙','♙','◎','⌘','♟'][i]}</span><span><h3>${c.name}</h3><small>(${Number(c.count).toLocaleString()} open positions)</small></span></a>`).join('')}</div></div></section>`}
function homeHowItWorks(s={}){const steps=[[s.step1Image||'/assets/step-1.jpg',s.step1Title||'Register an Account to Start'],[s.step2Image||'/assets/step-2.jpg',s.step2Title||'Explore Over Thousands of Jobs'],[s.step3Image||'/assets/step-3.jpg',s.step3Title||'Find the Most Suitable Company and Job']];return `<section class="section alt${homeSectionAttrs(s)}"><div class="wrap"><div class="section-title"><h2>${escapeAttr(s.title||'How It Works?')}</h2><p>${escapeAttr(s.subtitle||'Job for Anyone, Anywhere')}</p></div><div class="steps">${steps.map(step=>`<div class="step"><img src="${escapeAttr(step[0])}" alt="${escapeAttr(step[1])}"><h3>${escapeAttr(step[1])}</h3></div>`).join('')}</div></div></section>`}
function homeWidgets(){const fallback=['hero','categories','how-it-works','articles'].map(type=>({type,settings:{}}));try{const pages=JSON.parse(localStorage.getItem('trikonet_pages_cms')||'[]');const page=pages.find(item=>item.slug==='home');if(!page?.content)return fallback;const doc=new DOMParser().parseFromString(page.content,'text/html');const widgets=[...doc.querySelectorAll('[data-home-widget]')].map(node=>{let settings={};try{settings=JSON.parse(decodeURIComponent(node.dataset.homeSettings||'%7B%7D'))}catch{}return {type:node.dataset.homeWidget,settings}}).filter(item=>fallback.some(x=>x.type===item.type));return widgets.length?widgets:fallback}catch{return fallback}}
function home(){const renderers={hero:homeHero,categories:homeCategories,'how-it-works':homeHowItWorks,articles:(s)=>articleSection(s)};return `<main>${homeWidgets().map(item=>renderers[item.type]?.(item.settings)||'').join('')}</main>`}
function pager(base,total,size=pageSize){const pages=Math.ceil(total/size),pageLink=page=>{const params=new URLSearchParams(queryParams);params.set('page',page);return `${base}?${params}`};if(pages<=1)return '';return `<nav class="data-pagination" aria-label="Pagination">${currentPage>1?`<a href="${pageLink(currentPage-1)}">← Previous</a>`:'<span></span>'}<span>Page ${currentPage} of ${pages}</span>${currentPage<pages?`<a href="${pageLink(currentPage+1)}">Next →</a>`:'<span></span>'}</nav>`}
function articleSection(s={}){const slider=path==='/';return `<section class="recent-section${slider?' recent-slider':''}${homeSectionAttrs(s)}"><div class="wrap"><div class="section-title"><h2>${escapeAttr(s.title||'Recent Articles')}</h2><p>${escapeAttr(s.subtitle||'Fresh job related content posted each day.')}</p></div><div class="articles"${slider?' id="recent-articles" tabindex="0" aria-label="Recent articles slider"':''}>${data.posts.map((p,i)=>`<article class="article"><img class="article-cover" src="${escapeAttr(p.featuredImage||p.image||`/assets/article-${(i%3)+1}.jpg`)}" alt="${escapeAttr(p.title)}" onerror="this.onerror=null;this.src='/assets/article-${(i%3)+1}.jpg';"><div class="article-body"><small>${p.date}</small><h3><a href="/${p.category}/${p.slug}">${p.title}</a></h3><p>${p.excerpt}</p><a class="read" href="/${p.category}/${p.slug}">Read More ›</a></div></article>`).join('')}</div></div></section>`}
function jobs(){
  const total=data.counts.job_listing||data.jobs.length,start=total?(currentPage-1)*pageSize+1:0,end=Math.min(start+data.jobs.length-1,total),selectedType=queryParams.get('job_type')||'';
  return `<main><section class="jobs-head"><div class="wrap">${searchBar()}</div></section><div class="wrap jobs-layout"><aside class="filters"><div class="filter"><h3>Job type</h3>${data.taxonomies.types.map(x=>{const params=new URLSearchParams(queryParams);if(selectedType===x.name)params.delete('job_type');else params.set('job_type',x.name);params.delete('page');return `<a class="check${selectedType===x.name?' active':''}" href="/jobs?${params}"><i></i>${x.name} <small>(${x.count})</small></a>`}).join('')}</div></aside><section><div class="listing-top"><span>${total?`Showing ${start} – ${end} of ${total.toLocaleString()} database jobs`:'No jobs found for these filters'}</span><select><option>Sort by (Default)</option><option>Newest</option></select></div><div class="job-grid">${data.jobs.map(j=>{
    const tags = [
      j.type ? `<span class="tag">${escapeAttr(j.type)}</span>` : '',
      j.location ? `<span class="tag neutral">${escapeAttr(j.location)}</span>` : '',
      j.date ? `<span class="tag neutral">${escapeAttr(j.date)}</span>` : ''
    ].filter(Boolean).join('');
    const logoHtml = j.logo ? `<img class="logo-dot company-logo" src="${escapeAttr(j.logo)}" alt="${escapeAttr(j.company)}">` : `<span class="logo-dot">${escapeAttr((j.company || j.title || 'J').slice(0,2).toUpperCase())}</span>`;
    return `<a class="job-card" href="/job/${escapeAttr(j.slug)}">
      <div class="job-top">
        ${logoHtml}
        <div>
          <h2>${escapeAttr(j.title)}</h2>
          ${j.company ? `<p>by ${escapeAttr(j.company)}</p>` : ''}
          ${j.category ? `<p>in ${escapeAttr(j.category)}</p>` : ''}
        </div>
      </div>
      ${tags ? `<div class="tags">${tags}</div>` : ''}
    </a>`;
  }).join('')}</div>${pager('/jobs',total)}</section></div></main>`;
}
function nurseJobsPage(){
  const curatedNurseJobs=[
    {id:'nj-1',title:'Staff Nurse',company:'SEHA Salma Rehabilitation Hospital',category:'HealthCare, Nurse Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 22, 2026',slug:'staff-nurse-seha-salma',logo:'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&auto=format&fit=crop&q=60',excerpt:'Join a trusted healthcare team and provide high-quality, compassionate patient care while growing your nursing career in the UAE.'},
    {id:'nj-2',title:'Registered Nurse (OPD / Inpatient)',company:'Amana Healthcare',category:'HealthCare, Nurse Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 22, 2026',slug:'registered-nurse-amana-healthcare',logo:'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&auto=format&fit=crop&q=60',excerpt:'Provide dedicated post-acute and specialized rehabilitation nursing care with Amana Healthcare in a supportive clinical environment.'},
    {id:'nj-3',title:'Clinical Care Nurse - ICU',company:'M42 Health',category:'HealthCare, Nurse Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 21, 2026',slug:'clinical-care-nurse-icu-m42',logo:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=120&auto=format&fit=crop&q=60',excerpt:'Deliver critical patient monitoring and specialized clinical care within M42 world-class healthcare facilities in Abu Dhabi.'},
    {id:'nj-4',title:'Pediatric Staff Nurse',company:'Danat Al Emarat Hospital',category:'HealthCare, Nurse Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 20, 2026',slug:'pediatric-staff-nurse-danat-al-emarat',excerpt:'Deliver compassionate pediatric nursing care and patient family support within a premier women and children hospital setting.'},
    {id:'nj-5',title:'Emergency Room (ER) Nurse',company:'Mediclinic Middle East',category:'HealthCare, Nurse Jobs',location:'Dubai',type:'Full Time',date:'September 19, 2026',slug:'er-nurse-mediclinic',excerpt:'Fast-paced clinical emergency department nursing role supporting trauma, urgent care, and patient triage in Dubai.'}
  ];
  const pageLimit=20;
  const list=(data.jobs.length?data.jobs:curatedNurseJobs).slice(0,pageLimit);
  const total=data.counts?.nurse||data.counts?.job_listing||list.length;
  const start=total?(currentPage-1)*pageLimit+1:0;
  const end=Math.min(start+list.length-1,total);
  const qQuery=queryParams.get('q');
  const selectedLoc=queryParams.get('location')||'';
  const selectedType=queryParams.get('job_type')||'';

  const hasActiveFilters=!!(selectedLoc||selectedType||qQuery);
  const removeLocParams=new URLSearchParams(queryParams);
  removeLocParams.delete('location');
  removeLocParams.delete('page');
  const removeTypeParams=new URLSearchParams(queryParams);
  removeTypeParams.delete('job_type');
  removeTypeParams.delete('page');

  let pageTitle='Nurse Jobs in UAE';
  if(qQuery)pageTitle=`"${escapeAttr(qQuery)}" Jobs in UAE`;
  else if(selectedLoc)pageTitle=`Nurse Jobs in ${escapeAttr(selectedLoc)}`;

  const employerCards=[
    {company:'SEHA Salma Rehabilitation Hospital',logo:'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&auto=format&fit=crop&q=60',openJobs:4,employerUrl:'/employers'},
    {company:'Amana Healthcare',logo:'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&auto=format&fit=crop&q=60',openJobs:6,employerUrl:'/employers'},
    {company:'M42 Health',logo:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=120&auto=format&fit=crop&q=60',openJobs:8,employerUrl:'/employers'}
  ];
  const iconBriefcase=`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
  const iconPin=`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const iconClock=`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  const iconBuilding=`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="18" x2="15" y2="18"/></svg>`;
  const iconBell=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`;
  const iconShareLinkedin=`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
  const iconShareFb=`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>`;
  const iconShareWa=`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`;
  const iconShareX=`<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
  const iconCheckTick=`<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  const iconBookmark=`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;

  return `<main class="nurse-results-page">
    <section class="nurse-results-hero">
      <div class="wrap">
        <div class="nurse-hero-topline">
          <nav class="nurse-breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Trikonet</a>
            <span class="sep">&gt;</span>
            <a href="/jobs">Jobs</a>
            <span class="sep">&gt;</span>
            <span class="current">Nurse Jobs in UAE</span>
          </nav>
        </div>
        <div class="nurse-hero-head">
          <div class="nurse-hero-title-row">
            <h1>${pageTitle}</h1>
            <span class="nurse-hero-count-tag">${total.toLocaleString()} Vacancies</span>
          </div>
          <p class="nurse-hero-desc">Discover verified nursing, clinical care, and hospital positions across Dubai, Abu Dhabi, and Northern Emirates with direct employer application.</p>
        </div>
        <div class="nurse-search-wrapper">
          ${searchBar({ keyword: 'Nurse, Staff Nurse, Clinic...', category: 'HealthCare, Nurse Jobs', button: 'Search Jobs', action: '/nurse-jobs-in-uae' })}
        </div>
        <div class="nurse-popular-chips">
          <span class="chips-label">Popular searches:</span>
          <a href="/nurse-jobs-in-uae?q=Staff+Nurse">Staff Nurse</a>
          <a href="/nurse-jobs-in-uae?q=Registered+Nurse">Registered Nurse</a>
          <a href="/nurse-jobs-in-uae?q=Clinic+Nurse">Clinic Nurse</a>
          <a href="/nurse-jobs-in-uae?q=ICU+Nurse">ICU Nurse</a>
          <a href="/nurse-jobs-in-uae?q=nurse&location=Dubai">Dubai</a>
          <a href="/nurse-jobs-in-uae?q=nurse&location=Abu+Dhabi">Abu Dhabi</a>
        </div>
      </div>
    </section>

    <section class="wrap nurse-results-layout">
      <aside class="filters nurse-site-filters">
        <div class="nurse-filter-header">
          <div class="nurse-filter-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            <span>Filter Jobs</span>
          </div>
          ${hasActiveFilters ? `<a href="/nurse-jobs-in-uae" class="nurse-filter-reset-link">Reset All</a>` : ''}
        </div>

        <div class="nurse-filter-group">
          <h3>Location</h3>
          ${(data.taxonomies?.locations || []).filter(l => ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al Ain', 'Ras Al Khaimah'].includes(l.name)).sort((a,b) => (b.count || 0) - (a.count || 0)).map(x => {
            const params = new URLSearchParams(queryParams);
            const isSelected = selectedLoc === x.name;
            if (isSelected) params.delete('location');
            else params.set('location', x.name);
            params.delete('page');
            const countText = x.count != null ? Number(x.count).toLocaleString() : '';
            return `<a class="nurse-filter-row${isSelected ? ' active' : ''}" href="/nurse-jobs-in-uae?${params}">
              <span class="nurse-row-label">
                <span class="nurse-custom-cb">${iconCheckTick}</span>
                <span class="nurse-filter-name">${escapeAttr(x.name)}</span>
              </span>
              ${countText ? `<span class="nurse-filter-count">${countText}</span>` : ''}
            </a>`;
          }).join('')}
        </div>

        <div class="nurse-filter-group">
          <h3>Job type</h3>
          ${(data.taxonomies?.types || []).map(x => {
            const params = new URLSearchParams(queryParams);
            const isSelected = selectedType === x.name;
            if (isSelected) params.delete('job_type');
            else params.set('job_type', x.name);
            params.delete('page');
            const countText = x.count != null ? Number(x.count).toLocaleString() : '';
            return `<a class="nurse-filter-row${isSelected ? ' active' : ''}" href="/nurse-jobs-in-uae?${params}">
              <span class="nurse-row-label">
                <span class="nurse-custom-cb">${iconCheckTick}</span>
                <span class="nurse-filter-name">${escapeAttr(x.name)}</span>
              </span>
              ${countText ? `<span class="nurse-filter-count">${countText}</span>` : ''}
            </a>`;
          }).join('')}
        </div>
      </aside>

      <section class="nurse-results-main">
        <div class="nurse-results-tools">
          <div class="nurse-tools-top">
            <span class="nurse-tools-count">Showing <b>${start} – ${end}</b> of <b>${total.toLocaleString()}</b> Nurse Jobs</span>
            <div class="nurse-tools-actions">
              <select class="nurse-sort-select" aria-label="Sort listings">
                <option>Most Relevant</option>
                <option>Newest First</option>
              </select>
              <button type="button" class="nurse-alert-trigger">${iconBell} Alert Me</button>
            </div>
          </div>
          ${(selectedLoc || selectedType) ? `
            <div class="nurse-active-chips-bar">
              <span class="nurse-active-label">Active filters:</span>
              ${selectedLoc ? `<span class="nurse-active-chip">${escapeAttr(selectedLoc)} <a href="/nurse-jobs-in-uae?${removeLocParams}" title="Remove filter">×</a></span>` : ''}
              ${selectedType ? `<span class="nurse-active-chip">${escapeAttr(selectedType)} <a href="/nurse-jobs-in-uae?${removeTypeParams}" title="Remove filter">×</a></span>` : ''}
              <a href="/nurse-jobs-in-uae" class="nurse-clear-all-link">Clear all</a>
            </div>
          ` : ''}
        </div>

        <div class="nurse-job-list">
          ${list.map((job,index)=>`
            <article class="nurse-job-card">
              <div class="nurse-card-top">
                ${job.logo ? `
                  <div class="nurse-card-logo">
                    <img src="${escapeAttr(job.logo)}" alt="${escapeAttr(job.company)}">
                  </div>
                ` : `
                  <div class="nurse-card-logo-fallback">
                    <span>${escapeAttr(String(job.company||(typeof job.title==='string'?job.title:job.title?.rendered)||'NJ').slice(0,2).toUpperCase())}</span>
                  </div>
                `}
                <div class="nurse-card-info">
                  <div class="nurse-card-title-row">
                    <a href="/job/${escapeAttr(job.slug)}" class="nurse-job-title-link">
                      <h2>${escapeAttr(job.title)}</h2>
                    </a>
                    <button type="button" class="nurse-card-save-btn" title="Save job" aria-label="Save job">${iconBookmark}</button>
                  </div>
                  <div class="nurse-company-row">
                    <span class="comp-name">${escapeAttr(job.company||'Trikonet Healthcare')}</span>
                    <span class="nurse-verified-tag">${iconCheckTick} Verified Employer</span>
                  </div>
                  <div class="nurse-job-meta-row">
                    <span class="nurse-meta-badge">${iconBriefcase} ${escapeAttr(job.type||'Full Time')}</span>
                    <span class="nurse-meta-badge">${iconPin} ${escapeAttr(job.location||'United Arab Emirates')}</span>
                    <span class="nurse-meta-badge">${iconClock} ${escapeAttr(job.date||'Recently posted')}</span>
                  </div>
                  <p class="nurse-job-excerpt">${escapeAttr(job.excerpt||'Join a trusted healthcare team and provide high-quality, compassionate patient care while growing your nursing career in the UAE.')}</p>
                </div>
              </div>
              <div class="nurse-card-footer">
                <div class="nurse-footer-tags">
                  ${job.category ? `<span class="nurse-tag-category">${escapeAttr(job.category)}</span>` : ''}
                  <span class="nurse-tag-category">Hospital & Clinic</span>
                </div>
                <a href="/job/${escapeAttr(job.slug)}" class="nurse-view-job-btn">View Job <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg></a>
              </div>
            </article>
            ${index===0?`
              <div class="nurse-login-prompt">
                <div class="nurse-prompt-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div class="nurse-prompt-text">
                  <strong>Looking for your ideal nursing role?</strong>
                  <span>Get personalised UAE healthcare vacancies sent straight to your inbox.</span>
                </div>
                <a href="/login-register" class="nurse-prompt-btn">Login / Register</a>
              </div>
            `:''}
          `).join('')}
        </div>
        ${pager('/nurse-jobs-in-uae',total,pageLimit)}
      </section>

      <aside class="nurse-side-column">
        <section class="nurse-side-card">
          <div class="nurse-side-card-header">
            <h3>Top Hiring Hospitals</h3>
            <a href="/employers" class="nurse-side-see-all">All &rarr;</a>
          </div>
          <div class="nurse-side-emp-list">
            ${employerCards.map(emp => `
              <a href="${escapeAttr(emp.employerUrl || '/employers')}" class="nurse-side-emp-row">
                <div class="nurse-side-emp-logo">
                  ${emp.logo ? `<img src="${escapeAttr(emp.logo)}" alt="${escapeAttr(emp.company)}">` : `<span>${escapeAttr(emp.company.slice(0, 2).toUpperCase())}</span>`}
                </div>
                <div class="nurse-side-emp-details">
                  <strong class="nurse-side-emp-title">${escapeAttr(emp.company)}</strong>
                  <span class="nurse-side-emp-sub">${emp.openJobs || 4} Open Roles</span>
                </div>
                <span class="nurse-side-emp-arrow">&rsaquo;</span>
              </a>
            `).join('')}
          </div>
        </section>

        <section class="nurse-side-card nurse-alert-card">
          <div class="nurse-alert-card-top">
            <div class="nurse-alert-badge-icon">${iconBell}</div>
            <div>
              <h4>Nurse Job Alerts</h4>
              <p>Get newly posted hospital & clinic vacancies delivered to your inbox.</p>
            </div>
          </div>
          <form class="nurse-side-alert-form" action="/alerts-jobs" onsubmit="event.preventDefault(); alert('Subscribed to nurse job alerts!');">
            <input type="email" placeholder="Enter your email address..." class="nurse-side-email-input" required>
            <button type="submit" class="nurse-side-alert-btn">Subscribe Free</button>
          </form>
        </section>

        <section class="nurse-side-card">
          <div class="nurse-side-card-header">
            <h3>UAE Nursing Resources</h3>
          </div>
          <ul class="nurse-resource-list">
            <li>
              <a href="/blog/nursing-jobs-in-dubai-a-complete-guide-to-landing-your-dream-role" class="nurse-resource-link">
                <span class="nurse-res-icon">📄</span>
                <span>UAE Nursing License Guide (MOH/DHA)</span>
              </a>
            </li>
            <li>
              <a href="/blog" class="nurse-resource-link">
                <span class="nurse-res-icon">💰</span>
                <span>Nurse Salary Benchmarks in UAE</span>
              </a>
            </li>
            <li>
              <a href="/about" class="nurse-resource-link">
                <span class="nurse-res-icon">🛡️</span>
                <span>Verified Hospital Direct Apply</span>
              </a>
            </li>
          </ul>
        </section>

        <section class="nurse-side-card">
          <div class="nurse-side-card-header">
            <h3>Share Jobs</h3>
          </div>
          <p class="nurse-side-share-txt">Know someone looking for a nurse job in the UAE?</p>
          <div class="nurse-side-share-btns">
            <a href="https://www.linkedin.com/company/trikonet-team" target="_blank" rel="noopener" class="nurse-share-pill" aria-label="Share on LinkedIn">${iconShareLinkedin} LinkedIn</a>
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent('Healthcare Nurse Jobs in UAE: https://www.trikonet.com/nurse-jobs-in-uae')}" target="_blank" rel="noopener" class="nurse-share-pill" aria-label="Share on WhatsApp">${iconShareWa} WhatsApp</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://www.trikonet.com/nurse-jobs-in-uae')}" target="_blank" rel="noopener" class="nurse-share-pill" aria-label="Share on Facebook">${iconShareFb} Facebook</a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent('https://www.trikonet.com/nurse-jobs-in-uae')}" target="_blank" rel="noopener" class="nurse-share-pill" aria-label="Share on X">${iconShareX} X</a>
          </div>
        </section>
      </aside>
    </section>
  </main>`;
}
function employers(){const list=(data.employers||[]).map(e=>[e.title,(e.locations||[]).join(', '),e.openJobs??0,e.title.split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase(),e.slug,e.logo]),total=data.counts.employer??list.length,start=total?(currentPage-1)*pageSize+1:0,end=Math.min(start+list.length-1,total),q=escapeAttr(queryParams.get('q')),selectedLocation=queryParams.get('location')||'City or postcode',selectedCategory=queryParams.get('category')||'All Categories';return `<main><section class="jobs-head"><div class="wrap"><form class="searchbar" action="/employers"><label class="field"><b>${icons.search}</b><input name="q" value="${q}" placeholder="Company title, keywords..." aria-label="Company title"></label><label class="field"><b>${icons.pin}</b><select name="location" aria-label="Location">${optionList(data.taxonomies.employerLocations,'City or postcode',selectedLocation)}</select></label><label class="field"><b>${icons.bag}</b><select name="category" aria-label="Category">${optionList(data.taxonomies.employerCategories,'All Categories',selectedCategory)}</select></label><button class="primary">Find Employers</button></form></div></section><section class="wrap employer-layout"><div class="listing-top"><span>${total?`Showing ${start} – ${end} of ${total.toLocaleString()} database employers`:'No employers found for these filters'}</span><div class="sorts"><select><option>Sort by (Default)</option><option>Newest</option><option>Oldest</option></select></div></div><div class="employer-grid">${list.map(e=>`<a class="employer-card" href="/employer/${e[4]}"><div class="employer-logo">${e[5]?`<img src="${e[5]}" alt="${escapeAttr(e[0])}">`:`<span>${e[3]}</span>`}</div><h2>${e[0]}</h2>${e[1]?`<p>⌖ &nbsp;${e[1]}</p>`:''}<div class="open-jobs">Open Job${e[2]===1?'':'s'} - ${e[2]}</div></a>`).join('')}</div>${pager('/employers',total)}</section></main>`}
function about(){return `<main><section class="subhero"><h1>About Us</h1></section><article class="content"><h1>Welcome to Trikonet!</h1><p>${data.pages.about.content}</p><p>Founded by two passionate friends, our journey started with Medbiomate, a successful venture focused on healthcare jobs in the GCC region. Inspired by our early success, we realized the vast potential and growing demand for diverse job opportunities across industries.</p><h2>Your Dream Jobs Are Waiting</h2><p>Our mission is to connect talent with the right opportunities, helping job seekers discover and achieve their career dreams.</p><h2>How We Work</h2><p>We source trusted opportunities, assess job quality and collaborate with companies before showcasing verified roles to job seekers.</p></article></main>`}
function blog(){return `<main><section class="subhero"><h1>Blogs</h1></section>${articleSection()}</main>`}
function ensureTocTitles(html=''){
  return String(html).replace(/(<div\b[^>]*class=["'][^"']*wp-block-rank-math-toc-block[^"']*["'][^>]*>)(\s*)(<nav\b)/gi,(match,open,space,nav)=>`${open}${space}<h2 class="toc-title">Table of Contents</h2>${space}${nav}`);
}
function estimateReadingTime(text=''){const words=String(text).replace(/<[^>]+>/g,' ').trim().split(/\s+/).filter(Boolean).length;return Math.max(1,Math.round(words/200))||3}
function post(p){
  const content=ensureTocTitles(p.content||`<p>${p.excerpt}</p>`);
  const featured=p.featuredImage?`<figure class="post-featured-image"><img src="${escapeAttr(p.featuredImage)}" alt="${escapeAttr(p.title)}"></figure>`:'';
  const categoryName=p.categoryName||(p.category!=='blog'?p.category:'Career Advice');
  const readTime=estimateReadingTime(p.content||p.excerpt);
  const authorName=p.authorName||(p.author&&p.author!=='Trikonet'?p.author:'')||'';
  const authorImg=p.authorImage||'';
  const reviewerName=p.reviewer||'';
  const reviewerImg=p.reviewerImage||'';
  const showAuthor=Boolean(p.showAuthor);
  const showReviewer=Boolean(p.showReviewer);
  const authorAvatarHtml = authorImg
    ? `<img src="${escapeAttr(authorImg)}" alt="${escapeAttr(authorName)}" class="byline-avatar">`
    : `<div class="byline-avatar byline-avatar-placeholder" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`;
  const reviewerAvatarHtml = reviewerImg
    ? `<img src="${escapeAttr(reviewerImg)}" alt="${escapeAttr(reviewerName)}" class="byline-avatar">`
    : `<div class="byline-avatar byline-avatar-placeholder" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`;
  const authorByline=showAuthor?`<div class="post-byline-card">
    ${authorAvatarHtml}
    <div class="byline-info"><div class="byline-role"><svg class="byline-role-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b00008" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg><span>${escapeAttr(p.authorRole||'Written By')}</span></div><a href="${escapeAttr(p.authorLink||'#')}" class="byline-name">${escapeAttr(authorName)}</a></div>
  </div>`:'';
  const reviewerByline=showReviewer?`<div class="post-byline-card">
    ${reviewerAvatarHtml}
    <div class="byline-info"><div class="byline-role"><svg class="byline-role-icon" width="15" height="15" viewBox="0 0 24 24" fill="#b00008"><circle cx="12" cy="12" r="10" fill="#b00008"/><path d="m9 12 2 2 4-4" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg><span>${escapeAttr(p.reviewerRole||'Reviewed by:')}</span></div><a href="${escapeAttr(p.reviewerLink||'#')}" class="byline-name">${escapeAttr(reviewerName)}</a></div>
  </div>`:'';
  return `<main class="blog-post-page">
    <section class="subhero post-subhero">
      <div class="wrap">
        <nav class="post-breadcrumbs" aria-label="Breadcrumbs">
          <a href="/">Trikonet</a>
          <span class="bc-sep">&gt;</span>
          <a href="/blog">Blogs</a>
          ${categoryName ? `<span class="bc-sep">&gt;</span><a href="/blog?category=${encodeURIComponent(categoryName)}">${escapeAttr(categoryName)}</a>` : ''}
          <span class="bc-sep">&gt;</span>
          <span class="bc-current">${escapeAttr(p.title)}</span>
        </nav>
        <h1 class="post-headline">${escapeAttr(p.title)}</h1>
      </div>
    </section>
    <article class="content post-article-content">
      <div class="post-header-meta">
        <div class="post-meta-badges">
          <span class="post-cat-badge">${escapeAttr(categoryName)}</span>
          <span class="post-meta-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${escapeAttr(p.date)}
          </span>
          <span class="post-meta-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${readTime} min read
          </span>
        </div>
        ${(showAuthor||showReviewer)?`<div class="post-bylines-container">${authorByline}${showAuthor&&showReviewer?'<div class="byline-separator" aria-hidden="true"></div>':''}${reviewerByline}</div>`:''}
      </div>
      ${featured}
      ${content}
      ${renderContentFeedback(p)}
      ${renderRelatedArticles(p)}
    </article>
  </main>`;
}

function renderContentFeedback(p) {
  const postId = p.id || p.slug;
  return `
    <section class="content-feedback-section" aria-label="Content feedback">
      <div class="content-feedback-card" id="feedback-card-${escapeAttr(postId)}">
        <div class="feedback-confetti left" aria-hidden="true">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="15" cy="22" r="3" fill="#f59e0b"/>
            <rect x="36" y="14" width="3.5" height="9" rx="1.75" transform="rotate(28 36 14)" fill="#f59e0b"/>
            <circle cx="58" cy="24" r="2.5" fill="#cbd5e1"/>
            <rect x="78" y="18" width="3.5" height="8" rx="1.75" transform="rotate(-32 78 18)" fill="#f59e0b"/>
            <circle cx="18" cy="48" r="2.5" fill="#94a3b8"/>
            <rect x="42" y="44" width="3.5" height="9" rx="1.75" transform="rotate(42 42 44)" fill="#f59e0b"/>
            <circle cx="68" cy="54" r="3" fill="#cbd5e1"/>
            <rect x="14" y="74" width="3.5" height="8" rx="1.75" transform="rotate(-22 14 74)" fill="#f59e0b"/>
            <circle cx="45" cy="82" r="3" fill="#f59e0b"/>
            <circle cx="74" cy="86" r="2.5" fill="#94a3b8"/>
            <rect x="32" y="100" width="3.5" height="8" rx="1.75" transform="rotate(18 32 100)" fill="#cbd5e1"/>
          </svg>
        </div>
        <div class="feedback-inner">
          <h3 class="feedback-title">Did you find this content helpful?</h3>
          <div class="feedback-rating-group" role="group" aria-label="Rate this content from 1 to 5">
            <div class="feedback-btn-col">
              <button type="button" class="feedback-rate-btn" data-rate="1" data-post-id="${escapeAttr(postId)}" aria-label="1 - Dissatisfied">1</button>
              <span class="feedback-label">Dissatisfied</span>
            </div>
            <div class="feedback-btn-col">
              <button type="button" class="feedback-rate-btn" data-rate="2" data-post-id="${escapeAttr(postId)}" aria-label="2">2</button>
            </div>
            <div class="feedback-btn-col">
              <button type="button" class="feedback-rate-btn" data-rate="3" data-post-id="${escapeAttr(postId)}" aria-label="3">3</button>
            </div>
            <div class="feedback-btn-col">
              <button type="button" class="feedback-rate-btn" data-rate="4" data-post-id="${escapeAttr(postId)}" aria-label="4">4</button>
            </div>
            <div class="feedback-btn-col">
              <button type="button" class="feedback-rate-btn" data-rate="5" data-post-id="${escapeAttr(postId)}" aria-label="5 - Very satisfied">5</button>
              <span class="feedback-label">Very satisfied</span>
            </div>
          </div>
          <div class="feedback-divider"></div>
          <div class="feedback-stats">
            <strong>Rated 4.9/5</strong> by <span class="feedback-count">2023</span> Users
          </div>
          <div class="feedback-toast" style="display:none;" aria-live="polite">
            <span>🎉 Thank you for your feedback!</span>
          </div>
        </div>
        <div class="feedback-confetti right" aria-hidden="true">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="105" cy="22" r="3" fill="#f59e0b"/>
            <rect x="84" y="14" width="3.5" height="9" rx="1.75" transform="rotate(-28 84 14)" fill="#f59e0b"/>
            <circle cx="62" cy="24" r="2.5" fill="#cbd5e1"/>
            <rect x="42" y="18" width="3.5" height="8" rx="1.75" transform="rotate(32 42 18)" fill="#f59e0b"/>
            <circle cx="102" cy="48" r="2.5" fill="#94a3b8"/>
            <rect x="78" y="44" width="3.5" height="9" rx="1.75" transform="rotate(-42 78 44)" fill="#f59e0b"/>
            <circle cx="52" cy="54" r="3" fill="#cbd5e1"/>
            <rect x="106" y="74" width="3.5" height="8" rx="1.75" transform="rotate(22 106 74)" fill="#f59e0b"/>
            <circle cx="75" cy="82" r="3" fill="#f59e0b"/>
            <circle cx="46" cy="86" r="2.5" fill="#94a3b8"/>
            <rect x="88" y="100" width="3.5" height="8" rx="1.75" transform="rotate(-18 88 100)" fill="#cbd5e1"/>
          </svg>
        </div>
      </div>
    </section>
  `;
}

function renderRelatedArticles(currentPost) {
  const currentCat = currentPost.categoryName || currentPost.category || 'Career Advice';
  const allPosts = data.posts || [];
  
  // Find posts with the same category
  const sameCat = allPosts.filter(p => 
    p.slug !== currentPost.slug && 
    (p.categoryName === currentCat || p.category === currentCat)
  );

  // If fewer than 9, backfill with other posts for a balanced grid
  const otherPosts = allPosts.filter(p => 
    p.slug !== currentPost.slug && 
    !sameCat.some(sp => sp.slug === p.slug)
  );

  const related = [...sameCat, ...otherPosts].slice(0, 9);
  if (!related.length) return '';

  return `
    <section class="related-category-section" aria-label="Other articles in ${escapeAttr(currentCat)}">
      <div class="related-category-header">
        <span class="rc-line" aria-hidden="true"></span>
        <h2>Other Important Articles about ${escapeAttr(currentCat)}</h2>
        <span class="rc-line" aria-hidden="true"></span>
      </div>
      <div class="related-category-box">
        <div class="related-articles-grid">
          ${related.map(rp => `
            <a href="/${escapeAttr(rp.category || 'blog')}/${escapeAttr(rp.slug)}" class="related-article-card">
              <span>${escapeAttr(rp.title)}</span>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
function jobDetail(j){
  const w=j?.type==='job_listing'?j:null,m=w?.metas||{};
  const title=w?.title?.rendered||j?.title||'Job';
  const company=m._job_employer_name||j?.company||'';
  const categories=m._job_category?Object.values(m._job_category).join(', '):j?.category||'';
  const location=m._job_location?Object.values(m._job_location).join(', '):j?.location||'';
  const type=m._job_type?Object.values(m._job_type).join(', '):j?.type||'';
  const date=resolveJobDate(w||j),deadline=resolveJobDeadline(w||j),logo=m._job_logo||j?.logo||'';
  const content=w?.content?.rendered||j?.content||'<p>Job information will appear here.</p>';
  return `<main class="detail-page"><section class="detail-hero"><div class="wrap detail-hero-inner">${logo?`<img class="detail-logo" src="${escapeAttr(logo)}" alt="${escapeAttr(company)}">`:''}<div class="detail-title"><h1>${escapeAttr(title)}</h1><div class="detail-meta">${categories?`<span>▣ &nbsp;${escapeAttr(categories)}</span>`:''}${location?`<span>⌖ &nbsp;${escapeAttr(location)}</span>`:''}${date?`<span>◷ &nbsp;${escapeAttr(date)}</span>`:''}</div>${type?`<span class="tag">${escapeAttr(type)}</span>`:''}</div><div class="detail-actions"><a class="primary apply" href="${escapeAttr(m._job_apply_url||j?.applyUrl||'#')}">Apply Now</a></div></div></section><div class="wrap detail-grid"><article class="job-description"><h2>▣ Job Description</h2><div class="wordpress-content">${content}</div></article><aside><div class="overview"><h2>Job Overview</h2><dl>${date?`<dt>▣</dt><dd><b>Date Posted</b><span>${escapeAttr(date)}</span></dd>`:''}${location?`<dt>⌖</dt><dd><b>Location</b><span>${escapeAttr(location)}</span></dd>`:''}<dt>⌛</dt><dd><b>Expiration date</b><span>${escapeAttr(deadline)}</span></dd></dl></div></aside></div></main>`;
}
function employerDetail(e){
  const m=e?.metas||{},title=e?.title?.rendered||e?.title||'Employer',logo=m._employer_logo||e?.logo||'',category=m._employer_category?Object.values(m._employer_category).join(', '):e?.category||'Company',location=m._employer_location?Object.values(m._employer_location).join(', '):e?.location||'',content=e?.content?.rendered||e?.content||'<p>Company information will appear here.</p>';
  return `<main class="detail-page"><section class="detail-hero employer-hero"><div class="wrap detail-hero-inner">${logo?`<img class="detail-logo" src="${escapeAttr(logo)}" alt="${escapeAttr(title)}">`:''}<div class="detail-title"><h1>${escapeAttr(title)}</h1><div class="detail-meta"><span>▣ &nbsp;${escapeAttr(category)}</span>${location?`<span>⌖ &nbsp;${escapeAttr(location)}</span>`:''}</div><span class="tag">Open Jobs</span></div></div></section><div class="wrap detail-grid employer-detail-grid"><article class="job-description"><h2>About Company</h2><div class="wordpress-content">${content}</div></article></div></main>`;
}
function decodeHtml(value){const box=document.createElement('textarea');box.innerHTML=value;return box.value}
function faq(){return `<main><section class="subhero"><h1>FAQ</h1></section><div class="content faq"><h2>History Of Trikonet</h2>${[['Who is Trikonet?','Trikonet is a job platform connecting job seekers with employment opportunities in the UAE and other Middle Eastern countries.'],['How The Trikonet Started?','Trikonet was founded after the success of Medbiomate highlighted the need for a broader job platform.'],['How are Trikonet and Medbiomate connected?','Both platforms share founders and a commitment to connecting qualified candidates with trusted opportunities.']].map(x=>`<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join('')}</div></main>`}
function contact(){return `<main><section class="subhero"><h1>Contact Us</h1></section><div class="content contact-grid"><div><h2>Get in touch</h2><p>Questions about jobs, employers or your Trikonet account? Send us a message.</p><p><b>Email</b><br>info@trikonet.com</p></div><form class="form-card" id="contact"><label>Name<input required></label><label>Email<input type="email" required></label><label>Message<textarea required></textarea></label><button class="primary">Send Message</button></form></div></main>`}
function generic(){const title=path.split('/').filter(Boolean).map(s=>s.replaceAll('-',' ')).join(' / ')||'Trikonet';return `<main><section class="subhero"><h1>${title.replace(/\b\w/g,c=>c.toUpperCase())}</h1></section><div class="content"><p>This page keeps the existing Trikonet URL available in the local migration. Its content can be edited in the CMS.</p><a class="primary" href="/jobs">Browse Jobs</a></div></main>`}
function accountPage(){if(currentUser)return `<main class="member-page"><section class="member-card"><h1>Welcome, ${escapeAttr(currentUser.name)}</h1><p>Your account is active. Create and resume email campaigns from your private workspace.</p><a class="primary" href="/email-campaigns">Open email campaigns</a></section></main>`;return `<main class="member-page"><div class="auth-grid"><form class="member-card" id="loginForm"><h1>Log in</h1><p>Access your saved templates, drafts, and campaign history.</p><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label><button class="primary">Log in</button><p class="form-message" aria-live="polite"></p></form><form class="member-card" id="registerForm"><h1>Create account</h1><p>Sign up to unlock email campaigns.</p><label>Name<input name="name" autocomplete="name" required></label><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Password<input name="password" type="password" minlength="8" autocomplete="new-password" required></label><button class="primary">Sign up</button><p class="form-message" aria-live="polite"></p></form></div></main>`}
const emailTemplates=[['Job alert','New opportunities selected for you','<h2>New jobs for you</h2><p>We found new opportunities that match your profile.</p>'],['Application update','Your application status','<h2>Application update</h2><p>There is an update about your recent application.</p>'],['Welcome','Welcome to Trikonet','<h2>Welcome to Trikonet</h2><p>Your account is ready. Start exploring new opportunities.</p>']];
function campaignsPage(){if(!currentUser)return `<main class="member-page"><section class="member-card locked"><span class="lock-icon">🔒</span><h1>Sign in to use email campaigns</h1><p>Create and edit templates, save drafts, resume later, and keep your sending history private to your account.</p><a class="primary" href="/login-register">Sign up or log in</a></section></main>`;return `<main class="campaign-page"><header class="campaign-heading"><div><span class="eyebrow">MEMBER FEATURE</span><h1>Email campaigns</h1><p>Compose from a template, save your work, and resume it anytime.</p></div><button class="primary" id="newCampaign">New email</button></header><div class="campaign-layout"><aside class="template-panel"><h2>Templates</h2>${emailTemplates.map((t,i)=>`<button class="template-choice" data-template="${i}"><b>${t[0]}</b><span>${t[1]}</span></button>`).join('')}</aside><section class="composer member-card"><form id="campaignForm"><input type="hidden" name="id"><label>Campaign name<input name="name" required placeholder="e.g. Dubai nurse jobs — September"></label><label>Recipients<textarea name="recipients" rows="2" placeholder="email@example.com, another@example.com"></textarea></label><label>Subject<input name="subject" required></label><label>Email content<div class="email-toolbar"><button type="button" data-command="bold"><b>B</b></button><button type="button" data-command="italic"><i>I</i></button><button type="button" data-command="insertUnorderedList">• List</button></div><div class="email-editor" contenteditable="true" role="textbox" aria-label="Email content"></div></label><div class="campaign-actions"><button class="primary" type="submit">Save draft</button><button class="outline" type="button" id="sendCampaign">Send email</button></div><p class="form-message" aria-live="polite"></p></form></section><aside class="draft-panel"><h2>Saved & history</h2>${emailCampaigns.length?emailCampaigns.map(c=>`<button class="draft-choice" data-id="${escapeAttr(c.id)}"><b>${escapeAttr(c.name||c.subject)}</b><span>${escapeAttr(c.status)} · ${new Date(c.updatedAt).toLocaleDateString()}</span></button>`).join(''):'<p>No saved drafts yet.</p>'}</aside></div></main>`}
function admin(){return `<div class="admin"><div class="admin-shell"><aside class="sidebar"><img src="/assets/logo-white.png" alt="Trikonet"><h3>Content Manager</h3><a class="active" href="/admin">Overview</a><a href="/admin#jobs">Jobs</a><a href="/admin#posts">Blogs</a><a href="/admin#pages">Pages</a><a href="/">View website</a></aside><main class="admin-main"><h1>Trikonet CMS</h1><p>Edit content while keeping the existing frontend and URLs intact.</p><div class="admin-grid"><section class="panel"><h2>Add job</h2><form id="jobForm"><label>Job title<input name="title" required></label><label>Company<input name="company" required></label><label>Slug<input name="slug" required placeholder="job-slug"></label><label>Location<input name="location" value="Dubai"></label><label>Category<input name="category" value="General"></label><button class="primary">Publish job</button></form></section><section class="panel"><h2>Add blog post</h2><form id="postForm"><label>Post title<input name="title" required></label><label>Category<select name="category"><option>career</option><option>health</option><option>insurance</option></select></label><label>Slug<input name="slug" required placeholder="post-slug"></label><label>Excerpt<textarea name="excerpt"></textarea></label><button class="primary">Publish post</button></form></section></div><section class="panel records"><h2>Published jobs</h2>${data.jobs.map(j=>`<div class="record"><span><b>${j.title}</b><br><small>/job/${j.slug}</small></span><span class="status">Published</span></div>`).join('')}<p><button class="outline" id="reset">Reset demo content</button></p></section></main></div></div>`}
function render(){if(path.startsWith('/admin'))return renderAdmin(data);let body;if(path==='/')body=home();else if(path==='/login-register')body=accountPage();else if(path==='/email-campaigns')body=campaignsPage();else if(path==='/nurse-jobs-in-uae')body=nurseJobsPage();else if(path==='/jobs'||path==='/job-list'||path==='/job-openings')body=jobs();else if(path==='/employers')body=employers();else if(path.startsWith('/employer/')){const local=data.employers?.find(e=>e.local&&path===`/employer/${e.slug}`);body=renderEmployerDetail(local||wpRecord,path,profileJobs.length?profileJobs:data.jobs)}else if(path==='/about')body=about();else if(path==='/blog')body=blog();else if(path==='/faq')body=faq();else if(path==='/contact')body=contact();else if(path.startsWith('/job/')){const local=data.jobs.find(j=>j.local&&path===`/job/${j.slug}`);const employer=local?data.employers?.find(e=>e.slug===local.employerSlug||e.title===local.company):wpEmployer;body=renderJobDetail(local||wpRecord||data.jobs.find(j=>path.endsWith(j.slug)),employer,path)}else {const p=data.posts.find(p=>path.endsWith(`/${p.slug}`));body=p?post(p):generic()}return header()+body+footer()}
await Promise.all([loadLocalJobs(),loadLocalEmployers(),loadCounts(),loadWordPressRecord(),loadConnectedContent(),loadAccount()]);
try{const savedPosts=JSON.parse(localStorage.getItem('trikonet_posts_cms')||'[]');data.posts=data.posts.map(post=>({...post,...(savedPosts.find(saved=>saved.slug===post.slug)||{})}))}catch{}
document.querySelector('#app').innerHTML=render();
function applySavedSeoMeta(){
  if(path.startsWith('/admin'))return;
  try{
    const pageSlug=path==='/'?'home':path.split('/').filter(Boolean).pop();
    const pages=JSON.parse(localStorage.getItem('trikonet_pages_cms')||'[]');
    const savedPosts=JSON.parse(localStorage.getItem('trikonet_posts_cms')||'[]');
    const record=pages.find(item=>item.slug===pageSlug)||savedPosts.find(item=>item.slug===pageSlug)||data.posts.find(item=>item.slug===pageSlug);
    if(!record)return;
    document.title=record.metaTitle||record.title||document.title;
    let description=document.querySelector('meta[name="description"]');
    if(!description){description=document.createElement('meta');description.name='description';document.head.append(description)}
    description.content=record.metaDescription||record.excerpt||'';
    let canonical=document.querySelector('link[rel="canonical"]');
    if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical)}
    canonical.href=`${location.origin}${path==='/'?'/':`/${record.slug}`}`;
  }catch{}
}
applySavedSeoMeta();
function cleanSchemaText(value=''){const box=document.createElement('div');box.innerHTML=String(value);return (box.textContent||'').replace(/\s+/g,' ').trim()}
function isoSchemaDate(value){const date=new Date(value||'');return Number.isNaN(date.getTime())?'':date.toISOString()}
function addStructuredData(){
  if(path.startsWith('/admin'))return;
  const origin=location.origin,currentUrl=`${origin}${location.pathname}${location.search}`;
  const orgId=`${origin}/#organization`,siteId=`${origin}/#website`,pageId=`${origin}${location.pathname}#webpage`;
  const graph=[
    {'@type':'Organization','@id':orgId,name:'Trikonet',url:`${origin}/`,logo:{'@type':'ImageObject',url:`${origin}/assets/logo-black.png`},email:'info@trikonet.com'},
    {'@type':'WebSite','@id':siteId,url:`${origin}/`,name:'Trikonet',publisher:{'@id':orgId},potentialAction:{'@type':'SearchAction',target:{'@type':'EntryPoint',urlTemplate:`${origin}/jobs?q={search_term_string}`},'query-input':'required name=search_term_string'}}
  ];
  let pageType='WebPage',pageName=document.querySelector('main h1')?.textContent?.trim()||'Trikonet';
  if(path==='/about')pageType='AboutPage';
  else if(path==='/contact')pageType='ContactPage';
  else if((path==='/jobs'||path==='/job-list'||path==='/job-openings')&&queryParams.toString())pageType='SearchResultsPage';
  else if(path==='/jobs'||path==='/job-list'||path==='/job-openings'||path==='/employers'||path==='/blog'||/^\/(category|location|designation)\//.test(path))pageType='CollectionPage';
  else if(path.startsWith('/employer/')||path.startsWith('/author/')||path.startsWith('/profile/'))pageType='ProfilePage';
  graph.push({'@type':pageType,'@id':pageId,url:currentUrl,name:pageName,isPartOf:{'@id':siteId},about:{'@id':orgId}});
  const parts=location.pathname.split('/').filter(Boolean);
  if(parts.length){
    const items=[{'@type':'ListItem',position:1,name:'Trikonet',item:`${origin}/`}];
    parts.forEach((part,index)=>items.push({'@type':'ListItem',position:index+2,name:decodeURIComponent(part).replace(/-/g,' ').replace(/\b\w/g,char=>char.toUpperCase()),item:`${origin}/${parts.slice(0,index+1).join('/')}`}));
    graph.push({'@type':'BreadcrumbList','@id':`${currentUrl}#breadcrumb`,itemListElement:items});
  }
  if(path.startsWith('/job/')){
    const source=wpRecord||data.jobs.find(job=>path.endsWith(`/${job.slug}`))||{};
    const m=source.metas||{},job=mapJob(source),description=cleanSchemaText(source.content?.rendered||source.content||document.querySelector('.wordpress-content')?.innerHTML||'');
    const address={ '@type':'PostalAddress',streetAddress:source.streetAddress||m._job_street_address||source.address||undefined,addressLocality:source.addressLocality||m._job_address_locality||job.location||undefined,addressRegion:source.addressRegion||m._job_address_region||undefined,addressCountry:'AE' };
    Object.keys(address).forEach(key=>address[key]===undefined&&delete address[key]);
    const typeMap={'Full Time':'FULL_TIME','Part Time':'PART_TIME','Freelance':'CONTRACTOR','Contract':'CONTRACTOR','Internship':'INTERN','Temporary':'TEMPORARY'};
    const posting={'@type':'JobPosting','@id':`${currentUrl}#job`,title:job.title||pageName,description:source.description||description||job.title,identifier:{'@type':'PropertyValue',name:job.company||'Trikonet',value:String(source.id||source.slug||job.slug||'')},datePosted:isoSchemaDate(source.datePosted||source.postedDate||source.date||source.createdAt||job.date),validThrough:isoSchemaDate(source.deadline||source.expiryDate||m._job_application_deadline_date||job.deadline),employmentType:source.employmentType||m._job_employment_type||typeMap[job.type]||job.type||undefined,hiringOrganization:{'@type':'Organization',name:job.company||'Trikonet',sameAs:m._job_employer_url||job.employerUrl||undefined,logo:job.logo?new URL(job.logo,origin).href:undefined},jobLocation:{'@type':'Place',address},url:currentUrl};
    Object.keys(posting).forEach(key=>posting[key]===undefined&&delete posting[key]);graph.push(posting);
  }
  if(path==='/jobs'||path==='/job-list'||path==='/job-openings')graph.push({'@type':'ItemList','@id':`${currentUrl}#jobs`,name:'Job listings',numberOfItems:data.jobs.length,itemListElement:data.jobs.map((job,index)=>({'@type':'ListItem',position:index+1,url:`${origin}/job/${job.slug}`,name:job.title}))});
  if(path==='/employers')graph.push({'@type':'ItemList','@id':`${currentUrl}#employers`,name:'Employer listings',numberOfItems:(data.employers||[]).length,itemListElement:(data.employers||[]).map((employer,index)=>({'@type':'ListItem',position:index+1,url:`${origin}/employer/${employer.slug}`,name:employer.title}))});
  const currentPost=data.posts.find(post=>path.endsWith(`/${post.slug}`));
  if(currentPost)graph.push({'@type':['Article','BlogPosting'],'@id':`${currentUrl}#article`,headline:currentPost.title,description:currentPost.excerpt||cleanSchemaText(currentPost.content),datePublished:isoSchemaDate(currentPost.rawDate||currentPost.date)||undefined,image:currentPost.featuredImage?new URL(currentPost.featuredImage,origin).href:undefined,author:{'@type':'Person',name:currentPost.author||'Trikonet'},publisher:{'@id':orgId},mainEntityOfPage:{'@id':pageId}});
  if(path.startsWith('/employer/')){const source=wpRecord||data.employers.find(item=>path.endsWith(`/${item.slug}`))||{};graph.push({'@type':'Organization','@id':`${currentUrl}#profile`,name:source.title?.rendered||source.title||pageName,url:currentUrl,description:cleanSchemaText(source.content?.rendered||source.content||'')});}
  if(path.startsWith('/author/'))graph.push({'@type':'Person','@id':`${currentUrl}#person`,name:pageName,url:currentUrl});
  const faqItems=[...document.querySelectorAll('.rank-math-faq-item, .faq details')].map(item=>({question:item.querySelector('.rank-math-question, summary')?.textContent?.trim(),answer:cleanSchemaText(item.querySelector('.rank-math-answer, p')?.innerHTML||'')})).filter(item=>item.question&&item.answer);
  if(faqItems.length)graph.push({'@type':'FAQPage','@id':`${currentUrl}#faq`,mainEntity:faqItems.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))});
  const script=document.createElement('script');script.type='application/ld+json';script.id='trikonet-structured-data';script.textContent=JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c');document.head.append(script);
}
addStructuredData();
if(path.startsWith('/admin'))initAdmin(data,store.set);
document.querySelectorAll('.wp-block-rank-math-faq-block .rank-math-faq-item').forEach((item,index)=>{
  const question=item.querySelector('.rank-math-question');
  const answer=item.querySelector('.rank-math-answer');
  if(!question||!answer)return;
  const answerId=`faq-answer-${index}`;
  question.setAttribute('role','button');
  question.setAttribute('tabindex','0');
  question.setAttribute('aria-expanded','false');
  question.setAttribute('aria-controls',answerId);
  answer.id=answerId;
  answer.hidden=true;
  const toggle=()=>{const open=question.getAttribute('aria-expanded')==='true';question.setAttribute('aria-expanded',String(!open));answer.hidden=open;item.classList.toggle('is-open',!open)};
  question.addEventListener('click',toggle);
  question.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle()}});
});
const detailIcons={
  category:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18m-11 0v2h4v-2"/>',
  location:'<path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  date:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l-3 2"/>',
  phone:'<path d="M7 3H5a2 2 0 0 0-2 2c0 8.8 7.2 16 16 16a2 2 0 0 0 2-2v-2l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z"/>',
  email:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>',
  bookmark:'<path d="M6 3.5h12a1 1 0 0 1 1 1v16l-7-5-7 5v-16a1 1 0 0 1 1-1Z"/>'
};
const detailSvg=(name)=>`<svg class="detail-inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${detailIcons[name]}</svg>`;
document.querySelectorAll('.detail-exact .detail-hero .detail-meta').forEach((row,rowIndex)=>{
  row.querySelectorAll('span').forEach((item,index)=>{
    const icon=rowIndex===0?['category','location',document.querySelector('.employer-hero')?'phone':'date'][index]:'email';
    if(!icon||!item.firstChild||item.firstChild.nodeType!==Node.TEXT_NODE)return;
    item.firstChild.textContent=item.firstChild.textContent.replace(/^\s*[^\w\s]\s*/, '');
    item.insertAdjacentHTML('afterbegin',detailSvg(icon));
  });
});
const employerSave=document.querySelector('.employer-hero .save');
if(employerSave)employerSave.innerHTML=detailSvg('bookmark');
document.querySelector('.hamb')?.addEventListener('click',()=>document.querySelector('.links').classList.toggle('open'));
document.querySelector('#logoutBtn')?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/'});
async function submitAuth(form,endpoint){const message=form.querySelector('.form-message');message.textContent='Please wait…';const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form)))}),result=await response.json();if(!response.ok){message.textContent=result.error||'Unable to continue.';return}location.href='/email-campaigns'}
document.querySelector('#loginForm')?.addEventListener('submit',event=>{event.preventDefault();submitAuth(event.currentTarget,'/api/auth/login')});
document.querySelector('#registerForm')?.addEventListener('submit',event=>{event.preventDefault();submitAuth(event.currentTarget,'/api/auth/register')});
const campaignForm=document.querySelector('#campaignForm'),campaignEditor=document.querySelector('.email-editor');
function fillCampaign(c={}){if(!campaignForm)return;campaignForm.elements.id.value=c.id||'';campaignForm.elements.name.value=c.name||'';campaignForm.elements.recipients.value=Array.isArray(c.recipients)?c.recipients.join(', '):(c.recipients||'');campaignForm.elements.subject.value=c.subject||'';campaignEditor.innerHTML=c.html||'';campaignForm.querySelector('.form-message').textContent=''}
document.querySelectorAll('.template-choice').forEach(button=>button.addEventListener('click',()=>{const template=emailTemplates[Number(button.dataset.template)];fillCampaign({name:template[0],subject:template[1],html:template[2]})}));
document.querySelectorAll('.draft-choice').forEach(button=>button.addEventListener('click',()=>fillCampaign(emailCampaigns.find(item=>item.id===button.dataset.id))));
document.querySelector('#newCampaign')?.addEventListener('click',()=>fillCampaign());
document.querySelectorAll('.email-toolbar button').forEach(button=>button.addEventListener('click',()=>{campaignEditor.focus();document.execCommand(button.dataset.command)}));
campaignForm?.addEventListener('submit',async event=>{event.preventDefault();const values=Object.fromEntries(new FormData(campaignForm)),payload={...values,recipients:values.recipients.split(',').map(v=>v.trim()).filter(Boolean),html:campaignEditor.innerHTML,status:'draft'},response=await fetch('/api/email-campaigns',{method:values.id?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}),result=await response.json();campaignForm.querySelector('.form-message').textContent=response.ok?'Draft saved. You can safely resume it later.':result.error;if(response.ok)setTimeout(()=>location.reload(),700)});
document.querySelector('#sendCampaign')?.addEventListener('click',()=>{campaignForm.querySelector('.form-message').textContent='Your draft is ready. Connect an approved email provider before live delivery can be enabled.'});
const connectToggle=document.querySelector('.nav-dropdown-toggle');
connectToggle?.addEventListener('click',()=>{const open=connectToggle.getAttribute('aria-expanded')==='true';connectToggle.setAttribute('aria-expanded',String(!open));connectToggle.parentElement.classList.toggle('open',!open)});
document.addEventListener('click',event=>{if(connectToggle&&!connectToggle.parentElement.contains(event.target)){connectToggle.setAttribute('aria-expanded','false');connectToggle.parentElement.classList.remove('open')}});
const articleSlider=document.querySelector('#recent-articles');
if(articleSlider){
  const slideBy=direction=>{const item=articleSlider.querySelector('.article');if(!item)return;if(matchMedia('(min-width: 851px)').matches){if(direction>0)articleSlider.append(item);else articleSlider.prepend(articleSlider.lastElementChild);articleSlider.scrollLeft=0;return}const gap=parseFloat(getComputedStyle(articleSlider).columnGap)||0;const step=item.getBoundingClientRect().width+gap;const end=articleSlider.scrollWidth-articleSlider.clientWidth;if(direction>0&&articleSlider.scrollLeft>=end-2)articleSlider.scrollTo({left:0,behavior:'smooth'});else if(direction<0&&articleSlider.scrollLeft<=2)articleSlider.scrollTo({left:end,behavior:'smooth'});else articleSlider.scrollBy({left:direction*step,behavior:'smooth'})};
  articleSlider.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();slideBy(event.key==='ArrowRight'?1:-1)}});
}
document.querySelectorAll('.show-phone').forEach(button=>button.addEventListener('click',()=>{button.previousSibling.textContent=`${button.dataset.phone} `;button.remove()}));
document.querySelector('#contact')?.addEventListener('submit',e=>{e.preventDefault();toast('Thanks — your message is saved in this local demo.')});
document.querySelector('#jobForm')?.addEventListener('submit',e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));if(data.jobs.some(j=>j.slug===f.slug)&&!confirm('Changing this URL may affect SEO and existing links. Continue?'))return;data.jobs.unshift({...f,id:Date.now(),type:'Full Time',date:new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})});store.set(data);toast('Job published locally.');e.target.reset()});
document.querySelector('#postForm')?.addEventListener('submit',e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));data.posts.unshift({...f,date:new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})});store.set(data);toast('Blog post published locally.');e.target.reset()});
document.querySelector('#reset')?.addEventListener('click',()=>store.reset());
function toast(msg){const n=document.createElement('div');n.className='toast';n.textContent=msg;document.body.append(n);setTimeout(()=>n.remove(),2500)}

// Blog Post Feedback Rating Interaction
document.addEventListener('click', e => {
  const btn = e.target.closest('.feedback-rate-btn');
  if (!btn) return;
  const card = btn.closest('.content-feedback-card');
  if (!card) return;
  const rating = btn.dataset.rate;
  const postId = btn.dataset.postId;
  
  card.querySelectorAll('.feedback-rate-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  try {
    const ratings = JSON.parse(localStorage.getItem('trikonet_post_ratings') || '{}');
    if (!ratings[postId]) {
      const countEl = card.querySelector('.feedback-count');
      if (countEl) {
        const currentCount = parseInt(countEl.textContent.replace(/,/g, ''), 10) || 2023;
        countEl.textContent = (currentCount + 1).toLocaleString();
      }
    }
    ratings[postId] = rating;
    localStorage.setItem('trikonet_post_ratings', JSON.stringify(ratings));
  } catch {}
  
  const toastEl = card.querySelector('.feedback-toast');
  if (toastEl) {
    toastEl.style.display = 'block';
  }
});

function restoreSavedFeedbackRatings() {
  try {
    const ratings = JSON.parse(localStorage.getItem('trikonet_post_ratings') || '{}');
    document.querySelectorAll('.content-feedback-card').forEach(card => {
      const btn = card.querySelector('.feedback-rate-btn');
      if (!btn) return;
      const postId = btn.dataset.postId;
      const savedRate = ratings[postId];
      if (savedRate) {
        const targetBtn = card.querySelector(`.feedback-rate-btn[data-rate="${savedRate}"]`);
        if (targetBtn) targetBtn.classList.add('active');
      }
    });
  } catch {}
}
restoreSavedFeedbackRatings();
