import { renderJobDetail, renderEmployerDetail } from './detail-pages.js?v=14.0';
import { renderAdmin, initAdmin } from './admin.js?v=10.0';
import { initCVBuilder } from './cvBuilder.js?v=20260929-library-route-v27';
const seed = {
  jobs:[
    {id:1,title:'Corporate Accounting Manager',company:'Bateel International',category:'Accountant, Accounting or Finance',location:'Dubai',type:'Full Time',date:'September 22, 2026',slug:'corporate-accounting-manager'},
    {id:2,title:'Consultant, Ophthalmology',company:'Danat Al Emarat Hospital for Women & Children',category:'Consultant doctor Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 22, 2026',slug:'consultant-ophthalmology'},
    {id:3,title:'Consultant, Maternal and Fetal Medicine',company:'Danat Al Emarat Hospital for Women & Children',category:'Consultant doctor Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 22, 2026',slug:'consultant-maternal-and-fetal-medicine'},
    {id:4,title:'Registered Nurse',company:'Amana Healthcare',category:'HealthCare, Nurse Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 22, 2026',slug:'registered-nurse'}
  ],
  employers:[],
  posts:[
    {title:'Job Loss Insurance UAE: The Secret Salary Backup You Didn’t Know',slug:'job-loss-insurance-uae-iloe-guide',category:'blog',categoryName:'Insurance',urlPrefix:'insurance',localUrl:'/insurance/job-loss-insurance-uae-iloe-guide',date:'September 26, 2025',excerpt:'Imagine waking up one morning in the UAE to find that your company has closed its doors.',featuredImage:'/uploads/media/34983.jpg',author:'Athira Susan James',authorRole:'Written By',authorImage:'/assets/athira-susan-james.png',reviewer:'Mayur Kacholiya',reviewerRole:'Reviewed by:',reviewerImage:'/assets/mayur-kacholiya.png'},
    {title:'How to Manage Work-Related Stress',slug:'ips-to-manage-work-related-stress',category:'blog',categoryName:'Health & Wellness',urlPrefix:'health',localUrl:'/health/ips-to-manage-work-related-stress',date:'September 8, 2025',excerpt:'Work-related stress has become an inevitable part of modern life, impacting productivity and mental wellbeing.',featuredImage:'/uploads/media/15727.jpg',author:'Athira Susan James',authorRole:'Written By',authorImage:'/assets/athira-susan-james.png',reviewer:'Mayur Kacholiya',reviewerRole:'Reviewed by:',reviewerImage:'/assets/mayur-kacholiya.png'},
    {title:'Importance of Taking Regular Breaks During Work Hours',slug:'regular-breaks-at-work',category:'blog',categoryName:'Health & Wellness',urlPrefix:'health',localUrl:'/health/regular-breaks-at-work',date:'September 8, 2025',excerpt:'In the hustle of modern work culture, regular breaks help sustain focus and energy.',featuredImage:'/uploads/media/15736.jpg',author:'Athira Susan James',authorRole:'Written By',authorImage:'/assets/athira-susan-james.png',reviewer:'Mayur Kacholiya',reviewerRole:'Reviewed by:',reviewerImage:'/assets/mayur-kacholiya.png'}
  ],
  pages:{about:{title:'About Us',content:'Welcome to Trikonet! We are Konets, and this is not just a job portal—we’re your gateway to limitless career opportunities in the UAE and beyond.'}}
};
const store = {get(){try{return JSON.parse(localStorage.getItem('trikonetCMS'))||structuredClone(seed)}catch{return structuredClone(seed)}},set(v){localStorage.setItem('trikonetCMS',JSON.stringify(v))},reset(){localStorage.removeItem('trikonetCMS');location.reload()}};
const data=store.get();
let path=location.pathname.replace(/\/$/,'')||'/';
const SITE_ORIGIN='https://www.trikonet.com';
const defaultTopCategories = [
  { name: 'Education and Training', slug: 'education-and-training', count: 3148 },
  { name: 'Accounting or Finance', slug: 'accounting-finance', count: 1767 },
  { name: 'Administration', slug: 'administration', count: 1302 },
  { name: 'HealthCare', slug: 'healthcare', count: 762 },
  { name: 'Nurse Jobs', slug: 'nurse-jobs', count: 706 },
  { name: 'Human Resource', slug: 'human-resource', count: 654 },
  { name: 'Digital Marketing Jobs', slug: 'digital-marketing', count: 636 },
  { name: 'Marketing and Sales', slug: 'marketing-and-sales', count: 627 },
  { name: 'Customer Service Associate Jobs', slug: 'customer-service-associate-jobs', count: 231 },
  { name: 'Engineering', slug: 'engineering', count: 179 }
];
function slugifyCategory(cat) {
  const str = (typeof cat === 'object' && cat !== null) ? (cat.slug || cat.name) : String(cat || '');
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
function findCategoryBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = String(slug).toLowerCase().trim();
  const allCats = [
    ...(Array.isArray(data.taxonomies?.categories) ? data.taxonomies.categories : []),
    ...defaultTopCategories
  ];
  let found = allCats.find(c => (c.slug && c.slug.toLowerCase() === cleanSlug) || slugifyCategory(c.name) === cleanSlug || slugifyCategory(c.slug) === cleanSlug);
  if (!found) {
    const noOr = cleanSlug.replace(/-or-/g, '-').replace(/-and-/g, '-');
    found = allCats.find(c => {
      const cSlugNorm = (c.slug || slugifyCategory(c.name)).replace(/-or-/g, '-').replace(/-and-/g, '-');
      return cSlugNorm === noOr;
    });
  }
  if (!found) {
    const humanName = cleanSlug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
      .replace(/\bOr\b/g, 'or')
      .replace(/\bAnd\b/g, 'and');
    return { name: humanName, slug: cleanSlug, count: 0 };
  }
  return found;
}
export const POST_SLUG_PREFIXES = {
  'job-loss-insurance-uae-iloe-guide': 'insurance',
  'resume-tips': 'career-tips',
  'ips-to-manage-work-related-stress': 'health',
  'regular-breaks-at-work': 'health',
  'what-is-a-stipend': 'career-tips',
  'interview-questions-for-a-part-time-job': 'part-time-job',
  'fake-job-offers-in-the-uae': 'career-tips',
  'seasonal-jobs-in-dubai': 'part-time-job',
  'what-is-a-part-time-job': 'part-time-job',
  'how-to-stay-away-from-labour-and-visa-fraud': 'visa',
  'signs-of-job-burnout': 'health',
  'part-time-jobs-for-students': 'part-time-job',
  'online-jobs-for-students': 'part-time-job',
  'side-jobs-for-full-time-workers': 'part-time-job',
  'how-to-find-part-time-jobs': 'blog',
  'iloe-dubai-insurance': 'visa',
  'types-of-visa-in-uae': 'visa',
  'freelance-visa-in-dubai': 'visa',
  'how-to-save-money-in-dubai': 'guides',
  'uae-visa-online': 'visa',
  'uae-golden-visa': 'visa',
  'healthy-eating-tips-for-busy-professionals': 'health',
  'dubai-visa-rejection': 'visa',
  'nursing-interview-questions-and-answers': 'interview',
  'how-to-avoid-back-pain-in-desk-jobs': 'health',
  'how-to-negotiate-salary-offer': 'interview',
  'simple-exercises-for-office-workers': 'health',
  'physical-health-at-work': 'health',
  'work-life-balance': 'health',
  'mental-health-in-the-workplace': 'health',
  'how-to-develop-leadership-skills': 'career-tips',
  'career-development-plan': 'career-tips',
  'uae-visa-application-status': 'visa',
  'how-to-apply-for-a-dubai-tourist-visa': 'visa',
  'dubai-visa-renewal': 'visa',
  'dubai-visa-processing-time': 'visa',
  'how-to-apply-for-job-seekers-visa-in-dubai': 'visa',
  'top-20-golden-visa-benefits-in-the-uae': 'visa',
  'how-to-improve-work-from-home-productivity': 'career-tips',
  'what-is-personal-branding': 'career-tips',
  'how-to-use-linkedin-to-get-a-job': 'career-tips',
  'how-to-extend-your-dubai-visit-visa': 'visa',
  'how-to-sponsor-your-family-in-the-uae': 'visa',
  'mistakes-to-avoid-when-applying-for-a-visa': 'visa',
  'residence-visa-vs-work-visa-in-dubai': 'visa',
  'seo-interview-questions-and-answers': 'blog',
  'how-to-become-a-laboratory-assistant': 'types-of-jobs',
  'what-are-your-strengths-and-weaknesses': 'career-tips',
  'dubai-work-visa': 'visa',
  'how-to-handle-career-gaps-in-resume': 'career-tips',
  'tips-for-video-interview': 'career-tips',
  'top-mistakes-to-avoid-in-job-applications': 'career-tips',
  'how-to-stay-focused-during-long-work-hours': 'health',
  'simple-desk-exercises-to-improve-posture': 'health',
  'how-to-build-an-job-portfolio': 'career-tips',
  'freelancing-skills-in-demand-for-2025': 'career-tips',
  'medical-coding-interview-questions': 'interview',
  'what-is-medical-coder': 'types-of-jobs',
  'cost-of-living-in-dubai': 'guides',
  'things-you-have-to-know-before-working-in-dubai': 'career-tips',
  'minimum-wage-in-dubai': 'career-tips',
  'how-to-find-a-job-in-dubai-on-a-visit-visa': 'visa',
  'how-to-write-a-cover-letter': 'career-tips',
  'work-from-home-jobs': 'types-of-jobs',
  'how-to-find-jobs-in-dubai': 'career-tips',
  'how-to-improve-your-linkedin-profile': 'career-tips',
  'how-to-apply-doh-exam': 'exam',
  'what-is-a-gastroenterologist': 'types-of-jobs',
  'how-to-write-a-resume': 'career-tips',
  'what-is-moh-exam': 'exam',
  'what-is-a-gynecologist': 'types-of-jobs',
  'what-is-a-neurologist': 'types-of-jobs',
  'what-is-an-seo-analyst': 'types-of-jobs',
  'engineering-interview-questions': 'interview',
  'interview-tips-for-freshers': 'interview',
  'pharmacy-interview-questions': 'interview',
  'medical-laboratory-assistant-interview-questions': 'interview',
  'teacher-interview-questions': 'interview',
  'how-to-prepare-for-a-job-interview': 'interview',
  'who-is-clinical-nurse-specialist': 'types-of-jobs',
  'what-is-a-nurse': 'types-of-jobs',
  'part-time-jobs-for-women-over-40': 'part-time-job',
  'how-to-apply-for-dha-exam': 'exam',
  'what-is-a-phlebotomist': 'types-of-jobs',
  'what-is-a-cardiologist': 'types-of-jobs',
  'urologist-vs-nephrologist': 'types-of-jobs',
  'highest-paying-jobs-in-dubai': 'types-of-jobs',
  'what-is-biomedical-engineering': 'types-of-jobs'
};

export const BLOG_CATEGORY_PREFIXES = [
  'insurance',
  'health',
  'career-tips',
  'part-time-job',
  'visa',
  'guides',
  'interview',
  'types-of-jobs',
  'exam',
  'blog'
];

export const CATEGORY_PREFIX_LABELS = {
  'insurance': 'Insurance',
  'health': 'Health & Wellness',
  'career-tips': 'Career Tips',
  'part-time-job': 'Part-Time Jobs',
  'visa': 'Visa & Labour Laws',
  'guides': 'Dubai Guides',
  'interview': 'Interview Questions & Tips',
  'types-of-jobs': 'Types of Jobs',
  'exam': 'Medical Exams',
  'blog': 'Career Advice'
};

export function getPostUrl(postOrSlug) {
  if (!postOrSlug) return '/blog';
  const slug = typeof postOrSlug === 'string' ? postOrSlug : (postOrSlug.slug || '');
  if (!slug) return '/blog';
  const prefix = POST_SLUG_PREFIXES[slug]
    || (typeof postOrSlug === 'object' && (postOrSlug.urlPrefix || postOrSlug.url_prefix))
    || 'blog';
  return `/${prefix}/${slug}`;
}

data.counts={job_listing:0,employer:0,post:0};
data.taxonomies={types:[],categories:[...defaultTopCategories],locations:[],tags:[],employerCategories:[],employerLocations:[]};
let queryParams=new URLSearchParams(location.search),currentPage=Math.max(Number(queryParams.get('page'))||1,1);
const locationPathMatch=path.match(/^\/job-location\/([^/]+)$/);
if(locationPathMatch&&!queryParams.get('location')){
  queryParams.set('location',decodeURIComponent(locationPathMatch[1]).replace(/-/g,' ').replace(/\b\w/g,char=>char.toUpperCase()));
}
const pageSize=30;
const escapeAttr=value=>String(value||'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const icons={search:'⌕',pin:'⌖',bag:'▣'};
let wpRecord=null,wpEmployer=null,profileJobs=[],orgJobs=[],categoryJobs=[],currentUser=null,emailCampaigns=[];
async function loadAccount(){try{const response=await fetch('/api/auth/me');if(response.ok){currentUser=(await response.json()).user;const campaigns=await fetch('/api/email-campaigns');if(campaigns.ok)emailCampaigns=await campaigns.json()}}catch{}}
async function loadWordPressRecord(){const match=path.match(/^\/(job|employer)\/([^/]+)$/);if(!match)return;const type=match[1]==='job'?'job_listing':'employer',slug=match[2];try{const response=await fetch(`/api/wp/${type}?slug=${encodeURIComponent(slug)}`);if(response.ok){const records=await response.json();wpRecord=records[0]||null}if(!wpRecord){const localResponse=await fetch(`/api/local/${type==='job_listing'?'jobs':'employers'}/${encodeURIComponent(slug)}`);if(localResponse.ok)wpRecord=await localResponse.json()}if(type==='job_listing'){let employerSlug='';if(wpRecord?.metas?._job_employer_url){try{employerSlug=new URL(wpRecord.metas._job_employer_url).pathname.split('/').filter(Boolean).pop()||'';}catch{}}if(!employerSlug&&wpRecord?.employerSlug){employerSlug=wpRecord.employerSlug;}if(!employerSlug&&(wpRecord?.metas?._job_employer_name||wpRecord?.company)){const comp=wpRecord.metas?._job_employer_name||wpRecord.company;employerSlug=comp.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}if(employerSlug){const employerResponse=await fetch(`/api/wp/employer?slug=${encodeURIComponent(employerSlug)}`);if(employerResponse.ok){const emps=await employerResponse.json();wpEmployer=emps[0]||null;}}if(!wpEmployer&&wpRecord?.metas?._job_employer_posted_by){const employerResponse=await fetch(`/api/wp/employer?id=${encodeURIComponent(wpRecord.metas._job_employer_posted_by)}`);if(employerResponse.ok){const emps=await employerResponse.json();wpEmployer=emps[0]||null;}}if(wpEmployer){try{const query=wpEmployer.id?`employer_id=${wpEmployer.id}`:`employer_slug=${encodeURIComponent(wpEmployer.slug)}`;const jobsRes=await fetch(`/api/wp/job_listing?${query}&per_page=20`);if(jobsRes.ok){const list=await jobsRes.json();orgJobs=list.filter(j=>j.slug!==slug);}}catch{}}if(!orgJobs.length&&(wpEmployer?.title?.rendered||wpEmployer?.title||wpRecord?.metas?._job_employer_name||wpRecord?.company)){const cName=wpEmployer?.title?.rendered||wpEmployer?.title||wpRecord?.metas?._job_employer_name||wpRecord?.company;try{const searchRes=await fetch(`/api/wp/job_listing?q=${encodeURIComponent(cName)}&per_page=20`);if(searchRes.ok){const sList=await searchRes.json();orgJobs=sList.filter(j=>j.slug!==slug&&((j.metas?._job_employer_name&&j.metas._job_employer_name.toLowerCase()===cName.toLowerCase())||(j.company&&j.company.toLowerCase()===cName.toLowerCase())));}}catch{}}
categoryJobs=[];
const extractJobCats = (rec) => {
  if (!rec) return [];
  if (rec.local) return Array.isArray(rec.categories) ? rec.categories : [];
  const m = rec.metas || {};
  if (m._job_category) {
    if (typeof m._job_category === 'object') return Object.values(m._job_category);
    if (typeof m._job_category === 'string') return m._job_category.split(',').map(s => s.trim());
  }
  if (rec.job_listing_category) {
    return Array.isArray(rec.job_listing_category) ? rec.job_listing_category : [rec.job_listing_category];
  }
  return rec.category ? [rec.category] : [];
};
const cats = extractJobCats(wpRecord).filter(c => c && c.toLowerCase() !== 'all categories');
if (cats.length) {
  try {
    const catPromises = cats.slice(0, 2).map(c =>
      fetch(`/api/wp/job_listing?category=${encodeURIComponent(c)}&per_page=25&_fields=id,slug,title,status,date,metas`)
        .then(r => r.ok ? r.json() : [])
        .catch(() => [])
    );
    const catResults = await Promise.all(catPromises);
    const seenCat = new Set();
    categoryJobs = catResults.flat().filter(j => j && j.slug && !seenCat.has(j.slug) && seenCat.add(j.slug));
  } catch {}
}}else if(type==='employer'&&wpRecord){if(wpRecord.local){try{const localJobsRes=await fetch('/api/local/jobs');if(localJobsRes.ok){const lJobs=await localJobsRes.json();profileJobs=lJobs.filter(j=>j.employerSlug===wpRecord.slug||j.company===(wpRecord.title?.rendered||wpRecord.title)).map(mapJob)}}catch{}}else if(wpRecord.id){const jobsResponse=await fetch(`/api/wp/job_listing?employer_id=${wpRecord.id}&per_page=100`);if(jobsResponse.ok)profileJobs=(await jobsResponse.json()).map(mapJob);if(!profileJobs.length&&wpRecord.slug){const slugResponse=await fetch(`/api/wp/job_listing?employer_slug=${encodeURIComponent(wpRecord.slug)}&per_page=100`);if(slugResponse.ok)profileJobs=(await slugResponse.json()).map(mapJob)}}}}catch{wpRecord=null}}
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
    const isCategoryPage = path.startsWith('/category/');
    if (isCategoryPage && (!data.taxonomies?.categories || data.taxonomies.categories.length <= defaultTopCategories.length)) {
      try {
        const taxRes = await fetch('/api/wp/taxonomies');
        if (taxRes.ok) data.taxonomies = await taxRes.json();
      } catch {}
    }
    const catSlug = isCategoryPage ? path.replace('/category/', '').split('/')[0].split('?')[0] : '';
    const catObj = isCategoryPage ? findCategoryBySlug(catSlug) : null;
    const pageLimit = (path === '/nurse-jobs-in-uae' || isCategoryPage) ? 10 : pageSize;
    const filters=new URLSearchParams({per_page:String(pageLimit),page:String(currentPage)});
    if(path==='/nurse-jobs-in-uae'&&!queryParams.get('q'))filters.set('q','nurse');
    if(isCategoryPage && catObj && !queryParams.get('category')) filters.set('category', catObj.name);
    for(const key of ['q','location','category','job_type']){
      const val=queryParams.get(key);
      if(val&&val!=='Country or City'&&val!=='All Categories')filters.set(key,val);
    }
    const fetchPromises = [fetch(`/api/wp/job_listing?${filters}`)];
    if (currentPage === 1) fetchPromises.push(fetch('/api/local/jobs'));
    const results = await Promise.all(fetchPromises);
    const wp = results[0].ok ? await results[0].json() : [];
    const local = (results[1] && results[1].ok) ? await results[1].json() : [];
    const qTerm=queryParams.get('q')||(path==='/nurse-jobs-in-uae'?'nurse':'');
    const targetCat = isCategoryPage && catObj ? (queryParams.get('category') || catObj.name) : queryParams.get('category');
    const normalizedQuery=String(qTerm||'').trim().toLowerCase();
    const queryWords=[...new Set(normalizedQuery.split(/\s+/).filter(Boolean))];
    const localSearchText=job=>[
      job.title,job.company,job.description,job.content?.rendered||job.content,job.excerpt?.rendered||job.excerpt,
      ...(job.categories||[]),...(job.locations||[]),...(job.types||[]),...(job.tags||[]),...(job.skills||[]),
      ...Object.values(job.metas||{}).flatMap(value=>typeof value==='object'&&value?Object.values(value):[value])
    ].filter(Boolean).join(' ').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').toLowerCase();
    const localSearchScore=job=>{const title=String(job.title||'').toLowerCase(),company=String(job.company||job.metas?._job_employer_name||'').toLowerCase(),text=localSearchText(job);if(title===normalizedQuery)return 100;if(title.startsWith(normalizedQuery))return 90;if(title.includes(normalizedQuery))return 80;if(company===normalizedQuery)return 75;if(company.includes(normalizedQuery))return 65;return text.includes(normalizedQuery)?40:20};
    const localFiltered=local.filter(job=>(!normalizedQuery||queryWords.every(word=>localSearchText(job).includes(word)))&&(!queryParams.get('location')||queryParams.get('location')==='Country or City'||(job.locations||[]).includes(queryParams.get('location')))&&(!targetCat||targetCat==='All Categories'||(job.categories||[]).some(c=>c.toLowerCase().includes(targetCat.toLowerCase())))&&(!queryParams.get('job_type')||(job.types||[]).includes(queryParams.get('job_type')))).sort((a,b)=>localSearchScore(b)-localSearchScore(a));
    data.jobs=[...(currentPage===1?localFiltered.map(mapJob):[]),...wp.map(mapJob)];
  }catch{data.jobs=[]}
}
async function loadLocalEmployers(){try{if(!data.taxonomies?.employerCategories||data.taxonomies.employerCategories.length===0){try{const taxRes=await fetch('/api/wp/taxonomies');if(taxRes.ok)data.taxonomies=await taxRes.json();}catch{}}const filters=new URLSearchParams({per_page:String(pageSize),page:String(currentPage)});for(const key of ['q','location','category','min_jobs'])if(queryParams.get(key))filters.set(key,queryParams.get(key));const response=await fetch(`/api/wp/employer?${filters}`);const wp=response.ok?await response.json():[];data.employers=wp.map(record=>{const m=record.metas||{};return {title:record.title?.rendered||'',slug:record.slug,description:record.content?.rendered||'',logo:m._employer_logo||m._employer_featured_image_img||m._employer_featured_image||'',categories:Object.values(m._employer_category||{}),locations:Object.values(m._employer_location||{}),email:m._employer_email||'',phone:m._employer_phone||'',website:m._employer_website||'',openJobs:Number(m._employer_open_jobs)||0,source:'database'}})}catch{data.employers=[]}}
async function loadTopEmployers(){try{const res=await fetch('/api/wp/top-employers?min_jobs=20&limit=20');if(res.ok){const list=await res.json();if(Array.isArray(list)&&list.length>0){data.topEmployers=list.map(record=>{const m=record.metas||{};const rawText=(record.content?.rendered||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();return {title:record.title?.rendered||'',slug:record.slug,excerpt:rawText.slice(0,120),logo:m._employer_logo||m._employer_featured_image_img||m._employer_featured_image||'',locations:Array.isArray(m._employer_location)?m._employer_location:Object.values(m._employer_location||{}),categories:Array.isArray(m._employer_category)?m._employer_category:Object.values(m._employer_category||{}),openJobs:Number(m._employer_open_jobs)||0,source:'database'}})}}}catch{}}
function updateLiveJobCountUI(){
  const liveCount = (data.counts && data.counts.job_listing) ? data.counts.job_listing : 13621;
  const formattedCount = Number(liveCount).toLocaleString() + '+';
  document.querySelectorAll('.hero-live-job-count').forEach(el => {
    el.textContent = formattedCount;
  });
  document.querySelectorAll('[data-live-job-count]').forEach(el => {
    el.textContent = formattedCount;
  });
}

let baseCountsFetched = false;
async function loadCounts(){
  try{
    if (!baseCountsFetched) {
      const response=await fetch('/api/wp/counts');
      if(response.ok) {
        data.counts=await response.json();
        baseCountsFetched = true;
        updateLiveJobCountUI();
      }
    }
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
    }else if(path.startsWith('/category/')){
      const catSlug = path.replace('/category/', '').split('/')[0].split('?')[0];
      const catObj = findCategoryBySlug(catSlug);
      const hasExtraFilters = ['location','job_type','q'].some(k => queryParams.get(k) && queryParams.get(k) !== 'Country or City');
      if (!hasExtraFilters && catObj?.count) {
        data.counts.category = catObj.count;
      } else {
        const filters=new URLSearchParams();
        filters.set('type','job_listing');
        if(catObj) filters.set('category', queryParams.get('category') || catObj.name);
        for(const key of ['q','location','job_type']){
          const val=queryParams.get(key);
          if(val&&val!=='Country or City')filters.set(key,val);
        }
        const filtered=await fetch(`/api/wp/count?${filters}`);
        if(filtered.ok)data.counts.category=(await filtered.json()).total;
      }
    }else if((path==='/employers'||path==='/jobs'||path.startsWith('/job-location/'))&&[...queryParams].some(([key])=>['q','location','category','job_type','min_jobs'].includes(key))){
      const filters=new URLSearchParams(queryParams);
      filters.set('type',path==='/employers'?'employer':'job_listing');
      filters.delete('page');
      const filtered=await fetch(`/api/wp/count?${filters}`);
      if(filtered.ok)data.counts[path==='/employers'?'employer':'job_listing']=(await filtered.json()).total;
    }
  }catch{}
}

if(typeof window!=='undefined'){
  window.addEventListener('focus',()=>{loadCounts().catch(()=>{})});
  setInterval(()=>{loadCounts().catch(()=>{})},10000);
}
export function detectBlogCategory(title = '', excerpt = '') {
  const t = (title + ' ' + excerpt).toLowerCase();
  if (t.includes('interview question') || t.includes('questions and answers') || t.includes('questions to prepare') || t.includes('interview questions')) {
    return 'Interview Questions';
  }
  if (
    t.includes('interview tip') ||
    t.includes('interview tips') ||
    t.includes('prepare for a job interview') ||
    t.includes('video interview') ||
    t.includes('ace your virtual interview') ||
    t.includes('ace your next interview') ||
    t.includes('telephonic interview') ||
    t.includes('cracking your dream job interview') ||
    t.includes('job interview') ||
    t.includes('walk-in interview') ||
    t.includes('walk in interview') ||
    t.includes('interview') ||
    t.includes('strengths and weaknesses')
  ) {
    return 'Interview Tips';
  }
  if (t.includes('resume') || t.includes('cv') || t.includes('cover letter') || t.includes('curriculum vitae')) {
    return 'Resume & ATS';
  }
  if (
    t.includes('visa') ||
    t.includes('iloe') ||
    t.includes('labour') ||
    t.includes('labor') ||
    t.includes('mohre') ||
    t.includes('job scam') ||
    t.includes('fake job') ||
    t.includes('insurance') ||
    t.includes('residence visa') ||
    t.includes('golden visa') ||
    t.includes('gratuity') ||
    t.includes('contract')
  ) {
    return 'Visa & Labour Laws';
  }
  if (
    t.includes('stress') ||
    t.includes('break') ||
    t.includes('burnout') ||
    t.includes('health') ||
    t.includes('wellness') ||
    t.includes('work-life') ||
    t.includes('mental health') ||
    t.includes('healthy eating') ||
    t.includes('desk exercises') ||
    t.includes('posture') ||
    t.includes('back pain')
  ) {
    return 'Health & Wellness';
  }
  return 'Career Advice';
}

async function loadConnectedContent(){
  try{
    const pathParts=path.split('/').filter(Boolean);
    const candidateSlug=pathParts.at(-1)||'';
    const isArticlePath=pathParts.length===2&&(pathParts[0]==='blog'||Boolean(POST_SLUG_PREFIXES[candidateSlug]));
    const postQuery=isArticlePath
      ? `/api/wp/posts?slug=${encodeURIComponent(candidateSlug)}&per_page=1`
      : `/api/wp/posts?per_page=${path==='/'?12:30}&summary=1`;
    const [taxonomyResponse,postsResponse]=await Promise.all([fetch('/api/wp/taxonomies'),fetch(postQuery)]);
    if(taxonomyResponse.ok)data.taxonomies=await taxonomyResponse.json();
    if(postsResponse.ok){
      const posts=await postsResponse.json();
      if(posts.length)data.posts=posts.map(post=>{const rawTitle=post.title?.rendered||'';const rawExcerpt=(post.excerpt?.rendered||'').replace(/<[^>]+>/g,'').trim();const prefix=POST_SLUG_PREFIXES[post.slug]||post.url_prefix||'blog';const cat=post.categoryName||post.category_name||CATEGORY_PREFIX_LABELS[prefix]||detectBlogCategory(rawTitle,rawExcerpt);const authorName=(post.author_display_name||(post.author_name&&post.author_name!=='Trikonet'?post.author_name:''))||'Athira Susan James';return {id:post.id,title:rawTitle,slug:post.slug,category:'blog',categoryName:cat,urlPrefix:prefix,localUrl:`/${prefix}/${post.slug}`,date:new Date(`${post.date}Z`).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),excerpt:rawExcerpt,content:post.content?.rendered||'',featuredImage:post.featured_image||'',author:authorName,authorRole:'Written By',authorImage:post.author_avatar||'/assets/athira-susan-james.png',authorLink:'#',reviewer:post.reviewer_name||'Mayur Kacholiya',reviewerRole:'Reviewed by:',reviewerImage:post.reviewer_avatar||'/assets/mayur-kacholiya.png',reviewerLink:'#'}})
    }
  }catch{}
}
const siteChrome=(()=>{try{return JSON.parse(localStorage.getItem('trikonet_site_chrome')||'{}')}catch{return {}}})();
const LOGO_VERSION = 'v=20260929_footer_brand_v3';
const resolveLogo = (logo, fallback) => {
  const chosen = (logo && typeof logo === 'string' && !logo.startsWith('data:')) ? logo : fallback;
  if (!chosen) return `/assets/logo-black.png?${LOGO_VERSION}`;
  const base = chosen.split('?')[0];
  if (base.endsWith('/assets/logo-black.png') || base.endsWith('/assets/logo-white.png') || base.endsWith('/assets/trikonet-logo.png')) {
    return `${base}?${LOGO_VERSION}`;
  }
  return chosen;
};
document.documentElement.style.setProperty('--footer-title-size',`${Number(siteChrome.footerTitleSize)||18}px`);
const chromeMenu=(value,fallback)=>String(value||fallback).split('\n').map(line=>{const [label,url,depth]=line.split('|').map(v=>v.trim());return [label,url,Number(depth)||0]}).filter(item=>item[0]&&item[1]);
function renderHeaderMenu(items){const groups=[];items.forEach(([label,url,depth])=>{if(depth&&groups.length)groups[groups.length-1].children.push([label,url]);else groups.push({label,url,children:[]})});return groups.map(item=>item.children.length?`<div class="nav-dropdown"><a href="${escapeAttr(item.url)}">${escapeAttr(item.label)} <span>⌄</span></a><div class="nav-submenu">${item.children.map(([label,url])=>`<a href="${escapeAttr(url)}">${escapeAttr(label)}</a>`).join('')}</div></div>`:`<a href="${escapeAttr(item.url)}">${escapeAttr(item.label)}</a>`).join('')}
function header(){
  const nurseHeader=path==='/nurse-jobs-in-uae';
  const isJobs = path.startsWith('/job') || path === '/nurse-jobs-in-uae';
  const isEmployers = path.startsWith('/employer');
  const isServices = path.startsWith('/services') || path === '/resume-library' || path === '/resume-maker' || path === '/ats-resume-builder' || path === '/medical-coder-class';
  const navArrow = `<svg class="nav-arrow" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1.25L5 4.75L9 1.25"/></svg>`;
  let candidateAvatar = currentUser?.avatar || currentUser?.photo || currentUser?.profile?.photo || '';
  if (currentUser && !candidateAvatar) {
    try { candidateAvatar = JSON.parse(localStorage.getItem('cvBuilderPluginState') || '{}').photo || ''; } catch {}
  }
  const candidateInitial = escapeAttr((currentUser?.name || 'U').charAt(0).toUpperCase());
  const candidateComp = typeof currentUser?.completionPercentage === 'number'
    ? currentUser.completionPercentage
    : (currentUser?.profile ? calculateCandidateCompletion(currentUser.profile) : 0);
  const isProfileComplete = candidateComp >= 85;
  const profileBadge = isProfileComplete ? '' : `<span class="nav-profile-badge" aria-label="1 notification" title="Profile ${candidateComp}% complete — complete your profile to get verified">1</span>`;
  const accountIcon = pathData => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${pathData}</svg>`;
  const profileAvatar = `<div class="nav-account-menu">
    <button class="nav-profile-avatar" type="button" id="navAccountToggle" aria-label="Open account menu" aria-haspopup="menu" aria-expanded="false" title="Account menu">
      <span class="nav-profile-photo"><span class="nav-profile-initial">${candidateInitial}</span>${candidateAvatar ? `<img src="${escapeAttr(candidateAvatar)}" alt="${escapeAttr(currentUser?.name || 'Account')}">` : ''}</span>${profileBadge}
    </button>
    <div class="nav-account-dropdown" id="navAccountDropdown" role="menu" aria-hidden="true">
      <div class="nav-account-summary">
        <span class="nav-account-summary-avatar"><span>${candidateInitial}</span>${candidateAvatar ? `<img src="${escapeAttr(candidateAvatar)}" alt="">` : ''}</span>
        <div><strong>${escapeAttr(currentUser?.name || 'My account')}</strong><small>${escapeAttr(currentUser?.email || 'Signed in')}</small></div>
      </div>
      <a class="nav-account-score" href="/profile" role="menuitem">
        <span><strong>Account score</strong><small>${candidateComp >= 85 ? 'Your profile is recruiter-ready' : 'Complete your profile to improve visibility'}</small></span>
        <b>${candidateComp}%</b>
        <i><span style="width:${candidateComp}%"></span></i>
      </a>
      <div class="nav-account-links">
        <a href="/profile" role="menuitem"><span class="nav-account-link-icon">${accountIcon('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>')}</span><span><strong>Account information</strong><small>Profile and contact details</small></span><b>›</b></a>
        <a href="/resume-library" role="menuitem"><span class="nav-account-link-icon">${accountIcon('<path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h7M9 16h7"/>')}</span><span><strong>Résumé library</strong><small>Build and manage résumés</small></span><b>›</b></a>
        <a href="/saved-jobs" role="menuitem"><span class="nav-account-link-icon">${accountIcon('<path d="M6 3h12v18l-6-4-6 4z"/>')}</span><span><strong>Saved jobs</strong><small>Your shortlisted opportunities</small></span><b>›</b></a>
        <a href="/applied-jobs" role="menuitem"><span class="nav-account-link-icon">${accountIcon('<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M8 6V4h8v2M8 12l3 3 5-6"/>')}</span><span><strong>Applied jobs</strong><small>Track your applications</small></span><b>›</b></a>
        <a href="/followed-companies" role="menuitem"><span class="nav-account-link-icon">${accountIcon('<path d="M3 21h18M5 21V6l7-3v18M12 9h7v12M8 9v1M8 13v1M8 17v1M16 13v1M16 17v1"/>')}</span><span><strong>Followed companies</strong><small>Employers you follow</small></span><b>›</b></a>
      </div>
      <button class="nav-account-signout" type="button" id="navAccountLogout" role="menuitem">${accountIcon('<path d="M10 17l5-5-5-5M15 12H3M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/>')}<span>Sign out</span></button>
    </div>
  </div>`;

  return `<header class="topbar${nurseHeader?' nurse-page-header':''} site-header-${escapeAttr(siteChrome.headerLayout||'classic')}" style="background:${escapeAttr(siteChrome.headerBg||'#ffffff')};color:${escapeAttr(siteChrome.headerText||'#202124')}">
    <div class="wrap nav">
      <a class="brand" href="/"><img src="${escapeAttr(resolveLogo(siteChrome.headerLogo,'/assets/logo-black.png'))}" alt="Trikonet logo"></a>
      <nav class="links">
        <!-- 1. JOBS MEGA MENU -->
        <div class="nav-item nav-has-mega">
          <a class="nav-link${isJobs?' active':''}" href="/jobs">
            Jobs ${navArrow}
          </a>
          <div class="nav-mega-panel nav-jobs-mega">
            <div class="mega-grid">
              <div class="mega-col mega-categories-col">
                <div class="mega-head">
                  <span class="mega-eyebrow">POPULAR CATEGORIES</span>
                  <a href="/jobs" class="mega-view-all">All Categories →</a>
                </div>
                <div class="mega-category-grid">
                  <a href="/category/healthcare" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Healthcare</strong>
                      <small>762 Open Jobs</small>
                    </div>
                  </a>
                  <a href="/nurse-jobs-in-uae" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Nurse Jobs</strong>
                      <small>706 Open Jobs</small>
                    </div>
                  </a>
                  <a href="/category/accounting-or-finance" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Accounting & Finance</strong>
                      <small>1,767 Open Jobs</small>
                    </div>
                  </a>
                  <a href="/category/education-and-training" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Education & Training</strong>
                      <small>3,148 Open Jobs</small>
                    </div>
                  </a>
                  <a href="/category/administration" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Administration</strong>
                      <small>1,302 Open Jobs</small>
                    </div>
                  </a>
                  <a href="/jobs?q=IT" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>IT & Software</strong>
                      <small>Tech & Systems</small>
                    </div>
                  </a>
                  <a href="/category/marketing-and-sales" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Marketing & Sales</strong>
                      <small>627 Open Jobs</small>
                    </div>
                  </a>
                  <a href="/category/human-resource" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Human Resource</strong>
                      <small>654 Open Jobs</small>
                    </div>
                  </a>
                  <a href="/jobs?q=Medical+Coder" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Medical Coder Jobs</strong>
                      <small>Hospital Coding</small>
                    </div>
                  </a>
                </div>
              </div>
              <div class="mega-col mega-side-col">
                <div class="mega-head">
                  <span class="mega-eyebrow">BY REGION</span>
                </div>
                <div class="mega-region-list">
                  <a href="/jobs?location=Dubai" class="mega-region-pill">
                    <span>Jobs in Dubai</span>
                    <span class="mega-region-arrow">›</span>
                  </a>
                  <a href="/jobs?location=Abu+Dhabi" class="mega-region-pill">
                    <span>Jobs in Abu Dhabi</span>
                    <span class="mega-region-arrow">›</span>
                  </a>
                  <a href="/jobs?location=Sharjah" class="mega-region-pill">
                    <span>Jobs in Sharjah</span>
                    <span class="mega-region-arrow">›</span>
                  </a>
                </div>
                <div class="mega-cta-card">
                  <span class="mega-badge">13,600+ LISTINGS</span>
                  <h4>Find Your Role in UAE</h4>
                  <p>Verified vacancies from top hospitals, schools & enterprises.</p>
                  <a href="/jobs" class="mega-cta-btn">Browse All Jobs →</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. EMPLOYERS MENU (Hospitals, Labs, Schools, etc.) -->
        <div class="nav-item nav-has-mega">
          <a class="nav-link${isEmployers?' active':''}" href="/employers">
            Employers ${navArrow}
          </a>
          <div class="nav-mega-panel nav-employers-mega">
            <div class="mega-grid">
              <div class="mega-col mega-categories-col">
                <div class="mega-head">
                  <span class="mega-eyebrow">POPULAR CATEGORIES</span>
                  <a href="/employers" class="mega-view-all">All Companies (2,700+) →</a>
                </div>
                <div class="mega-category-grid">
                  <a href="/employers?q=Hospital" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Top Hospitals</strong>
                      <small>450+ Active</small>
                    </div>
                  </a>
                  <a href="/employers?q=Clinic" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Clinics & Day Surgery</strong>
                      <small>600+ Clinics</small>
                    </div>
                  </a>
                  <a href="/employers?q=Lab" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Medical Laboratories</strong>
                      <small>180+ Labs</small>
                    </div>
                  </a>
                  <a href="/employers?q=Pharmacy" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Pharmacies & Pharma</strong>
                      <small>290+ Chains</small>
                    </div>
                  </a>
                  <a href="/employers?q=School" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Schools & Academies</strong>
                      <small>320+ Schools</small>
                    </div>
                  </a>
                  <a href="/employers?q=Group" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Corporate Groups</strong>
                      <small>850+ Groups</small>
                    </div>
                  </a>
                  <a href="/employers?q=Bank" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Banking & Financial</strong>
                      <small>Top UAE Banks</small>
                    </div>
                  </a>
                  <a href="/employers?q=Technology" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>IT & Technology</strong>
                      <small>Tech Companies</small>
                    </div>
                  </a>
                  <a href="/employers?q=Retail" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Retail & Aviation</strong>
                      <small>Top Conglomerates</small>
                    </div>
                  </a>
                  <a href="/employers?q=Government" class="mega-cat-item">
                    <div class="mega-cat-info">
                      <strong>Government Entities</strong>
                      <small>Public Sector</small>
                    </div>
                  </a>
                </div>
              </div>
              <div class="mega-col mega-side-col">
                <div class="mega-head">
                  <span class="mega-eyebrow">BY REGION</span>
                </div>
                <div class="mega-region-list">
                  <a href="/employers?location=Dubai" class="mega-region-pill">
                    <span>Employers in Dubai</span>
                    <span class="mega-region-arrow">›</span>
                  </a>
                  <a href="/employers?location=Abu+Dhabi" class="mega-region-pill">
                    <span>Employers in Abu Dhabi</span>
                    <span class="mega-region-arrow">›</span>
                  </a>
                  <a href="/employers?location=Sharjah" class="mega-region-pill">
                    <span>Employers in Sharjah</span>
                    <span class="mega-region-arrow">›</span>
                  </a>
                </div>
                <div class="mega-cta-card">
                  <span class="mega-badge">2,700+ COMPANIES</span>
                  <h4>Top Employers in UAE</h4>
                  <p>Explore verified hiring companies, direct career pages & hospital networks.</p>
                  <a href="/employers" class="mega-cta-btn">Browse All Employers →</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. SERVICES MENU (Resume Maker) -->
        <div class="nav-item nav-has-dropdown">
          <a class="nav-link${isServices?' active':''}" href="/resume-library">
            Services ${navArrow}
          </a>
          <div class="nav-services-dropdown">
            <a href="/resume-library" class="service-item">
              <div class="service-text">
                <div class="service-title-row">
                  <strong>Resume Maker</strong>
                  <span class="service-tag">Popular</span>
                </div>
                <p>Create polished, modern CVs tailored for UAE hiring managers</p>
              </div>
            </a>
          </div>
        </div>

        <div class="mobile-nav-actions">
          ${currentUser?`<div class="mobile-account-panel">
            <div class="mobile-account-user">
              <span class="mobile-account-avatar"><span>${candidateInitial}</span>${candidateAvatar ? `<img src="${escapeAttr(candidateAvatar)}" alt="">` : ''}</span>
              <div><strong>${escapeAttr(currentUser?.name || 'My account')}</strong><small>${escapeAttr(currentUser?.email || '')}</small></div>
            </div>
            <a class="mobile-account-score" href="/profile"><span><strong>Account score</strong><small>Complete your profile to improve visibility</small></span><b>${candidateComp}%</b><i><span style="width:${candidateComp}%"></span></i></a>
            <div class="mobile-account-links">
              <a href="/profile">${accountIcon('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>')}<span>Account information</span><b>›</b></a>
              <a href="/resume-library">${accountIcon('<path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h7M9 16h7"/>')}<span>Résumé library</span><b>›</b></a>
              <a href="/saved-jobs">${accountIcon('<path d="M6 3h12v18l-6-4-6 4z"/>')}<span>Saved jobs</span><b>›</b></a>
              <a href="/applied-jobs">${accountIcon('<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M8 6V4h8v2M8 12l3 3 5-6"/>')}<span>Applied jobs</span><b>›</b></a>
              <a href="/followed-companies">${accountIcon('<path d="M3 21h18M5 21V6l7-3v18M12 9h7v12M8 9v1M8 13v1M8 17v1M16 13v1M16 17v1"/>')}<span>Followed companies</span><b>›</b></a>
            </div>
            <button type="button" id="mobileLogoutBtn" class="mobile-account-signout">${accountIcon('<path d="M10 17l5-5-5-5M15 12H3M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/>')} Sign out</button>
          </div>`:`<a class="mobile-btn-auth" href="/login">Login / Register</a>`}
          ${currentUser?'':`<a class="mobile-btn-primary" href="/submit-job">+ Add Job</a>`}
        </div>
      </nav>
      <div class="nav-actions">
        ${currentUser?`${profileAvatar}`:`<a class="nav-btn-auth" href="/login">Login / Register</a>`}
        ${currentUser?'':`<a class="nav-btn-primary" href="/submit-job"><span>+ Add Job</span></a>`}
      </div>
      <button class="hamb" aria-label="Toggle navigation" aria-expanded="false">
        <svg class="hamb-open" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        <svg class="hamb-close" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  </header>`;
}
const footerGuideRows = [
  {
    id: 'job-categories',
    defaultOpen: true,
    columns: [
      {
        title: 'Healthcare & Nursing Jobs',
        links: [
          { label: 'Staff Nurse in Dubai', url: '/nurse-jobs-in-uae' },
          { label: 'Registered Nurse Jobs', url: '/category/registered-nurse-jobs' },
          { label: 'Nurse Jobs in UAE', url: '/category/nurse-jobs' },
          { label: 'Healthcare Jobs UAE', url: '/category/healthcare' },
          { label: 'Consultant Doctor Jobs', url: '/category/consultant-doctor-jobs' },
          { label: 'General Practitioner Jobs', url: '/category/general-practitioner-jobs' },
          { label: 'Pharmacist Jobs UAE', url: '/category/pharmacist-jobs' },
          { label: 'Medical Laboratory Jobs', url: '/category/medical-laboratory-jobs' }
        ]
      },
      {
        title: 'Finance & Banking Jobs',
        links: [
          { label: 'Accounting & Finance Jobs', url: '/category/accounting-finance' },
          { label: 'Accountant Jobs in UAE', url: '/category/accountant' },
          { label: 'Finance & Accounts Manager', url: '/category/finance-accounts-manager-jobs' },
          { label: 'Financial Auditor Jobs', url: '/category/financial-auditor-jobs' },
          { label: 'Chartered Accountant Jobs', url: '/category/chartered-accountant-jobs' },
          { label: 'Banking Careers in UAE', url: '/jobs?q=Bank' },
          { label: 'Tax & Payroll Specialist', url: '/jobs?q=Payroll' }
        ]
      },
      {
        title: 'IT, Software & Tech Jobs',
        links: [
          { label: 'Engineering Jobs in UAE', url: '/category/engineering' },
          { label: 'Full Stack & Web Developer', url: '/jobs?q=Developer' },
          { label: 'Cloud & DevOps Engineer', url: '/jobs?q=DevOps' },
          { label: 'Cyber Security Specialist', url: '/jobs?q=Cyber+Security' },
          { label: 'IT Support & Systems', url: '/jobs?q=IT+Support' },
          { label: 'Graphic Designer Jobs', url: '/category/graphic-designer-jobs' },
          { label: 'Data Analyst Jobs', url: '/category/data-analyst' }
        ]
      },
      {
        title: 'Sales, Marketing & HR Jobs',
        links: [
          { label: 'Human Resource Jobs', url: '/category/human-resource' },
          { label: 'HR Officer Jobs', url: '/category/human-resources-officer-jobs' },
          { label: 'Talent Acquisition Specialist', url: '/category/talent-acquisition-specialist-jobs' },
          { label: 'Digital Marketing Jobs', url: '/category/digital-marketing' },
          { label: 'Marketing & Sales Jobs', url: '/category/marketing-and-sales' },
          { label: 'Social Media Marketing', url: '/category/social-media-coordinator-jobs' },
          { label: 'Customer Service Jobs', url: '/category/customer-service-associate-jobs' }
        ]
      }
    ]
  }
];

function footerCategoriesAccordion() {
  const rowsHtml = footerGuideRows.map(row => {
    const cols = row.columns;
    const headerColsHtml = cols.map((col, idx) => {
      const isLast = idx === cols.length - 1;
      return `<div class="footer-acc-header-col${isLast ? ' footer-acc-header-col-last' : ''}">
        <span class="footer-acc-header-title">${escapeAttr(col.title)}</span>
        ${isLast ? `
        <span class="footer-acc-arrow-indicator" aria-hidden="true">
          <svg class="footer-acc-chevron-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>` : ''}
      </div>`;
    }).join('');

    const bodyColsHtml = cols.map(col => `
      <div class="footer-acc-col">
        <h4 class="footer-acc-col-mobile-title">${escapeAttr(col.title)}</h4>
        <ul class="footer-acc-links">
          ${col.links.map(l => `<li><a href="${escapeAttr(l.url)}">${escapeAttr(l.label)}</a></li>`).join('')}
        </ul>
      </div>
    `).join('');

    return `
      <div class="footer-acc-row${row.defaultOpen ? ' open' : ''}" data-acc-row="${escapeAttr(row.id)}">
        <button type="button" class="footer-acc-header" aria-expanded="${row.defaultOpen ? 'true' : 'false'}">
          <div class="footer-acc-header-grid">
            ${headerColsHtml}
          </div>
        </button>
        <div class="footer-acc-drawer">
          <div class="footer-acc-drawer-inner">
            <div class="footer-acc-body-grid">
              ${bodyColsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `<div class="wrap footer-categories-container">
    <div class="footer-acc-wrapper">
      ${rowsHtml}
    </div>
  </div>`;
}

function footerQuickBar() {
  return `<div class="footer-quick-bar">
    <div class="wrap footer-quick-container">
      <div class="footer-quick-links">
        <a href="/jobs">Browse All Jobs</a>
        <span class="footer-quick-sep">|</span>
        <a href="/employers">Top Employers</a>
        <span class="footer-quick-sep">|</span>
        <a href="/about">About Us</a>
        <span class="footer-quick-sep">|</span>
        <a href="/contact">Contact</a>
        <span class="footer-quick-sep">|</span>
        <a href="/privacy-policy">Privacy Policy</a>
        <span class="footer-quick-sep">|</span>
        <a href="/terms">Terms of Service</a>
      </div>
    </div>
  </div>`;
}

function footer(){
  const menu=chromeMenu(siteChrome.footerMenu,'About Us | /about\nContact Us | /contact\nTerms | /terms\nFAQ | /faq\nPrivacy Policy | /privacy-policy'),
  candidateMenu=chromeMenu(siteChrome.footerCandidateMenu,'Browse Jobs | /jobs\nJob Alerts | /alerts-jobs'),
  employerMenu=chromeMenu(siteChrome.footerEmployerMenu,'Employers List | /employers\nSubmit Job | /submit-job'),
  links=items=>items.map(([label,url])=>`<a href="${escapeAttr(url)}" style="color:${escapeAttr(siteChrome.footerLink||'#979797')}">${escapeAttr(label)}</a>`).join('');
  return `<footer class="footer site-footer-columns site-footer-standard" style="background:#202124;color:#ffffff">
    <div class="wrap footer-grid">
      <div>
        <img src="${escapeAttr(resolveLogo(siteChrome.footerLogo,'/assets/logo-white.png'))}" alt="Trikonet">
        <p>${escapeAttr(siteChrome.footerEmail||'info@trikonet.com')}</p>
      </div>
      <div><h2>${escapeAttr(siteChrome.footerExploreTitle||'Explore')}</h2>${links(menu)}</div>
      <div><h2>${escapeAttr(siteChrome.footerCandidateTitle||'For Candidates')}</h2>${links(candidateMenu)}</div>
      <div><h2>${escapeAttr(siteChrome.footerEmployerTitle||'For Employers')}</h2>${links(employerMenu)}</div>
    </div>
    ${footerCategoriesAccordion()}
    ${footerQuickBar()}
    <div class="wrap footer-bottom">
      <div class="footer-bottom-info">
        <p class="footer-legal-note">${escapeAttr(siteChrome.footerLegalNote||'Trikonet Recruitment Services | Registered in Dubai, United Arab Emirates. Connecting certified professionals with leading healthcare providers, schools, corporate firms, and technology groups across the UAE & GCC.')}</p>
        <p class="footer-copy-text">${escapeAttr(siteChrome.footerCopyright||'© 2026 Trikonet. All Right Reserved.')}</p>
      </div>
    </div>
  </footer>`;
}
const optionList=(items,placeholder,selected)=>`<option value="">${placeholder}</option>${(items||[]).map(item=>`<option value="${escapeAttr(item.name)}"${selected===item.name?' selected':''}>${item.name}</option>`).join('')}`;
function customSelect(name, items, defaultLabel, selectedValue) {
  const currentVal = selectedValue || '';
  const currentItem = (items || []).find(item => item.name === currentVal);
  const currentLabel = currentItem ? currentItem.name : defaultLabel;
  
  const optionsHtml = [
    { name: '', label: defaultLabel },
    ...(items || []).map(item => ({ name: item.name, label: item.name }))
  ].map(opt => {
    const isSelected = opt.name === currentVal;
    return `<li class="custom-select-option${isSelected ? ' selected' : ''}" data-value="${escapeAttr(opt.name)}" role="option" aria-selected="${isSelected ? 'true' : 'false'}">
      <span>${escapeAttr(opt.label)}</span>
      ${isSelected ? `<svg class="custom-select-check" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>` : ''}
    </li>`;
  }).join('');

  return `<div class="custom-select-wrapper" data-name="${escapeAttr(name)}">
    <input type="hidden" name="${escapeAttr(name)}" value="${escapeAttr(currentVal)}">
    <button type="button" class="custom-select-trigger" aria-haspopup="listbox" aria-expanded="false">
      <span class="custom-select-label">${escapeAttr(currentLabel)}</span>
      <svg class="custom-select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </button>
    <div class="custom-select-dropdown">
      <ul class="custom-select-list" role="listbox">
        ${optionsHtml}
      </ul>
    </div>
  </div>`;
}
function searchBar(settings={}){const action=settings.action||(path==='/nurse-jobs-in-uae'?'/nurse-jobs-in-uae':'/jobs'),locationLabel=settings.location||'Country or City',categoryLabel=settings.category||'All Categories',selectedLocation=queryParams.get('location')||locationLabel,selectedCategory=queryParams.get('category')||categoryLabel;return `<form class="searchbar" action="${escapeAttr(action)}"><label class="field"><b>${icons.search}</b><input name="q" value="${escapeAttr(queryParams.get('q'))}" placeholder="${escapeAttr(settings.keyword||'Job Title, Keywords')}" aria-label="Job title"></label><label class="field"><b>${icons.pin}</b><select name="location" aria-label="Location">${optionList(data.taxonomies.locations,locationLabel,selectedLocation)}</select></label><label class="field"><select name="category" aria-label="Category">${optionList(data.taxonomies.categories,categoryLabel,selectedCategory)}</select></label><button class="primary">${escapeAttr(settings.button||'Find Jobs')}</button></form>`}
const homeSectionAttrs=s=>`${s.className?` ${escapeAttr(s.className)}`:''}" style="${s.background?`background:${escapeAttr(s.background)};`:''}${s.textColor?`color:${escapeAttr(s.textColor)};`:''}`;
function homeHero(s={}){
  const heroTitle = (s.title && s.title !== 'Trying to Connect') ? s.title : 'Find your next <span class="hero-title-gradient">career move</span> in the UAE';
  
  const liveCount = (data.counts && data.counts.job_listing) ? data.counts.job_listing : 13621;
  const formattedCount = Number(liveCount).toLocaleString() + '+';
  let subtitleHtml;
  if (s.subtitle && s.subtitle.trim() && s.subtitle !== 'Over 13,600+ Verified Jobs Across Dubai, Abu Dhabi & the GCC') {
    if (/\d[\d,]*\+?/.test(s.subtitle)) {
      subtitleHtml = escapeAttr(s.subtitle).replace(/\d[\d,]*\+?/, `<span class="hero-live-job-count" data-live-job-count>${formattedCount}</span>`);
    } else {
      subtitleHtml = escapeAttr(s.subtitle);
    }
  } else {
    subtitleHtml = `Over <span class="hero-live-job-count" data-live-job-count>${formattedCount}</span> Verified Jobs Across Dubai, Abu Dhabi & the GCC`;
  }

  return `<section class="hero-minimal">
    <div class="hero-minimal-wrap">
      <div class="hero-premium-pill">
        <span class="hero-pill-sparkle">✦</span>
        <span>Verified Opportunities Across UAE & GCC</span>
      </div>

      <h1 class="hero-minimal-title">${heroTitle}</h1>
      <p class="hero-minimal-subtitle">${subtitleHtml}</p>

      <div class="hero-minimal-search-box">
        <form class="hero-minimal-search-form" action="/jobs" method="GET">
          <div class="hero-minimal-field field-keyword">
            <svg class="hero-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input class="hero-minimal-input" name="q" value="${escapeAttr(queryParams.get('q')||'')}" placeholder="Job title, skills, or company" aria-label="Job title or keywords">
          </div>

          <div class="hero-minimal-divider"></div>

          <div class="hero-minimal-field field-location">
            <svg class="hero-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${customSelect('location', data.taxonomies.locations, 'All Locations', queryParams.get('location') || '')}
          </div>

          <div class="hero-minimal-divider"></div>

          <div class="hero-minimal-field field-category">
            <svg class="hero-field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <div class="category-autocomplete-wrap" id="category-autocomplete">
              <input 
                type="text" 
                class="category-input" 
                name="category" 
                id="category-search-input" 
                value="${escapeAttr(queryParams.get('category') || '')}" 
                placeholder="All Categories" 
                autocomplete="off" 
                aria-label="Job category"
              >
              <button type="button" class="category-clear-btn" id="category-clear-btn" aria-label="Clear category" style="display:${queryParams.get('category') ? 'flex' : 'none'};">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <div class="category-suggestions-box" id="category-suggestions">
                <ul class="category-suggestions-list" role="listbox"></ul>
              </div>
            </div>
          </div>

          <button type="submit" class="hero-minimal-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span>Search</span>
          </button>
        </form>
      </div>

      <div class="hero-minimal-trending">
        <span class="trending-label">Popular:</span>
        <a class="trending-chip" href="/jobs?q=Nurse">Nurse</a>
        <a class="trending-chip" href="/jobs?q=Doctor">Doctor</a>
        <a class="trending-chip" href="/jobs?q=Accountant">Accountant</a>
        <a class="trending-chip" href="/jobs?q=Software">Software</a>
        <a class="trending-chip" href="/jobs?q=Sales">Sales</a>
        <a class="trending-chip" href="/jobs?q=Driver">Driver</a>
      </div>

      <div class="hero-minimal-image-wrap">
        <img class="hero-minimal-image" src="/assets/hero-team.png" alt="Trikonet UAE Professionals Team" width="1116" height="542">
      </div>
    </div>
  </section>`;
}
function getCategorySvg(name = '') {
  const n = String(name).toLowerCase();
  if (n.includes('educat') || n.includes('teach') || n.includes('school') || n.includes('academic')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
  }
  if (n.includes('account') || n.includes('financ') || n.includes('audit') || n.includes('bank') || n.includes('cashier')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
  }
  if (n.includes('nurse')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`;
  }
  if (n.includes('health') || n.includes('doctor') || n.includes('medic') || n.includes('clinic') || n.includes('hospital')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 9v6m-3-3h6"/></svg>`;
  }
  if (n.includes('human') || n.includes('hr') || n.includes('talent') || n.includes('recruit')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  }
  if (n.includes('digital') || n.includes('marketing') || n.includes('seo') || n.includes('media')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>`;
  }
  if (n.includes('sale') || n.includes('retail') || n.includes('customer')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`;
  }
  if (n.includes('engineer') || n.includes('tech') || n.includes('software') || n.includes('comput')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
  }
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
}

function homeCategories(s = {}) {
  const sourceList = (data.taxonomies?.categories?.length) ? data.taxonomies.categories : defaultTopCategories;
  const mainCategories = sourceList.filter(c => !c.parent || ['Nurse Jobs'].includes(c.name));
  const cats = [...(mainCategories.length >= 9 ? mainCategories : sourceList)]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 9);
  return `<section class="section home-categories-section${homeSectionAttrs(s)}">
    <div class="wrap">
      <div class="categories-header">
        <div class="categories-header-text">
          <span class="categories-eyebrow">BROWSE BY INDUSTRY</span>
          <h2 class="categories-title">${escapeAttr(s.title || 'Popular Job Categories')}</h2>
          <p class="categories-subtitle">${escapeAttr(s.subtitle || 'Explore thousands of active vacancies across top in-demand industries in the UAE')}</p>
        </div>
        <a href="/jobs" class="categories-all-link">
          <span>Explore All Categories</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div class="category-grid">
        ${cats.map((c) => `
          <a class="category-card" href="/category/${slugifyCategory(c)}">
            <div class="category-card-icon">
              ${getCategorySvg(c.name)}
            </div>
            <div class="category-card-body">
              <h3 class="category-card-title">${escapeAttr(c.name)}</h3>
              <span class="category-card-count">${Number(c.count || 0).toLocaleString()} open positions</span>
            </div>
            <div class="category-card-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  </section>`;
}
const companyTaglineMap = {
  'gems-education': "World-class private education and international curricula across UAE.",
  'aldar-education': "Leading educational group with British & IB curriculum schools.",
  'nmc-healthcare': "Pioneering private healthcare and specialized clinical excellence.",
  'american-hospital': "Mayo Clinic Network care and advanced multi-specialty services.",
  'al-futtaim': "Conglomerate leader across automotive, retail, and real estate.",
  'seha': "Transforming public & private clinical health services across UAE.",
  'mediclinic': "International private hospital network operating across Dubai & GCC.",
  'aster-dm-healthcare': "Integrated healthcare provider with world-class hospitals & clinics.",
  'dubai-health-authority': "Delivering public health protection and patient-centered services.",
  'adnoc': "Energy, oil & gas engineering leader driving sustainable innovation.",
  'emirates-group': "Global aviation, airline operations, and hospitality leader.",
  'emaar': "Iconic real estate, luxury developments, and hospitality in Dubai."
};

const TOP_HIRING_COMPANIES_FALLBACK = [
  { title: 'GEMS Education', slug: 'gems-education', openJobs: 511, locations: ['Dubai'], categories: ['Educational Services'], logo: '/uploads/employers/11640.png' },
  { title: 'Aldar Education', slug: 'aldar-education', openJobs: 400, locations: ['Abu Dhabi'], categories: ['Educational Services'], logo: '/uploads/employers/11645.png' },
  { title: 'NMC Healthcare', slug: 'nmc-healthcare', openJobs: 206, locations: ['UAE'], categories: ['Healthcare'], logo: '/uploads/employers/11664.jpg' },
  { title: 'American Hospital', slug: 'american-hospital-dubai', openJobs: 184, locations: ['Dubai'], categories: ['Healthcare'], logo: '/uploads/employers/11647.png' },
  { title: 'Al-Futtaim', slug: 'alfuttaim', openJobs: 157, locations: ['Dubai'], categories: ['Retail', 'Conglomerate'], logo: '/uploads/employers/11641.png' },
  { title: 'Seha Abudhabi Health Services CO', slug: 'seha-abu-dhabi-health-services-co-2', openJobs: 144, locations: ['Abu Dhabi'], categories: ['Healthcare'], logo: '/uploads/employers/12777.jpg' },
  { title: 'Mediclinic', slug: 'mediclinic', openJobs: 115, locations: ['UAE'], categories: ['Healthcare'], logo: '/uploads/employers/12103.jpg' },
  { title: 'Nord Anglia Education', slug: 'nord-anglia-education', openJobs: 108, locations: ['Dubai'], categories: ['Educational Services'], logo: '/uploads/employers/31623.jpg' },
  { title: 'Jumeirah', slug: 'jumeirah', openJobs: 101, locations: ['Dubai'], categories: ['Hospitality'], logo: '/uploads/employers/28110.jpg' },
  { title: 'Wynn Al Marjan Island', slug: 'wynn-al-marjan-island', openJobs: 92, locations: ['Ras Al Khaimah'], categories: ['Hospitality'], logo: '/uploads/employers/29164.jpg' },
  { title: 'Saudi German Health', slug: 'saudigerman', openJobs: 91, locations: ['UAE'], categories: ['Healthcare'], logo: '/uploads/employers/9222.jpg' },
  { title: "King's College Hospital London – UAE", slug: 'kings-college-hospital-london-uae', openJobs: 88, locations: ['Dubai'], categories: ['Healthcare'], logo: '/uploads/employers/12975.jpg' },
  { title: 'First Abu Dhabi Bank (FAB)', slug: 'first-abu-dhabi-bank', openJobs: 81, locations: ['Abu Dhabi'], categories: ['Banking'], logo: '/uploads/employers/9867.jpg' },
  { title: 'Mashreq', slug: 'mashreq-bank', openJobs: 79, locations: ['Dubai'], categories: ['Banking'], logo: '/uploads/employers/9915.jpg' },
  { title: 'United Arab Emirates University', slug: 'united-arab-emirates-university', openJobs: 79, locations: ['Al Ain'], categories: ['Educational Services'], logo: '/uploads/employers/38913.jpg' },
  { title: 'Majid Al Futtaim', slug: 'majid-al-futtaim', openJobs: 76, locations: ['Dubai'], categories: ['Retail'], logo: '/uploads/employers/9891.jpg' }
];

function homeTopCompanies(s = {}) {
  let employers = (data.topEmployers && data.topEmployers.length) 
    ? [...data.topEmployers] 
    : [...(data.employers || [])];

  if (!employers.length) {
    employers = [...TOP_HIRING_COMPANIES_FALLBACK];
  }

  // Strictly sort by highest open jobs descending!
  employers.sort((a, b) => (Number(b.openJobs) || 0) - (Number(a.openJobs) || 0));

  if ((Number(employers[0]?.openJobs) || 0) < 20) {
    employers = [...TOP_HIRING_COMPANIES_FALLBACK];
  }

  const cardsHtml = employers.slice(0, 16).map(e => {
    const displayTitle = decodeHtml(e.title || '');
    const initials = escapeAttr(displayTitle.slice(0, 2).toUpperCase() || 'TC');
    const rawLoc = (e.locations && e.locations[0]) || '';
    const cleanLoc = (!rawLoc || /^\d+$/.test(rawLoc) || rawLoc === 'United Arab Emirates') ? 'UAE' : decodeHtml(rawLoc);
    
    // Extract category
    const validCats = (e.categories || []).filter(c => typeof c === 'string' && c.trim() && !/^\d+$/.test(c));
    const catText = validCats.length ? decodeHtml(validCats.slice(0, 2).join(' • ')) : decodeHtml(e.category || 'Top Employer');
    const openJobsCount = Number(e.openJobs) || 20;

    return `
      <div class="featured-company-card">
        <div class="featured-company-logo-wrap">
          ${e.logo ? `<img src="${escapeAttr(e.logo)}" alt="${escapeAttr(displayTitle)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
          <div class="featured-company-logo-fallback" style="${e.logo ? 'display:none;' : 'display:flex;'}">
            ${initials}
          </div>
        </div>

        <div class="featured-company-info-box">
          <h3 class="featured-company-name" title="${escapeAttr(displayTitle)}">${escapeAttr(displayTitle)}</h3>
          <div class="featured-company-jobs-badge">
            <svg class="featured-company-job-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <span class="company-jobs-count-text"><strong>${openJobsCount}</strong> Open Jobs</span>
            <span class="company-jobs-sep">•</span>
            <span class="company-jobs-loc">${escapeAttr(cleanLoc)}</span>
          </div>
        </div>

        <div class="featured-company-category-tag">
          <span class="company-cat-pill">${escapeAttr(catText)}</span>
        </div>

        <a href="/employer/${escapeAttr(e.slug)}" class="featured-company-view-btn">View jobs</a>
      </div>
    `;
  }).join('');

  const sectionTitle = (s.title && s.title !== 'Featured companies actively hiring') ? s.title : 'Top Companies Hiring';

  return `<section class="featured-companies-section"${homeSectionAttrs(s)}>
    <div class="wrap">
      <div class="featured-companies-header">
        <h2 class="featured-companies-title">${escapeAttr(sectionTitle)}</h2>
      </div>

      <div class="featured-companies-carousel-wrap">
        <button type="button" class="carousel-arrow carousel-arrow-prev" aria-label="Previous companies">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div class="featured-companies-track">
          ${cardsHtml}
        </div>

        <button type="button" class="carousel-arrow carousel-arrow-next" aria-label="Next companies">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <div class="featured-companies-footer">
        <a class="btn-all-companies-pill" href="/employers">View all companies</a>
      </div>
    </div>
  </section>`;
}
function homeHowItWorks(s = {}) {
  const steps = [
    {
      title: s.step1Title || 'Register an Account to Start',
      image: s.step1Image || '/assets/step-1.jpg'
    },
    {
      title: s.step2Title || 'Explore Over Thousands of Jobs',
      image: s.step2Image || '/assets/step-2.jpg'
    },
    {
      title: s.step3Title || 'Find the Most Suitable Company and Job',
      image: s.step3Image || '/assets/step-3.jpg'
    }
  ];

  return `<section class="section alt how-it-works-section${homeSectionAttrs(s)}" id="howItWorksSection">
    <div class="wrap">
      <div class="section-title">
        <h2>${escapeAttr(s.title || 'How It Works?')}</h2>
        <p>${escapeAttr(s.subtitle || 'Job for Anyone, Anywhere')}</p>
      </div>
      <div class="how-steps-wrap">
        <div class="how-steps-track" id="howStepsTrack">
          ${steps.map((st, i) => `
            <div class="how-step-item" data-step="${i}">
              <div class="how-step-icon">
                <img src="${escapeAttr(st.image)}" alt="${escapeAttr(st.title)}" loading="lazy">
              </div>
              <h3 class="how-step-title">${escapeAttr(st.title)}</h3>
            </div>
          `).join('')}
        </div>
        <div class="how-slider-dots" id="howSliderDots" aria-label="Step slider navigation">
          <button type="button" class="how-dot active" data-index="0" aria-label="Step 1"></button>
          <button type="button" class="how-dot" data-index="1" aria-label="Step 2"></button>
          <button type="button" class="how-dot" data-index="2" aria-label="Step 3"></button>
        </div>
      </div>
    </div>
  </section>`;
}
function homeWidgets(){const fallback=['hero','categories','top-companies','how-it-works','articles'].map(type=>({type,settings:{}}));try{const pages=JSON.parse(localStorage.getItem('trikonet_pages_cms')||'[]');const page=pages.find(item=>item.slug==='home');if(!page?.content)return fallback;const doc=new DOMParser().parseFromString(page.content,'text/html');const widgets=[...doc.querySelectorAll('[data-home-widget]')].map(node=>{let settings={};try{settings=JSON.parse(decodeURIComponent(node.dataset.homeSettings||'%7B%7D'))}catch{}return {type:node.dataset.homeWidget,settings}}).filter(item=>['hero','categories','top-companies','how-it-works','articles'].includes(item.type));if(widgets.length&&!widgets.some(w=>w.type==='top-companies')){const catIdx=widgets.findIndex(w=>w.type==='categories');if(catIdx>=0)widgets.splice(catIdx+1,0,{type:'top-companies',settings:{}});else widgets.push({type:'top-companies',settings:{}})}return widgets.length?widgets:fallback}catch{return fallback}}
function home(){const renderers={hero:homeHero,categories:homeCategories,'top-companies':homeTopCompanies,'how-it-works':homeHowItWorks,articles:(s)=>articleSection(s)};return `<main>${homeWidgets().map(item=>renderers[item.type]?.(item.settings)||'').join('')}</main>`}
function getPaginationRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
}

function pager(base, total, size = pageSize) {
  const pages = Math.ceil(total / size);
  if (pages <= 1) return '';
  const safeCurrent = Math.min(Math.max(currentPage, 1), pages);
  const pageLink = page => {
    const params = new URLSearchParams(queryParams);
    params.set('page', page);
    return `${base}?${params.toString()}`;
  };

  const range = getPaginationRange(safeCurrent, pages);

  const prevBtn = safeCurrent > 1
    ? `<a class="pagination-btn pagination-prev" href="${pageLink(safeCurrent - 1)}" aria-label="Previous page">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        <span>Previous</span>
      </a>`
    : `<span class="pagination-btn pagination-prev disabled" aria-disabled="true">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        <span>Previous</span>
      </span>`;

  const nextBtn = safeCurrent < pages
    ? `<a class="pagination-btn pagination-next" href="${pageLink(safeCurrent + 1)}" aria-label="Next page">
        <span>Next</span>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </a>`
    : `<span class="pagination-btn pagination-next disabled" aria-disabled="true">
        <span>Next</span>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </span>`;

  const pageItems = range.map(item => {
    if (item === '...') {
      return `<span class="pagination-ellipsis" aria-hidden="true">&hellip;</span>`;
    }
    if (item === safeCurrent) {
      return `<span class="pagination-num active" aria-current="page">${item}</span>`;
    }
    return `<a class="pagination-num" href="${pageLink(item)}" aria-label="Page ${item}">${item}</a>`;
  }).join('');

  return `
    <nav class="data-pagination" aria-label="Pagination">
      <div class="pagination-info">
        Page <span class="highlight">${safeCurrent}</span> of <span class="highlight">${pages}</span>
        ${total ? `<span class="total-count">(${Number(total).toLocaleString()} total)</span>` : ''}
      </div>
      <div class="pagination-controls">
        ${prevBtn}
        <div class="pagination-pages">
          ${pageItems}
        </div>
        ${nextBtn}
      </div>
    </nav>
  `;
}
function getRecentArticles() {
  const posts = [...(data.posts || [])];
  posts.sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : 0;
    const timeB = b.date ? new Date(b.date).getTime() : 0;
    if (timeB && timeA && timeB !== timeA) return timeB - timeA;
    return (b.id || 0) - (a.id || 0);
  });
  return posts.slice(0, Math.max(10, Math.min(14, posts.length)));
}

function articleSection(s = {}) {
  const slider = path === '/';
  const recentArticles = getRecentArticles();
  if (!recentArticles.length) return '';

  return `
    <section class="recent-section${slider ? ' recent-slider' : ''}"${homeSectionAttrs(s)}>
      <div class="wrap">
        <div class="section-title">
          <h2>${escapeAttr(s.title || 'Recent Articles')}</h2>
          <p>${escapeAttr(s.subtitle || 'Fresh job related content posted each day.')}</p>
        </div>

        <div class="articles-carousel-wrap">
          ${slider ? `
            <button type="button" class="carousel-arrow carousel-arrow-prev article-arrow-prev" aria-label="Previous articles">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
          ` : ''}

          <div class="articles" ${slider ? 'id="recent-articles" tabindex="0" aria-label="Recent articles slider"' : ''}>
            ${recentArticles.map((p, i) => `
              <article class="article">
                <a href="${getPostUrl(p)}" class="article-cover-link">
                  <img class="article-cover" src="${escapeAttr(p.featuredImage || p.image || `/assets/article-${(i % 3) + 1}.jpg`)}" alt="${escapeAttr(p.title)}" onerror="this.onerror=null;this.src='/assets/article-${(i % 3) + 1}.jpg';">
                </a>
                <div class="article-body">
                  <small>${escapeAttr(p.date || 'Recent')}</small>
                  <h3><a href="${getPostUrl(p)}">${escapeAttr(p.title)}</a></h3>
                  <p>${escapeAttr(p.excerpt)}</p>
                  <a class="read" href="${getPostUrl(p)}">Read More ›</a>
                </div>
              </article>
            `).join('')}
          </div>

          ${slider ? `
            <button type="button" class="carousel-arrow carousel-arrow-next article-arrow-next" aria-label="Next articles">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          ` : ''}
        </div>

        <div class="recent-articles-footer">
          <a class="btn-all-articles-pill" href="/blog">
            <span>View all articles</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      </div>
    </section>
  `;
}
function jobs(){
  const total=data.counts.job_listing||data.jobs.length,start=total?(currentPage-1)*pageSize+1:0,end=Math.min(start+data.jobs.length-1,total),selectedType=queryParams.get('job_type')||'';
  const jobsBase=path.startsWith('/job-location/')?path:'/jobs';
  return `<main><section class="jobs-head"><div class="wrap">${searchBar()}</div></section><div class="wrap jobs-layout">
    <aside class="filters jobs-filter-card">
      <div class="jobs-filter-group">
        <div class="jobs-filter-head">
          <h3>Job type</h3>
          ${selectedType ? `<a href="/jobs${(() => { const p = new URLSearchParams(queryParams); p.delete('job_type'); p.delete('page'); const qs = p.toString(); return qs ? '?' + qs : ''; })()}" class="jobs-filter-clear">Clear</a>` : ''}
        </div>
        <div class="jobs-filter-list">
          ${(data.taxonomies?.types || []).map(x => {
            const params = new URLSearchParams(queryParams);
            const isSelected = selectedType === x.name;
            if (isSelected) params.delete('job_type');
            else params.set('job_type', x.name);
            params.delete('page');
            const countFormatted = Number(x.count || 0).toLocaleString();
            return `<a class="jobs-filter-row${isSelected ? ' active' : ''}" href="/jobs?${params}">
              <span class="jobs-row-label">
                <span class="jobs-custom-cb">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span class="jobs-filter-name">${escapeAttr(x.name)}</span>
              </span>
              <span class="jobs-filter-count">(${countFormatted})</span>
            </a>`;
          }).join('')}
        </div>
      </div>
    </aside>
    <section><div class="listing-top"><span>${total?`Showing ${start} – ${end} of ${total.toLocaleString()} database jobs`:'No jobs found for these filters'}</span><select><option>Sort by (Default)</option><option>Newest</option></select></div><div class="job-grid">${data.jobs.map(j=>{
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
  }).join('')}</div>${pager(jobsBase,total)}</section></div></main>`;
}
function nurseJobsPage(){
  const curatedNurseJobs=[
    {id:'nj-1',title:'Staff Nurse',company:'SEHA Salma Rehabilitation Hospital',category:'HealthCare, Nurse Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 22, 2026',slug:'staff-nurse-seha-salma',logo:'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&auto=format&fit=crop&q=60',excerpt:'Join a trusted healthcare team and provide high-quality, compassionate patient care while growing your nursing career in the UAE.'},
    {id:'nj-2',title:'Registered Nurse (OPD / Inpatient)',company:'Amana Healthcare',category:'HealthCare, Nurse Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 22, 2026',slug:'registered-nurse-amana-healthcare',logo:'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&auto=format&fit=crop&q=60',excerpt:'Provide dedicated post-acute and specialized rehabilitation nursing care with Amana Healthcare in a supportive clinical environment.'},
    {id:'nj-3',title:'Clinical Care Nurse - ICU',company:'M42 Health',category:'HealthCare, Nurse Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 21, 2026',slug:'clinical-care-nurse-icu-m42',logo:'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=120&auto=format&fit=crop&q=60',excerpt:'Deliver critical patient monitoring and specialized clinical care within M42 world-class healthcare facilities in Abu Dhabi.'},
    {id:'nj-4',title:'Pediatric Staff Nurse',company:'Danat Al Emarat Hospital',category:'HealthCare, Nurse Jobs',location:'Abu Dhabi',type:'Full Time',date:'September 20, 2026',slug:'pediatric-staff-nurse-danat-al-emarat',excerpt:'Deliver compassionate pediatric nursing care and patient family support within a premier women and children hospital setting.'},
    {id:'nj-5',title:'Emergency Room (ER) Nurse',company:'Mediclinic Middle East',category:'HealthCare, Nurse Jobs',location:'Dubai',type:'Full Time',date:'September 19, 2026',slug:'er-nurse-mediclinic',excerpt:'Fast-paced clinical emergency department nursing role supporting trauma, urgent care, and patient triage in Dubai.'}
  ];
  const pageLimit=10;
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

  const latestArticles=(data.posts||[])
    .filter(article=>article&&article.slug&&article.title)
    .slice(0,3);
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
                  ${(() => {
                    if (!job.category) return '';
                    const primaryCat = String(job.category).split(',')[0].trim();
                    return `<span class="nurse-tag-category">${escapeAttr(primaryCat)}</span>`;
                  })()}
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
        <a href="/resume-builder" class="nurse-resume-builder-card" aria-label="Open Trikonet Resume Builder">
          <span class="nurse-resume-builder-badge">FREE TOOL</span>
          <span class="nurse-resume-builder-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></svg>
          </span>
          <span class="nurse-resume-builder-copy">
            <strong>Build your professional résumé</strong>
            <small>Create an ATS-friendly CV for UAE healthcare roles.</small>
          </span>
          <span class="nurse-resume-builder-action">Build my résumé <span aria-hidden="true">→</span></span>
        </a>

        <section class="nurse-side-card nurse-articles-card">
          <div class="nurse-side-card-header">
            <h3>Latest Articles</h3>
            <a href="/blog" class="nurse-side-see-all">View all &rarr;</a>
          </div>
          <div class="nurse-side-article-list">
            ${latestArticles.length?latestArticles.map(article => `
              <a href="${escapeAttr(getPostUrl(article))}" class="nurse-side-article-row">
                <span class="nurse-side-article-image">
                  <img src="${escapeAttr(article.featuredImage||'/assets/article-1.jpg')}" alt="" loading="lazy" onerror="this.onerror=null;this.src='/assets/article-1.jpg'">
                </span>
                <span class="nurse-side-article-copy">
                  <small>${escapeAttr(article.categoryName||'Career Advice')}</small>
                  <strong>${escapeAttr(article.title)}</strong>
                  ${article.date?`<time>${escapeAttr(article.date)}</time>`:''}
                </span>
              </a>
            `).join(''):`<p class="nurse-side-article-empty">Published articles will appear here.</p>`}
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
            <h3>Share Jobs</h3>
          </div>
          <p class="nurse-side-share-txt">Know someone looking for a nurse job in the UAE?</p>
          <div class="nurse-side-share-btns">
            <a href="https://www.linkedin.com/company/trikonet-team" target="_blank" rel="noopener noreferrer nofollow" class="nurse-share-pill" aria-label="Share on LinkedIn">${iconShareLinkedin} LinkedIn</a>
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent('Healthcare Nurse Jobs in UAE: https://www.trikonet.com/nurse-jobs-in-uae')}" target="_blank" rel="noopener noreferrer nofollow" class="nurse-share-pill" aria-label="Share on WhatsApp">${iconShareWa} WhatsApp</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://www.trikonet.com/nurse-jobs-in-uae')}" target="_blank" rel="noopener noreferrer nofollow" class="nurse-share-pill" aria-label="Share on Facebook">${iconShareFb} Facebook</a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent('https://www.trikonet.com/nurse-jobs-in-uae')}" target="_blank" rel="noopener noreferrer nofollow" class="nurse-share-pill" aria-label="Share on X">${iconShareX} X</a>
          </div>
        </section>
      </aside>
    </section>
  </main>`;
}

function categoryPage() {
  const catSlug = path.replace('/category/', '').split('/')[0].split('?')[0];
  const cat = findCategoryBySlug(catSlug);
  const categoryName = cat ? cat.name : (catSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
  const categoryCleanSlug = slugifyCategory(cat || categoryName);

  if (typeof document !== 'undefined') {
    document.title = `${categoryName} Jobs in UAE — Trikonet`;
  }

  const pageLimit = 10;
  const list = data.jobs.slice(0, pageLimit);
  const total = data.counts?.category || cat?.count || list.length;
  const start = total ? (currentPage - 1) * pageLimit + 1 : 0;
  const end = Math.min(start + list.length - 1, total);

  const qQuery = queryParams.get('q') || '';
  const selectedLoc = queryParams.get('location') || '';
  const selectedType = queryParams.get('job_type') || '';
  const hasActiveFilters = !!(selectedLoc || selectedType || qQuery);

  const removeLocParams = new URLSearchParams(queryParams);
  removeLocParams.delete('location');
  removeLocParams.delete('page');
  const removeTypeParams = new URLSearchParams(queryParams);
  removeTypeParams.delete('job_type');
  removeTypeParams.delete('page');

  let pageTitle = `${escapeAttr(categoryName)} Jobs in UAE`;
  if (qQuery) pageTitle = `"${escapeAttr(qQuery)}" in ${escapeAttr(categoryName)}`;
  else if (selectedLoc) pageTitle = `${escapeAttr(categoryName)} Jobs in ${escapeAttr(selectedLoc)}`;

  const iconCheckTick = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  const iconBookmark = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;
  const iconBell = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`;
  const iconBriefcase = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
  const iconPin = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const iconClock = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

  const latestArticles = (data.posts || [])
    .filter(article => article && article.slug && article.title)
    .slice(0, 3);
  const iconShareLinkedin = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
  const iconShareFb = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>`;
  const iconShareWa = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`;
  const iconShareX = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;

  // Other related categories
  const otherCats = (data.taxonomies?.categories?.length ? data.taxonomies.categories : defaultTopCategories)
    .filter(c => c.name.toLowerCase() !== categoryName.toLowerCase())
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 8);

  return `<main class="nurse-results-page category-results-page">
    <section class="nurse-results-hero category-page-hero">
      <div class="wrap">
        <div class="nurse-hero-topline">
          <nav class="nurse-breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span class="sep">&gt;</span>
            <a href="/jobs">Categories</a>
            <span class="sep">&gt;</span>
            <span class="current">${escapeAttr(categoryName)}</span>
          </nav>
        </div>
        <div class="category-hero-head">
          <div class="nurse-hero-title-row">
            <h1>${pageTitle}</h1>
            <span class="nurse-hero-count-tag">${Number(total).toLocaleString()} Active Vacancies</span>
          </div>
          <p class="nurse-hero-desc">Explore verified ${escapeAttr(categoryName)} job vacancies across Dubai, Abu Dhabi, Sharjah, and all UAE emirates with direct employer hiring.</p>
        </div>
        <div class="nurse-search-wrapper">
          ${searchBar({ keyword: `${categoryName} job title, role...`, category: categoryName, button: 'Search Category', action: `/category/${categoryCleanSlug}` })}
        </div>
        <div class="category-popular-chips">
          <span class="chips-label">
            <span class="chips-label-desktop">Popular in ${escapeAttr(categoryName)}:</span>
            <span class="chips-label-mobile">Popular:</span>
          </span>
          <a href="/category/${categoryCleanSlug}?location=Dubai">Dubai</a>
          <a href="/category/${categoryCleanSlug}?location=Abu+Dhabi">Abu Dhabi</a>
          <a href="/category/${categoryCleanSlug}?location=Sharjah">Sharjah</a>
        </div>
      </div>
    </section>

    <section class="wrap nurse-results-layout category-results-layout">
      <aside class="filters nurse-site-filters">
        <div class="nurse-filter-header">
          <div class="nurse-filter-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            <span>Filter Jobs</span>
          </div>
          ${hasActiveFilters ? `<a href="/category/${categoryCleanSlug}" class="nurse-filter-reset-link">Reset All</a>` : ''}
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
            return `<a class="nurse-filter-row${isSelected ? ' active' : ''}" href="/category/${categoryCleanSlug}?${params}">
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
            return `<a class="nurse-filter-row${isSelected ? ' active' : ''}" href="/category/${categoryCleanSlug}?${params}">
              <span class="nurse-row-label">
                <span class="nurse-custom-cb">${iconCheckTick}</span>
                <span class="nurse-filter-name">${escapeAttr(x.name)}</span>
              </span>
              ${countText ? `<span class="nurse-filter-count">${countText}</span>` : ''}
            </a>`;
          }).join('')}
        </div>

        <div class="nurse-filter-group other-categories-group">
          <h3>Other Top Categories</h3>
          <div class="other-categories-list">
            ${otherCats.map(c => `
              <a class="other-category-link" href="/category/${slugifyCategory(c)}">
                <span class="other-cat-name">${escapeAttr(c.name)}</span>
                <span class="other-cat-count">${Number(c.count || 0).toLocaleString()}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </aside>

      <section class="nurse-results-main">
        <div class="nurse-results-tools">
          <div class="nurse-tools-top">
            <span class="nurse-tools-count">Showing <b>${start} – ${end}</b> of <b>${Number(total).toLocaleString()}</b> ${escapeAttr(categoryName)} Jobs</span>
            <div class="nurse-tools-actions">
              <select class="nurse-sort-select" aria-label="Sort listings">
                <option>Most Relevant</option>
                <option>Newest First</option>
              </select>
              <button type="button" class="nurse-alert-trigger">${iconBell} Alert Me</button>
            </div>
          </div>
          ${(selectedLoc || selectedType || qQuery) ? `
            <div class="nurse-active-chips-bar">
              <span class="nurse-active-label">Active filters:</span>
              ${qQuery ? `<span class="nurse-active-chip">Keyword: "${escapeAttr(qQuery)}" <a href="/category/${categoryCleanSlug}?${(() => { const p = new URLSearchParams(queryParams); p.delete('q'); p.delete('page'); return p.toString(); })()}" title="Remove keyword">×</a></span>` : ''}
              ${selectedLoc ? `<span class="nurse-active-chip">${escapeAttr(selectedLoc)} <a href="/category/${categoryCleanSlug}?${removeLocParams}" title="Remove filter">×</a></span>` : ''}
              ${selectedType ? `<span class="nurse-active-chip">${escapeAttr(selectedType)} <a href="/category/${categoryCleanSlug}?${removeTypeParams}" title="Remove filter">×</a></span>` : ''}
              <a href="/category/${categoryCleanSlug}" class="nurse-clear-all-link">Clear all</a>
            </div>
          ` : ''}
        </div>

        <div class="nurse-job-list">
          ${list.length ? list.map((job) => `
            <article class="nurse-job-card">
              <div class="nurse-card-top">
                ${job.logo ? `
                  <div class="nurse-card-logo">
                    <img src="${escapeAttr(job.logo)}" alt="${escapeAttr(job.company)}">
                  </div>
                ` : `
                  <div class="nurse-card-logo-fallback">
                    <span>${escapeAttr(String(job.company || (typeof job.title === 'string' ? job.title : job.title?.rendered) || 'TJ').slice(0, 2).toUpperCase())}</span>
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
                    <span class="comp-name">${escapeAttr(job.company || 'Employer')}</span>
                  </div>
                  <div class="nurse-job-meta-row">
                    <span class="nurse-meta-badge">${iconBriefcase} ${escapeAttr(job.type || 'Full Time')}</span>
                    <span class="nurse-meta-badge">${iconPin} ${escapeAttr(job.location || 'United Arab Emirates')}</span>
                    <span class="nurse-meta-badge">${iconClock} ${escapeAttr(job.date || 'Recently posted')}</span>
                  </div>
                  ${job.excerpt ? `
                    <p class="nurse-job-excerpt">${escapeAttr(job.excerpt)}</p>
                  ` : ''}
                </div>
              </div>
              <div class="nurse-card-footer">
                <div class="nurse-footer-tags">
                  ${(() => {
                    if (!job.category) return '';
                    const primaryCat = String(job.category).split(',')[0].trim();
                    return `<span class="nurse-tag-category">${escapeAttr(primaryCat)}</span>`;
                  })()}
                  <span class="nurse-tag-category">UAE Vacancies</span>
                </div>
                <a href="/job/${escapeAttr(job.slug)}" class="nurse-view-job-btn">View Job <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg></a>
              </div>
            </article>
          `).join('') : `
            <div class="nurse-empty-state">
              <h3>No jobs found matching your criteria</h3>
              <p>Try resetting filters or searching for different keywords within ${escapeAttr(categoryName)}.</p>
              <a href="/category/${categoryCleanSlug}" class="primary" style="display:inline-block;margin-top:12px;padding:10px 20px;border-radius:8px;">Reset Filters</a>
            </div>
          `}
        </div>
        ${pager(`/category/${categoryCleanSlug}`, total, pageLimit)}
      </section>

      <aside class="nurse-side-column">
        <a href="/resume-builder" class="nurse-resume-builder-card" aria-label="Open Trikonet Resume Builder">
          <span class="nurse-resume-builder-badge">FREE TOOL</span>
          <span class="nurse-resume-builder-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></svg>
          </span>
          <span class="nurse-resume-builder-copy">
            <strong>Build your professional résumé</strong>
            <small>Create an ATS-friendly CV for UAE ${escapeAttr(categoryName)} roles.</small>
          </span>
          <span class="nurse-resume-builder-action">Build my résumé <span aria-hidden="true">→</span></span>
        </a>

        <section class="nurse-side-card nurse-articles-card">
          <div class="nurse-side-card-header">
            <h3>Latest Articles</h3>
            <a href="/blog" class="nurse-side-see-all">View all &rarr;</a>
          </div>
          <div class="nurse-side-article-list">
            ${latestArticles.length ? latestArticles.map(article => `
              <a href="${escapeAttr(getPostUrl(article))}" class="nurse-side-article-row">
                <span class="nurse-side-article-image">
                  <img src="${escapeAttr(article.featuredImage || '/assets/article-1.jpg')}" alt="" loading="lazy" onerror="this.onerror=null;this.src='/assets/article-1.jpg'">
                </span>
                <span class="nurse-side-article-copy">
                  <small>${escapeAttr(article.categoryName || 'Career Advice')}</small>
                  <strong>${escapeAttr(article.title)}</strong>
                  ${article.date ? `<time>${escapeAttr(article.date)}</time>` : ''}
                </span>
              </a>
            `).join('') : `<p class="nurse-side-article-empty">Published articles will appear here.</p>`}
          </div>
        </section>

        <section class="nurse-side-card nurse-alert-card">
          <div class="nurse-alert-card-top">
            <div class="nurse-alert-badge-icon">${iconBell}</div>
            <div>
              <h4>${escapeAttr(categoryName)} Job Alerts</h4>
              <p>Get newly posted ${escapeAttr(categoryName)} vacancies delivered to your inbox.</p>
            </div>
          </div>
          <form class="nurse-side-alert-form" action="/alerts-jobs" onsubmit="event.preventDefault(); alert('Subscribed to job alerts!');">
            <input type="email" placeholder="Enter your email address..." class="nurse-side-email-input" required>
            <button type="submit" class="nurse-side-alert-btn">Subscribe Free</button>
          </form>
        </section>

        <section class="nurse-side-card">
          <div class="nurse-side-card-header">
            <h3>Share Jobs</h3>
          </div>
          <p class="nurse-side-share-txt">Know someone looking for a ${escapeAttr(categoryName)} job in the UAE?</p>
          <div class="nurse-side-share-btns">
            <a href="https://www.linkedin.com/company/trikonet-team" target="_blank" rel="noopener noreferrer nofollow" class="nurse-share-pill" aria-label="Share on LinkedIn">${iconShareLinkedin} LinkedIn</a>
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(`${categoryName} Jobs in UAE: https://www.trikonet.com/category/${categoryCleanSlug}`)}" target="_blank" rel="noopener noreferrer nofollow" class="nurse-share-pill" aria-label="Share on WhatsApp">${iconShareWa} WhatsApp</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.trikonet.com/category/${categoryCleanSlug}`)}" target="_blank" rel="noopener noreferrer nofollow" class="nurse-share-pill" aria-label="Share on Facebook">${iconShareFb} Facebook</a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.trikonet.com/category/${categoryCleanSlug}`)}" target="_blank" rel="noopener noreferrer nofollow" class="nurse-share-pill" aria-label="Share on X">${iconShareX} X</a>
          </div>
        </section>
      </aside>
    </section>
  </main>`;
}
function employers() {
  const employersList = (data.employers || []);
  const total = data.counts.employer ?? employersList.length;
  const start = total ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(start + employersList.length - 1, total);
  
  const q = queryParams.get('q') || '';
  const selectedLocation = queryParams.get('location') || '';
  const selectedCategory = queryParams.get('category') || '';
  const selectedMinJobs = queryParams.get('min_jobs') || '';
  const sort = queryParams.get('sort') || 'default';

  let list = [...employersList];
  if (sort === 'jobs') {
    list.sort((a, b) => (b.openJobs || 0) - (a.openJobs || 0));
  } else if (sort === 'az') {
    list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } else if (sort === 'za') {
    list.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
  }

  const catCountMap = new Map((data.taxonomies?.employerCategories || []).map(c => [c.name.toLowerCase(), Number(c.count)]));
  const getCatCount = (name, fallback) => {
    const val = catCountMap.get(name.toLowerCase());
    return (val !== undefined && val !== null && !isNaN(val)) ? val : fallback;
  };

  const locCountMap = new Map((data.taxonomies?.employerLocations || []).map(l => [l.name.toLowerCase(), Number(l.count)]));
  const getLocCount = (name, fallback) => {
    const val = locCountMap.get(name.toLowerCase());
    return (val !== undefined && val !== null && !isNaN(val)) ? val : fallback;
  };

  const topStripCategories = [
    { title: 'Healthcare', subtitle: `${getCatCount('Healthcare', 271)} Companies`, qParam: 'Healthcare' },
    { title: 'Hospitals & Clinics', subtitle: `${getCatCount('Hospital', 107)} Companies`, qParam: 'Hospital' },
    { title: 'IT & Technology', subtitle: `${getCatCount('Information Technology', 63)} Companies`, qParam: 'Information Technology' },
    { title: 'Education', subtitle: `${getCatCount('Educational Services', 339)} Companies`, qParam: 'Educational Services' },
    { title: 'Banking & Finance', subtitle: `${getCatCount('Banking', 33) + getCatCount('Finance and Insurance', 83)} Companies`, qParam: 'Banking' },
    { title: 'Hospitality', subtitle: `${getCatCount('Hospitality', 103)} Companies`, qParam: 'Hospitality' },
    { title: 'Real Estate', subtitle: `${getCatCount('Real Estate', 392)} Companies`, qParam: 'Real Estate' },
    { title: 'Construction', subtitle: `${getCatCount('Construction', 113)} Companies`, qParam: 'Construction' },
    { title: 'Retail & Commerce', subtitle: `${getCatCount('Retail', 92)} Companies`, qParam: 'Retail' }
  ];

  const buildFilterUrl = (overrides = {}) => {
    const params = new URLSearchParams(queryParams);
    params.delete('page');
    for (const [key, value] of Object.entries(overrides)) {
      if (value === null || value === '' || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const qs = params.toString();
    return `/employers${qs ? `?${qs}` : ''}`;
  };

  const hasActiveFilters = Boolean(q || selectedLocation || selectedCategory || selectedMinJobs);

  const sidebarCategoryKeys = [
    { name: 'Healthcare', fallback: 271 },
    { name: 'Hospital', fallback: 107 },
    { name: 'Educational Services', fallback: 339 },
    { name: 'Information Technology', fallback: 63 },
    { name: 'Banking', fallback: 33 },
    { name: 'Finance and Insurance', fallback: 83 },
    { name: 'Hospitality', fallback: 103 },
    { name: 'Real Estate', fallback: 392 },
    { name: 'Construction', fallback: 113 },
    { name: 'Manufacturing', fallback: 112 },
    { name: 'Retail', fallback: 92 },
    { name: 'Accounting', fallback: 78 },
    { name: 'Business Consulting and Services', fallback: 70 },
    { name: 'Other Services', fallback: 130 }
  ];

  const sidebarCategories = sidebarCategoryKeys.map(cat => ({
    name: cat.name,
    count: Number(getCatCount(cat.name, cat.fallback)).toLocaleString()
  }));

  const sidebarLocationKeys = [
    { name: 'Dubai', fallback: 1680 },
    { name: 'United Arab Emirates', fallback: 655 },
    { name: 'Abu Dhabi', fallback: 450 },
    { name: 'Sharjah', fallback: 122 },
    { name: 'Ajman', fallback: 62 },
    { name: 'Ras Al Khaimah', fallback: 37 },
    { name: 'Al Ain', fallback: 20 },
    { name: 'Fujairah', fallback: 18 },
    { name: 'Umm Al Quwain', fallback: 10 }
  ];

  const sidebarLocations = sidebarLocationKeys.map(loc => ({
    name: loc.name,
    count: Number(getLocCount(loc.name, loc.fallback)).toLocaleString()
  }));

  const vacancyFilters = [
    { label: 'All Companies', value: '' },
    { label: 'Actively Hiring (1+ jobs)', value: '1' },
    { label: 'High Hiring (5+ jobs)', value: '5' },
    { label: 'Mass Hiring (10+ jobs)', value: '10' }
  ];

  const getEmpRating = employer => {
    const explicitReviews = Number(employer?.reviewCount || employer?.metas?._employer_review_count || 0);
    const explicitRating = Number(employer?.rating || employer?.metas?._employer_rating || 0);
    if (explicitReviews > 0 && explicitRating > 0) {
      return { rating: explicitRating.toFixed(1), reviews: explicitReviews };
    }
    try {
      const stored = JSON.parse(localStorage.getItem(`trikonet_emp_reviews_${employer?.slug || ''}`) || '[]');
      if (!Array.isArray(stored) || stored.length === 0) return null;
      const valid = stored.filter(review => Number(review?.ratingScore) > 0);
      if (valid.length === 0) return null;
      const average = valid.reduce((sum, review) => sum + Number(review.ratingScore), 0) / valid.length;
      return { rating: average.toFixed(1), reviews: valid.length };
    } catch {
      return null;
    }
  };

  return `<main class="emp-directory-page">
    <div class="wrap">
      <!-- Top Strip: Top companies hiring now (Trikonet Signature Crimson Red Branding) -->
      <section class="emp-top-hiring-strip" aria-label="Top companies hiring now">
        <div class="emp-top-hiring-head">
          <span class="emp-top-eyebrow">EXPLORE BY INDUSTRY</span>
          <h2>Top companies hiring now</h2>
        </div>
        <div class="emp-top-hiring-wrap">
          <button type="button" class="emp-top-arrow-btn prev" id="empTopPrevBtn" aria-label="Scroll to previous categories">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div class="emp-top-hiring-track" id="empTopHiringTrack">
            ${topStripCategories.map(cat => {
              const isActive = selectedCategory.toLowerCase() === cat.qParam.toLowerCase();
              return `<a href="${buildFilterUrl({ category: isActive ? null : cat.qParam })}" class="emp-top-hiring-card${isActive ? ' active' : ''}">
                <strong>${escapeAttr(cat.title)}</strong>
                <span class="emp-top-count">${cat.subtitle} <span class="arrow">›</span></span>
              </a>`;
            }).join('')}
          </div>
          <button type="button" class="emp-top-arrow-btn" id="empTopNextBtn" aria-label="Scroll next categories">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </section>

      <section class="emp-directory-search" aria-label="Search companies">
        <div class="emp-directory-search-copy">
          <strong>Find a company</strong>
          <span>Search by company name, industry, or location</span>
        </div>
        <form class="emp-search-form emp-search-form-prominent" action="/employers" method="GET" onsubmit="event.preventDefault(); const val=this.q.value.trim(); location.href='${buildFilterUrl({ q: null })}'+(val?('${buildFilterUrl({ q: null })}'.includes('?')?'&':'?')+'q='+encodeURIComponent(val):'');">
          <div class="emp-search-input-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="search" name="q" value="${escapeAttr(q)}" placeholder="Search companies…" aria-label="Search companies">
          </div>
          <button type="submit" class="emp-directory-search-btn">
            <span>Search</span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </form>
      </section>

      <!-- Main Layout: Sidebar Filters + Right Listings -->
      <div class="emp-main-layout">
        <!-- Left Filters Sidebar -->
        <aside class="emp-filters-sidebar">
          <div class="emp-filters-head">
            <h3>All Filters</h3>
            ${hasActiveFilters ? `<a href="/employers" class="emp-clear-all">Clear All</a>` : ''}
          </div>

          <button type="button" class="emp-mobile-filter-toggle" id="empMobileFilterToggle" aria-expanded="false" aria-controls="empExpandableFilters">
            <span>Show filters</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>

          <div class="emp-expandable-filters" id="empExpandableFilters">

          <!-- Company Type / Industry Filter Group -->
          <div class="emp-filter-group">
            <h4>
              <span>Company Type</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </h4>
            <div class="emp-filter-list">
              ${sidebarCategories.map(cat => {
                const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                return `<a href="${buildFilterUrl({ category: isActive ? null : cat.name })}" class="emp-filter-row${isActive ? ' active' : ''}">
                  <span class="emp-checkbox${isActive ? ' checked' : ''}">${isActive ? `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : ''}</span>
                  <span class="label">${escapeAttr(cat.name)}</span>
                  <span class="count">(${cat.count})</span>
                </a>`;
              }).join('')}
            </div>
          </div>

          <!-- Location Filter Group -->
          <div class="emp-filter-group">
            <h4>
              <span>Location</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </h4>
            <div class="emp-filter-list">
              ${sidebarLocations.map(loc => {
                const isActive = selectedLocation.toLowerCase() === loc.name.toLowerCase();
                return `<a href="${buildFilterUrl({ location: isActive ? null : loc.name })}" class="emp-filter-row${isActive ? ' active' : ''}">
                  <span class="emp-checkbox${isActive ? ' checked' : ''}">${isActive ? `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : ''}</span>
                  <span class="label">${escapeAttr(loc.name)}</span>
                  <span class="count">(${loc.count})</span>
                </a>`;
              }).join('')}
            </div>
          </div>

          <!-- Open Vacancies Group -->
          <div class="emp-filter-group">
            <h4>
              <span>Open Vacancies</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </h4>
            <div class="emp-filter-list">
              ${vacancyFilters.map(v => {
                const isActive = selectedMinJobs === v.value;
                return `<a href="${buildFilterUrl({ min_jobs: isActive ? null : (v.value || null) })}" class="emp-filter-row${isActive ? ' active' : ''}">
                  <span class="emp-checkbox${isActive ? ' checked' : ''}">${isActive ? `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : ''}</span>
                  <span class="label">${escapeAttr(v.label)}</span>
                </a>`;
              }).join('')}
            </div>
          </div>
          </div>
        </aside>

        <!-- Right Column: Listing Pane -->
        <section class="emp-listing-pane" aria-label="Company Listings">
          <div class="emp-listing-top">
            <div class="emp-results-count">
              ${total > 0 ? `Showing <strong class="emp-count-highlight">${start} – ${end}</strong> of <strong class="emp-count-highlight">${total.toLocaleString()}</strong> companies` : 'No companies found matching your filters'}
            </div>
            <div class="emp-listing-sorts">
              <select onchange="window.location.href=this.value" aria-label="Sort Companies">
                <option value="${buildFilterUrl({ sort: null })}"${sort === 'default' ? ' selected' : ''}>Sort by: Recommended</option>
                <option value="${buildFilterUrl({ sort: 'jobs' })}"${sort === 'jobs' ? ' selected' : ''}>Most Open Jobs</option>
                <option value="${buildFilterUrl({ sort: 'az' })}"${sort === 'az' ? ' selected' : ''}>Company Name (A - Z)</option>
                <option value="${buildFilterUrl({ sort: 'za' })}"${sort === 'za' ? ' selected' : ''}>Company Name (Z - A)</option>
              </select>
            </div>
          </div>

          <!-- 2-Column Naukri Cards Grid -->
          <div class="emp-naukri-grid">
            ${list.length > 0 ? list.map(e => {
              const displayTitle = decodeHtml(e.title || '');
              const initials = displayTitle.split(/\s+/).map(x => x[0]).join('').slice(0, 3).toUpperCase() || 'CO';
              const reviewData = getEmpRating(e);
              const primaryCat = decodeHtml((e.categories && e.categories[0]) || 'Corporate');
              const primaryLoc = decodeHtml((e.locations && e.locations[0]) || '');
              const openJobs = e.openJobs || 0;

              return `<a href="/employer/${e.slug}" class="emp-naukri-card">
                <div class="emp-naukri-logo">
                  ${e.logo ? `<img src="${e.logo}" alt="${escapeAttr(displayTitle)}" loading="lazy">` : `<div class="emp-naukri-fallback">${initials}</div>`}
                </div>
                <div class="emp-naukri-info">
                  <h3 class="emp-naukri-title" title="${escapeAttr(displayTitle)}">${escapeAttr(displayTitle)}</h3>
                  <div class="emp-naukri-meta">
                    ${reviewData ? `<span class="emp-rating-pill">★ ${reviewData.rating}</span><span class="emp-meta-divider">|</span><span class="emp-reviews-count">${reviewData.reviews} ${reviewData.reviews === 1 ? 'review' : 'reviews'}</span>` : ''}
                    <span class="emp-jobs-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg> ${openJobs} ${openJobs === 1 ? 'Job' : 'Jobs'} Hiring</span>
                  </div>
                  <div class="emp-naukri-tags">
                    <span class="emp-pill-tag">${escapeAttr(primaryCat)}</span>
                    ${primaryLoc ? `<span class="emp-pill-tag loc"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z"></path><circle cx="12" cy="9" r="2.5"></circle></svg>${escapeAttr(primaryLoc)}</span>` : ''}
                  </div>
                </div>
                <div class="emp-naukri-arrow" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </a>`;
            }).join('') : `
              <div class="emp-empty-card">
                <h3>No companies found</h3>
                <p>Try adjusting your search keywords, location or company type filters.</p>
                <div style="margin-top: 16px;">
                  <a href="/employers" class="primary" style="display:inline-block; padding:8px 20px; border-radius:10px; background:#b00008; color:#fff; text-decoration:none; font-weight:600; font-size:13.5px;">View All Companies</a>
                </div>
              </div>
            `}
          </div>

          <!-- Pagination -->
          ${pager('/employers', total)}
        </section>
      </div>
    </div>
  </main>`;
}
function about(){return `<main><section class="subhero"><h1>About Us</h1></section><article class="content"><h1>Welcome to Trikonet!</h1><p>${data.pages.about.content}</p><p>Founded by two passionate friends, our journey started with Medbiomate, a successful venture focused on healthcare jobs in the GCC region. Inspired by our early success, we realized the vast potential and growing demand for diverse job opportunities across industries.</p><h2>Your Dream Jobs Are Waiting</h2><p>Our mission is to connect talent with the right opportunities, helping job seekers discover and achieve their career dreams.</p><h2>How We Work</h2><p>We source trusted opportunities, assess job quality and collaborate with companies before showcasing verified roles to job seekers.</p></article></main>`}
function blog() {
  const initialQ = queryParams.get('q') || '';
  const initialCat = queryParams.get('category') || 'All';
  const initialSort = queryParams.get('sort') || 'recent';

  const categories = [
    'All',
    'Interview Tips',
    'Interview Questions',
    'Resume & ATS',
    'Visa & Labour Laws',
    'Career Advice',
    'Health & Wellness'
  ];

  return `
  <main class="blog-directory-page">
    <div class="wrap">
      <!-- Blue Gradient Banner Matching User Screenshot -->
      <section class="blog-banner-strip" aria-label="Career Tips Banner">
        <div class="blog-banner-info">
          <h1>Career Tips</h1>
          <p>Read from these articles curated specially for your job journey</p>
        </div>
        <div class="blog-banner-search">
          <form class="blog-search-pill" id="blogSearchForm" action="/blog" onsubmit="event.preventDefault(); if(window.applyBlogFilters) window.applyBlogFilters();">
            <span class="blog-search-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input type="search" id="blogSearchInput" name="q" value="${escapeAttr(initialQ)}" placeholder="Search for articles here..." aria-label="Search for articles">
            <button type="submit" class="blog-search-submit" id="blogSearchBtn">Search Articles</button>
          </form>
        </div>
      </section>

      <!-- Category Filter Tabs & Sort Controls -->
      <div class="blog-controls-bar">
        <div class="blog-cat-tabs" id="blogCatTabs" role="tablist" aria-label="Article categories">
          ${categories.map(cat => `
            <button type="button" class="blog-cat-tab ${cat === initialCat ? 'active' : ''}" data-cat="${escapeAttr(cat)}" role="tab" aria-selected="${cat === initialCat ? 'true' : 'false'}">
              ${cat === 'All' ? 'All Articles' : escapeAttr(cat)}
            </button>
          `).join('')}
        </div>
        <div class="blog-sort-wrap">
          <label for="blogSortSelect">Sort by:</label>
          <select id="blogSortSelect" aria-label="Sort articles">
            <option value="recent" ${initialSort === 'recent' ? 'selected' : ''}>Most Recent</option>
            <option value="oldest" ${initialSort === 'oldest' ? 'selected' : ''}>Oldest</option>
            <option value="az" ${initialSort === 'az' ? 'selected' : ''}>Title (A - Z)</option>
            <option value="za" ${initialSort === 'za' ? 'selected' : ''}>Title (Z - A)</option>
          </select>
        </div>
      </div>

      <!-- Results Meta Information -->
      <div class="blog-results-meta" id="blogResultsMeta" aria-live="polite">
        Showing all articles
      </div>

      <!-- Articles Grid -->
      <div class="blog-grid" id="blogArticlesGrid">
        <!-- Rendered dynamically by initBlogDirectory() -->
      </div>
    </div>
  </main>`;
}

function initBlogDirectory() {
  if (path !== '/blog') return;

  const searchInput = document.getElementById('blogSearchInput');
  const catTabs = document.querySelectorAll('.blog-cat-tab');
  const sortSelect = document.getElementById('blogSortSelect');
  const grid = document.getElementById('blogArticlesGrid');
  const meta = document.getElementById('blogResultsMeta');

  if (!grid) return;

  let currentCategory = queryParams.get('category') || 'All';
  let currentSearch = (searchInput ? searchInput.value : '') || queryParams.get('q') || '';
  let currentSort = (sortSelect ? sortSelect.value : '') || queryParams.get('sort') || 'recent';

  function renderArticles() {
    let posts = [...(data.posts || [])];

    // Filter by category
    if (currentCategory && currentCategory !== 'All') {
      posts = posts.filter(p => (p.categoryName || '').toLowerCase() === currentCategory.toLowerCase());
    }

    // Filter by search query
    const q = (currentSearch || '').trim().toLowerCase();
    if (q) {
      posts = posts.filter(p => {
        const title = (p.title || '').toLowerCase();
        const excerpt = (p.excerpt || '').toLowerCase();
        const cat = (p.categoryName || '').toLowerCase();
        return title.includes(q) || excerpt.includes(q) || cat.includes(q);
      });
    }

    // Sort articles
    if (currentSort === 'recent') {
      posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } else if (currentSort === 'oldest') {
      posts.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    } else if (currentSort === 'az') {
      posts.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (currentSort === 'za') {
      posts.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    }

    // Update meta text
    if (meta) {
      const catLabel = currentCategory === 'All' ? 'articles' : `articles in "${escapeAttr(currentCategory)}"`;
      const queryLabel = q ? ` matching "${escapeAttr(q)}"` : '';
      meta.innerHTML = `Showing <strong>${posts.length}</strong> ${catLabel}${queryLabel}`;
    }

    // Empty state
    if (!posts.length) {
      grid.innerHTML = `
        <div class="blog-empty-state">
          <div class="bes-icon">🔍</div>
          <h3>No articles found</h3>
          <p>We couldn't find any articles matching your search criteria. Try a different keyword or category.</p>
        </div>
      `;
      return;
    }

    // Render cards
    grid.innerHTML = posts.map((p, idx) => {
      const cover = p.featuredImage || `/assets/article-${(idx % 3) + 1}.jpg`;
      const postUrl = getPostUrl(p);
      const catBadge = p.categoryName || 'Career Advice';
      return `
        <article class="blog-card" data-slug="${escapeAttr(p.slug)}">
          <a class="blog-card-media" href="${postUrl}" aria-label="${escapeAttr(p.title)}">
            <img src="${escapeAttr(cover)}" alt="${escapeAttr(p.title)}" loading="lazy" onerror="this.onerror=null;this.src='/assets/article-${(idx % 3) + 1}.jpg';">
            <span class="blog-card-cat-badge">${escapeAttr(catBadge)}</span>
          </a>
          <div class="article-body">
            <small class="blog-card-date">${escapeAttr(p.date || '')}</small>
            <h3><a href="${postUrl}">${p.title}</a></h3>
            <p>${escapeAttr(p.excerpt || '').slice(0, 140)}${p.excerpt && p.excerpt.length > 140 ? '...' : ''}</p>
            <a class="read" href="${postUrl}">Read Article <span aria-hidden="true">&rsaquo;</span></a>
          </div>
        </article>
      `;
    }).join('');
  }

  // Category tab clicking
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentCategory = tab.dataset.cat || 'All';
      renderArticles();
    });
  });

  // Search input live typing & debounce
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearch = searchInput.value;
        renderArticles();
      }, 150);
    });
  }

  // Sort dropdown change
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      renderArticles();
    });
  }

  window.applyBlogFilters = function() {
    if (searchInput) currentSearch = searchInput.value;
    renderArticles();
  };

  // Initial render
  renderArticles();
}
function ensureTocTitles(html=''){
  return String(html).replace(/(<div\b[^>]*class=["'][^"']*wp-block-rank-math-toc-block[^"']*["'][^>]*>)(\s*)(<nav\b)/gi,(match,open,space,nav)=>`${open}${space}<h2 class="toc-title">Table of Contents</h2>${space}${nav}`);
}
function estimateReadingTime(text=''){const words=String(text).replace(/<[^>]+>/g,' ').trim().split(/\s+/).filter(Boolean).length;return Math.max(1,Math.round(words/200))||3}
function post(p){
  const content=ensureTocTitles(p.content||`<p>${p.excerpt}</p>`);
  const featured=p.featuredImage?`<figure class="post-featured-image"><img src="${escapeAttr(p.featuredImage)}" alt="${escapeAttr(p.title)}"></figure>`:'';
  const prefix = p.urlPrefix || p.url_prefix || POST_SLUG_PREFIXES[p.slug] || 'blog';
  const categoryName=p.categoryName||CATEGORY_PREFIX_LABELS[prefix]||(p.category!=='blog'?p.category:'Career Advice');
  const catHref = `/${prefix}`;
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
        <h1 class="post-headline">${escapeAttr(p.title)}</h1>
        <nav class="post-breadcrumbs" aria-label="Breadcrumbs">
          <a href="/">Trikonet</a>
          <span class="bc-sep">&gt;</span>
          <a href="/blog">Blogs</a>
          ${categoryName ? `<span class="bc-sep">&gt;</span><a href="${catHref}">${escapeAttr(categoryName)}</a>` : ''}
          <span class="bc-sep">&gt;</span>
          <span class="bc-current">${escapeAttr(p.title)}</span>
        </nav>
      </div>
    </section>
    <article class="content post-article-content">
      <div class="post-header-meta">
        <div class="post-meta-badges">
          <a href="${catHref}" class="post-cat-badge" style="text-decoration:none;">${escapeAttr(categoryName)}</a>
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
            <a href="${getPostUrl(rp)}" class="related-article-card">
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
  return `<main class="detail-page"><section class="detail-hero"><div class="wrap detail-hero-inner">${logo?`<img class="detail-logo" src="${escapeAttr(logo)}" alt="${escapeAttr(company)}">`:''}<div class="detail-title"><h1>${escapeAttr(title)}</h1><div class="detail-meta">${categories?`<span>▣ &nbsp;${escapeAttr(categories)}</span>`:''}${location?`<span>⌖ &nbsp;${escapeAttr(location)}</span>`:''}${date?`<span>◷ &nbsp;${escapeAttr(date)}</span>`:''}</div>${type?`<span class="tag">${escapeAttr(type)}</span>`:''}</div><div class="detail-actions"><a class="primary apply" href="${escapeAttr(m._job_apply_url||j?.applyUrl||'#')}" target="_blank" rel="noopener noreferrer nofollow">Apply Now</a></div></div></section><div class="wrap detail-grid"><article class="job-description"><h2>▣ Job Description</h2><div class="wordpress-content">${content}</div></article><aside><div class="overview"><h2>Job Overview</h2><dl>${date?`<dt>▣</dt><dd><b>Date Posted</b><span>${escapeAttr(date)}</span></dd>`:''}${location?`<dt>⌖</dt><dd><b>Location</b><span>${escapeAttr(location)}</span></dd>`:''}</dl></div></aside></div></main>`;
}
function employerDetail(e){
  const m=e?.metas||{},title=e?.title?.rendered||e?.title||'Employer',logo=m._employer_logo||e?.logo||'',category=m._employer_category?Object.values(m._employer_category).join(', '):e?.category||'Company',location=m._employer_location?Object.values(m._employer_location).join(', '):e?.location||'',content=e?.content?.rendered||e?.content||'<p>Company information will appear here.</p>';
  return `<main class="detail-page"><section class="detail-hero employer-hero"><div class="wrap detail-hero-inner">${logo?`<img class="detail-logo" src="${escapeAttr(logo)}" alt="${escapeAttr(title)}">`:''}<div class="detail-title"><h1>${escapeAttr(title)}</h1><div class="detail-meta"><span>▣ &nbsp;${escapeAttr(category)}</span>${location?`<span>⌖ &nbsp;${escapeAttr(location)}</span>`:''}</div><span class="tag">Open Jobs</span></div></div></section><div class="wrap detail-grid employer-detail-grid"><article class="job-description"><h2>About Company</h2><div class="wordpress-content">${content}</div></article></div></main>`;
}
function decodeHtml(value) {
  if (!value) return '';
  let str = String(value);
  for (let i = 0; i < 3; i++) {
    if (!str.includes('&')) break;
    const box = document.createElement('textarea');
    box.innerHTML = str;
    str = box.value;
  }
  return str;
}
function faq(){return `<main><section class="subhero"><h1>FAQ</h1></section><div class="content faq"><h2>History Of Trikonet</h2>${[['Who is Trikonet?','Trikonet is a job platform connecting job seekers with employment opportunities in the UAE and other Middle Eastern countries.'],['How The Trikonet Started?','Trikonet was founded after the success of Medbiomate highlighted the need for a broader job platform.'],['How are Trikonet and Medbiomate connected?','Both platforms share founders and a commitment to connecting qualified candidates with trusted opportunities.']].map(x=>`<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join('')}</div></main>`}
function contact(){return `<main><section class="subhero"><h1>Contact Us</h1></section><div class="content contact-grid"><div><h2>Get in touch</h2><p>Questions about jobs, employers or your Trikonet account? Send us a message.</p><p><b>Email</b><br>info@trikonet.com</p></div><form class="form-card" id="contact"><label>Name<input required></label><label>Email<input type="email" required></label><label>Message<textarea required></textarea></label><button class="primary">Send Message</button></form></div></main>`}
function employerSignupComingSoon(){return `<main class="employer-coming-soon"><section class="employer-coming-card"><div class="employer-coming-icon" aria-hidden="true">🏢</div><span class="employer-coming-eyebrow">FOR EMPLOYERS</span><h1>Employer job posting is coming soon</h1><p>Employer registration and job posting are not open yet. We are preparing the employer portal and will launch it shortly.</p><div class="employer-coming-actions"><a class="employer-coming-primary" href="/jobs">Browse Jobs</a><a class="employer-coming-secondary" href="/contact">Contact Us</a></div><small>Thank you for your interest in hiring through Trikonet.</small></section></main>`}
function generic(){const title=path.split('/').filter(Boolean).map(s=>s.replaceAll('-',' ')).join(' / ')||'Trikonet';return `<main><section class="subhero"><h1>${title.replace(/\b\w/g,c=>c.toUpperCase())}</h1></section><div class="content"><p>This page keeps the existing Trikonet URL available in the local migration. Its content can be edited in the CMS.</p><a class="primary" href="/jobs">Browse Jobs</a></div></main>`}
const CANDIDATE_QUALIFICATION_LEVELS = [
  "Doctorate / PhD",
  "Master's / Post Graduate Degree (PG)",
  "Post Graduate Diploma (PGD)",
  "Bachelor's Degree (UG)",
  "Fellowship / Super Specialty",
  "Board Certification / Residency",
  "Diploma / Advanced Diploma",
  "High School / Secondary",
  "Other Qualification"
];

const CANDIDATE_DEGREE_GROUPS = [
  {
    group: 'Computer Science, IT & Software',
    options: [
      'BTech / BE Computer Science',
      'BSc Information Technology (IT)',
      'BCA / MCA (Computer Applications)',
      'MTech / MS Computer Science',
      'MSc Data Science / Artificial Intelligence',
      'BSc Cybersecurity / Cloud Computing',
      'Diploma in Computer Engineering / IT',
      'Full Stack Software Development Certification'
    ]
  },
  {
    group: 'Business, Management & Finance',
    options: [
      'Bachelor of Commerce (B.Com)',
      'Bachelor of Business Administration (BBA)',
      'MBA (Master of Business Administration)',
      'Master of Commerce (M.Com)',
      'Chartered Accountant (CA / CPA)',
      'ACCA / CMA Certified',
      'BSc Finance & Banking',
      'Master in International Business'
    ]
  },
  {
    group: 'Engineering & Construction',
    options: [
      'BTech / BE Civil Engineering',
      'BTech / BE Mechanical Engineering',
      'BTech / BE Electrical Engineering',
      'BTech / BE Electronics & Communication',
      'Bachelor of Architecture (B.Arch)',
      'MTech / ME in Engineering',
      'Diploma in Engineering (Civil / Mech / Elec)',
      'Quantity Surveying Certification'
    ]
  },
  {
    group: 'Marketing, Media & Design',
    options: [
      'BA in Marketing / Public Relations',
      'BA in Mass Communication & Journalism',
      'BSc Graphic Design / Multimedia',
      'UI/UX Design Certification',
      'Digital Marketing Professional Diploma'
    ]
  },
  {
    group: 'Human Resources & Law',
    options: [
      'MBA in Human Resource Management',
      'Bachelor of Laws (LLB)',
      'Master of Laws (LLM)',
      'Diploma in Human Resources',
      'SHRM / CIPD Human Resources Certification'
    ]
  },
  {
    group: 'Hospitality, Tourism & Aviation',
    options: [
      'BSc Hotel Management & Catering (BHM)',
      'Diploma in Culinary Arts / F&B Operations',
      'Diploma in Aviation & Cabin Crew Training',
      'BSc Tourism & Travel Management'
    ]
  },
  {
    group: 'Education & Academics',
    options: [
      'Bachelor of Education (B.Ed)',
      'Master of Education (M.Ed)',
      'Bachelor of Arts (BA)',
      'Bachelor of Science (BSc)',
      'Master of Arts (MA)',
      'Master of Science (MSc)',
      'TEFL / TESOL Teaching Certification'
    ]
  },
  {
    group: 'Healthcare & Medicine',
    options: [
      'BSc Nursing / GNM',
      'Post Basic BSc Nursing / MSc Nursing',
      'MBBS (Bachelor of Medicine & Surgery)',
      'MD / MS (Medical Specialist)',
      'BDS / MDS (Dental Surgery)',
      'B.Pharm / M.Pharm / PharmD (Pharmacy)',
      'BPT / MPT (Physiotherapy)',
      'BSc Medical Laboratory Technology (MLT)',
      'Certified Medical Coder (CPC / CCS)',
      'BSc Radiography & Medical Imaging'
    ]
  },
  {
    group: 'Doctorate & Advanced Research',
    options: [
      'Doctor of Philosophy (PhD)',
      'Post-Doctoral Research Fellowship',
      'Executive Leadership Certification'
    ]
  }
];

const CANDIDATE_TRACKED_ROLES = [
  // Software & IT
  { role: 'Software Engineer', category: 'Software & IT' },
  { role: 'Frontend Developer', category: 'Software & IT' },
  { role: 'Backend Developer', category: 'Software & IT' },
  { role: 'Full Stack Developer', category: 'Software & IT' },
  { role: 'Mobile App Developer (iOS/Android)', category: 'Software & IT' },
  { role: 'DevOps / Cloud Engineer', category: 'Software & IT' },
  { role: 'Data Analyst / Data Scientist', category: 'Software & IT' },
  { role: 'UI/UX Designer', category: 'Software & IT' },
  { role: 'QA & Automation Test Engineer', category: 'Software & IT' },
  { role: 'Cybersecurity Analyst', category: 'Software & IT' },
  { role: 'IT Support Specialist / System Admin', category: 'Software & IT' },
  { role: 'Technical Product Manager', category: 'Software & IT' },

  // Engineering & Construction
  { role: 'Civil Engineer', category: 'Engineering & Technical' },
  { role: 'Mechanical Engineer', category: 'Engineering & Technical' },
  { role: 'Electrical Engineer', category: 'Engineering & Technical' },
  { role: 'MEP Project Engineer', category: 'Engineering & Technical' },
  { role: 'Site Engineer / Supervisor', category: 'Engineering & Technical' },
  { role: 'Project Manager (Construction)', category: 'Engineering & Technical' },
  { role: 'Architect / Interior Designer', category: 'Engineering & Technical' },
  { role: 'Quantity Surveyor (QS)', category: 'Engineering & Technical' },
  { role: 'HSE Safety Officer / Inspector', category: 'Engineering & Technical' },
  { role: 'Structural Engineer', category: 'Engineering & Technical' },

  // Finance & Accounting
  { role: 'Accountant / General Accountant', category: 'Finance & Accounting' },
  { role: 'Senior Accountant', category: 'Finance & Accounting' },
  { role: 'Finance Manager / CFO', category: 'Finance & Accounting' },
  { role: 'Financial Analyst', category: 'Finance & Accounting' },
  { role: 'Auditor / Tax Consultant (VAT)', category: 'Finance & Accounting' },
  { role: 'Payroll Specialist', category: 'Finance & Accounting' },
  { role: 'Accounts Payable / Receivable Clerk', category: 'Finance & Accounting' },
  { role: 'Credit Controller / Treasury Officer', category: 'Finance & Accounting' },

  // Sales & Marketing
  { role: 'Sales Executive / Business Development', category: 'Sales & Marketing' },
  { role: 'Sales Manager / Director', category: 'Sales & Marketing' },
  { role: 'Digital Marketing Specialist', category: 'Sales & Marketing' },
  { role: 'Social Media & Content Manager', category: 'Sales & Marketing' },
  { role: 'SEO / Performance Marketing Specialist', category: 'Sales & Marketing' },
  { role: 'Brand & Marketing Manager', category: 'Sales & Marketing' },
  { role: 'Public Relations (PR) Executive', category: 'Sales & Marketing' },
  { role: 'Real Estate Consultant / Broker', category: 'Sales & Marketing' },

  // Human Resources & Recruitment
  { role: 'HR Executive / Generalist', category: 'Human Resources (HR)' },
  { role: 'HR Manager / HR Director', category: 'Human Resources (HR)' },
  { role: 'Talent Acquisition / Recruiter', category: 'Human Resources (HR)' },
  { role: 'HR Operations & PRO Specialist', category: 'Human Resources (HR)' },
  { role: 'Training & Development Specialist', category: 'Human Resources (HR)' },
  { role: 'Compensation & Benefits Specialist', category: 'Human Resources (HR)' },

  // Administration & Support
  { role: 'Executive Assistant / Personal Assistant', category: 'Administration & Support' },
  { role: 'Office Administrator / Office Manager', category: 'Administration & Support' },
  { role: 'Receptionist / Front Desk Executive', category: 'Administration & Support' },
  { role: 'Data Entry Operator / Clerk', category: 'Administration & Support' },
  { role: 'Document Controller', category: 'Administration & Support' },
  { role: 'Customer Service Representative', category: 'Customer Service' },
  { role: 'Call Centre Team Leader', category: 'Customer Service' },

  // Hospitality & Catering
  { role: 'Hotel General Manager / Duty Manager', category: 'Hospitality & F&B' },
  { role: 'Front Office Executive / Supervisor', category: 'Hospitality & F&B' },
  { role: 'Executive Chef / Head Chef', category: 'Hospitality & F&B' },
  { role: 'Sous Chef / Line Cook', category: 'Hospitality & F&B' },
  { role: 'Restaurant Manager / F&B Supervisor', category: 'Hospitality & F&B' },
  { role: 'Barista / Bartender', category: 'Hospitality & F&B' },
  { role: 'Waiter / Waitress / Hostess', category: 'Hospitality & F&B' },
  { role: 'Housekeeping Supervisor', category: 'Hospitality & F&B' },

  // Logistics & Supply Chain
  { role: 'Supply Chain Manager', category: 'Logistics & Supply Chain' },
  { role: 'Logistics Coordinator / Specialist', category: 'Logistics & Supply Chain' },
  { role: 'Procurement / Purchasing Officer', category: 'Logistics & Supply Chain' },
  { role: 'Warehouse Supervisor / Manager', category: 'Logistics & Supply Chain' },
  { role: 'Inventory Controller', category: 'Logistics & Supply Chain' },
  { role: 'Fleet / Transport Supervisor', category: 'Logistics & Supply Chain' },

  // Education & Teaching
  { role: 'Primary / Kindergarten Teacher', category: 'Education & Training' },
  { role: 'Secondary / High School Teacher', category: 'Education & Training' },
  { role: 'English / ESL Teacher', category: 'Education & Training' },
  { role: 'Mathematics / Science Teacher', category: 'Education & Training' },
  { role: 'University Lecturer / Professor', category: 'Education & Training' },
  { role: 'Academic Counselor / Special Needs Educator', category: 'Education & Training' },

  // Healthcare & Nursing
  { role: 'Staff Nurse', category: 'Nursing & Clinical' },
  { role: 'Registered Nurse (RN)', category: 'Nursing & Clinical' },
  { role: 'Assistant Nurse', category: 'Nursing & Clinical' },
  { role: 'ICU / Critical Care Nurse', category: 'Nursing & Clinical' },
  { role: 'Emergency (ER) Nurse', category: 'Nursing & Clinical' },
  { role: 'Operating Theatre (OT) Nurse', category: 'Nursing & Clinical' },
  { role: 'Derma / Aesthetic Nurse', category: 'Nursing & Clinical' },
  { role: 'General Practitioner (GP)', category: 'Healthcare & Medical' },
  { role: 'Consultant / Specialist Doctor', category: 'Healthcare & Medical' },
  { role: 'Dentist / Dental Surgeon', category: 'Healthcare & Medical' },
  { role: 'Pharmacist / Clinical Pharmacist', category: 'Healthcare & Medical' },
  { role: 'Medical Coder / Billing Specialist', category: 'Healthcare & Medical' },
  { role: 'Medical Lab Technologist (MLT)', category: 'Healthcare & Medical' },
  { role: 'Physiotherapist', category: 'Healthcare & Medical' },
  { role: 'Radiographer / X-Ray Technologist', category: 'Healthcare & Medical' }
];

const CANDIDATE_INDUSTRIES = [
  'Information Technology & Software',
  'Healthcare & Medical',
  'Hospitality, Tourism & Catering',
  'Finance, Banking & Accounting',
  'Engineering & Construction',
  'Sales, Marketing & Advertising',
  'Human Resources & Recruitment',
  'Logistics, Supply Chain & Aviation',
  'Education & Teaching',
  'Administration & Office Support',
  'Customer Service & Call Centre',
  'Retail & FMCG',
  'Real Estate & Property',
  'Legal & Compliance'
];

const CANDIDATE_CATEGORIES = [
  'Software & IT',
  'Engineering & Technical',
  'Finance & Accounting',
  'Sales & Marketing',
  'Healthcare & Medical',
  'Nursing & Clinical',
  'Human Resources (HR)',
  'Hospitality & F&B',
  'Logistics & Supply Chain',
  'Education & Training',
  'Administration & Support',
  'Customer Service'
];

const CANDIDATE_EXPERIENCES = ['Student / Intern', 'Fresher', '1–3 years', '4–7 years', '8–12 years', '12+ years'];
const CANDIDATE_LICENSES = [
  'No license / General Career',
  'UAE Driving License',
  'AWS / Azure / GCP Cloud Certified',
  'PMP / Agile Scrum Certified',
  'CPA / ACCA / CMA Certified',
  'SHRM / CIPD HR Certified',
  'DHA License (Dubai)',
  'DOH / HAAD License (Abu Dhabi)',
  'MOH License (UAE)',
  'SCFHS License (Saudi Arabia)',
  'Other Professional License'
];
const CANDIDATE_AVAILABILITY = ['Immediately', 'Within 15 days', 'Within 30 days', 'Within 60 days', 'More than 60 days'];
const CANDIDATE_HOSPITAL_TYPES = ['Any Employer Type', 'Private Corporate Company', 'Government / Semi-Government', 'Multinational Corporation (MNC)', 'Hospital / Medical Centre', 'Startup / Tech Agency', 'Retail / Hospitality Chain', 'Educational Institution'];
const CANDIDATE_LOCATIONS = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain'];
const CANDIDATE_COUNTRIES = [
  { name: 'United Arab Emirates', code: 'AE', dial: '+971', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: 'SA', dial: '+966', flag: '🇸🇦' },
  { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
  { name: 'Philippines', code: 'PH', dial: '+63', flag: '🇵🇭' },
  { name: 'Egypt', code: 'EG', dial: '+20', flag: '🇪🇬' },
  { name: 'Pakistan', code: 'PK', dial: '+92', flag: '🇵🇰' },
  { name: 'Jordan', code: 'JO', dial: '+962', flag: '🇯🇴' },
  { name: 'Oman', code: 'OM', dial: '+968', flag: '🇴🇲' },
  { name: 'Qatar', code: 'QA', dial: '+974', flag: '🇶🇦' },
  { name: 'Kuwait', code: 'KW', dial: '+965', flag: '🇰🇼' },
  { name: 'Bahrain', code: 'BH', dial: '+973', flag: '🇧🇭' },
  { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
  { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
  { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
  { name: 'South Africa', code: 'ZA', dial: '+27', flag: '🇿🇦' },
  { name: 'Lebanon', code: 'LB', dial: '+961', flag: '🇱🇧' },
  { name: 'Syria', code: 'SY', dial: '+963', flag: '🇸🇾' },
  { name: 'Sudan', code: 'SD', dial: '+249', flag: '🇸🇩' },
  { name: 'Yemen', code: 'YE', dial: '+967', flag: '🇾🇪' },
  { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
  { name: 'Kenya', code: 'KE', dial: '+254', flag: '🇰🇪' },
  { name: 'Nepal', code: 'NP', dial: '+977', flag: '🇳🇵' },
  { name: 'Sri Lanka', code: 'LK', dial: '+94', flag: '🇱🇰' },
  { name: 'Bangladesh', code: 'BD', dial: '+880', flag: '🇧🇩' },
  { name: 'Germany', code: 'DE', dial: '+49', flag: '🇩🇪' },
  { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
  { name: 'Turkey', code: 'TR', dial: '+90', flag: '🇹🇷' }
];

function calculateCandidateCompletion(p) {
  if (!p || typeof p !== 'object') return 0;
  let score = 0;
  if (p.name?.trim()) score += 5;
  if (p.email?.trim()) score += 5;
  if (p.phone?.trim()) score += 5;
  if (p.nationality?.trim()) score += 5;
  if (p.currentLocation?.trim()) score += 5;
  if (p.industry?.trim()) score += 5;
  if (p.category?.trim()) score += 5;
  if (p.role?.trim()) score += 5;
  if (p.currentDesignation?.trim()) score += 5;
  if (p.experience?.trim()) score += 5;
  if (p.qualification?.trim()) score += 5;
  if (p.degree?.trim()) score += 5;
  if (p.specialization?.trim()) score += 5;
  if ((Array.isArray(p.licenses) && p.licenses.length > 0) || p.licenseStatus?.trim()) score += 5;
  if ((Array.isArray(p.languages) && p.languages.length > 0) || (typeof p.languages === 'string' && p.languages.trim())) score += 5;
  if (p.salaryExpectation?.trim()) score += 5;
  if (p.availability?.trim()) score += 5;
  if (p.noticePeriod?.trim() || p.hospitalType?.trim()) score += 5;
  if (Array.isArray(p.locations) && p.locations.length > 0) score += 5;
  if (p.summary?.trim() || p.photo) score += 5;
  return Math.min(100, Math.max(0, score));
}

function candidateProfileWorkspace(profile) {
  const p = profile || {};
  const currentPhoto = p.photo || currentUser?.avatar || '';
  const initial = escapeAttr((p.name || currentUser?.name || 'U').charAt(0).toUpperCase());
  const completion = typeof currentUser?.completionPercentage === 'number'
    ? currentUser.completionPercentage
    : calculateCandidateCompletion(p);

  const phoneStr = String(p.phone || '').trim();
  const matchedCountry = CANDIDATE_COUNTRIES.find(c => phoneStr.startsWith(c.dial)) || CANDIDATE_COUNTRIES[0];
  const nationalNumber = phoneStr.startsWith(matchedCountry.dial)
    ? phoneStr.slice(matchedCountry.dial.length).trim()
    : phoneStr;

  const currentNationality = CANDIDATE_COUNTRIES.find(c => c.name.toLowerCase() === (p.nationality || '').toLowerCase());
  const selectedLicenses = Array.isArray(p.licenses) ? p.licenses : [];
  const selectedLocations = Array.isArray(p.locations) ? p.locations : [];
  const allStandardDegrees = CANDIDATE_DEGREE_GROUPS.flatMap(g => g.options);
  const isCustomDegree = p.degree && !allStandardDegrees.includes(p.degree);
  const isCustomQual = p.qualification && !CANDIDATE_QUALIFICATION_LEVELS.includes(p.qualification);

  return `<main class="candidate-profile-shell">
    <!-- Top Hero Banner -->
    <section class="candidate-profile-hero">
      <div class="profile-hero-top">
        <div class="profile-hero-user">
          <label class="profile-avatar-wrap" title="Click to upload profile photo">
            ${currentPhoto ? `<img id="candAvatarImg" src="${escapeAttr(currentPhoto)}" alt="Candidate Avatar">` : `<span id="candAvatarInitial" class="profile-avatar-initial">${initial}</span>`}
            <span class="profile-avatar-camera" title="Upload Photo">📷</span>
            <input type="file" id="candPhotoInput" accept="image/*" style="display:none;">
          </label>
          <div class="profile-hero-info">
            <span class="profile-hero-kicker">Candidate Profile & Workspace</span>
            <h1>${escapeAttr(p.name || currentUser?.name || 'Candidate')} <span class="profile-hero-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Verified Candidate</span></h1>
            <div class="profile-hero-meta">
              <span>✉️ ${escapeAttr(p.email || currentUser?.email || '')}</span>
              <span id="heroRoleMeta">💼 ${escapeAttr(p.role || p.currentDesignation || 'Professional')}</span>
              <span id="heroLocationMeta">📍 ${escapeAttr(p.currentLocation || 'UAE')}</span>
            </div>
          </div>
        </div>
        <div class="profile-hero-actions">
          <button type="button" class="profile-btn-primary" id="saveProfileHeroBtn">
            <span>💾</span> Save Changes
          </button>
          <a href="/resume-library" class="profile-btn-secondary" title="Build ATS Resume">
            <span>📄</span> ATS CV Builder
          </a>
          <button type="button" class="profile-btn-secondary profile-btn-signout" id="dashboardLogoutBtn">
            Sign Out
          </button>
        </div>
      </div>
    </section>

    <!-- 2-Column Executive Dashboard -->
    <div class="candidate-dashboard-grid">
      <!-- Main Form Column -->
      <div class="candidate-main-content">
        <!-- Sticky Section Navigation Tabs -->
        <nav class="candidate-section-tabs" id="profileSectionTabs" aria-label="Profile Sections">
          <button type="button" class="tab-pill active" data-target="section-personal"><span>👤</span> Personal</button>
          <button type="button" class="tab-pill" data-target="section-career"><span>💼</span> Career & Role</button>
          <button type="button" class="tab-pill" data-target="section-education"><span>🎓</span> Education & Licenses</button>
          <button type="button" class="tab-pill" data-target="section-preferences"><span>⚙️</span> Preferences & Salary</button>
          <button type="button" class="tab-pill" data-target="section-locations"><span>📍</span> Locations & Bio</button>
        </nav>

        <!-- SECTION 1: Personal & Contact Information -->
        <section class="profile-section-card" id="section-personal">
          <div class="section-head">
            <span class="section-eyebrow">ABOUT YOU</span>
            <h2 class="section-title"><span>👤</span> Personal & Contact Details</h2>
            <p class="section-subtitle">Recruiters and HR coordinators will use these details to contact you directly.</p>
          </div>
      <div class="profile-grid-2">
        <div class="profile-field">
          <label for="candName">Full Name *</label>
          <input type="text" id="candName" value="${escapeAttr(p.name || currentUser?.name || '')}" placeholder="e.g. Sarah Jenkins">
        </div>
        <div class="profile-field">
          <label for="candEmail">Email Address (Registered)</label>
          <input type="email" id="candEmail" value="${escapeAttr(p.email || currentUser?.email || '')}" readonly style="background:#f8fafc;cursor:not-allowed;">
        </div>
        <div class="profile-field">
          <label for="candPhoneNumber">Phone Number *</label>
          <div class="phone-field-wrap">
            <button type="button" class="phone-code-btn" id="phoneCodeBtn" title="Choose country dial code">
              <span id="phoneCodeFlag">${matchedCountry.flag}</span>
              <strong id="phoneCodeDial">${matchedCountry.dial}</strong>
              <small>▼</small>
            </button>
            <input type="tel" id="candPhoneNumber" value="${escapeAttr(nationalNumber)}" placeholder="50 123 4567" style="flex:1;">
          </div>
        </div>
        <div class="profile-field">
          <label>Nationality *</label>
          <button type="button" class="picker-trigger-btn ${p.nationality ? '' : 'empty'}" id="candNationalityBtn">
            <span id="nationalityBtnText">${currentNationality ? `${currentNationality.flag} ${currentNationality.name}` : (p.nationality || 'Select your nationality')}</span>
            <small>▼</small>
          </button>
          <input type="hidden" id="candNationality" value="${escapeAttr(p.nationality || '')}">
        </div>
        <div class="profile-field">
          <label for="candCurrentLocation">Current City and Country *</label>
          <input type="text" id="candCurrentLocation" value="${escapeAttr(p.currentLocation || '')}" placeholder="e.g. Dubai, UAE">
        </div>
        <div class="profile-field">
          <label for="candGender">Gender</label>
          <select id="candGender">
            <option value="">Select gender</option>
            <option value="Female" ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
            <option value="Male" ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
            <option value="Prefer not to say" ${p.gender === 'Prefer not to say' ? 'selected' : ''}>Prefer not to say</option>
          </select>
        </div>
      </div>
    </section>

    <!-- SECTION 2: Career Field & Professional Level -->
    <section class="profile-section-card" id="section-career">
      <div class="section-head">
        <span class="section-eyebrow">YOUR CAREER</span>
        <h2 class="section-title"><span>💼</span> Career Field & Professional Level</h2>
        <p class="section-subtitle">Select your industry discipline, target role, and total experience.</p>
      </div>

      <div class="profile-grid-2 career-compact-selects">
        <div class="profile-field">
          <label for="candIndustry">Industry / Sector *</label>
          <select id="candIndustry">
            ${CANDIDATE_INDUSTRIES.map(item => `<option value="${escapeAttr(item)}" ${(p.industry || 'Information Technology & Software') === item ? 'selected' : ''}>${escapeAttr(item)}</option>`).join('')}
          </select>
        </div>
        <div class="profile-field">
          <label for="candCategory">Job Category *</label>
          <select id="candCategory">
            ${CANDIDATE_CATEGORIES.map(item => `<option value="${escapeAttr(item)}" ${(p.category || 'Software & IT') === item ? 'selected' : ''}>${escapeAttr(item)}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="profile-grid-2" style="margin-bottom:18px;">
        <div class="profile-field">
          <label>Target Job Role *</label>
          <button type="button" class="picker-trigger-btn ${p.role ? '' : 'empty'}" id="candRoleBtn">
            <span id="candRoleBtnText">💼 ${escapeAttr(p.role || 'Select target job role')}</span>
            <small>🔍 Browse</small>
          </button>
          <input type="hidden" id="candRole" value="${escapeAttr(p.role || '')}">
        </div>
        <div class="profile-field">
          <label for="candDesignation">Current / Most Recent Designation *</label>
          <input type="text" id="candDesignation" value="${escapeAttr(p.currentDesignation || p.role || '')}" placeholder="e.g. Senior Software Engineer, Staff Nurse, Project Manager, Accountant">
          ${p.role ? `<button type="button" class="suggestion-chip" id="sameAsRoleChip">✓ Same as role: “${escapeAttr(p.role)}”</button>` : ''}
        </div>
      </div>

      <div class="profile-field">
        <label for="candExperience">Total Professional Experience Level *</label>
        <select id="candExperience">
          ${CANDIDATE_EXPERIENCES.map(item => `<option value="${escapeAttr(item)}" ${(p.experience || '1–3 years') === item ? 'selected' : ''}>${escapeAttr(item)}</option>`).join('')}
        </select>
      </div>
    </section>

    <!-- SECTION 3: Education, Degrees & Credentials -->
    <section class="profile-section-card" id="section-education">
      <div class="section-head">
        <span class="section-eyebrow">CREDENTIALS & EDUCATION</span>
        <h2 class="section-title"><span>🎓</span> Education, Degrees & Qualifications</h2>
        <p class="section-subtitle">Add your academic degrees, certifications, and professional credentials for UAE employers.</p>
      </div>

      <div class="profile-grid-2" style="margin-bottom:18px;">
        <div class="profile-field">
          <label for="candQualification">Highest Qualification Level *</label>
          <select id="candQualification">
            <option value="">Select qualification level</option>
            ${CANDIDATE_QUALIFICATION_LEVELS.map(level => `
              <option value="${escapeAttr(level)}" ${p.qualification === level ? 'selected' : ''}>${escapeAttr(level)}</option>
            `).join('')}
            <option value="Other Qualification" ${isCustomQual ? 'selected' : ''}>Other Qualification</option>
          </select>
          <input type="text" id="candCustomQual" value="${isCustomQual ? escapeAttr(p.qualification) : ''}" placeholder="Enter qualification" style="margin-top:6px;display:${isCustomQual ? 'block' : 'none'};">
        </div>

        <div class="profile-field">
          <label for="candDegreeSelect">Degree / Certification *</label>
          <select id="candDegreeSelect">
            <option value="">Select degree / major</option>
            ${CANDIDATE_DEGREE_GROUPS.map(g => `
              <optgroup label="${escapeAttr(g.group)}">
                ${g.options.map(opt => `
                  <option value="${escapeAttr(opt)}" ${p.degree === opt ? 'selected' : ''}>${escapeAttr(opt)}</option>
                `).join('')}
              </optgroup>
            `).join('')}
            <option value="Other" ${isCustomDegree ? 'selected' : ''}>Other / Custom Degree</option>
          </select>
          <input type="text" id="candCustomDegree" value="${isCustomDegree ? escapeAttr(p.degree) : ''}" placeholder="Enter custom degree (e.g. BSc Computer Science, MBA, MBBS)" style="margin-top:6px;display:${isCustomDegree ? 'block' : 'none'};">
        </div>

        <div class="profile-field">
          <label for="candSpecialization">Specialization / Major / Department</label>
          <input type="text" id="candSpecialization" value="${escapeAttr(p.specialization || '')}" placeholder="e.g. Cloud Computing, Corporate Finance, Civil Engineering, Cardiology">
        </div>

        <div class="profile-field">
          <label for="candUniversity">University / Institute / College</label>
          <input type="text" id="candUniversity" value="${escapeAttr(p.university || '')}" placeholder="e.g. University of Dubai, AUS, Heriot-Watt, Cairo University">
        </div>
      </div>

      <div class="profile-field" style="margin-bottom:18px;">
        <label>Professional Certifications & Licenses (Technical, Medical & Professional)</label>
        <div class="choice-pills-wrap" id="licensePillsWrap">
          ${CANDIDATE_LICENSES.map(item => {
            const isSel = selectedLicenses.includes(item);
            return `
              <button type="button" class="choice-pill ${isSel ? 'selected' : ''}" data-val="${escapeAttr(item)}">
                ${isSel ? '<span class="choice-pill-icon">✓</span>' : ''} ${escapeAttr(item)}
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <div class="profile-grid-2">
        <div class="profile-field">
          <label for="candLicenseStatus">License / Credential Verification Status</label>
          <select id="candLicenseStatus">
            <option value="">Select verification status</option>
            <option value="Active License / Certified" ${p.licenseStatus === 'Active License / Certified' || p.licenseStatus === 'Active License' ? 'selected' : ''}>Active License / Certified</option>
            <option value="Degree Attested (MoFA / UAE)" ${p.licenseStatus === 'Degree Attested (MoFA / UAE)' ? 'selected' : ''}>Degree Attested (MoFA / UAE)</option>
            <option value="Eligibility Letter" ${p.licenseStatus === 'Eligibility Letter' ? 'selected' : ''}>Eligibility Letter (Healthcare)</option>
            <option value="Dataflow Completed" ${p.licenseStatus === 'Dataflow Completed' ? 'selected' : ''}>Dataflow Completed</option>
            <option value="Exam Passed / In Process" ${p.licenseStatus === 'Exam Passed / In Process' || p.licenseStatus === 'Exam Passed' ? 'selected' : ''}>Exam Passed / In Process</option>
            <option value="Not Applicable / General Career" ${p.licenseStatus === 'Not Applicable / General Career' || p.licenseStatus === 'No license yet' ? 'selected' : ''}>Not Applicable / General Career</option>
          </select>
        </div>

        <div class="profile-field">
          <label for="candLanguages">Languages Known</label>
          <input type="text" id="candLanguages" value="${escapeAttr(Array.isArray(p.languages) ? p.languages.join(', ') : (p.languages || 'English'))}" placeholder="e.g. English, Arabic, Hindi, Tagalog, French">
        </div>
      </div>
    </section>

    <!-- SECTION 4: Work Preferences & Availability -->
    <section class="profile-section-card" id="section-preferences">
      <div class="section-head">
        <span class="section-eyebrow">JOB PREFERENCES</span>
        <h2 class="section-title"><span>⚙️</span> Availability & Career Expectations</h2>
        <p class="section-subtitle">Specify your employment status, expected salary, and employer preferences.</p>
      </div>

      <div class="profile-grid-2" style="margin-bottom:18px;">
        <div class="profile-field">
          <label for="candEmployers">Previous / Current Employers</label>
          <input type="text" id="candEmployers" value="${escapeAttr(p.previousEmployers || '')}" placeholder="e.g. Emirates Group, EMAAR, Mediclinic, Etisalat">
        </div>
        <div class="profile-field">
          <label for="candSalary">Expected Monthly Salary</label>
          <input type="text" id="candSalary" value="${escapeAttr(p.salaryExpectation || '')}" placeholder="e.g. AED 12,000 monthly">
        </div>
        <div class="profile-field">
          <label for="candAvailability">Availability to Join</label>
          <select id="candAvailability">
            <option value="">Select availability</option>
            ${CANDIDATE_AVAILABILITY.map(opt => `
              <option value="${escapeAttr(opt)}" ${p.availability === opt ? 'selected' : ''}>${escapeAttr(opt)}</option>
            `).join('')}
          </select>
        </div>
        <div class="profile-field">
          <label for="candNotice">Notice Period</label>
          <input type="text" id="candNotice" value="${escapeAttr(p.noticePeriod || '')}" placeholder="e.g. 30 days, Immediate">
        </div>
        <div class="profile-field">
          <label for="candHospitalType">Preferred Employer Sector / Type</label>
          <select id="candHospitalType">
            <option value="">Select employer type</option>
            ${CANDIDATE_HOSPITAL_TYPES.map(opt => `
              <option value="${escapeAttr(opt)}" ${p.hospitalType === opt ? 'selected' : ''}>${escapeAttr(opt)}</option>
            `).join('')}
          </select>
        </div>
        <div class="profile-field">
          <label for="candVisaStatus">UAE Visa Status</label>
          <select id="candVisaStatus">
            <option value="">Select visa status</option>
            <option value="Employment Visa" ${p.visaStatus === 'Employment Visa' ? 'selected' : ''}>Employment Visa</option>
            <option value="Visit / Tourist Visa" ${p.visaStatus === 'Visit / Tourist Visa' ? 'selected' : ''}>Visit / Tourist Visa</option>
            <option value="Residence / Golden Visa" ${p.visaStatus === 'Residence / Golden Visa' ? 'selected' : ''}>Residence / Golden Visa</option>
            <option value="Citizen / GCC National" ${p.visaStatus === 'Citizen / GCC National' ? 'selected' : ''}>Citizen / GCC National</option>
            <option value="Need Sponsorship" ${p.visaStatus === 'Need Sponsorship' ? 'selected' : ''}>Need Sponsorship</option>
          </select>
        </div>
      </div>
    </section>

    <!-- SECTION 5: Preferred UAE Locations & Bio Summary -->
    <section class="profile-section-card" id="section-locations">
      <div class="section-head">
        <span class="section-eyebrow">LOCATIONS & SUMMARY</span>
        <h2 class="section-title"><span>📍</span> Preferred Work Locations & Summary</h2>
        <p class="section-subtitle">Select your target UAE Emirates to receive personalized job matches.</p>
      </div>

      <div class="profile-field" style="margin-bottom:24px;">
        <div class="location-header-row">
          <div class="location-label-wrap">
            <label style="margin-bottom:0;">Preferred UAE Work Locations</label>
            <span class="location-selected-badge" id="locationSelectedBadge">${selectedLocations.length} selected</span>
          </div>
          <div class="location-quick-actions">
            <button type="button" class="loc-quick-pill" id="locSelectAllBtn">Select All</button>
            <button type="button" class="loc-quick-pill" id="locTopHubsBtn">Dubai & Abu Dhabi</button>
            <button type="button" class="loc-quick-pill" id="locClearBtn">Clear</button>
          </div>
        </div>

        <div class="location-cards-grid" id="locationCardsGrid">
          ${CANDIDATE_LOCATIONS.map(loc => {
            const isSel = selectedLocations.includes(loc);
            return `
              <button type="button" class="location-card-btn ${isSel ? 'selected' : ''}" data-val="${escapeAttr(loc)}">
                <div class="loc-btn-left">
                  <span class="loc-pin-icon">📍</span>
                  <span class="loc-name">${escapeAttr(loc)}</span>
                </div>
                <span class="loc-check-circle">
                  <svg class="loc-check-svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <div class="profile-field" style="margin-bottom:14px;">
        <div class="bio-header-row">
          <label for="candSummary" style="margin-bottom:0;">Professional Summary / Career Bio</label>
          <span class="bio-char-counter" id="bioCharCounter">${(p.summary || '').length} characters</span>
        </div>

        <div class="bio-templates-row">
          <span class="bio-template-label">✨ Quick Templates:</span>
          <button type="button" class="bio-template-chip" data-template="health">Healthcare Pro</button>
          <button type="button" class="bio-template-chip" data-template="it">Software / Tech</button>
          <button type="button" class="bio-template-chip" data-template="biz">Finance & Accounting</button>
          <button type="button" class="bio-template-chip" data-template="exec">Operations / HR</button>
        </div>

        <div class="bio-box-wrap">
          <textarea id="candSummary" class="bio-textarea" placeholder="Write a short summary of your professional background, key achievements, core skills, and UAE career goals...">${escapeAttr(p.summary || '')}</textarea>
          <div class="bio-box-footer">
            <span class="bio-tip-text">💡 Tip: Highlight your UAE credentials, key specializations, and availability for top recruiter discovery.</span>
            <button type="button" class="bio-clear-btn" id="bioClearBtn" title="Clear text" ${p.summary ? '' : 'style="display:none;"'}>✕ Clear</button>
          </div>
        </div>
      </div>
    </section>

  </div>

  <!-- Right Column: Sticky Sidebar -->
  <aside class="candidate-sidebar">
    <!-- Widget 1: Profile Completeness Meter -->
    <div class="sidebar-widget profile-strength-widget">
      <div class="strength-header">
        <span class="strength-title"><span>⚡</span> Profile Strength</span>
        <span class="strength-percent" id="strengthPercentText">${completion}% Completed</span>
      </div>
      <div class="strength-bar-bg">
        <div class="strength-bar-fill" id="strengthBarFill" style="width:${Math.max(5, completion)}%;"></div>
      </div>
      <p class="strength-tips" id="strengthTipsText">
        ${completion >= 85
          ? '✓ Excellent! Your candidate profile is verified and prioritized for top employers across the UAE.'
          : '💡 Complete all sections to reach 100% and get 3x more recruiter contacts and direct interview requests.'}
      </p>
      <div class="strength-checklist" id="strengthChecklist">
        <div class="strength-check-item ${p.name && p.phone && p.currentLocation ? 'done' : ''}">
          <span class="strength-check-icon">${p.name && p.phone && p.currentLocation ? '✓' : '○'}</span> Personal & Contact
        </div>
        <div class="strength-check-item ${p.role && p.experience ? 'done' : ''}">
          <span class="strength-check-icon">${p.role && p.experience ? '✓' : '○'}</span> Career Field & Role
        </div>
        <div class="strength-check-item ${p.qualification && p.degree ? 'done' : ''}">
          <span class="strength-check-icon">${p.qualification && p.degree ? '✓' : '○'}</span> Degree & Credentials
        </div>
        <div class="strength-check-item ${selectedLicenses.length > 0 || p.licenseStatus ? 'done' : ''}">
          <span class="strength-check-icon">${selectedLicenses.length > 0 || p.licenseStatus ? '✓' : '○'}</span> Certifications / Status
        </div>
        <div class="strength-check-item ${selectedLocations.length > 0 ? 'done' : ''}">
          <span class="strength-check-icon">${selectedLocations.length > 0 ? '✓' : '○'}</span> Target Locations
        </div>
      </div>
    </div>

    <!-- Widget 2: ATS CV Builder Promo Card -->
    <div class="sidebar-widget cv-promo-widget">
      <div class="cv-promo-header">
        <span class="cv-promo-badge">⚡ ATS Optimized</span>
      </div>
      <h3>Professional CV Builder</h3>
      <p>Convert your profile information into a clean, UAE-compliant PDF and Word résumé ready for recruiter applications.</p>
      <a href="/resume-library" class="cv-promo-btn">
        Create / Edit My CV →
      </a>
    </div>
  </aside>
</div>

<!-- Floating Save Button Bar on Scroll -->
<div class="floating-profile-save-bar" id="floatingSaveBar">
  <span>Profile workspace</span>
  <button type="button" class="floating-save-btn" id="floatingSaveBtn">
    <span>💾</span> Save Changes
  </button>
  <a href="#" class="floating-top-btn" id="floatingTopBtn">↑ Top</a>
</div>

    <!-- Role Picker Modal -->
    <div class="profile-modal-overlay" id="rolePickerModal" style="display:none;" role="dialog" aria-modal="true" aria-label="Select healthcare job role">
      <div class="profile-modal-sheet">
        <div class="modal-sheet-head">
          <h3>Choose Healthcare Role</h3>
          <button type="button" class="modal-close-btn" id="closeRoleModalBtn" aria-label="Close modal">✕</button>
        </div>
        <div class="modal-search-wrap">
          <input type="text" class="modal-search-input" id="roleSearchInput" placeholder="Search role (e.g. Staff Nurse, GP, Coder, Pharmacist...)" autofocus>
        </div>
        <div class="modal-tabs-row" id="roleCategoryTabs">
          <button type="button" class="modal-tab-pill active" data-cat="All">All Roles</button>
          ${CANDIDATE_CATEGORIES.map(cat => `<button type="button" class="modal-tab-pill" data-cat="${escapeAttr(cat)}">${escapeAttr(cat)}</button>`).join('')}
        </div>
        <div class="modal-list-body" id="roleModalList"></div>
      </div>
    </div>

    <!-- Country / Nationality Picker Modal -->
    <div class="profile-modal-overlay" id="countryPickerModal" style="display:none;" role="dialog" aria-modal="true" aria-label="Select country">
      <div class="profile-modal-sheet">
        <div class="modal-sheet-head">
          <h3 id="countryModalTitle">Select Country</h3>
          <button type="button" class="modal-close-btn" id="closeCountryModalBtn" aria-label="Close modal">✕</button>
        </div>
        <div class="modal-search-wrap">
          <input type="text" class="modal-search-input" id="countrySearchInput" placeholder="Search country name or calling code..." autofocus>
        </div>
        <div class="modal-list-body" id="countryModalList"></div>
      </div>
    </div>
  </main>`;
}

function initCandidateProfile() {
  const root = document.querySelector('.candidate-profile-shell');
  if (!root || !currentUser) return;

  const currentProf = currentUser.profile || {};
  let currentCountryCode = (document.getElementById('phoneCodeDial')?.textContent || '+971').trim();
  let currentCountryFlag = (document.getElementById('phoneCodeFlag')?.textContent || '🇦🇪').trim();
  let currentNationalityName = document.getElementById('candNationality')?.value || '';
  let countryModalTarget = 'phone';

  const getProfileData = () => {
    const rawNumber = (document.getElementById('candPhoneNumber')?.value || '').trim();
    const phone = rawNumber ? `${currentCountryCode} ${rawNumber}` : '';
    const degreeSelect = document.getElementById('candDegreeSelect')?.value || '';
    const customDegree = (document.getElementById('candCustomDegree')?.value || '').trim();
    const degree = degreeSelect === 'Other' ? customDegree : degreeSelect;

    const qualSelect = document.getElementById('candQualification')?.value || '';
    const customQual = (document.getElementById('candCustomQual')?.value || '').trim();
    const qualification = qualSelect === 'Other Qualification' ? customQual : qualSelect;

    const selectedLicenses = Array.from(document.querySelectorAll('#licensePillsWrap .choice-pill.selected'))
      .map(btn => btn.dataset.val);
    const selectedLocations = Array.from(document.querySelectorAll('#locationCardsGrid .location-card-btn.selected'))
      .map(btn => btn.dataset.val);

    const langStr = document.getElementById('candLanguages')?.value || '';
    const languages = langStr.split(',').map(s => s.trim()).filter(Boolean);

    return {
      name: (document.getElementById('candName')?.value || '').trim(),
      email: currentUser.email,
      phone,
      nationality: (document.getElementById('candNationality')?.value || '').trim(),
      currentLocation: (document.getElementById('candCurrentLocation')?.value || '').trim(),
      gender: document.getElementById('candGender')?.value || '',
      industry: document.getElementById('candIndustry')?.value || 'Information Technology & Software',
      category: document.getElementById('candCategory')?.value || 'Software & IT',
      role: (document.getElementById('candRole')?.value || '').trim(),
      currentDesignation: (document.getElementById('candDesignation')?.value || '').trim(),
      experience: document.getElementById('candExperience')?.value || '',
      qualification,
      degree,
      specialization: (document.getElementById('candSpecialization')?.value || '').trim(),
      university: (document.getElementById('candUniversity')?.value || '').trim(),
      licenses: selectedLicenses,
      licenseStatus: document.getElementById('candLicenseStatus')?.value || '',
      languages,
      previousEmployers: (document.getElementById('candEmployers')?.value || '').trim(),
      salaryExpectation: (document.getElementById('candSalary')?.value || '').trim(),
      availability: document.getElementById('candAvailability')?.value || '',
      noticePeriod: (document.getElementById('candNotice')?.value || '').trim(),
      hospitalType: document.getElementById('candHospitalType')?.value || '',
      visaStatus: document.getElementById('candVisaStatus')?.value || '',
      locations: selectedLocations,
      summary: (document.getElementById('candSummary')?.value || '').trim(),
      photo: currentUser.avatar || currentProf.photo || ''
    };
  };

  const updateCompletionUI = () => {
    const pData = getProfileData();
    const score = calculateCandidateCompletion(pData);

    const percentText = document.getElementById('strengthPercentText');
    if (percentText) percentText.textContent = `${score}% Completed`;

    const barFill = document.getElementById('strengthBarFill');
    if (barFill) barFill.style.width = `${Math.max(5, score)}%`;

    const tipsText = document.getElementById('strengthTipsText');
    if (tipsText) {
      tipsText.textContent = score >= 85
        ? '✓ Excellent! Your candidate profile is verified and prioritized for top healthcare employers in the UAE.'
        : '💡 Complete your healthcare licenses, qualifications, and target locations to reach 100% and get 3x more recruiter contacts.';
    }

    const heroRole = document.getElementById('heroRoleMeta');
    if (heroRole) heroRole.textContent = `💼 ${pData.role || pData.currentDesignation || 'Healthcare Professional'}`;

    const heroLoc = document.getElementById('heroLocationMeta');
    if (heroLoc) heroLoc.textContent = `📍 ${pData.currentLocation || 'UAE'}`;

    const checklist = document.getElementById('strengthChecklist');
    if (checklist) {
      checklist.innerHTML = `
        <span class="strength-check-item ${pData.name && pData.phone && pData.currentLocation ? 'done' : ''}">
          ${pData.name && pData.phone && pData.currentLocation ? '✓' : '○'} Personal & Contact
        </span>
        <span class="strength-check-item ${pData.role && pData.experience ? 'done' : ''}">
          ${pData.role && pData.experience ? '✓' : '○'} Healthcare Role & Experience
        </span>
        <span class="strength-check-item ${pData.qualification && pData.degree ? 'done' : ''}">
          ${pData.qualification && pData.degree ? '✓' : '○'} Degree & Credentials
        </span>
        <span class="strength-check-item ${pData.licenses.length > 0 ? 'done' : ''}">
          ${pData.licenses.length > 0 ? '✓' : '○'} License (DHA/DOH/MOH/SCFHS)
        </span>
        <span class="strength-check-item ${pData.locations.length > 0 ? 'done' : ''}">
          ${pData.locations.length > 0 ? '✓' : '○'} Preferred Locations
        </span>
      `;
    }
  };

  root.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', updateCompletionUI);
    el.addEventListener('change', updateCompletionUI);
  });

  // Upgrade all profile-field selects into searchable custom selects matching the website
  const enhanceSelectWithSearch = (selectEl) => {
    if (!selectEl || selectEl.dataset.searchableEnhanced) return;
    selectEl.dataset.searchableEnhanced = 'true';
    selectEl.style.display = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-searchable-select';
    wrapper.dataset.selectId = selectEl.id || '';

    // Trigger button
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'css-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const selectedTextSpan = document.createElement('span');
    selectedTextSpan.className = 'css-selected-text';

    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('class', 'css-arrow');
    arrowSvg.setAttribute('viewBox', '0 0 24 24');
    arrowSvg.setAttribute('fill', 'none');
    arrowSvg.setAttribute('stroke', 'currentColor');
    arrowSvg.setAttribute('stroke-width', '2.2');
    arrowSvg.setAttribute('stroke-linecap', 'round');
    arrowSvg.setAttribute('stroke-linejoin', 'round');
    arrowSvg.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';

    trigger.appendChild(selectedTextSpan);
    trigger.appendChild(arrowSvg);

    // Dropdown panel
    const dropdown = document.createElement('div');
    dropdown.className = 'css-dropdown';

    // Search box in dropdown
    const searchBox = document.createElement('div');
    searchBox.className = 'css-search-box';
    searchBox.innerHTML = `
      <svg class="css-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input type="text" class="css-search-input" placeholder="Search option..." autocomplete="off">
      <button type="button" class="css-search-clear" style="display:none;" title="Clear">✕</button>
    `;

    const searchInput = searchBox.querySelector('.css-search-input');
    const searchClear = searchBox.querySelector('.css-search-clear');

    // Options list
    const listEl = document.createElement('ul');
    listEl.className = 'css-options-list';
    listEl.setAttribute('role', 'listbox');

    // Empty state
    const emptyEl = document.createElement('div');
    emptyEl.className = 'css-empty-state';
    emptyEl.style.display = 'none';

    dropdown.appendChild(searchBox);
    dropdown.appendChild(listEl);
    dropdown.appendChild(emptyEl);

    wrapper.appendChild(trigger);
    wrapper.appendChild(dropdown);

    // Insert wrapper right after the original select
    selectEl.parentNode.insertBefore(wrapper, selectEl.nextSibling);

    const updateSelectedDisplay = () => {
      const selOpt = selectEl.options[selectEl.selectedIndex];
      const text = selOpt ? selOpt.text : '';
      const isPlaceholder = !selOpt || selOpt.value === '';
      selectedTextSpan.textContent = text || 'Select option';
      selectedTextSpan.classList.toggle('is-placeholder', isPlaceholder);

      listEl.querySelectorAll('.css-option').forEach(li => {
        const isSel = li.dataset.value === selectEl.value;
        li.classList.toggle('selected', isSel);
        const check = li.querySelector('.css-check');
        if (isSel && !check) {
          li.insertAdjacentHTML('beforeend', '<svg class="css-check" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>');
        } else if (!isSel && check) {
          check.remove();
        }
      });
    };

    const createOptionLi = (opt, groupName) => {
      const li = document.createElement('li');
      li.className = 'css-option';
      li.dataset.value = opt.value;
      li.setAttribute('role', 'option');
      if (groupName) li.dataset.group = groupName;

      const isSel = opt.selected || selectEl.value === opt.value;
      if (isSel) li.classList.add('selected');

      li.innerHTML = `
        <span class="css-opt-text">${escapeAttr(opt.text)}</span>
        ${isSel ? '<svg class="css-check" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>' : ''}
      `;

      li.addEventListener('click', (e) => {
        e.stopPropagation();
        selectEl.value = opt.value;
        updateSelectedDisplay();
        closeDropdown();
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        selectEl.dispatchEvent(new Event('input', { bubbles: true }));
      });

      return li;
    };

    const renderOptions = () => {
      listEl.innerHTML = '';
      const children = Array.from(selectEl.children);
      children.forEach(child => {
        if (child.tagName === 'OPTGROUP') {
          const groupLi = document.createElement('li');
          groupLi.className = 'css-optgroup-label';
          groupLi.textContent = child.label;
          listEl.appendChild(groupLi);

          Array.from(child.children).forEach(opt => {
            listEl.appendChild(createOptionLi(opt, child.label));
          });
        } else if (child.tagName === 'OPTION') {
          listEl.appendChild(createOptionLi(child, null));
        }
      });
      updateSelectedDisplay();
    };

    const filterOptions = (query) => {
      const q = query.trim().toLowerCase();
      searchClear.style.display = q ? 'flex' : 'none';

      let matchCount = 0;
      const groupCounts = new Map();

      listEl.querySelectorAll('.css-option').forEach(li => {
        const text = li.querySelector('.css-opt-text')?.textContent?.toLowerCase() || '';
        const isMatch = !q || text.includes(q);
        li.style.display = isMatch ? 'flex' : 'none';
        if (isMatch) matchCount++;

        const grp = li.dataset.group;
        if (grp) {
          groupCounts.set(grp, (groupCounts.get(grp) || 0) + (isMatch ? 1 : 0));
        }
      });

      listEl.querySelectorAll('.css-optgroup-label').forEach(labelEl => {
        const grpName = labelEl.textContent;
        const count = groupCounts.get(grpName) || 0;
        labelEl.style.display = count > 0 ? 'block' : 'none';
      });

      if (matchCount === 0) {
        emptyEl.style.display = 'block';
        emptyEl.innerHTML = `<span>🔍 No options matching "<strong>${escapeAttr(query)}</strong>"</span>`;
      } else {
        emptyEl.style.display = 'none';
      }
    };

    const openDropdown = () => {
      document.querySelectorAll('.custom-searchable-select.open').forEach(other => {
        if (other !== wrapper) other.classList.remove('open');
      });
      wrapper.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      searchInput.value = '';
      searchClear.style.display = 'none';
      filterOptions('');
      setTimeout(() => {
        searchInput.focus();
        const selectedLi = listEl.querySelector('.css-option.selected');
        if (selectedLi) {
          selectedLi.scrollIntoView({ block: 'nearest' });
        }
      }, 40);
    };

    const closeDropdown = () => {
      wrapper.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    };

    const toggleDropdown = () => {
      if (wrapper.classList.contains('open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    };

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown();
    });

    searchInput.addEventListener('input', () => {
      filterOptions(searchInput.value);
    });

    searchClear.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchInput.value = '';
      filterOptions('');
      searchInput.focus();
    });

    selectEl.addEventListener('change', () => {
      updateSelectedDisplay();
    });

    renderOptions();
  };

  root.querySelectorAll('.profile-field select').forEach(enhanceSelectWithSearch);

  // Close custom dropdowns on outside click or Escape
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-searchable-select')) {
      document.querySelectorAll('.custom-searchable-select.open').forEach(w => {
        w.classList.remove('open');
        w.querySelector('.css-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.custom-searchable-select.open').forEach(w => {
        w.classList.remove('open');
        w.querySelector('.css-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  const degreeSelect = document.getElementById('candDegreeSelect');
  const customDegreeInput = document.getElementById('candCustomDegree');
  if (degreeSelect && customDegreeInput) {
    degreeSelect.addEventListener('change', () => {
      customDegreeInput.style.display = degreeSelect.value === 'Other' ? 'block' : 'none';
      if (degreeSelect.value === 'Other') customDegreeInput.focus();
    });
  }

  const qualSelect = document.getElementById('candQualification');
  const customQualInput = document.getElementById('candCustomQual');
  if (qualSelect && customQualInput) {
    qualSelect.addEventListener('change', () => {
      customQualInput.style.display = qualSelect.value === 'Other Qualification' ? 'block' : 'none';
      if (qualSelect.value === 'Other Qualification') customQualInput.focus();
    });
  }

  const sameAsRoleChip = document.getElementById('sameAsRoleChip');
  if (sameAsRoleChip) {
    sameAsRoleChip.addEventListener('click', () => {
      const role = document.getElementById('candRole')?.value || '';
      const designationInput = document.getElementById('candDesignation');
      if (designationInput && role) {
        designationInput.value = role;
        updateCompletionUI();
      }
    });
  }

  document.getElementById('candIndustry')?.addEventListener('change', updateCompletionUI);
  document.getElementById('candCategory')?.addEventListener('change', updateCompletionUI);
  document.getElementById('candExperience')?.addEventListener('change', updateCompletionUI);

  const licenseWrap = document.getElementById('licensePillsWrap');
  if (licenseWrap) {
    licenseWrap.querySelectorAll('.choice-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const isSel = btn.classList.toggle('selected');
        const icon = btn.querySelector('.choice-pill-icon');
        if (isSel && !icon) {
          const iconSpan = document.createElement('span');
          iconSpan.className = 'choice-pill-icon';
          iconSpan.textContent = '✓';
          btn.prepend(iconSpan);
        } else if (!isSel && icon) {
          icon.remove();
        }
        updateCompletionUI();
      });
    });
  }

  // Location Cards & Quick Select Actions
  const locGrid = document.getElementById('locationCardsGrid');
  const locBadge = document.getElementById('locationSelectedBadge');

  const updateLocationBadge = () => {
    if (!locGrid || !locBadge) return;
    const count = locGrid.querySelectorAll('.location-card-btn.selected').length;
    locBadge.textContent = `${count} selected`;
    locBadge.classList.toggle('has-selection', count > 0);
  };

  if (locGrid) {
    locGrid.querySelectorAll('.location-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
        updateLocationBadge();
        updateCompletionUI();
      });
    });

    document.getElementById('locSelectAllBtn')?.addEventListener('click', () => {
      locGrid.querySelectorAll('.location-card-btn').forEach(b => b.classList.add('selected'));
      updateLocationBadge();
      updateCompletionUI();
    });

    document.getElementById('locTopHubsBtn')?.addEventListener('click', () => {
      locGrid.querySelectorAll('.location-card-btn').forEach(b => {
        const val = b.dataset.val;
        b.classList.toggle('selected', val === 'Dubai' || val === 'Abu Dhabi');
      });
      updateLocationBadge();
      updateCompletionUI();
    });

    document.getElementById('locClearBtn')?.addEventListener('click', () => {
      locGrid.querySelectorAll('.location-card-btn').forEach(b => b.classList.remove('selected'));
      updateLocationBadge();
      updateCompletionUI();
    });

    updateLocationBadge();
  }

  // Bio Summary Character Counter & Quick Templates
  const summaryEl = document.getElementById('candSummary');
  const bioCounter = document.getElementById('bioCharCounter');
  const bioClearBtn = document.getElementById('bioClearBtn');

  const updateBioCounter = () => {
    if (!summaryEl || !bioCounter) return;
    const len = summaryEl.value.length;
    bioCounter.textContent = `${len} characters${len >= 120 ? ' (Strong)' : len >= 50 ? ' (Good)' : ''}`;
    if (bioClearBtn) bioClearBtn.style.display = len > 0 ? 'inline-flex' : 'none';
  };

  if (summaryEl) {
    summaryEl.addEventListener('input', () => {
      updateBioCounter();
      updateCompletionUI();
    });

    if (bioClearBtn) {
      bioClearBtn.addEventListener('click', () => {
        summaryEl.value = '';
        updateBioCounter();
        updateCompletionUI();
        summaryEl.focus();
      });
    }

    const bioTemplates = {
      health: "Dedicated Healthcare Professional with 4+ years of clinical experience in high-volume hospital environments. Licensed/eligible with UAE credentials (DHA/DOH/MOH), committed to exceptional patient care and clinical quality standards.",
      it: "Results-driven Software Engineer with 4+ years experience developing resilient web platforms and cloud-native services. Skilled in modern JavaScript/TypeScript architectures, APIs, and eager to contribute to forward-thinking UAE tech teams.",
      biz: "Detail-oriented Finance & Accounting Professional with 5+ years expertise in financial modeling, compliance, VAT/tax reporting, and strategic audit across diverse Middle Eastern business environments.",
      exec: "Accomplished Operations & HR Specialist with proven track record in talent acquisition, workforce planning, and organizational efficiency aligned with UAE labor laws and corporate standards."
    };

    document.querySelectorAll('.bio-template-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const key = chip.dataset.template;
        if (bioTemplates[key]) {
          summaryEl.value = bioTemplates[key];
          updateBioCounter();
          updateCompletionUI();
          summaryEl.focus();
        }
      });
    });

    updateBioCounter();
  }

  const photoInput = document.getElementById('candPhotoInput');
  if (photoInput) {
    photoInput.addEventListener('change', e => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = async () => {
          const size = 240;
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          const crop = Math.min(img.width, img.height);
          const x = (img.width - crop) / 2;
          const y = (img.height - crop) / 2;
          ctx.drawImage(img, x, y, crop, crop, 0, 0, size, size);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

          currentUser.avatar = dataUrl;
          if (!currentUser.profile) currentUser.profile = {};
          currentUser.profile.photo = dataUrl;

          const avatarImg = document.getElementById('candAvatarImg');
          const avatarInitial = document.getElementById('candAvatarInitial');
          if (avatarImg) {
            avatarImg.src = dataUrl;
          } else if (avatarInitial && avatarInitial.parentElement) {
            avatarInitial.outerHTML = `<img id="candAvatarImg" src="${dataUrl}" alt="Candidate Avatar">`;
          }

          const headerAvatar = document.querySelector('.nav-profile-photo');
          if (headerAvatar) headerAvatar.innerHTML = `<img src="${dataUrl}" alt="">`;

          updateCompletionUI();

          try {
            const photoRes = await fetch('/api/candidate/photo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ photo: dataUrl })
            });
            const photoData = await photoRes.json();
            if (photoRes.ok) {
              showToast('Profile photo updated and saved successfully!', 'success');
            } else {
              showToast(photoData.error || 'Photo updated locally. Click "Save Profile" to apply.', 'info');
            }
          } catch {
            showToast('Profile photo selected. Click "Save Profile" to finish saving.', 'info');
          }
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  // ROLE PICKER MODAL
  const roleModal = document.getElementById('rolePickerModal');
  const roleBtn = document.getElementById('candRoleBtn');
  const closeRoleBtn = document.getElementById('closeRoleModalBtn');
  const roleSearch = document.getElementById('roleSearchInput');
  const roleTabs = document.getElementById('roleCategoryTabs');
  const roleList = document.getElementById('roleModalList');
  let currentCatFilter = 'All';

  const renderRoleList = () => {
    if (!roleList) return;
    const q = (roleSearch?.value || '').trim().toLowerCase();
    const currentRole = (document.getElementById('candRole')?.value || '').toLowerCase();

    const matches = CANDIDATE_TRACKED_ROLES.filter(item => {
      const matchCat = currentCatFilter === 'All' || item.category === currentCatFilter;
      const matchQ = !q || item.role.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    let html = '';
    if (q && !matches.some(m => m.role.toLowerCase() === q)) {
      html += `
        <button type="button" class="modal-list-item custom-role-item" style="background:#fef2f2;border:1px dashed #f87171;color:#b00008;margin-bottom:8px;">
          <span><strong>+ Use custom role: “${escapeAttr(roleSearch.value.trim())}”</strong></span>
          <small>Select</small>
        </button>
      `;
    }

    html += matches.map(item => {
      const isSelected = item.role.toLowerCase() === currentRole;
      return `
        <button type="button" class="modal-list-item ${isSelected ? 'selected' : ''}" data-role="${escapeAttr(item.role)}" data-cat="${escapeAttr(item.category)}">
          <span><strong>${escapeAttr(item.role)}</strong> <small style="color:#64748b;margin-left:6px;">${escapeAttr(item.category)}</small></span>
          ${isSelected ? '<span style="color:#b00008;font-weight:700;">✓</span>' : ''}
        </button>
      `;
    }).join('');

    if (!html) {
      html = `<div style="text-align:center;padding:24px;color:#64748b;">No roles found matching “${escapeAttr(q)}”. Type custom role above.</div>`;
    }

    roleList.innerHTML = html;

    roleList.querySelectorAll('.modal-list-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosenRole = btn.classList.contains('custom-role-item')
          ? roleSearch.value.trim()
          : (btn.dataset.role || '');
        const chosenCat = btn.dataset.cat || '';

        const roleHidden = document.getElementById('candRole');
        const roleBtnText = document.getElementById('candRoleBtnText');
        if (roleHidden) roleHidden.value = chosenRole;
        if (roleBtnText) roleBtnText.textContent = `💼 ${chosenRole}`;
        if (roleBtn) roleBtn.classList.remove('empty');

        const desigInput = document.getElementById('candDesignation');
        if (desigInput && !desigInput.value.trim()) {
          desigInput.value = chosenRole;
        }

        if (chosenCat) {
          const categorySelect = document.getElementById('candCategory');
          if (categorySelect && [...categorySelect.options].some(option => option.value === chosenCat)) categorySelect.value = chosenCat;
        }

        roleModal.style.display = 'none';
        updateCompletionUI();
      });
    });
  };

  if (roleBtn && roleModal) {
    roleBtn.addEventListener('click', () => {
      roleModal.style.display = 'flex';
      if (roleSearch) {
        roleSearch.value = '';
        setTimeout(() => roleSearch.focus(), 50);
      }
      currentCatFilter = 'All';
      if (roleTabs) {
        roleTabs.querySelectorAll('.modal-tab-pill').forEach(p => p.classList.toggle('active', p.dataset.cat === 'All'));
      }
      renderRoleList();
    });
  }

  if (closeRoleBtn && roleModal) {
    closeRoleBtn.addEventListener('click', () => { roleModal.style.display = 'none'; });
    roleModal.addEventListener('click', e => { if (e.target === roleModal) roleModal.style.display = 'none'; });
  }

  if (roleSearch) {
    roleSearch.addEventListener('input', renderRoleList);
  }

  if (roleTabs) {
    roleTabs.querySelectorAll('.modal-tab-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        roleTabs.querySelectorAll('.modal-tab-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCatFilter = pill.dataset.cat || 'All';
        renderRoleList();
      });
    });
  }

  // COUNTRY & NATIONALITY MODAL
  const countryModal = document.getElementById('countryPickerModal');
  const countryModalTitle = document.getElementById('countryModalTitle');
  const countrySearch = document.getElementById('countrySearchInput');
  const countryList = document.getElementById('countryModalList');
  const closeCountryBtn = document.getElementById('closeCountryModalBtn');
  const phoneBtn = document.getElementById('phoneCodeBtn');
  const natBtn = document.getElementById('candNationalityBtn');

  const renderCountryList = () => {
    if (!countryList) return;
    const q = (countrySearch?.value || '').trim().toLowerCase();
    const matches = CANDIDATE_COUNTRIES.filter(c => !q || c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q));

    countryList.innerHTML = matches.map(c => `
      <button type="button" class="modal-list-item" data-code="${c.code}" data-name="${escapeAttr(c.name)}" data-dial="${c.dial}" data-flag="${c.flag}">
        <span><strong style="font-size:17px;margin-right:8px;">${c.flag}</strong> ${escapeAttr(c.name)}</span>
        <span style="font-size:13px;color:#64748b;font-weight:600;">${countryModalTarget === 'phone' ? c.dial : c.code}</span>
      </button>
    `).join('');

    countryList.querySelectorAll('.modal-list-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const flag = btn.dataset.flag || '';
        const dial = btn.dataset.dial || '';
        const name = btn.dataset.name || '';

        if (countryModalTarget === 'phone') {
          currentCountryCode = dial;
          currentCountryFlag = flag;
          const phoneFlagEl = document.getElementById('phoneCodeFlag');
          const phoneDialEl = document.getElementById('phoneCodeDial');
          if (phoneFlagEl) phoneFlagEl.textContent = flag;
          if (phoneDialEl) phoneDialEl.textContent = dial;
        } else {
          currentNationalityName = name;
          const natInput = document.getElementById('candNationality');
          const natText = document.getElementById('nationalityBtnText');
          if (natInput) natInput.value = name;
          if (natText) natText.textContent = `${flag} ${name}`;
          if (natBtn) natBtn.classList.remove('empty');
        }

        countryModal.style.display = 'none';
        updateCompletionUI();
      });
    });
  };

  if (phoneBtn && countryModal) {
    phoneBtn.addEventListener('click', () => {
      countryModalTarget = 'phone';
      if (countryModalTitle) countryModalTitle.textContent = 'Select Calling Code';
      countryModal.style.display = 'flex';
      if (countrySearch) {
        countrySearch.value = '';
        setTimeout(() => countrySearch.focus(), 50);
      }
      renderCountryList();
    });
  }

  if (natBtn && countryModal) {
    natBtn.addEventListener('click', () => {
      countryModalTarget = 'nationality';
      if (countryModalTitle) countryModalTitle.textContent = 'Select Nationality';
      countryModal.style.display = 'flex';
      if (countrySearch) {
        countrySearch.value = '';
        setTimeout(() => countrySearch.focus(), 50);
      }
      renderCountryList();
    });
  }

  if (closeCountryBtn && countryModal) {
    closeCountryBtn.addEventListener('click', () => { countryModal.style.display = 'none'; });
    countryModal.addEventListener('click', e => { if (e.target === countryModal) countryModal.style.display = 'none'; });
  }

  if (countrySearch) {
    countrySearch.addEventListener('input', renderCountryList);
  }

  const showToast = (msg, type = 'success') => {
    const existing = document.querySelector('.profile-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `profile-toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span> <span>${escapeAttr(msg)}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
  };

  const saveProfile = async (btn) => {
    if (!currentUser) return;
    const origHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>⏳</span> Saving profile…`;
    }

    try {
      const payload = getProfileData();
      const res = await fetch('/api/candidate/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save candidate profile');

      currentUser.profile = data.profile;
      currentUser.completionPercentage = data.completionPercentage;
      if (data.profile.name) currentUser.name = data.profile.name;
      if (data.profile.photo) currentUser.avatar = data.profile.photo;

      const isComplete = data.completionPercentage >= 85;
      const navBadge = document.querySelector('.nav-profile-badge');
      if (navBadge) {
        if (isComplete) navBadge.remove();
        else navBadge.setAttribute('title', `Profile ${data.completionPercentage}% complete`);
      }

      updateCompletionUI();
      showToast('Profile saved successfully! Your candidate profile is updated.', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Error saving profile', 'error');
      return false;
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origHtml;
      }
    }
  };

  const heroSaveBtn = document.getElementById('saveProfileHeroBtn');
  if (heroSaveBtn) heroSaveBtn.addEventListener('click', () => saveProfile(heroSaveBtn));

  // Section Navigation Tabs
  const tabPills = document.querySelectorAll('.candidate-section-tabs .tab-pill');
  tabPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = pill.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        tabPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Floating save bar on scroll
  const floatingSaveBar = document.getElementById('floatingSaveBar');
  const floatingSaveBtn = document.getElementById('floatingSaveBtn');
  const floatingTopBtn = document.getElementById('floatingTopBtn');
  if (floatingSaveBar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        floatingSaveBar.classList.add('visible');
      } else {
        floatingSaveBar.classList.remove('visible');
      }
    }, { passive: true });
  }
  if (floatingSaveBtn) {
    floatingSaveBtn.addEventListener('click', () => saveProfile(floatingSaveBtn));
  }
  if (floatingTopBtn) {
    floatingTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active section indicator on scroll
  const profileSections = document.querySelectorAll('.candidate-main-content .profile-section-card');
  if ('IntersectionObserver' in window && profileSections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tabPills.forEach(pill => {
            pill.classList.toggle('active', pill.dataset.target === id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    profileSections.forEach(sec => observer.observe(sec));
  }

  // Add individual quick Save button to each section card header
  document.querySelectorAll('.profile-section-card').forEach((section, index) => {
    const sectionHead = section.querySelector('.section-head');
    if (!sectionHead) return;

    const controls = document.createElement('div');
    controls.className = 'section-edit-controls';
    controls.style.position = 'absolute';
    controls.style.top = '0';
    controls.style.right = '0';
    controls.innerHTML = `
      <button type="button" class="section-save-btn" style="background:#f8fafc;border:1px solid #e2e8f0;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;color:#475569;cursor:pointer;transition:all 0.15s ease;">Save Section</button>
    `;
    sectionHead.style.position = 'relative';
    sectionHead.appendChild(controls);

    const sectionSaveBtn = controls.querySelector('.section-save-btn');
    sectionSaveBtn.addEventListener('mouseenter', () => {
      sectionSaveBtn.style.background = '#b00008';
      sectionSaveBtn.style.color = '#ffffff';
      sectionSaveBtn.style.borderColor = '#b00008';
    });
    sectionSaveBtn.addEventListener('mouseleave', () => {
      sectionSaveBtn.style.background = '#f8fafc';
      sectionSaveBtn.style.color = '#475569';
      sectionSaveBtn.style.borderColor = '#e2e8f0';
    });
    sectionSaveBtn.addEventListener('click', async () => {
      await saveProfile(sectionSaveBtn);
    });
  });

  // Dashboard Sign Out
  document.getElementById('dashboardLogoutBtn')?.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    location.href = '/';
  });
}

function memberCollectionKey(kind){
  const userKey=currentUser?.id||currentUser?.email||'member';
  return `trikonet_${kind}_${userKey}`;
}
function readMemberCollection(kind){
  try{const value=JSON.parse(localStorage.getItem(memberCollectionKey(kind))||'[]');return Array.isArray(value)?value:[]}catch{return []}
}
function memberWorkspacePage(kind){
  if(!currentUser)return `<main class="member-workspace member-workspace-locked"><section><h1>Sign in to continue</h1><p>Your personal career lists are available after signing in.</p><a href="/login?redirect=${encodeURIComponent(path)}">Sign in</a></section></main>`;
  const config={
    'saved_jobs':{title:'Saved jobs',eyebrow:'YOUR SHORTLIST',description:'Jobs you saved to review and apply for later.',emptyTitle:'No saved jobs yet',emptyText:'Save a role from any job page and it will appear here.',action:'/jobs',actionText:'Browse jobs'},
    'applied_jobs':{title:'Applied jobs',eyebrow:'APPLICATION TRACKER',description:'Keep track of the opportunities you have opened to apply.',emptyTitle:'No applications tracked yet',emptyText:'When you select Apply Now on a job, it will be added here.',action:'/jobs',actionText:'Find jobs'},
    'followed_companies':{title:'Followed companies',eyebrow:'YOUR EMPLOYERS',description:'Companies you follow for quick access to their profiles and openings.',emptyTitle:'No followed companies yet',emptyText:'Follow a company from its employer page and it will appear here.',action:'/employers',actionText:'Explore employers'}
  }[kind];
  const items=readMemberCollection(kind);
  const isCompanies=kind==='followed_companies';
  const cards=items.map(item=>{
    const href=isCompanies?`/employer/${escapeAttr(item.slug||'')}`:`/job/${escapeAttr(item.slug||'')}`;
    const title=escapeAttr(item.title||item.name||'Untitled');
    const subtitle=escapeAttr(isCompanies?(item.category||item.location||'Employer'):[item.company,item.location,item.type].filter(Boolean).join(' · ')||'Job opportunity');
    const initial=escapeAttr(String(item.title||item.name||'T').charAt(0).toUpperCase());
    return `<article class="member-list-card"><a class="member-list-logo" href="${href}">${item.logo?`<img src="${escapeAttr(item.logo)}" alt="">`:`<span>${initial}</span>`}</a><div><a href="${href}" class="member-list-title">${title}</a><p>${subtitle}</p>${item.savedAt||item.appliedAt||item.followedAt?`<small>${kind==='applied_jobs'?'Opened to apply':'Saved'} ${new Date(item.appliedAt||item.savedAt||item.followedAt).toLocaleDateString()}</small>`:''}</div><a class="member-list-open" href="${href}">View <span>→</span></a></article>`;
  }).join('');
  return `<main class="member-workspace"><div class="member-workspace-wrap"><header><span>${config.eyebrow}</span><h1>${config.title}</h1><p>${config.description}</p></header>${items.length?`<section class="member-list-grid">${cards}</section>`:`<section class="member-list-empty"><div>${isCompanies?'⌂':'☆'}</div><h2>${config.emptyTitle}</h2><p>${config.emptyText}</p><a href="${config.action}">${config.actionText}</a></section>`}</div></main>`;
}

function accountPage(forcedMode) {
  if (currentUser) {
    return candidateProfileWorkspace(currentUser.profile || {});
  }

  const isRegister = forcedMode === 'register' || path === '/register' || path === '/signup' || path === '/sign-up' || queryParams.get('tab') === 'register' || queryParams.get('mode') === 'signup';

  return `<main class="auth-page auth-entry-page">
    <div class="auth-ambient-glow"></div>

    <section class="auth-brand-panel" aria-label="Trikonet member benefits">
      <div class="auth-brand-orbit"></div>
      <a href="/" class="auth-brand-logo"><img src="/assets/logo-black.png" alt="Trikonet"></a>
      <div class="auth-brand-content">
        <span class="auth-brand-kicker">Your career workspace</span>
        <h2>Move your career<br>forward.</h2>
        <p>Discover verified opportunities, connect with leading UAE employers, and keep every application organised.</p>
        <div class="auth-brand-benefits">
          <div><span>✓</span> Save and revisit jobs that match your goals</div>
          <div><span>✓</span> Apply faster with one secure profile</div>
          <div><span>✓</span> Stay updated on new opportunities</div>
        </div>
      </div>
      <div class="auth-brand-foot">Trusted opportunities across the UAE & GCC</div>
    </section>

    <div class="auth-card-shell">
      <div class="auth-card-header">
        <a href="/" class="auth-card-logo">
          <img src="${escapeAttr(resolveLogo(null,'/assets/logo-black.png'))}" alt="Trikonet logo">
        </a>
      </div>

      <!-- Segmented Tab Switcher -->
      <nav class="auth-tabs" role="tablist" aria-label="Account Options">
        <a href="/login" class="auth-tab ${!isRegister ? 'active' : ''}" data-target="login" role="tab" aria-selected="${!isRegister}">
          <span>Sign In</span>
        </a>
        <a href="/register" class="auth-tab ${isRegister ? 'active' : ''}" data-target="register" role="tab" aria-selected="${isRegister}">
          <span>Create Account</span>
        </a>
      </nav>

      <!-- SIGN IN VIEW -->
      <div class="auth-view-login ${!isRegister ? 'active-view' : 'hidden-view'}" id="authViewLogin">
        <div class="auth-title-box">
          <h1 class="auth-title">Welcome Back</h1>
          <p class="auth-subtitle">Sign in to manage your saved jobs, email campaigns, and employer applications.</p>
        </div>

        <form id="loginForm" class="auth-form" novalidate autocomplete="off">
          <div class="form-group">
            <label for="loginEmail">Email Address</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <input type="email" id="loginEmail" name="email" value="" placeholder="name@domain.com" autocomplete="off" data-lpignore="true" autocapitalize="off" spellcheck="false" required>
            </div>
          </div>

          <div class="form-group">
            <label for="loginPassword">Password</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input type="password" id="loginPassword" name="password" value="" placeholder="••••••••" autocomplete="new-password" data-lpignore="true" required>
              <button type="button" class="toggle-password" data-target="loginPassword" aria-label="Toggle password visibility">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <div class="auth-row-remember">
            <label class="custom-check">
              <input type="checkbox" name="remember">
              <span>Remember me on this browser</span>
            </label>
          </div>

          <button type="submit" class="auth-submit-btn">
            <span>Sign In</span>
            <svg class="arrow-svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>

          <div class="form-message" aria-live="polite"></div>
        </form>

        <div class="auth-divider"><span>or continue with</span></div>

        <div class="auth-social-row">
          <button type="button" class="auth-social-btn" onclick="alert('Google Sign-in: Please enter your credentials above.')">
            <svg class="social-svg" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.02h3.87c2.26-2.09 3.67-5.17 3.67-9.11z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.12C3.26 21.3 7.37 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.12z"/><path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.28 6.61l3.99 3.12c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
            <span>Google</span>
          </button>
          <button type="button" class="auth-social-btn" onclick="alert('LinkedIn Sign-in: Please enter your credentials above.')">
            <svg class="social-svg" viewBox="0 0 24 24"><path fill="#0A66C2" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            <span>LinkedIn</span>
          </button>
        </div>

        <footer class="auth-footer-prompt">
          <a href="mailto:info@trikonet.com?subject=Trikonet%20Password%20Reset%20Request" class="forgot-link">Forgot password?</a>
        </footer>
      </div>

      <!-- CREATE ACCOUNT / SIGN UP VIEW -->
      <div class="auth-view-register ${isRegister ? 'active-view' : 'hidden-view'}" id="authViewRegister">
        <div class="auth-title-box">
          <h1 class="auth-title">Create Your Account</h1>
          <p class="auth-subtitle">Join Trikonet to connect with employers, apply to vacancies, and manage career alerts.</p>
        </div>

        <form id="registerForm" class="auth-form" novalidate autocomplete="off">
          <div class="form-row-2col">
            <div class="form-group">
              <label for="regName">Full Name</label>
              <div class="input-wrap">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" id="regName" name="name" placeholder="e.g. Sarah Mansoor" autocomplete="name" required>
              </div>
            </div>

            <div class="form-group">
              <label for="regEmail">Email Address</label>
              <div class="input-wrap">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input type="email" id="regEmail" name="email" value="" placeholder="name@domain.com" autocomplete="off" data-lpignore="true" autocapitalize="off" spellcheck="false" required>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="regPassword">Password</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input type="password" id="regPassword" name="password" minlength="8" placeholder="At least 8 characters" autocomplete="new-password" data-lpignore="true" required>
              <button type="button" class="toggle-password" data-target="regPassword" aria-label="Toggle password visibility">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <span class="input-hint">Must be at least 8 characters long.</span>
          </div>

          <div class="auth-row-remember">
            <label class="custom-check">
              <input type="checkbox" name="terms" required checked>
              <span>I agree to Trikonet's <a href="/faq" target="_blank">Terms of Service</a> & <a href="/faq" target="_blank">Privacy Policy</a></span>
            </label>
          </div>

          <button type="submit" class="auth-submit-btn">
            <span>Create Free Account</span>
            <svg class="arrow-svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>

          <div class="form-message" aria-live="polite"></div>
        </form>

        <div class="auth-divider"><span>or continue with</span></div>

        <div class="auth-social-row">
          <button type="button" class="auth-social-btn" onclick="alert('Google Sign-up: Please fill in your name and email above.')">
            <svg class="social-svg" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.02h3.87c2.26-2.09 3.67-5.17 3.67-9.11z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.12C3.26 21.3 7.37 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.12z"/><path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.28 6.61l3.99 3.12c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
            <span>Google</span>
          </button>
          <button type="button" class="auth-social-btn" onclick="alert('LinkedIn Sign-up: Please fill in your name and email above.')">
            <svg class="social-svg" viewBox="0 0 24 24"><path fill="#0A66C2" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            <span>LinkedIn</span>
          </button>
        </div>

        <footer class="auth-footer-prompt">
          <a href="mailto:info@trikonet.com?subject=Trikonet%20Password%20Reset%20Request" class="forgot-link">Forgot password?</a>
        </footer>
      </div>
    </div>
  </main>`;
}
const emailTemplates=[['Job alert','New opportunities selected for you','<h2>New jobs for you</h2><p>We found new opportunities that match your profile.</p>'],['Application update','Your application status','<h2>Application update</h2><p>There is an update about your recent application.</p>'],['Welcome','Welcome to Trikonet','<h2>Welcome to Trikonet</h2><p>Your account is ready. Start exploring new opportunities.</p>']];
function campaignsPage(){if(!currentUser)return `<main class="member-page"><section class="member-card locked"><span class="lock-icon">🔒</span><h1>Sign in to use email campaigns</h1><p>Create and edit templates, save drafts, resume later, and keep your sending history private to your account.</p><a class="primary" href="/login">Sign up or log in</a></section></main>`;return `<main class="campaign-page"><header class="campaign-heading"><div><span class="eyebrow">MEMBER FEATURE</span><h1>Email campaigns</h1><p>Compose from a template, save your work, and resume it anytime.</p></div><button class="primary" id="newCampaign">New email</button></header><div class="campaign-layout"><aside class="template-panel"><h2>Templates</h2>${emailTemplates.map((t,i)=>`<button class="template-choice" data-template="${i}"><b>${t[0]}</b><span>${t[1]}</span></button>`).join('')}</aside><section class="composer member-card"><form id="campaignForm"><input type="hidden" name="id"><label>Campaign name<input name="name" required placeholder="e.g. Dubai nurse jobs — September"></label><label>Recipients<textarea name="recipients" rows="2" placeholder="email@example.com, another@example.com"></textarea></label><label>Subject<input name="subject" required></label><label>Email content<div class="email-toolbar"><button type="button" data-command="bold"><b>B</b></button><button type="button" data-command="italic"><i>I</i></button><button type="button" data-command="insertUnorderedList">• List</button></div><div class="email-editor" contenteditable="true" role="textbox" aria-label="Email content"></div></label><div class="campaign-actions"><button class="primary" type="submit">Save draft</button><button class="outline" type="button" id="sendCampaign">Send email</button></div><p class="form-message" aria-live="polite"></p></form></section><aside class="draft-panel"><h2>Saved & history</h2>${emailCampaigns.length?emailCampaigns.map(c=>`<button class="draft-choice" data-id="${escapeAttr(c.id)}"><b>${escapeAttr(c.name||c.subject)}</b><span>${escapeAttr(c.status)} · ${new Date(c.updatedAt).toLocaleDateString()}</span></button>`).join(''):'<p>No saved drafts yet.</p>'}</aside></div></main>`}
function resumeMakerPage() {
  return `<main class="service-page">
    <section class="service-hero">
      <div class="wrap service-hero-inner">
        <span class="service-badge">AI-Powered Resume Solution</span>
        <h1>Professional UAE Resume Maker</h1>
        <p>Create an executive, interview-ready CV structured specifically to meet UAE and Gulf recruiter expectations in minutes.</p>
        <div class="service-hero-actions">
          <a class="primary" href="#builder-start">Create My Resume Now</a>
          <a class="outline" href="#features">Explore Features</a>
        </div>
      </div>
    </section>
    <section class="wrap service-content-section" id="features">
      <div class="service-grid-3">
        <div class="service-feature-card">
          <div class="sfc-icon">📋</div>
          <h3>Gulf-Standard Formats</h3>
          <p>Clean single and double-column structures with verified UAE visa, residency, and professional licensing sections.</p>
        </div>
        <div class="service-feature-card">
          <div class="sfc-icon">⚡</div>
          <h3>Pre-Built Industry Bullets</h3>
          <p>Over 1,200+ battle-tested achievement bullet points for healthcare, nursing, finance, education, and tech roles.</p>
        </div>
        <div class="service-feature-card">
          <div class="sfc-icon">📥</div>
          <h3>Instant PDF & Word Export</h3>
          <p>Download print-ready high-resolution PDFs or fully editable DOCX files formatted for immediate recruiter sharing.</p>
        </div>
      </div>

      <div class="service-interactive-box" id="builder-start">
        <div class="sib-header">
          <h2>Start Building Your UAE Resume</h2>
          <p>Fill in your basic information below to generate your initial template preview.</p>
        </div>
        <form class="service-form" onsubmit="event.preventDefault(); alert('Your resume workspace has been created! Our template wizard is launching.');">
          <div class="sform-grid">
            <label>Full Name
              <input type="text" required placeholder="e.g. Athira Susan James">
            </label>
            <label>Target Job Title
              <input type="text" required placeholder="e.g. Registered Staff Nurse / Financial Analyst">
            </label>
            <label>Years of Experience
              <select>
                <option>Entry Level (0 - 2 years)</option>
                <option>Mid-Level (3 - 6 years)</option>
                <option>Senior / Executive (7+ years)</option>
              </select>
            </label>
            <label>Current Location
              <select>
                <option>Dubai, UAE</option>
                <option>Abu Dhabi, UAE</option>
                <option>Sharjah, UAE</option>
                <option>Other UAE Emirate</option>
                <option>Outside UAE (Planning Relocation)</option>
              </select>
            </label>
            <label>Email Address
              <input type="email" required placeholder="name@example.com">
            </label>
            <label>Mobile Number (WhatsApp)
              <input type="tel" required placeholder="+971 50 123 4567">
            </label>
          </div>
          <button type="submit" class="primary service-submit-btn">Build & Preview My Resume →</button>
        </form>
      </div>
    </section>
  </main>`;
}

function atsResumeBuilderPage() {
  return `<main class="service-page">
    <section class="service-hero ats-hero">
      <div class="wrap service-hero-inner">
        <span class="service-badge highlight">ATS Optimization Engine</span>
        <h1>ATS Resume Builder for UAE Jobs</h1>
        <p>Beat the automated candidate screening systems (Taleo, Oracle HCM, Workday, iCIMS) used by UAE hospitals and top enterprises with 95%+ parse rates.</p>
        <div class="service-hero-actions">
          <a class="primary" href="#ats-check">Scan & Optimize My Resume</a>
          <a class="outline" href="#ats-guide">How ATS Works</a>
        </div>
      </div>
    </section>
    <section class="wrap service-content-section" id="ats-guide">
      <div class="service-grid-3">
        <div class="service-feature-card">
          <div class="sfc-icon">🤖</div>
          <h3>Parser-Safe Architecture</h3>
          <p>No tables, unreadable graphics, or multi-nested text frames that cause Gulf ATS software to reject your application.</p>
        </div>
        <div class="service-feature-card">
          <div class="sfc-icon">🎯</div>
          <h3>Target Keyword Injector</h3>
          <p>Automatically match job descriptions from NMC, Aldar, Burjeel, and government job postings to trigger high match scores.</p>
        </div>
        <div class="service-feature-card">
          <div class="sfc-icon">📊</div>
          <h3>Real-Time Score Audit</h3>
          <p>Get a comprehensive diagnostic report highlighting missing industry certifications, formatting flaws, and readability rating.</p>
        </div>
      </div>

      <div class="service-interactive-box" id="ats-check">
        <div class="sib-header">
          <h2>Upload Your Resume for Free ATS Diagnostic</h2>
          <p>Upload your current CV to check its ATS readability score against UAE recruitment criteria.</p>
        </div>
        <div class="ats-upload-dropzone" onclick="document.getElementById('ats-file-input').click()">
          <input type="file" id="ats-file-input" style="display:none" onchange="alert('CV received! Your ATS compatibility score is 92/100. Recommendations generated.')">
          <div class="aud-icon">📄</div>
          <h3>Click or Drag & Drop your Resume (PDF or DOCX)</h3>
          <p>Supports files up to 10MB. 100% confidential and safe.</p>
          <button type="button" class="primary" style="margin-top:12px;">Select Resume File</button>
        </div>
      </div>
    </section>
  </main>`;
}

function medicalCoderClassPage() {
  return `<main class="service-page">
    <section class="service-hero medical-hero">
      <div class="wrap service-hero-inner">
        <span class="service-badge">Healthcare Career Academy</span>
        <h1>Medical Coder Training & Certification Class</h1>
        <p>Master AAPC Certified Professional Coder (CPC) preparation, ICD-10-CM, CPT, and UAE insurance reimbursement guidelines with certified mentors.</p>
        <div class="service-hero-actions">
          <a class="primary" href="#enroll">Enroll in Next Batch</a>
          <a class="outline" href="#curriculum">View Course Syllabus</a>
        </div>
      </div>
    </section>
    <section class="wrap service-content-section" id="curriculum">
      <div class="service-grid-3">
        <div class="service-feature-card">
          <div class="sfc-icon">🩺</div>
          <h3>ICD-10-CM & CPT Mastery</h3>
          <p>In-depth clinical code assignment, HCPCS Level II modifiers, and diagnostic validation tailored to DOH, DHA, and MOHAP standards.</p>
        </div>
        <div class="service-feature-card">
          <div class="sfc-icon">🏆</div>
          <h3>AAPC CPC Exam Preparation</h3>
          <p>100+ hours of rigorous live sessions, 6 mock exams, and test-taking strategies with a 94% first-attempt pass rate.</p>
        </div>
        <div class="service-feature-card">
          <div class="sfc-icon">💼</div>
          <h3>UAE Hospital Placement</h3>
          <p>Direct placement coordination with leading UAE hospital groups, clinics, and medical coding billing centers.</p>
        </div>
      </div>

      <div class="service-interactive-box" id="enroll">
        <div class="sib-header">
          <h2>Enroll in the Upcoming Batch (Weekend & Evening Available)</h2>
          <p>Reserve your seat or speak with a senior medical coding advisor.</p>
        </div>
        <form class="service-form" onsubmit="event.preventDefault(); alert('Thank you for registering! An admissions advisor will contact you with syllabus details and batch schedule.');">
          <div class="sform-grid">
            <label>Student Full Name
              <input type="text" required placeholder="Your full name">
            </label>
            <label>Educational Background
              <select>
                <option>Life Sciences / Nursing / Pharmacy</option>
                <option>Medical Graduate (MBBS / BDS / BAMS / BHMS)</option>
                <option>Science / Non-Medical Graduate</option>
                <option>Other / High School</option>
              </select>
            </label>
            <label>Preferred Batch
              <select>
                <option>Weekend Batch (Sat & Sun)</option>
                <option>Weekday Evening Batch (Mon - Thu)</option>
                <option>Self-Paced Recorded + Live Mentorship</option>
              </select>
            </label>
            <label>City / Country
              <input type="text" required placeholder="e.g. Dubai, UAE / India / Philippines">
            </label>
            <label>Email Address
              <input type="email" required placeholder="name@example.com">
            </label>
            <label>WhatsApp Contact
              <input type="tel" required placeholder="+971 50 123 4567">
            </label>
          </div>
          <button type="submit" class="primary service-submit-btn">Request Syllabus & Reserve Seat →</button>
        </form>
      </div>
    </section>
  </main>`;
}

function getAdminAuth() {
  try {
    const raw = localStorage.getItem('trikonet_admin_session') || sessionStorage.getItem('trikonet_admin_session');
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session?.expiresAt || Number(session.expiresAt) <= Date.now()) return null;
    if (session.role !== 'Administrator' && session.role !== 'Editor') return null;
    return session;
  } catch {}
  return null;
}

function notFound404Page() {
  return `<main class="page-404-wrap" style="min-height:70vh; display:flex; align-items:center; justify-content:center; text-align:center; padding:60px 20px;">
    <div style="max-width:540px; margin:0 auto;">
      <div style="font-size:88px; font-weight:900; line-height:1; color:#b00008; margin-bottom:16px; font-family:Inter, sans-serif; letter-spacing:-2px;">404</div>
      <h1 style="font-size:26px; font-weight:700; color:#0f172a; margin-bottom:12px;">Page Not Found</h1>
      <p style="font-size:15px; color:#64748b; line-height:1.6; margin-bottom:28px;">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
        <a href="/" style="display:inline-flex; align-items:center; gap:8px; background:#b00008; color:#fff; padding:12px 24px; border-radius:8px; font-weight:600; font-size:14px; text-decoration:none; box-shadow:0 4px 12px rgba(176,0,8,0.2);">Return to Home</a>
        <a href="/jobs" style="display:inline-flex; align-items:center; gap:8px; background:#f1f5f9; color:#1e293b; padding:12px 20px; border-radius:8px; font-weight:600; font-size:14px; text-decoration:none;">Search Jobs</a>
      </div>
    </div>
  </main>`;
}

function adminLoginPage() {
  return `<style>
    .admin-auth-page{min-height:100vh;display:grid;grid-template-columns:minmax(320px,.9fr) minmax(520px,1.1fr);background:#f7f8fb;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#111827}
    .admin-auth-brand{position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:46px 52px;background:linear-gradient(145deg,#740006 0%,#a60008 48%,#d21d27 100%);color:#fff}
    .admin-auth-brand:before,.admin-auth-brand:after{content:"";position:absolute;border-radius:50%;pointer-events:none}
    .admin-auth-brand:before{width:430px;height:430px;right:-210px;top:-190px;border:1px solid rgba(255,255,255,.16);box-shadow:0 0 0 70px rgba(255,255,255,.035),0 0 0 140px rgba(255,255,255,.025)}
    .admin-auth-brand:after{width:280px;height:280px;left:-150px;bottom:-145px;background:rgba(42,0,2,.18)}
    .admin-auth-logo,.admin-auth-copy,.admin-auth-brand-foot{position:relative;z-index:1}
    .admin-auth-logo{display:flex;align-items:center;width:max-content;padding:10px 14px;border-radius:12px;background:#fff;box-shadow:0 8px 22px rgba(55,0,3,.16)}
    .admin-auth-logo img{width:154px;height:auto;display:block}
    .admin-auth-copy{max-width:470px;margin:auto 0}
    .admin-auth-kicker{display:inline-flex;align-items:center;gap:8px;margin-bottom:22px;padding:7px 11px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(255,255,255,.1);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
    .admin-auth-kicker:before{content:"";width:7px;height:7px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(255,255,255,.14)}
    .admin-auth-copy h2{margin:0 0 18px;font-size:clamp(34px,4vw,54px);line-height:1.05;letter-spacing:-.045em;color:#fff}
    .admin-auth-copy p{max-width:410px;margin:0;color:rgba(255,255,255,.78);font-size:16px;line-height:1.7}
    .admin-auth-points{display:grid;gap:12px;margin-top:34px}
    .admin-auth-point{display:flex;align-items:center;gap:11px;color:rgba(255,255,255,.88);font-size:13px;font-weight:600}
    .admin-auth-point svg{width:18px;height:18px;flex:0 0 auto}
    .admin-auth-brand-foot{font-size:12px;color:rgba(255,255,255,.62)}
    .admin-auth-form-side{display:flex;align-items:center;justify-content:center;padding:48px}
    .admin-auth-card{width:100%;max-width:465px}
    .admin-auth-mobile-logo{display:none;margin-bottom:32px}.admin-auth-mobile-logo img{width:160px;height:auto}
    .admin-auth-icon{width:48px;height:48px;display:grid;place-items:center;margin-bottom:28px;border-radius:14px;background:#fff1f2;color:#b00008;box-shadow:inset 0 0 0 1px #ffe0e3}
    .admin-auth-card h1{margin:0 0 10px;font-size:32px;line-height:1.2;letter-spacing:-.035em;color:#111827}
    .admin-auth-intro{margin:0 0 34px;color:#687386;font-size:14px;line-height:1.65}
    .admin-auth-field{display:block;margin-bottom:20px}
    .admin-auth-field>span{display:block;margin-bottom:8px;color:#263244;font-size:13px;font-weight:700}
    .admin-auth-input-wrap{position:relative}
    .admin-auth-input{width:100%;height:54px;box-sizing:border-box;border:1px solid #d8dee8;border-radius:12px;background:#fff;padding:0 16px;color:#111827;font-size:14px;outline:none;box-shadow:0 1px 2px rgba(15,23,42,.03);transition:border-color .18s,box-shadow .18s}
    .admin-auth-input::placeholder{color:#9aa4b2}.admin-auth-input:focus{border-color:#b00008;box-shadow:0 0 0 4px rgba(176,0,8,.09)}
    .admin-auth-input.has-action{padding-right:50px}
    .admin-pass-toggle{position:absolute;right:7px;top:7px;width:40px;height:40px;display:grid;place-items:center;border:0;border-radius:9px;background:transparent;color:#7c8798;cursor:pointer}
    .admin-pass-toggle:hover{background:#f2f4f7;color:#263244}.admin-pass-toggle svg{width:19px;height:19px}
    #adminLoginError{display:none;margin-bottom:20px;padding:12px 14px;border:1px solid #fecaca;border-radius:10px;background:#fff1f2;color:#991b1b;font-size:13px;line-height:1.5}
    .admin-auth-submit{width:100%;height:54px;margin-top:8px;display:flex;align-items:center;justify-content:center;gap:10px;border:0;border-radius:12px;background:linear-gradient(135deg,#a90008,#cf1822);color:#fff;font-size:14px;font-weight:750;cursor:pointer;box-shadow:0 10px 24px rgba(176,0,8,.22);transition:transform .18s,box-shadow .18s,filter .18s}
    .admin-auth-submit:hover{transform:translateY(-1px);box-shadow:0 14px 28px rgba(176,0,8,.28);filter:saturate(1.08)}.admin-auth-submit:disabled{opacity:.7;cursor:wait;transform:none}
    .admin-auth-meta{display:flex;align-items:flex-start;gap:10px;margin-top:28px;padding-top:23px;border-top:1px solid #e5e9f0;color:#7b8797;font-size:12px;line-height:1.55}
    .admin-auth-meta svg{width:17px;height:17px;flex:0 0 auto;margin-top:1px;color:#8c96a5}
    .admin-auth-home{display:inline-flex;align-items:center;gap:7px;margin-top:22px;color:#596579;font-size:12px;font-weight:650;text-decoration:none}.admin-auth-home:hover{color:#b00008}
    @media(max-width:860px){.admin-auth-page{display:block;background:#fff}.admin-auth-brand{display:none}.admin-auth-form-side{min-height:100vh;padding:42px 24px}.admin-auth-mobile-logo{display:block}.admin-auth-card{max-width:500px}.admin-auth-card h1{font-size:29px}}
    @media(max-width:480px){.admin-auth-form-side{align-items:flex-start;padding:28px 20px}.admin-auth-mobile-logo{margin-bottom:42px}.admin-auth-icon{margin-bottom:22px}.admin-auth-card h1{font-size:26px}.admin-auth-intro{margin-bottom:28px}}
  </style>
  <main class="admin-auth-page">
    <section class="admin-auth-brand" aria-label="Trikonet administration portal">
      <a class="admin-auth-logo" href="/"><img src="/assets/logo-black.png" alt="Trikonet"></a>
      <div class="admin-auth-copy">
        <span class="admin-auth-kicker">Private workspace</span>
        <h2>Run Trikonet<br>with confidence.</h2>
        <p>Manage jobs, employers, content and platform operations from one secure workspace.</p>
        <div class="admin-auth-points">
          <div class="admin-auth-point"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg>Protected administrator access</div>
          <div class="admin-auth-point"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg>Centralised publishing controls</div>
        </div>
      </div>
      <div class="admin-auth-brand-foot">Trikonet Administration · Internal use only</div>
    </section>
    <section class="admin-auth-form-side">
      <div class="admin-auth-card">
        <a class="admin-auth-mobile-logo" href="/"><img src="/assets/logo-black.png" alt="Trikonet"></a>
        <div class="admin-auth-icon"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></div>
        <h1>Welcome back</h1>
        <p class="admin-auth-intro">Sign in with your administrator credentials to continue to the Trikonet console.</p>
        <div id="adminLoginError" role="alert"></div>
        <form id="adminLoginForm">
          <label class="admin-auth-field"><span>Username or email</span><div class="admin-auth-input-wrap"><input class="admin-auth-input" type="text" id="adminLoginUser" required autocomplete="off" data-lpignore="true" data-form-type="other" readonly placeholder="Enter username or email"></div></label>
          <label class="admin-auth-field"><span>Password</span><div class="admin-auth-input-wrap"><input class="admin-auth-input has-action" type="password" id="adminLoginPass" required autocomplete="new-password" data-lpignore="true" data-form-type="other" readonly placeholder="Enter your password"><button class="admin-pass-toggle" id="adminPassToggle" type="button" aria-label="Show password" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg></button></div></label>
          <button type="submit" id="adminLoginBtn" class="admin-auth-submit">Sign in securely <span aria-hidden="true">→</span></button>
        </form>
        <div class="admin-auth-meta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg><span>This is a restricted system. Administrative activity may be recorded for security and auditing.</span></div>
        <a class="admin-auth-home" href="/">← Return to the Trikonet website</a>
      </div>
    </section>
  </main>`;
}

async function hashAdminPassword(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function initAdminLogin() {
  const form = document.getElementById('adminLoginForm');
  if (!form) return;
  const usernameInput = document.getElementById('adminLoginUser');
  const passwordInput = document.getElementById('adminLoginPass');
  const passwordToggle = document.getElementById('adminPassToggle');
  const clearAdminFields = () => {
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.type = 'password';
    }
  };
  [usernameInput, passwordInput].forEach(input => {
    input?.addEventListener('pointerdown', () => input.removeAttribute('readonly'), { once: true });
    input?.addEventListener('focus', () => input.removeAttribute('readonly'), { once: true });
  });
  clearAdminFields();
  requestAnimationFrame(clearAdminFields);
  setTimeout(clearAdminFields, 150);
  window.addEventListener('pageshow', clearAdminFields, { once: true });
  passwordToggle?.addEventListener('click', () => {
    const showing = passwordInput?.getAttribute('type') === 'text';
    passwordInput?.setAttribute('type', showing ? 'password' : 'text');
    passwordToggle.setAttribute('aria-pressed', String(!showing));
    passwordToggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
  });
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = (document.getElementById('adminLoginUser')?.value || '').trim();
    const passInput = (document.getElementById('adminLoginPass')?.value || '').trim();
    const errBox = document.getElementById('adminLoginError');
    const btn = document.getElementById('adminLoginBtn');

    if (!userInput || !passInput) {
      if (errBox) { errBox.textContent = 'Please enter both administrator username and password.'; errBox.style.display = 'block'; }
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Verifying credentials…'; }
    let response;
    try {
      response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: userInput, password: passInput })
      });
    } catch {
      if (errBox) { errBox.textContent = 'The administration service is unavailable. Please try again.'; errBox.style.display = 'block'; }
      if (btn) { btn.disabled = false; btn.innerHTML = 'Sign in securely <span aria-hidden="true">→</span>'; }
      return;
    }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.admin) {
      if (errBox) { errBox.textContent = payload.error || 'Invalid administrator username or password.'; errBox.style.display = 'block'; }
      if (btn) { btn.disabled = false; btn.innerHTML = 'Sign in securely <span aria-hidden="true">→</span>'; }
      return;
    }

    const session = { ...payload.admin, loginAt: new Date().toISOString() };

    localStorage.removeItem('trikonet_admin_session');
    sessionStorage.setItem('trikonet_admin_session', JSON.stringify(session));

    window.location.href = '/admin';
  });
}

function isResumeBuilderPath(p) {
  return p === '/resume-library' ||
         p === '/services/resume-maker' ||
         p === '/resume-maker' ||
         p === '/services/resume-builder' ||
         p === '/resume-builder' ||
         p === '/services/ats-resume-builder' ||
         p === '/ats-resume-builder' ||
         p === '/cv-builder' ||
         p === '/services/cv-builder';
}

function fitEmployerLogos() {
  document.querySelectorAll('.emp-profile-logo-img').forEach(sourceImage => {
    if (sourceImage.dataset.trimAttempted === 'true') return;
    sourceImage.dataset.trimAttempted = 'true';
    const probe = new Image();
    probe.crossOrigin = 'anonymous';
    probe.onload = () => {
      try {
        const maxSample = 320;
        const scale = Math.min(1, maxSample / Math.max(probe.naturalWidth, probe.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(probe.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(probe.naturalHeight * scale));
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(probe, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const offset = (y * canvas.width + x) * 4;
            const visible = pixels[offset + 3] > 18 && Math.min(pixels[offset], pixels[offset + 1], pixels[offset + 2]) < 242;
            if (!visible) continue;
            left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
          }
        }
        if (right < left || bottom < top) return;
        const contentWidth = right - left + 1;
        const contentHeight = bottom - top + 1;
        const occupiedArea = (contentWidth * contentHeight) / (canvas.width * canvas.height);
        if (occupiedArea > .68) return;
        const padding = Math.max(2, Math.round(Math.max(contentWidth, contentHeight) * .08));
        const output = document.createElement('canvas');
        output.width = contentWidth + padding * 2;
        output.height = contentHeight + padding * 2;
        output.getContext('2d').drawImage(canvas, left, top, contentWidth, contentHeight, padding, padding, contentWidth, contentHeight);
        sourceImage.src = output.toDataURL('image/png');
        sourceImage.classList.add('is-trimmed-logo');
      } catch {
        sourceImage.classList.add('is-logo-fallback-enlarged');
      }
    };
    probe.onerror = () => sourceImage.classList.add('is-logo-fallback-enlarged');
    probe.src = sourceImage.currentSrc || sourceImage.src;
  });
}

function render() {
  if (path === '/admin-login' || path === '/admin-portal' || path === '/trikonet-admin-access') {
    return adminLoginPage();
  }
  if (path.startsWith('/admin')) {
    if (!getAdminAuth()) {
      return header() + notFound404Page() + footer();
    }
    return renderAdmin(data);
  }
  if (path === '/404') {
    return header() + notFound404Page() + footer();
  }
  if (isResumeBuilderPath(path)) {
    return '<div id="cv-builder-root"></div>';
  }
  let body;
  if (path === '/') body = home();
  else if (path === '/login' || path === '/signin' || path === '/sign-in' || path === '/login-register' || path === '/register' || path === '/signup' || path === '/sign-up' || path === '/profile') body = accountPage();
  else if (path === '/saved-jobs') body = memberWorkspacePage('saved_jobs');
  else if (path === '/applied-jobs') body = memberWorkspacePage('applied_jobs');
  else if (path === '/followed-companies') body = memberWorkspacePage('followed_companies');
  else if (path === '/email-campaigns') body = campaignsPage();
  else if (path === '/nurse-jobs-in-uae') body = nurseJobsPage();
  else if (path.startsWith('/category/')) body = categoryPage();
  else if (path === '/jobs' || path === '/job-list' || path === '/job-openings' || path.startsWith('/job-location/')) body = jobs();
  else if (path === '/employers') body = employers();
  else if (path === '/services/medical-coder-class' || path === '/medical-coder-class') body = medicalCoderClassPage();
  else if (path.startsWith('/employer/')) {
    const local = data.employers?.find(e => e.local && path === `/employer/${e.slug}`);
    body = renderEmployerDetail(local || wpRecord, path, profileJobs);
  }
  else if (path === '/about') body = about();
  else if (path === '/blog') body = blog();
  else if (path.startsWith('/blog/')) {
    const postSlug = path.slice('/blog/'.length).replace(/\/$/, '');
    const p = data.posts?.find(item => item.slug === postSlug);
    if (p) {
      const canonicalUrl = getPostUrl(p);
      if (typeof window !== 'undefined' && window.history && window.history.replaceState && canonicalUrl !== path) {
        window.history.replaceState(null, '', canonicalUrl + window.location.search);
      }
      body = post(p);
    } else {
      body = notFound404Page();
    }
  }
  else if (BLOG_CATEGORY_PREFIXES.includes(path.slice(1).replace(/\/$/, ''))) {
    const catSlug = path.slice(1).replace(/\/$/, '');
    const catName = CATEGORY_PREFIX_LABELS[catSlug] || catSlug;
    queryParams.set('category', catName);
    body = blog();
  }
  else if (BLOG_CATEGORY_PREFIXES.some(prefix => path.startsWith(`/${prefix}/`))) {
    const pathParts = path.split('/').filter(Boolean);
    const postSlug = pathParts[1] ? pathParts[1].replace(/\/$/, '') : '';
    const p = data.posts?.find(item => item.slug === postSlug);
    if (p) {
      body = post(p);
    } else {
      body = notFound404Page();
    }
  }
  else if (path === '/faq') body = faq();
  else if (path === '/contact') body = contact();
  else if (path === '/submit-job') body = employerSignupComingSoon();
  else if (path.startsWith('/job/')) {
    const local = data.jobs.find(j => j.local && path === `/job/${j.slug}`);
    const currentJob = local || wpRecord || data.jobs.find(j => path.endsWith(j.slug));
    const employer = wpEmployer || (local ? data.employers?.find(e => e.slug === local.employerSlug || e.title === local.company) : null) || (data.employers?.find(e => wpRecord?.metas?._job_employer_name && e.title?.toLowerCase() === wpRecord.metas._job_employer_name.toLowerCase())) || null;
    const relatedValue = (job, field, metaField) => {
      const direct = job?.[field];
      const meta = job?.metas?.[metaField];
      const value = Array.isArray(direct) ? direct.join(' ') : (direct || (meta && typeof meta === 'object' ? Object.values(meta).join(' ') : meta) || '');
      return String(value).toLowerCase();
    };
    const currentCategory = relatedValue(currentJob, 'categories', '_job_category') || relatedValue(currentJob, 'category', '_job_category');
    const currentLocation = relatedValue(currentJob, 'locations', '_job_location') || relatedValue(currentJob, 'location', '_job_location');
    const currentCompany = (currentJob?.metas?._job_employer_name || currentJob?.company || employer?.title?.rendered || employer?.title || '').trim().toLowerCase();
    const currentEmployerId = currentJob?.metas?._job_employer_posted_by || employer?.id;

    const isSameCompany = (job) => {
      const comp = (job?.metas?._job_employer_name || job?.company || '').trim().toLowerCase();
      if (currentCompany && comp && (comp === currentCompany || comp.includes(currentCompany) || currentCompany.includes(comp))) {
        return true;
      }
      if (currentEmployerId && job?.metas?._job_employer_posted_by && String(job.metas._job_employer_posted_by) === String(currentEmployerId)) {
        return true;
      }
      return false;
    };

    // Related jobs pool MUST come from the same category and EXCLUDE the same company!
    const relatedPool = [...categoryJobs, ...(data.jobs || [])];
    const seenRelated = new Set();
    const catTokens = currentCategory.split(/[\s,]+/).filter(w => w.length > 2);
    const relatedMatches = relatedPool
      .filter(job => job && job.slug && job.slug !== currentJob?.slug && !isSameCompany(job) && !seenRelated.has(job.slug) && seenRelated.add(job.slug))
      .map((job, index) => {
        const jobCategory = relatedValue(job, 'categories', '_job_category') || relatedValue(job, 'category', '_job_category');
        const jobLocation = relatedValue(job, 'locations', '_job_location') || relatedValue(job, 'location', '_job_location');
        const matchCount = catTokens.filter(t => jobCategory.includes(t)).length;
        const hasMatch = matchCount > 0 || (currentCategory && jobCategory && (jobCategory.includes(currentCategory) || currentCategory.includes(jobCategory)));
        const score = (hasMatch ? (matchCount * 4 || 4) : 0)
          + (currentLocation && jobLocation && (jobLocation.includes(currentLocation) || currentLocation.includes(jobLocation)) ? 2 : 0);
        return { job, score, index, hasMatch };
      })
      .filter(item => item.hasMatch)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, 4)
      .map(item => item.job);
    body = renderJobDetail(currentJob, employer, path, orgJobs, relatedMatches);
  }
  else {
    const pathParts = path.split('/').filter(Boolean);
    const postBySlug = (pathParts.length === 2)
      ? data.posts?.find(p => p.slug === pathParts[1])
      : data.posts?.find(p => path.endsWith(`/${p.slug}`));
    if (postBySlug) {
      body = post(postBySlug);
    } else {
      body = generic();
    }
  }
  const memberAuthPaths = ['/login','/signin','/sign-in','/login-register','/register','/signup','/sign-up'];
  if (memberAuthPaths.includes(path)) return body + footer();
  return header() + body + footer();
}
const initialLoads=[loadAccount()];
if(path==='/')initialLoads.push(loadLocalJobs(),loadTopEmployers(),loadCounts(),loadConnectedContent());
else if(path==='/jobs'||path==='/job-list'||path==='/job-openings'||path==='/nurse-jobs-in-uae'||path.startsWith('/category/')||path.startsWith('/job-location/'))initialLoads.push(loadLocalJobs(),loadCounts(),loadConnectedContent());
else if(path==='/employers')initialLoads.push(loadLocalEmployers(),loadCounts(),loadConnectedContent());
else if(path.startsWith('/job/'))initialLoads.push(loadWordPressRecord(),loadLocalJobs(),loadCounts());
else if(path.startsWith('/employer/'))initialLoads.push(loadWordPressRecord(),loadCounts());
else if(path==='/blog'||path.startsWith('/blog/')||POST_SLUG_PREFIXES[path.split('/').filter(Boolean).at(-1)])initialLoads.push(loadConnectedContent(),loadCounts());
else initialLoads.push(loadConnectedContent(),loadCounts());
await Promise.all(initialLoads);
// Published article data comes from the backend. The admin screen also keeps
// local draft/mock records, but those must never replace database content on
// the public site.
document.querySelector('#app').innerHTML=render();
fitEmployerLogos();
initCandidateProfile();
document.querySelectorAll('.emp-follow-btn').forEach(button => {
  if (!currentUser || !button.dataset.slug) return;
  const userKey = currentUser.id || currentUser.email || 'member';
  try {
    const isFollowing = localStorage.getItem(`trikonet_follow_employer_${userKey}_${button.dataset.slug}`) === 'true';
    button.classList.toggle('following', isFollowing);
    button.textContent = isFollowing ? '✓ Following' : '+ Follow';
  } catch {}
});
{
  const filterToggle = document.getElementById('empMobileFilterToggle');
  const expandableFilters = document.getElementById('empExpandableFilters');
  if (filterToggle && expandableFilters) {
    filterToggle.addEventListener('click', () => {
      const expanded = expandableFilters.classList.toggle('is-open');
      filterToggle.setAttribute('aria-expanded', String(expanded));
      const label = filterToggle.querySelector('span');
      if (label) label.textContent = expanded ? 'Hide filters' : 'Show filters';
    });
  }
}
{
  const descriptionCopy = document.getElementById('jobDescriptionCopy');
  const descriptionToggle = document.getElementById('jobDescriptionToggle');
  if (descriptionCopy && descriptionToggle) {
    const setDescriptionCollapsePoint = () => {
      const paragraphs = descriptionCopy.querySelectorAll('.wordpress-content p');
      if (paragraphs.length <= 2) {
        descriptionCopy.classList.add('is-expanded');
        descriptionToggle.hidden = true;
        return;
      }
      const copyTop = descriptionCopy.getBoundingClientRect().top;
      let targetP = paragraphs[Math.min(1, paragraphs.length - 1)];
      for (let i = 1; i < paragraphs.length && i < 8; i++) {
        const h = paragraphs[i].getBoundingClientRect().bottom - copyTop;
        if (h >= 180) {
          targetP = paragraphs[i];
          break;
        }
      }
      const secondBottom = Math.max(targetP.getBoundingClientRect().bottom - copyTop, 180);
      descriptionCopy.style.setProperty('--job-description-collapsed-height', `${Math.ceil(secondBottom)}px`);
      descriptionToggle.hidden = false;
    };
    requestAnimationFrame(setDescriptionCollapsePoint);
    window.addEventListener('resize', setDescriptionCollapsePoint, { passive: true });
    descriptionToggle.addEventListener('click', () => {
      const expanded = descriptionCopy.classList.toggle('is-expanded');
      descriptionToggle.setAttribute('aria-expanded', String(expanded));
      const label = descriptionToggle.querySelector('span');
      if (label) label.textContent = expanded ? 'Show less' : 'Read more';
      if (!expanded) descriptionCopy.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}
{
  const reportModal = document.getElementById('jobReportModal');
  const reportOpen = document.getElementById('openJobReportBtn');
  const reportClose = document.getElementById('closeJobReportBtn');
  const reportForm = document.getElementById('jobReportForm');
  const closeReportModal = () => {
    if (!reportModal) return;
    reportModal.hidden = true;
    reportModal.setAttribute('aria-hidden', 'true');
    document.body.style.removeProperty('overflow');
  };
  reportOpen?.addEventListener('click', () => {
    reportModal.hidden = false;
    reportModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    reportModal.querySelector('input[name="reason"]')?.focus();
  });
  reportClose?.addEventListener('click', closeReportModal);
  reportModal?.addEventListener('click', event => { if (event.target === reportModal) closeReportModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && reportModal && !reportModal.hidden) closeReportModal(); });
  reportForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = reportForm.querySelector('.job-report-submit');
    const message = reportForm.querySelector('.job-report-message');
    const formData = new FormData(reportForm);
    const payload = Object.fromEntries(formData.entries());
    payload.jobPath = `${location.pathname}${location.search}`;
    submit.disabled = true;
    message.textContent = 'Submitting your report…';
    try {
      const response = await fetch('/api/job-reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to submit report.');
      message.textContent = 'Thank you. This job has been reported for review.';
      reportForm.reset();
      window.setTimeout(closeReportModal, 1400);
    } catch (error) {
      message.textContent = error.message || 'Unable to submit report.';
    } finally {
      submit.disabled = false;
    }
  });
}
if (isResumeBuilderPath(path)) {
  initCVBuilder('#cv-builder-root');
}
initCategoryAutocomplete();
initBlogDirectory();
initRecentArticlesAutoSlider();
if (path === '/admin-login' || path === '/admin-portal' || path === '/trikonet-admin-access') {
  initAdminLogin();
}
if(path.startsWith('/employer/')){
  const empSlug = path.replace('/employer/', '').split('/')[0].split('?')[0];
  if(empSlug && window.renderEmployerUserReviews) window.renderEmployerUserReviews(empSlug);
}

function initCategoryAutocomplete() {
  const input = document.getElementById('category-search-input');
  const box = document.getElementById('category-suggestions');
  const clearBtn = document.getElementById('category-clear-btn');
  if (!input || !box) return;

  const list = box.querySelector('.category-suggestions-list');
  let selectedIndex = -1;

  function getCategories() {
    return Array.isArray(data.taxonomies?.categories) ? data.taxonomies.categories : [];
  }

  function renderSuggestions(query) {
    const q = (query || '').trim().toLowerCase();
    const all = getCategories();
    let matches = [];

    if (!q) {
      matches = [...all].sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 5);
    } else {
      const starts = all.filter(c => c.name.toLowerCase().startsWith(q));
      const includes = all.filter(c => !c.name.toLowerCase().startsWith(q) && c.name.toLowerCase().includes(q));
      matches = [...starts, ...includes].slice(0, 5);
    }

    selectedIndex = -1;

    if (!matches.length) {
      list.innerHTML = `<li class="category-no-suggestions">No categories found matching "${escapeAttr(query)}"</li>`;
      box.style.display = 'block';
      return;
    }

    list.innerHTML = matches.map((item, index) => {
      let highlightedName = escapeAttr(item.name);
      if (q) {
        const reg = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        highlightedName = escapeAttr(item.name).replace(reg, '<strong>$1</strong>');
      }
      return `<li class="category-suggestion-item" data-value="${escapeAttr(item.name)}" data-index="${index}" role="option">
        <span class="suggestion-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        </span>
        <span class="suggestion-text">${highlightedName}</span>
        ${item.count ? `<span class="suggestion-count">${Number(item.count).toLocaleString()} jobs</span>` : ''}
      </li>`;
    }).join('');

    box.style.display = 'block';
  }

  input.addEventListener('input', () => {
    const val = input.value;
    if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';
    renderSuggestions(val);
  });

  input.addEventListener('focus', () => {
    renderSuggestions(input.value);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      input.value = '';
      clearBtn.style.display = 'none';
      renderSuggestions('');
      input.focus();
    });
  }

  box.addEventListener('click', (e) => {
    const item = e.target.closest('.category-suggestion-item');
    if (!item) return;
    input.value = item.dataset.value || '';
    if (clearBtn) clearBtn.style.display = input.value ? 'flex' : 'none';
    box.style.display = 'none';
  });

  input.addEventListener('keydown', (e) => {
    const items = list.querySelectorAll('.category-suggestion-item');
    if (!items.length || box.style.display === 'none') return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateActiveItem(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateActiveItem(items);
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && items[selectedIndex]) {
        e.preventDefault();
        input.value = items[selectedIndex].dataset.value || '';
        if (clearBtn) clearBtn.style.display = input.value ? 'flex' : 'none';
        box.style.display = 'none';
      }
    } else if (e.key === 'Escape') {
      box.style.display = 'none';
    }
  });

  function updateActiveItem(items) {
    items.forEach((it, idx) => {
      it.classList.toggle('active', idx === selectedIndex);
      if (idx === selectedIndex) it.scrollIntoView({ block: 'nearest' });
    });
  }

  document.addEventListener('click', (e) => {
    if (!document.getElementById('category-autocomplete')?.contains(e.target)) {
      box.style.display = 'none';
    }
  });
}
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
    if(record && data.posts && data.posts.some(p => p.slug === record.slug)){
      canonical.href=`${SITE_ORIGIN}${getPostUrl(record)}`;
    } else {
      canonical.href=`${SITE_ORIGIN}${path==='/'?'/':`/${record.slug}`}`;
    }
  }catch{}
}
applySavedSeoMeta();
function cleanSchemaText(value=''){const box=document.createElement('div');box.innerHTML=String(value);return (box.textContent||'').replace(/\s+/g,' ').trim()}
function isoSchemaDate(value){const date=new Date(value||'');return Number.isNaN(date.getTime())?'':date.toISOString()}
function addStructuredData(){
  if(path.startsWith('/admin'))return;
  const origin=SITE_ORIGIN,currentUrl=`${origin}${location.pathname}${location.search}`;
  const orgId=`${origin}/#organization`,siteId=`${origin}/#website`,pageId=`${origin}${location.pathname}#webpage`;
  const graph=[
    {'@type':'Organization','@id':orgId,name:'Trikonet',url:`${origin}/`,logo:{'@type':'ImageObject',url:`${origin}/assets/logo-black.png?${LOGO_VERSION}`},email:'info@trikonet.com'},
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
if(path.startsWith('/admin') && getAdminAuth()) initAdmin(data,store.set);
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
const upsertMemberCollection=(kind,item,remove=false)=>{
  if(!currentUser)return;
  const key=memberCollectionKey(kind);
  let items=readMemberCollection(kind);
  const identity=String(item.slug||item.id||'');
  items=items.filter(entry=>String(entry.slug||entry.id||'')!==identity);
  if(!remove)items.unshift(item);
  try{localStorage.setItem(key,JSON.stringify(items.slice(0,200)))}catch{}
};
const currentDetailJob=path.startsWith('/job/')?(wpRecord||data.jobs.find(job=>path.endsWith(`/${job.slug}`))):null;
const currentJobView=currentDetailJob?mapJob(currentDetailJob):null;
const jobSaveButton=document.querySelector('.detail-actions .save');
if(jobSaveButton&&currentJobView){
  const saved=readMemberCollection('saved_jobs').some(item=>String(item.slug)===String(currentJobView.slug));
  jobSaveButton.classList.toggle('is-saved',saved);
  jobSaveButton.setAttribute('aria-label',saved?'Remove saved job':'Save job');
  jobSaveButton.addEventListener('click',()=>{
    if(!currentUser){location.href=`/login?redirect=${encodeURIComponent(path)}`;return}
    const willSave=!jobSaveButton.classList.contains('is-saved');
    jobSaveButton.classList.toggle('is-saved',willSave);
    jobSaveButton.setAttribute('aria-label',willSave?'Remove saved job':'Save job');
    upsertMemberCollection('saved_jobs',{...currentJobView,savedAt:new Date().toISOString()},!willSave);
  });
}
const applyButton=document.querySelector('.detail-actions .apply');
if(applyButton&&currentJobView)applyButton.addEventListener('click',()=>{
  if(currentUser)upsertMemberCollection('applied_jobs',{...currentJobView,appliedAt:new Date().toISOString()});
});
const hambBtn=document.querySelector('.hamb');
hambBtn?.addEventListener('click',function(){
  const links=document.querySelector('.links');
  const isOpen=links?.classList.toggle('open');
  this.classList.toggle('open',!!isOpen);
  this.setAttribute('aria-expanded',isOpen?'true':'false');
  document.body.classList.toggle('mobile-nav-open',!!isOpen);
});
const closeMobileNavigation=()=>{
  document.querySelector('.links')?.classList.remove('open');
  document.querySelector('.hamb')?.classList.remove('open');
  document.querySelector('.hamb')?.setAttribute('aria-expanded','false');
  document.body.classList.remove('mobile-nav-open');
};
const accountMenu = document.querySelector('.nav-account-menu');
const accountToggle = document.querySelector('#navAccountToggle');
const accountDropdown = document.querySelector('#navAccountDropdown');
const closeAccountMenu = () => {
  accountMenu?.classList.remove('is-open');
  accountToggle?.setAttribute('aria-expanded', 'false');
  accountDropdown?.setAttribute('aria-hidden', 'true');
};
accountToggle?.addEventListener('click', event => {
  event.stopPropagation();
  const willOpen = !accountMenu?.classList.contains('is-open');
  accountMenu?.classList.toggle('is-open', willOpen);
  accountToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  accountDropdown?.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
});
accountDropdown?.addEventListener('click', event => event.stopPropagation());
document.addEventListener('click', closeAccountMenu);
document.querySelectorAll('.nav-profile-photo img, .nav-account-summary-avatar img, .mobile-account-avatar img').forEach(image => {
  image.addEventListener('error', () => image.remove(), { once: true });
});
document.querySelectorAll('.mobile-nav-actions a').forEach(link=>link.addEventListener('click',closeMobileNavigation));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMobileNavigation();closeAccountMenu()}});
document.querySelectorAll('.nav-has-mega > .nav-link, .nav-has-dropdown > .nav-link').forEach(link => {
  link.addEventListener('click', e => {
    if (window.innerWidth <= 1100) {
      e.preventDefault();
      const parent = link.closest('.nav-item');
      if (parent) {
        const isCurrentOpen = parent.classList.contains('mobile-expanded');
        document.querySelectorAll('.nav-item.mobile-expanded').forEach(item => item.classList.remove('mobile-expanded'));
        if (!isCurrentOpen) parent.classList.add('mobile-expanded');
      }
    }
  });
});
window.addEventListener('resize', () => {
  if (window.innerWidth <= 1100) return;
  const links = document.querySelector('.links');
  const button = document.querySelector('.hamb');
  links?.classList.remove('open');
  button?.classList.remove('open');
  button?.setAttribute('aria-expanded', 'false');
  document.querySelectorAll('.nav-item.mobile-expanded').forEach(item => item.classList.remove('mobile-expanded'));
  document.body.classList.remove('mobile-nav-open');
});
document.querySelector('#logoutBtn')?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/'});
document.querySelector('#mobileLogoutBtn')?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/'});
document.querySelector('#dashboardLogoutBtn')?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/'});
document.querySelector('#navAccountLogout')?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/'});

async function submitAuth(form,endpoint){
  const message=form.querySelector('.form-message');
  const submitBtn=form.querySelector('button[type="submit"]');
  const origContent=submitBtn?submitBtn.innerHTML:'';
  if(submitBtn){
    submitBtn.disabled=true;
    submitBtn.innerHTML=`<span>Please wait…</span>`;
  }
  if(message){
    message.className='form-message';
    message.textContent='Processing…';
  }
  try{
    const response=await fetch(endpoint,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const result=await response.json();
    if(!response.ok){
      if(message){
        message.className='form-message error';
        message.textContent=result.error||'Unable to continue.';
      }
      if(submitBtn){
        submitBtn.disabled=false;
        submitBtn.innerHTML=origContent;
      }
      return;
    }
    if(message){
      message.className='form-message success';
      message.textContent=endpoint.includes('register')?'Account created successfully! Redirecting…':'Welcome back! Redirecting…';
    }
    const requestedRedirect=new URLSearchParams(location.search).get('redirect');
    const safeRedirect=requestedRedirect&&requestedRedirect.startsWith('/')&&!requestedRedirect.startsWith('//')?requestedRedirect:'/';
    setTimeout(()=>{location.href=safeRedirect},500);
  }catch(err){
    if(message){
      message.className='form-message error';
      message.textContent='Connection error. Please try again.';
    }
    if(submitBtn){
      submitBtn.disabled=false;
      submitBtn.innerHTML=origContent;
    }
  }
}

document.querySelector('#loginForm')?.addEventListener('submit',event=>{event.preventDefault();submitAuth(event.currentTarget,'/api/auth/login')});
document.querySelector('#registerForm')?.addEventListener('submit',event=>{event.preventDefault();submitAuth(event.currentTarget,'/api/auth/register')});

function switchAuthView(mode){
  const loginView=document.querySelector('#authViewLogin');
  const registerView=document.querySelector('#authViewRegister');
  const tabs=document.querySelectorAll('.auth-tab');
  if(!loginView||!registerView)return;
  if(mode==='register'){
    loginView.classList.remove('active-view');
    loginView.classList.add('hidden-view');
    registerView.classList.remove('hidden-view');
    registerView.classList.add('active-view');
    tabs.forEach(t=>{
      const isTarget=t.dataset.target==='register';
      t.classList.toggle('active',isTarget);
      t.setAttribute('aria-selected',String(isTarget));
    });
    history.pushState(null,'','/register');
    document.title='Create Account — Trikonet';
  }else{
    registerView.classList.remove('active-view');
    registerView.classList.add('hidden-view');
    loginView.classList.remove('hidden-view');
    loginView.classList.add('active-view');
    tabs.forEach(t=>{
      const isTarget=t.dataset.target==='login';
      t.classList.toggle('active',isTarget);
      t.setAttribute('aria-selected',String(isTarget));
    });
    history.pushState(null,'','/login');
    document.title='Sign In — Trikonet';
  }
}

document.querySelectorAll('.auth-tab').forEach(tab=>{
  tab.addEventListener('click',e=>{
    e.preventDefault();
    switchAuthView(tab.dataset.target);
  });
});

document.querySelectorAll('.auth-switch-link').forEach(link=>{
  link.addEventListener('click',e=>{
    e.preventDefault();
    switchAuthView(link.dataset.switch);
  });
});

document.querySelectorAll('.toggle-password').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const targetId=btn.dataset.target;
    const input=document.getElementById(targetId);
    if(!input)return;
    const isPass=input.type==='password';
    input.type=isPass?'text':'password';
    btn.innerHTML=isPass
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`
      : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
  });
});

// Clear any browser pre-filled or autofilled credentials on login/register view
function clearAuthInputs() {
  const emailInput = document.querySelector('#loginEmail');
  const passInput = document.querySelector('#loginPassword');
  if (emailInput) {
    emailInput.value = '';
    emailInput.setAttribute('value', '');
  }
  if (passInput) {
    passInput.value = '';
    passInput.setAttribute('value', '');
  }
}
clearAuthInputs();
setTimeout(clearAuthInputs, 50);
setTimeout(clearAuthInputs, 200);
setTimeout(clearAuthInputs, 600);

window.addEventListener('popstate',()=>{
  const newPath=location.pathname;
  if(newPath==='/register'||newPath==='/signup'||newPath==='/sign-up'){
    switchAuthView('register');
  }else if(newPath==='/login'||newPath==='/signin'||newPath==='/sign-in'||newPath==='/login-register'){
    switchAuthView('login');
  }
});
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
function initRecentArticlesAutoSlider() {
  const slider = document.querySelector('#recent-articles');
  if (!slider) return;
  
  let autoTimer = null;
  const getStep = () => {
    const item = slider.querySelector('.article');
    if (!item) return 360;
    const gap = parseFloat(getComputedStyle(slider).gap) || 30;
    return item.getBoundingClientRect().width + gap;
  };

  const slideNext = () => {
    const step = getStep();
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    if (slider.scrollLeft >= maxScroll - 15) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  const slidePrev = () => {
    const step = getStep();
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    if (slider.scrollLeft <= 15) {
      slider.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(slideNext, 3800);
  };

  const stopAuto = () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  startAuto();

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);
  slider.addEventListener('touchstart', stopAuto, { passive: true });
  slider.addEventListener('touchend', startAuto, { passive: true });

  const wrap = slider.closest('.articles-carousel-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);
    wrap.querySelector('.article-arrow-prev')?.addEventListener('click', () => {
      stopAuto();
      slidePrev();
      startAuto();
    });
    wrap.querySelector('.article-arrow-next')?.addEventListener('click', () => {
      stopAuto();
      slideNext();
      startAuto();
    });
  }

  slider.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      stopAuto();
      if (event.key === 'ArrowRight') slideNext();
      else slidePrev();
      startAuto();
    }
  });
}
initRecentArticlesAutoSlider();
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

// Custom Select Dropdowns interaction
document.addEventListener('click', e => {
  const trigger = e.target.closest('.custom-select-trigger');
  const option = e.target.closest('.custom-select-option');
  
  if (trigger) {
    const wrapper = trigger.closest('.custom-select-wrapper');
    const wasOpen = wrapper?.classList.contains('open');
    document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
      w.classList.remove('open');
      w.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen && wrapper) {
      wrapper.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
    return;
  }
  
  if (option) {
    const wrapper = option.closest('.custom-select-wrapper');
    if (!wrapper) return;
    const value = option.dataset.value || '';
    const label = option.querySelector('span')?.textContent || '';
    const input = wrapper.querySelector('input[type="hidden"]');
    const labelEl = wrapper.querySelector('.custom-select-label');
    
    if (input) input.value = value;
    if (labelEl) labelEl.textContent = label;
    
    wrapper.querySelectorAll('.custom-select-option').forEach(opt => {
      const isSelected = opt === option;
      opt.classList.toggle('selected', isSelected);
      opt.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      const existingCheck = opt.querySelector('.custom-select-check');
      if (isSelected && !existingCheck) {
        opt.insertAdjacentHTML('beforeend', '<svg class="custom-select-check" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>');
      } else if (!isSelected && existingCheck) {
        existingCheck.remove();
      }
    });
    
    wrapper.classList.remove('open');
    wrapper.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
    return;
  }
  
  document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
    w.classList.remove('open');
    w.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
      w.classList.remove('open');
      w.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
    });
  }
});

// Footer Categories Accordion Interaction
document.addEventListener('click', e => {
  const header = e.target.closest('.footer-acc-header');
  if (!header) return;
  const row = header.closest('.footer-acc-row');
  if (!row) return;
  const wasOpen = row.classList.contains('open');
  row.classList.toggle('open', !wasOpen);
  header.setAttribute('aria-expanded', !wasOpen ? 'true' : 'false');
});

// Featured Companies Carousel Arrow Navigation
document.addEventListener('click', e => {
  const nextBtn = e.target.closest('.carousel-arrow-next');
  if (nextBtn) {
    const wrap = nextBtn.closest('.featured-companies-carousel-wrap');
    const track = wrap?.querySelector('.featured-companies-track');
    if (track) {
      const card = track.querySelector('.featured-company-card');
      const cardWidth = card ? card.getBoundingClientRect().width : 240;
      const gap = parseFloat(getComputedStyle(track).gap) || 16;
      const scrollStep = cardWidth + gap;
      const visibleCount = Math.max(1, Math.round(track.clientWidth / scrollStep));
      track.scrollBy({ left: scrollStep * visibleCount, behavior: 'smooth' });
    }
    return;
  }
  const prevBtn = e.target.closest('.carousel-arrow-prev');
  if (prevBtn) {
    const wrap = prevBtn.closest('.featured-companies-carousel-wrap');
    const track = wrap?.querySelector('.featured-companies-track');
    if (track) {
      const card = track.querySelector('.featured-company-card');
      const cardWidth = card ? card.getBoundingClientRect().width : 240;
      const gap = parseFloat(getComputedStyle(track).gap) || 16;
      const scrollStep = cardWidth + gap;
      const visibleCount = Math.max(1, Math.round(track.clientWidth / scrollStep));
      track.scrollBy({ left: -scrollStep * visibleCount, behavior: 'smooth' });
    }
    return;
  }
});

// Employer Directory Top Categories Strip Navigation & How It Works Slider
document.addEventListener('click', e => {
  const prevBtn = e.target.closest('#empTopPrevBtn');
  if (prevBtn) {
    const track = document.getElementById('empTopHiringTrack');
    if (track) {
      const scrollAmount = Math.max(240, Math.floor(track.clientWidth * 0.75));
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
    return;
  }
  const nextBtn = e.target.closest('#empTopNextBtn');
  if (nextBtn) {
    const track = document.getElementById('empTopHiringTrack');
    if (track) {
      const scrollAmount = Math.max(240, Math.floor(track.clientWidth * 0.75));
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    return;
  }

  // How It Works Mobile Slider Interactive Dots
  const howDot = e.target.closest('.how-dot');
  if (howDot) {
    const index = parseInt(howDot.getAttribute('data-index'), 10);
    const track = document.getElementById('howStepsTrack');
    if (track) {
      const cards = track.querySelectorAll('.how-step-card');
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
    return;
  }
});

// Update active dot on scroll for How It Works mobile slider
document.addEventListener('scroll', e => {
  if (e.target && e.target.id === 'howStepsTrack') {
    const track = e.target;
    const dots = document.querySelectorAll('.how-dot');
    if (!dots.length) return;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    const cards = track.querySelectorAll('.how-step-card');
    let closestIdx = 0;
    let minDiff = Infinity;
    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const diff = Math.abs(trackCenter - cardCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === closestIdx);
    });
  }
}, true);

// Employer Detail Page Interactions
window.handleClaimFileSelect = function(input) {
  const label = document.getElementById('empUploadLabelText');
  if (!label) return;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const kb = Math.round(file.size / 1024);
    label.textContent = `Selected: ${file.name} (${kb} KB)`;
    label.style.color = '#15803d';
    label.style.fontWeight = '600';
  } else {
    label.textContent = 'Click or drag & drop trade license / document here';
    label.style.color = '';
    label.style.fontWeight = '';
  }
};

window.handleEmployerClaimSubmit = async function(form) {
  const btn = form.querySelector('#empClaimSubmitBtn');
  const origText = btn ? btn.innerHTML : 'Submit Claim Request';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = 'Submitting verification…';
  }

  try {
    const formData = new FormData(form);
    const fileInput = form.querySelector('#empDocFileInput');
    let fileData = null;
    let fileName = '';
    let fileSize = 0;
    let fileType = '';

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      fileName = file.name;
      fileSize = file.size;
      fileType = file.type;
      if (file.size <= 10 * 1024 * 1024) {
        fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
    }

    const payload = {
      employerSlug: formData.get('employerSlug'),
      employerName: formData.get('employerName'),
      applicantName: formData.get('applicantName'),
      designation: formData.get('designation'),
      workEmail: formData.get('workEmail'),
      phone: formData.get('phone'),
      documentType: formData.get('documentType'),
      notes: formData.get('notes'),
      fileName,
      fileSize,
      fileType,
      documentData: fileData
    };

    const res = await fetch('/api/local/employer-claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit claim request.');
    }

    const codeEl = document.getElementById('empClaimRefCode');
    if (codeEl && data.claim) {
      codeEl.textContent = data.claim.id;
    }
    const formWrap = document.getElementById('empClaimFormWrap');
    const succWrap = document.getElementById('empClaimSuccessWrap');
    if (formWrap) formWrap.style.display = 'none';
    if (succWrap) succWrap.style.display = 'block';

  } catch (err) {
    alert(err.message || 'Error submitting claim request. Please check the information and try again.');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origText;
    }
  }
};

window.handleEmployerRateSubmit = async function(form) {
  const ratingFields = ['salary', 'workLife', 'satisfaction', 'skills', 'culture', 'security'];
  const selectedRatings = ratingFields.map(section => Number(form.querySelector(`[name="rating_${section}"]`)?.value || 0));
  if (selectedRatings.some(rating => rating < 1 || rating > 5)) {
    alert('Please select a rating for every workplace category.');
    return;
  }
  const btn = form.querySelector('#empRateSubmitBtn');
  const origText = btn ? btn.innerHTML : 'Submit Rating';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = 'Submitting rating…';
  }

  try {
    const formData = new FormData(form);
    const employerSlug = formData.get('employerSlug') || 'employer';
    const newReview = {
      id: 'rev_' + Date.now(),
      employerSlug,
      employerName: formData.get('employerName') || '',
      ratingScore: Number(formData.get('ratingScore')),
      rating_salary: Number(formData.get('rating_salary')),
      rating_workLife: Number(formData.get('rating_workLife')),
      rating_satisfaction: Number(formData.get('rating_satisfaction')),
      rating_skills: Number(formData.get('rating_skills')),
      rating_culture: Number(formData.get('rating_culture')),
      rating_security: Number(formData.get('rating_security')),
      jobTitle: formData.get('jobTitle') || 'Professional',
      employmentStatus: formData.get('employmentStatus') || 'Current Employee',
      location: formData.get('location') || '',
      yearsExp: formData.get('yearsExp') || '',
      reviewTitle: formData.get('reviewTitle') || '',
      feedback: formData.get('feedback') || '',
      createdAt: new Date().toISOString()
    };

    // Store in localStorage
    const storageKey = 'trikonet_emp_reviews_' + employerSlug;
    let existing = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) existing = JSON.parse(raw);
    } catch(e) {}
    existing.unshift(newReview);
    localStorage.setItem(storageKey, JSON.stringify(existing));

    // Render newly updated reviews list
    if (window.renderEmployerUserReviews) {
      window.renderEmployerUserReviews(employerSlug);
    }

    // Toggle modal state to success
    const formWrap = document.getElementById('empRateFormWrap');
    const succWrap = document.getElementById('empRateSuccessWrap');
    if (formWrap) formWrap.style.display = 'none';
    if (succWrap) succWrap.style.display = 'block';

  } catch(err) {
    alert(err.message || 'Error submitting rating. Please try again.');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origText;
    }
  }
};

window.renderEmployerUserReviews = function(slug) {
  try {
    const storageKey = 'trikonet_emp_reviews_' + slug;
    const raw = localStorage.getItem(storageKey);
    const reviews = raw ? JSON.parse(raw) : [];

    const badge = document.getElementById('empTabReviewsBadge');
    if (badge) {
      badge.textContent = reviews.length;
    }

    const headerRatingRow = document.getElementById('empHeaderRatingRow');
    const headerRatingVal = document.getElementById('empHeaderRatingVal');
    const headerReviewCnt = document.getElementById('empHeaderReviewCnt');

    const reviewsHeaderPill = document.getElementById('empReviewsHeaderRatingPill');
    const scoreBanner = document.getElementById('empRatingScoreBanner');
    const speaksWrapper = document.getElementById('empSpeaksListWrapper');
    const container = document.getElementById('empUserReviewsList');
    const emptyState = document.getElementById('empNoReviewsEmptyState');

    if (reviews && reviews.length > 0) {
      // Calculate real averages
      const avgOverall = (reviews.reduce((acc, r) => acc + Number(r.ratingScore || 5), 0) / reviews.length).toFixed(1);
      const avgSalary = (reviews.reduce((acc, r) => acc + Number(r.rating_salary || r.ratingScore || 5), 0) / reviews.length).toFixed(1);
      const avgWorkLife = (reviews.reduce((acc, r) => acc + Number(r.rating_workLife || r.ratingScore || 5), 0) / reviews.length).toFixed(1);
      const avgSatisfaction = (reviews.reduce((acc, r) => acc + Number(r.rating_satisfaction || r.ratingScore || 5), 0) / reviews.length).toFixed(1);
      const avgSkills = (reviews.reduce((acc, r) => acc + Number(r.rating_skills || r.ratingScore || 5), 0) / reviews.length).toFixed(1);
      const avgCulture = (reviews.reduce((acc, r) => acc + Number(r.rating_culture || r.ratingScore || 5), 0) / reviews.length).toFixed(1);
      const avgSecurity = (reviews.reduce((acc, r) => acc + Number(r.rating_security || r.ratingScore || 5), 0) / reviews.length).toFixed(1);

      // Header rating
      if (headerRatingRow) headerRatingRow.style.display = 'inline-flex';
      if (headerRatingVal) headerRatingVal.textContent = avgOverall;
      if (headerReviewCnt) headerReviewCnt.textContent = `(${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})`;

      // Reviews tab header pill
      if (reviewsHeaderPill) {
        reviewsHeaderPill.style.display = 'inline-flex';
        reviewsHeaderPill.textContent = `★ ${avgOverall} Overall Rating`;
      }

      // Rating score banner
      if (scoreBanner) {
        scoreBanner.style.display = 'flex';
        const bigNum = document.getElementById('empBigOverallScore');
        if (bigNum) bigNum.textContent = avgOverall;
        const bigStars = document.getElementById('empBigOverallStars');
        if (bigStars) {
          const filled = Math.min(5, Math.max(1, Math.round(Number(avgOverall))));
          bigStars.textContent = '★'.repeat(filled) + '☆'.repeat(5 - filled);
        }
        const lbl = document.getElementById('empReviewsCountLabel');
        if (lbl) lbl.textContent = `Based on ${reviews.length} employee ${reviews.length === 1 ? 'review' : 'reviews'}`;
        const secVal = document.getElementById('empSecurityVal');
        if (secVal) secVal.textContent = avgSecurity;
      }

      // Breakdown bars
      if (speaksWrapper) {
        speaksWrapper.style.display = 'block';
        const updateBar = (idFill, idScore, val) => {
          const f = document.getElementById(idFill);
          const s = document.getElementById(idScore);
          const pct = Math.min(100, Math.max(0, Math.round((Number(val) / 5) * 100)));
          if (f) f.style.width = pct + '%';
          if (s) s.textContent = '★ ' + val;
        };
        updateBar('fill_salary', 'score_salary', avgSalary);
        updateBar('fill_workLife', 'score_workLife', avgWorkLife);
        updateBar('fill_satisfaction', 'score_satisfaction', avgSatisfaction);
        updateBar('fill_skills', 'score_skills', avgSkills);
        updateBar('fill_culture', 'score_culture', avgCulture);
        updateBar('fill_security', 'score_security', avgSecurity);
      }

      // Hide empty state
      if (emptyState) emptyState.style.display = 'none';

      // Render reviews
      if (container) {
        const escHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        container.innerHTML = reviews.map(r => `
          <div class="emp-sample-review-card emp-user-submitted-review" style="border-left: 4px solid #16a34a; background: #ffffff;">
            <div class="emp-review-card-head">
              <div class="emp-reviewer-info">
                <span class="emp-reviewer-badge" style="background:#16a34a; color:#ffffff;">★ ${Number(r.ratingScore || 5).toFixed(1)}</span>
                <div>
                  <strong>${escHtml(r.jobTitle || 'Employee')}</strong>
                  <span class="emp-review-meta">${escHtml(r.employmentStatus || 'Employee')}${r.location ? ' • ' + escHtml(r.location) : ''} • Verified Community Submission</span>
                </div>
              </div>
              <span class="emp-review-date" style="color:#16a34a; font-weight:600;">Recent</span>
            </div>
            <h4 class="emp-review-headline">"${escHtml(r.reviewTitle)}"</h4>
            <p class="emp-review-text">${escHtml(r.feedback)}</p>
            <div class="emp-review-section-pills">
              <span class="emp-sec-pill">💰 Salary: <strong>★${Number(r.rating_salary || r.ratingScore || 5).toFixed(1)}</strong></span>
              <span class="emp-sec-pill">⚖️ Work Life: <strong>★${Number(r.rating_workLife || r.ratingScore || 5).toFixed(1)}</strong></span>
              <span class="emp-sec-pill">🎯 Satisfaction: <strong>★${Number(r.rating_satisfaction || r.ratingScore || 5).toFixed(1)}</strong></span>
              <span class="emp-sec-pill">🚀 Skills: <strong>★${Number(r.rating_skills || r.ratingScore || 5).toFixed(1)}</strong></span>
              <span class="emp-sec-pill">🤝 Culture: <strong>★${Number(r.rating_culture || r.ratingScore || 5).toFixed(1)}</strong></span>
              <span class="emp-sec-pill">🛡️ Security: <strong>★${Number(r.rating_security || r.ratingScore || 5).toFixed(1)}</strong></span>
            </div>
          </div>
        `).join('');
      }

      // Update callout buttons
      const rateBtns = document.querySelectorAll('#openRateCompanyBtn, #openRateCompanyCalloutBtn, #openRateCompanyBtnSidebar, #openRateCompanyEmptyBtn');
      rateBtns.forEach(btn => {
        btn.innerHTML = `★ Rate Company`;
      });

    } else {
      // Zero reviews: Clean Empty State!
      if (headerRatingRow) headerRatingRow.style.display = 'none';
      if (reviewsHeaderPill) reviewsHeaderPill.style.display = 'none';
      if (scoreBanner) scoreBanner.style.display = 'none';
      if (speaksWrapper) speaksWrapper.style.display = 'none';
      if (container) container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
    }

  } catch(e) {
    console.error('Error rendering employer reviews:', e);
  }
};

document.addEventListener('click', e => {
  // Rate company modal open
  if (e.target.closest('#openRateCompanyBtn') || e.target.closest('#openRateCompanyCalloutBtn') || e.target.closest('#openRateCompanyBtnSidebar') || e.target.closest('#openRateCompanyBtnHeader') || e.target.closest('.emp-open-rate-modal') || e.target.closest('#openRateCompanyEmptyBtn')) {
    e.preventDefault();
    const modal = document.getElementById('empRateModal');
    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      const rateForm = document.getElementById('empRateSubmitForm');
      if (rateForm) {
        rateForm.querySelectorAll('.emp-sec-star-btn').forEach(star => star.classList.remove('active'));
        rateForm.querySelectorAll('input[id^="input_rating_"]').forEach(input => { input.value = ''; });
        rateForm.querySelectorAll('.emp-sec-score-badge').forEach(badge => { badge.textContent = '—'; });
        const overallInput = document.getElementById('empSelectedRatingScore');
        const overallValue = document.getElementById('empCalcOverallVal');
        const statusTag = document.getElementById('empStarStatusTag');
        if (overallInput) overallInput.value = '';
        if (overallValue) overallValue.textContent = '—';
        if (statusTag) statusTag.textContent = 'Select all categories';
      }
      const formWrap = document.getElementById('empRateFormWrap');
      const succWrap = document.getElementById('empRateSuccessWrap');
      if (formWrap) formWrap.style.display = 'block';
      if (succWrap) succWrap.style.display = 'none';
    }
    return;
  }

  // Rate company modal close
  if (e.target.closest('#empCloseRateBtn') || (e.target.classList && e.target.id === 'empRateModal')) {
    const modal = document.getElementById('empRateModal');
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
    return;
  }

  // Interactive Section Star Rating selection in modal
  const secStarBtn = e.target.closest('.emp-sec-star-btn');
  if (secStarBtn) {
    e.preventDefault();
    const section = secStarBtn.dataset.section;
    const rating = parseInt(secStarBtn.dataset.rating, 10) || 0;

    // Update section input & badge
    const input = document.getElementById(`input_rating_${section}`);
    if (input) input.value = rating;
    const badge = document.getElementById(`scoreBadge_${section}`);
    if (badge) badge.textContent = rating.toFixed(1);

    // Toggle active on stars for this section
    const group = secStarBtn.closest('.emp-sec-stars-group');
    if (group) {
      group.querySelectorAll('.emp-sec-star-btn').forEach(btn => {
        const r = parseInt(btn.dataset.rating, 10) || 0;
        btn.classList.toggle('active', r <= rating);
      });
    }

    // Recalculate Overall Rating
    const sections = ['salary', 'workLife', 'satisfaction', 'skills', 'culture', 'security'];
    const selected = sections.map(s => {
      const inp = document.getElementById(`input_rating_${s}`);
      return Number(inp?.value || 0);
    }).filter(value => value > 0);
    const overallInput = document.getElementById('empSelectedRatingScore');
    const overallVal = document.getElementById('empCalcOverallVal');
    const statusTag = document.getElementById('empStarStatusTag');
    if (selected.length === sections.length) {
      const avg = (selected.reduce((sum, value) => sum + value, 0) / sections.length).toFixed(1);
      if (overallInput) overallInput.value = avg;
      if (overallVal) overallVal.textContent = avg;
      const num = Number(avg);
      if (statusTag) statusTag.textContent = num >= 4.5 ? `${avg} - Excellent` : num >= 3.5 ? `${avg} - Very Good` : num >= 2.5 ? `${avg} - Good` : `${avg} - Fair`;
    } else {
      if (overallInput) overallInput.value = '';
      if (overallVal) overallVal.textContent = '—';
      if (statusTag) statusTag.textContent = `${selected.length} of ${sections.length} categories rated`;
    }
    return;
  }

  // Claim modal open
  if (e.target.closest('#empOpenClaimBtn')) {
    e.preventDefault();
    const modal = document.getElementById('empClaimModal');
    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      const formWrap = document.getElementById('empClaimFormWrap');
      const succWrap = document.getElementById('empClaimSuccessWrap');
      if (formWrap) formWrap.style.display = 'block';
      if (succWrap) succWrap.style.display = 'none';
    }
    return;
  }

  // Claim modal close button or backdrop click
  if (e.target.closest('#empCloseClaimBtn') || (e.target.classList && e.target.id === 'empClaimModal')) {
    const modal = document.getElementById('empClaimModal');
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
    return;
  }

  // Employer profile sub-tabs switching
  const tab = e.target.closest('.emp-profile-tab-item');
  if (tab) {
    e.preventDefault();
    tab.blur();
    const target = tab.dataset.tab;
    if (!target) return;
    document.querySelectorAll('.emp-profile-tab-item').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.emp-tab-panel').forEach(p => {
      const isMatch = (p.dataset.panel === target) || (p.id === `panel-${target}`);
      p.classList.toggle('active', isMatch);
      p.style.display = isMatch ? 'block' : 'none';
    });

    if (target === 'reviews') {
      const slugInput = document.querySelector('#empRateSubmitForm input[name="employerSlug"]');
      if (slugInput && window.renderEmployerUserReviews) {
        window.renderEmployerUserReviews(slugInput.value);
      }
    }
    return;
  }

  // Employer About Read More toggle
  const readMoreBtn = e.target.closest('#empAboutReadMoreBtn');
  if (readMoreBtn) {
    const body = document.getElementById('empAboutBody');
    if (body) {
      const isExpanded = body.classList.toggle('is-expanded');
      readMoreBtn.textContent = isExpanded ? 'Show less ↑' : 'Read more ↓';
    }
    return;
  }

  // Employer follow button toggle
  const followBtn = e.target.closest('.emp-follow-btn');
  if (followBtn) {
    if (!currentUser) {
      const returnPath = `${location.pathname}${location.search}${location.hash}`;
      location.href = `/login?redirect=${encodeURIComponent(returnPath)}`;
      return;
    }
    const isFollowing = followBtn.classList.toggle('following');
    followBtn.textContent = isFollowing ? '✓ Following' : '+ Follow';
    const employerSlug = followBtn.dataset.slug;
    if (employerSlug) {
      const userKey = currentUser.id || currentUser.email || 'member';
      try { localStorage.setItem(`trikonet_follow_employer_${userKey}_${employerSlug}`, String(isFollowing)); } catch {}
      const employerTitle=document.querySelector('.emp-profile-title, .employer-hero h1, .detail-hero h1')?.textContent?.trim()||employerSlug.replace(/-/g,' ');
      const employerLogo=document.querySelector('.emp-profile-logo-img, .employer-hero img')?.getAttribute('src')||'';
      const employerCategory=document.querySelector('.emp-cat-pill')?.textContent?.trim()||'';
      const employerLocation=document.querySelector('.emp-location-pill')?.textContent?.trim()||'';
      upsertMemberCollection('followed_companies',{slug:employerSlug,title:employerTitle,logo:employerLogo,category:employerCategory,location:employerLocation,followedAt:new Date().toISOString()},!isFollowing);
    }
    return;
  }
});
