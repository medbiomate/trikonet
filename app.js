import { renderJobDetail, renderEmployerDetail } from './detail-pages.js?v=11.0';
import { renderAdmin, initAdmin } from './admin.js?v=10.0';
import { initCVBuilder } from './cvBuilder.js?v=20260929-clean-cards-v24';
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
const data=store.get(), path=location.pathname.replace(/\/$/,'')||'/';
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
const queryParams=new URLSearchParams(location.search),currentPage=Math.max(Number(queryParams.get('page'))||1,1),pageSize=30;
const escapeAttr=value=>String(value||'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const icons={search:'⌕',pin:'⌖',bag:'▣'};
let wpRecord=null,wpEmployer=null,profileJobs=[],orgJobs=[],currentUser=null,emailCampaigns=[];
async function loadAccount(){try{const response=await fetch('/api/auth/me');if(response.ok){currentUser=(await response.json()).user;const campaigns=await fetch('/api/email-campaigns');if(campaigns.ok)emailCampaigns=await campaigns.json()}}catch{}}
async function loadWordPressRecord(){const match=path.match(/^\/(job|employer)\/([^/]+)$/);if(!match)return;const type=match[1]==='job'?'job_listing':'employer',slug=match[2];try{const response=await fetch(`/api/wp/${type}?slug=${encodeURIComponent(slug)}`);if(response.ok){const records=await response.json();wpRecord=records[0]||null}if(!wpRecord){const localResponse=await fetch(`/api/local/${type==='job_listing'?'jobs':'employers'}/${encodeURIComponent(slug)}`);if(localResponse.ok)wpRecord=await localResponse.json()}if(type==='job_listing'){let employerSlug='';if(wpRecord?.metas?._job_employer_url){try{employerSlug=new URL(wpRecord.metas._job_employer_url).pathname.split('/').filter(Boolean).pop()||'';}catch{}}if(!employerSlug&&wpRecord?.employerSlug){employerSlug=wpRecord.employerSlug;}if(!employerSlug&&(wpRecord?.metas?._job_employer_name||wpRecord?.company)){const comp=wpRecord.metas?._job_employer_name||wpRecord.company;employerSlug=comp.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}if(employerSlug){const employerResponse=await fetch(`/api/wp/employer?slug=${encodeURIComponent(employerSlug)}`);if(employerResponse.ok){const emps=await employerResponse.json();wpEmployer=emps[0]||null;}}if(!wpEmployer&&wpRecord?.metas?._job_employer_posted_by){const employerResponse=await fetch(`/api/wp/employer?id=${encodeURIComponent(wpRecord.metas._job_employer_posted_by)}`);if(employerResponse.ok){const emps=await employerResponse.json();wpEmployer=emps[0]||null;}}if(wpEmployer){try{const query=wpEmployer.id?`employer_id=${wpEmployer.id}`:`employer_slug=${encodeURIComponent(wpEmployer.slug)}`;const jobsRes=await fetch(`/api/wp/job_listing?${query}&per_page=20`);if(jobsRes.ok){const list=await jobsRes.json();orgJobs=list.filter(j=>j.slug!==slug);}}catch{}}if(!orgJobs.length&&(wpEmployer?.title?.rendered||wpEmployer?.title||wpRecord?.metas?._job_employer_name||wpRecord?.company)){const cName=wpEmployer?.title?.rendered||wpEmployer?.title||wpRecord?.metas?._job_employer_name||wpRecord?.company;try{const searchRes=await fetch(`/api/wp/job_listing?q=${encodeURIComponent(cName)}&per_page=20`);if(searchRes.ok){const sList=await searchRes.json();orgJobs=sList.filter(j=>j.slug!==slug&&((j.metas?._job_employer_name&&j.metas._job_employer_name.toLowerCase()===cName.toLowerCase())||(j.company&&j.company.toLowerCase()===cName.toLowerCase())));}}catch{}}}else if(type==='employer'&&wpRecord){if(wpRecord.local){try{const localJobsRes=await fetch('/api/local/jobs');if(localJobsRes.ok){const lJobs=await localJobsRes.json();profileJobs=lJobs.filter(j=>j.employerSlug===wpRecord.slug||j.company===(wpRecord.title?.rendered||wpRecord.title)).map(mapJob)}}catch{}}else if(wpRecord.id){const jobsResponse=await fetch(`/api/wp/job_listing?employer_id=${wpRecord.id}&per_page=100`);if(jobsResponse.ok)profileJobs=(await jobsResponse.json()).map(mapJob);if(!profileJobs.length&&wpRecord.slug){const slugResponse=await fetch(`/api/wp/job_listing?employer_slug=${encodeURIComponent(wpRecord.slug)}&per_page=100`);if(slugResponse.ok)profileJobs=(await slugResponse.json()).map(mapJob)}}}}catch{wpRecord=null}}
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
    const [wpResponse,localResponse]=await Promise.all([fetch(`/api/wp/job_listing?${filters}`),fetch('/api/local/jobs')]);
    const wp=wpResponse.ok?await wpResponse.json():[],local=localResponse.ok?await localResponse.json():[];
    const qTerm=queryParams.get('q')||(path==='/nurse-jobs-in-uae'?'nurse':'');
    const targetCat = isCategoryPage && catObj ? (queryParams.get('category') || catObj.name) : queryParams.get('category');
    const localFiltered=local.filter(job=>(!qTerm||job.title?.toLowerCase().includes(qTerm.toLowerCase())||(job.categories||[]).some(c=>c.toLowerCase().includes(qTerm.toLowerCase())))&&(!queryParams.get('location')||queryParams.get('location')==='Country or City'||(job.locations||[]).includes(queryParams.get('location')))&&(!targetCat||targetCat==='All Categories'||(job.categories||[]).some(c=>c.toLowerCase().includes(targetCat.toLowerCase())))&&(!queryParams.get('job_type')||(job.types||[]).includes(queryParams.get('job_type'))));
    data.jobs=[...(currentPage===1?localFiltered.map(mapJob):[]),...wp.map(mapJob)];
  }catch{data.jobs=[]}
}
async function loadLocalEmployers(){try{const filters=new URLSearchParams({per_page:String(pageSize),page:String(currentPage)});for(const key of ['q','location','category','min_jobs'])if(queryParams.get(key))filters.set(key,queryParams.get(key));const response=await fetch(`/api/wp/employer?${filters}`);const wp=response.ok?await response.json():[];data.employers=wp.map(record=>{const m=record.metas||{};return {title:record.title?.rendered||'',slug:record.slug,description:record.content?.rendered||'',logo:m._employer_logo||m._employer_featured_image_img||m._employer_featured_image||'',categories:Object.values(m._employer_category||{}),locations:Object.values(m._employer_location||{}),email:m._employer_email||'',phone:m._employer_phone||'',website:m._employer_website||'',openJobs:Number(m._employer_open_jobs)||0,source:'database'}})}catch{data.employers=[]}}
async function loadTopEmployers(){try{const res=await fetch('/api/wp/top-employers?min_jobs=20&limit=16');if(res.ok){const list=await res.json();data.topEmployers=list.map(record=>{const m=record.metas||{};const rawText=(record.content?.rendered||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();return {title:record.title?.rendered||'',slug:record.slug,excerpt:rawText.slice(0,120),logo:m._employer_logo||m._employer_featured_image_img||m._employer_featured_image||'',locations:Object.values(m._employer_location||{}),categories:Object.values(m._employer_category||{}),openJobs:Number(m._employer_open_jobs)||0,source:'database'}})}}catch{}}
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

async function loadCounts(){
  try{
    const response=await fetch('/api/wp/counts');
    if(response.ok) {
      data.counts=await response.json();
      updateLiveJobCountUI();
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
      const filters=new URLSearchParams();
      filters.set('type','job_listing');
      if(catObj) filters.set('category', queryParams.get('category') || catObj.name);
      for(const key of ['q','location','job_type']){
        const val=queryParams.get(key);
        if(val&&val!=='Country or City')filters.set(key,val);
      }
      const filtered=await fetch(`/api/wp/count?${filters}`);
      if(filtered.ok)data.counts.category=(await filtered.json()).total;
    }else if((path==='/employers'||path==='/jobs')&&[...queryParams].some(([key])=>['q','location','category','job_type','min_jobs'].includes(key))){
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

async function loadConnectedContent(){try{const [taxonomyResponse,postsResponse,pagesResponse]=await Promise.all([fetch('/api/wp/taxonomies'),fetch('/api/wp/posts?per_page=100'),fetch('/api/wp/pages?per_page=100')]);if(taxonomyResponse.ok)data.taxonomies=await taxonomyResponse.json();if(postsResponse.ok){const posts=await postsResponse.json();if(posts.length)data.posts=posts.map(post=>{const rawTitle=post.title?.rendered||'';const rawExcerpt=(post.excerpt?.rendered||'').replace(/<[^>]+>/g,'').trim();const prefix=POST_SLUG_PREFIXES[post.slug]||post.url_prefix||'blog';const cat=post.categoryName||post.category_name||CATEGORY_PREFIX_LABELS[prefix]||detectBlogCategory(rawTitle,rawExcerpt);const authorName=(post.author_display_name||(post.author_name&&post.author_name!=='Trikonet'?post.author_name:''))||'Athira Susan James';return {id:post.id,title:rawTitle,slug:post.slug,category:'blog',categoryName:cat,urlPrefix:prefix,localUrl:`/${prefix}/${post.slug}`,date:new Date(`${post.date}Z`).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),excerpt:rawExcerpt,content:post.content?.rendered||'',featuredImage:post.featured_image||'',author:authorName,authorRole:'Written By',authorImage:post.author_avatar||'/assets/athira-susan-james.png',authorLink:'#',reviewer:post.reviewer_name||'Mayur Kacholiya',reviewerRole:'Reviewed by:',reviewerImage:post.reviewer_avatar||'/assets/mayur-kacholiya.png',reviewerLink:'#'}})}if(pagesResponse.ok){const pages=await pagesResponse.json();data.connectedPages=Object.fromEntries(pages.map(page=>[page.slug,page]))}}catch{}}
const siteChrome=(()=>{try{return JSON.parse(localStorage.getItem('trikonet_site_chrome')||'{}')}catch{return {}}})();
const LOGO_VERSION = 'v=20260928_triangle_v1';
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
  const isServices = path.startsWith('/services') || path === '/resume-maker' || path === '/ats-resume-builder' || path === '/medical-coder-class';
  const navArrow = `<svg class="nav-arrow" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1.25L5 4.75L9 1.25"/></svg>`;

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
          <a class="nav-link${isServices?' active':''}" href="/services/resume-maker">
            Services ${navArrow}
          </a>
          <div class="nav-services-dropdown">
            <a href="/services/resume-maker" class="service-item">
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
          ${currentUser?`<a class="mobile-btn-auth" href="/email-campaigns">Email campaigns</a><button class="mobile-btn-auth" id="mobileLogoutBtn">Logout</button>`:`<a class="mobile-btn-auth" href="/login">Login / Register</a>`}
          <a class="mobile-btn-primary" href="/submit-job">+ Add Job</a>
        </div>
      </nav>
      <div class="nav-actions">
        ${currentUser?`<a class="nav-btn-auth" href="/email-campaigns">Email campaigns</a><button class="nav-btn-auth" id="logoutBtn">Logout</button>`:`<a class="nav-btn-auth" href="/login">Login / Register</a>`}
        <a class="nav-btn-primary" href="/submit-job">
          <span>+ Add Job</span>
        </a>
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
  return `<footer class="footer site-footer-${escapeAttr(siteChrome.footerLayout||'columns')}" style="background:${escapeAttr(siteChrome.footerBg||'#202124')};color:${escapeAttr(siteChrome.footerText||'#ffffff')}">
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

function homeTopCompanies(s = {}) {
  const employers = (data.topEmployers && data.topEmployers.length) 
    ? data.topEmployers 
    : (data.employers || []).filter(e => (e.openJobs || 0) >= 20);
  if (!employers.length) return '';

  const cardsHtml = employers.slice(0, 14).map(e => {
    const initials = escapeAttr((e.title || 'TC').slice(0, 2).toUpperCase());
    const rawLoc = (e.locations && e.locations[0]) || '';
    const cleanLoc = (!rawLoc || /^\d+$/.test(rawLoc) || rawLoc === 'United Arab Emirates') ? 'UAE' : rawLoc;
    
    // Extract category
    const validCats = (e.categories || []).filter(c => typeof c === 'string' && c.trim() && !/^\d+$/.test(c));
    const catText = validCats.length ? validCats.slice(0, 2).join(' • ') : (e.category || 'Hiring Enterprise');

    return `
      <div class="featured-company-card">
        <div class="featured-company-logo-wrap">
          ${e.logo ? `<img src="${escapeAttr(e.logo)}" alt="${escapeAttr(e.title)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : ''}
          <div class="featured-company-logo-fallback" style="${e.logo ? 'display:none;' : 'display:flex;'}">
            ${initials}
          </div>
        </div>

        <div class="featured-company-info-box">
          <h3 class="featured-company-name" title="${escapeAttr(e.title)}">${escapeAttr(e.title)}</h3>
          <div class="featured-company-jobs-badge">
            <svg class="featured-company-job-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <span class="company-jobs-count-text"><strong>${e.openJobs || 20}</strong> Open Jobs</span>
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
function homeHowItWorks(s={}){const steps=[[s.step1Image||'/assets/step-1.jpg',s.step1Title||'Register an Account to Start'],[s.step2Image||'/assets/step-2.jpg',s.step2Title||'Explore Over Thousands of Jobs'],[s.step3Image||'/assets/step-3.jpg',s.step3Title||'Find the Most Suitable Company and Job']];return `<section class="section alt${homeSectionAttrs(s)}"><div class="wrap"><div class="section-title"><h2>${escapeAttr(s.title||'How It Works?')}</h2><p>${escapeAttr(s.subtitle||'Job for Anyone, Anywhere')}</p></div><div class="steps">${steps.map(step=>`<div class="step"><img src="${escapeAttr(step[0])}" alt="${escapeAttr(step[1])}"><h3>${escapeAttr(step[1])}</h3></div>`).join('')}</div></div></section>`}
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
            <a href="https://www.linkedin.com/company/trikonet-team" target="_blank" rel="noopener" class="nurse-share-pill" aria-label="Share on LinkedIn">${iconShareLinkedin} LinkedIn</a>
            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(`${categoryName} Jobs in UAE: https://www.trikonet.com/category/${categoryCleanSlug}`)}" target="_blank" rel="noopener" class="nurse-share-pill" aria-label="Share on WhatsApp">${iconShareWa} WhatsApp</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.trikonet.com/category/${categoryCleanSlug}`)}" target="_blank" rel="noopener" class="nurse-share-pill" aria-label="Share on Facebook">${iconShareFb} Facebook</a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.trikonet.com/category/${categoryCleanSlug}`)}" target="_blank" rel="noopener" class="nurse-share-pill" aria-label="Share on X">${iconShareX} X</a>
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

  const topStripCategories = [
    { title: 'Healthcare', subtitle: '850+ Companies', qParam: 'Healthcare' },
    { title: 'Hospitals & Clinics', subtitle: '210+ Companies', qParam: 'Hospital' },
    { title: 'IT & Technology', subtitle: '340+ Companies', qParam: 'Information Technology' },
    { title: 'Education', subtitle: '380+ Companies', qParam: 'Educational Services' },
    { title: 'Banking & Finance', subtitle: '195+ Companies', qParam: 'Banking' },
    { title: 'Hospitality', subtitle: '165+ Companies', qParam: 'Hospitality' },
    { title: 'Real Estate', subtitle: '420+ Companies', qParam: 'Real Estate' },
    { title: 'Construction', subtitle: '240+ Companies', qParam: 'Construction' },
    { title: 'Retail & Commerce', subtitle: '150+ Companies', qParam: 'Retail' }
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

  const sidebarCategories = [
    { name: 'Healthcare', count: '270' },
    { name: 'Hospital', count: '107' },
    { name: 'Educational Services', count: '339' },
    { name: 'Information Technology', count: '63' },
    { name: 'Banking', count: '33' },
    { name: 'Finance and Insurance', count: '83' },
    { name: 'Hospitality', count: '103' },
    { name: 'Real Estate', count: '392' },
    { name: 'Construction', count: '113' },
    { name: 'Manufacturing', count: '112' },
    { name: 'Retail', count: '92' }
  ];

  const sidebarLocations = [
    { name: 'Dubai', count: '1,680' },
    { name: 'Abu Dhabi', count: '450' },
    { name: 'Sharjah', count: '122' },
    { name: 'Ajman', count: '62' },
    { name: 'Ras Al Khaimah', count: '37' },
    { name: 'Al Ain', count: '20' }
  ];

  const vacancyFilters = [
    { label: 'All Companies', value: '' },
    { label: 'Actively Hiring (1+ jobs)', value: '1' },
    { label: 'High Hiring (5+ jobs)', value: '5' },
    { label: 'Mass Hiring (10+ jobs)', value: '10' }
  ];

  const getEmpRating = (title = '') => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
    const rating = (4.0 + (hash % 10) / 10).toFixed(1);
    const reviews = 24 + (hash % 140);
    return { rating, reviews };
  };

  return `<main class="emp-directory-page">
    <div class="wrap">
      <!-- Top Strip: Top companies hiring now (Naukri style with Trikonet red branding) -->
      <section class="emp-top-hiring-strip" aria-label="Top companies hiring now">
        <div class="emp-top-hiring-head">
          <h2>Top companies hiring now</h2>
        </div>
        <div class="emp-top-hiring-wrap">
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

      <!-- Main Layout: Sidebar Filters + Right Listings -->
      <div class="emp-main-layout">
        <!-- Left Filters Sidebar -->
        <aside class="emp-filters-sidebar">
          <div class="emp-filters-head">
            <h3>All Filters</h3>
            ${hasActiveFilters ? `<a href="/employers" class="emp-clear-all">Clear All</a>` : ''}
          </div>

          <!-- Search Company Input -->
          <form class="emp-search-form" action="/employers" method="GET" onsubmit="event.preventDefault(); const val=this.q.value.trim(); location.href='${buildFilterUrl({ q: null })}'+(val?('${buildFilterUrl({ q: null })}'.includes('?')?'&':'?')+'q='+encodeURIComponent(val):'');">
            <div class="emp-search-input-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" name="q" value="${escapeAttr(q)}" placeholder="Search Company" aria-label="Search Company">
            </div>
          </form>

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
                  <span class="emp-checkbox${isActive ? ' checked' : ''}"></span>
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
                  <span class="emp-checkbox${isActive ? ' checked' : ''}"></span>
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
                  <span class="emp-checkbox${isActive ? ' checked' : ''}"></span>
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
              ${total > 0 ? `Showing ${start} – ${end} of ${total.toLocaleString()} companies` : 'No companies found matching your filters'}
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
              const initials = (e.title || '').split(/\s+/).map(x => x[0]).join('').slice(0, 3).toUpperCase() || 'CO';
              const { rating, reviews } = getEmpRating(e.title);
              const primaryCat = (e.categories && e.categories[0]) || 'Corporate';
              const primaryLoc = (e.locations && e.locations[0]) || '';
              const openJobs = e.openJobs || 0;

              return `<a href="/employer/${e.slug}" class="emp-naukri-card">
                <div class="emp-naukri-logo">
                  ${e.logo ? `<img src="${e.logo}" alt="${escapeAttr(e.title)}" loading="lazy">` : `<div class="emp-naukri-fallback">${initials}</div>`}
                </div>
                <div class="emp-naukri-info">
                  <h3 class="emp-naukri-title" title="${escapeAttr(e.title)}">${escapeAttr(e.title)}</h3>
                  <div class="emp-naukri-meta">
                    <span class="emp-rating-pill">★ ${rating}</span>
                    <span class="emp-meta-divider">|</span>
                    <span class="emp-reviews-count">${reviews} reviews</span>
                    <span class="emp-meta-bullet">•</span>
                    <span class="emp-jobs-count"><strong>${openJobs}</strong> Jobs</span>
                  </div>
                  <div class="emp-naukri-tags">
                    <span class="emp-pill-tag">${escapeAttr(primaryCat)}</span>
                    ${primaryLoc ? `<span class="emp-pill-tag loc">📍 ${escapeAttr(primaryLoc)}</span>` : ''}
                  </div>
                </div>
                <div class="emp-naukri-arrow" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
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
  return `<main class="detail-page"><section class="detail-hero"><div class="wrap detail-hero-inner">${logo?`<img class="detail-logo" src="${escapeAttr(logo)}" alt="${escapeAttr(company)}">`:''}<div class="detail-title"><h1>${escapeAttr(title)}</h1><div class="detail-meta">${categories?`<span>▣ &nbsp;${escapeAttr(categories)}</span>`:''}${location?`<span>⌖ &nbsp;${escapeAttr(location)}</span>`:''}${date?`<span>◷ &nbsp;${escapeAttr(date)}</span>`:''}</div>${type?`<span class="tag">${escapeAttr(type)}</span>`:''}</div><div class="detail-actions"><a class="primary apply" href="${escapeAttr(m._job_apply_url||j?.applyUrl||'#')}">Apply Now</a></div></div></section><div class="wrap detail-grid"><article class="job-description"><h2>▣ Job Description</h2><div class="wordpress-content">${content}</div></article><aside><div class="overview"><h2>Job Overview</h2><dl>${date?`<dt>▣</dt><dd><b>Date Posted</b><span>${escapeAttr(date)}</span></dd>`:''}${location?`<dt>⌖</dt><dd><b>Location</b><span>${escapeAttr(location)}</span></dd>`:''}</dl></div></aside></div></main>`;
}
function employerDetail(e){
  const m=e?.metas||{},title=e?.title?.rendered||e?.title||'Employer',logo=m._employer_logo||e?.logo||'',category=m._employer_category?Object.values(m._employer_category).join(', '):e?.category||'Company',location=m._employer_location?Object.values(m._employer_location).join(', '):e?.location||'',content=e?.content?.rendered||e?.content||'<p>Company information will appear here.</p>';
  return `<main class="detail-page"><section class="detail-hero employer-hero"><div class="wrap detail-hero-inner">${logo?`<img class="detail-logo" src="${escapeAttr(logo)}" alt="${escapeAttr(title)}">`:''}<div class="detail-title"><h1>${escapeAttr(title)}</h1><div class="detail-meta"><span>▣ &nbsp;${escapeAttr(category)}</span>${location?`<span>⌖ &nbsp;${escapeAttr(location)}</span>`:''}</div><span class="tag">Open Jobs</span></div></div></section><div class="wrap detail-grid employer-detail-grid"><article class="job-description"><h2>About Company</h2><div class="wordpress-content">${content}</div></article></div></main>`;
}
function decodeHtml(value){const box=document.createElement('textarea');box.innerHTML=value;return box.value}
function faq(){return `<main><section class="subhero"><h1>FAQ</h1></section><div class="content faq"><h2>History Of Trikonet</h2>${[['Who is Trikonet?','Trikonet is a job platform connecting job seekers with employment opportunities in the UAE and other Middle Eastern countries.'],['How The Trikonet Started?','Trikonet was founded after the success of Medbiomate highlighted the need for a broader job platform.'],['How are Trikonet and Medbiomate connected?','Both platforms share founders and a commitment to connecting qualified candidates with trusted opportunities.']].map(x=>`<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join('')}</div></main>`}
function contact(){return `<main><section class="subhero"><h1>Contact Us</h1></section><div class="content contact-grid"><div><h2>Get in touch</h2><p>Questions about jobs, employers or your Trikonet account? Send us a message.</p><p><b>Email</b><br>info@trikonet.com</p></div><form class="form-card" id="contact"><label>Name<input required></label><label>Email<input type="email" required></label><label>Message<textarea required></textarea></label><button class="primary">Send Message</button></form></div></main>`}
function generic(){const title=path.split('/').filter(Boolean).map(s=>s.replaceAll('-',' ')).join(' / ')||'Trikonet';return `<main><section class="subhero"><h1>${title.replace(/\b\w/g,c=>c.toUpperCase())}</h1></section><div class="content"><p>This page keeps the existing Trikonet URL available in the local migration. Its content can be edited in the CMS.</p><a class="primary" href="/jobs">Browse Jobs</a></div></main>`}
function accountPage(forcedMode) {
  if (currentUser) {
    return `<main class="auth-page">
      <div class="auth-dashboard-wrap">
        <div class="dashboard-hero-card">
          <div class="dashboard-user-info">
            <div class="dashboard-avatar">${escapeAttr((currentUser.name || 'U').charAt(0).toUpperCase())}</div>
            <div class="dashboard-user-text">
              <h1>Welcome, ${escapeAttr(currentUser.name)}</h1>
              <p>${escapeAttr(currentUser.email)} · <span style="color:#16a34a;font-weight:600;">Active Account</span></p>
            </div>
          </div>
          <button class="outline" id="dashboardLogoutBtn" style="border-color:#e2e8f0;color:#64748b;padding:8px 18px;font-size:13px;border-radius:10px;">Sign Out</button>
        </div>
        <div class="dashboard-actions-grid">
          <a class="dashboard-action-card" href="/email-campaigns">
            <div class="dashboard-action-icon">✉</div>
            <h3>Email Campaigns</h3>
            <p>Compose, save, and manage your private email campaigns & candidate outreach.</p>
          </a>
          <a class="dashboard-action-card" href="/jobs">
            <div class="dashboard-action-icon">💼</div>
            <h3>Browse <span class="hero-live-job-count" data-live-job-count>${(data.counts?.job_listing || 13621).toLocaleString()}+</span> Jobs</h3>
            <p>Explore verified openings across Abu Dhabi, Dubai, Sharjah, and other GCC hubs.</p>
          </a>
          <a class="dashboard-action-card" href="/employers">
            <div class="dashboard-action-icon">🏢</div>
            <h3>Top ${(data.counts?.employer || 2728).toLocaleString()}+ Employers</h3>
            <p>Connect directly with leading healthcare, education, hospitality, and corporate firms.</p>
          </a>
          <a class="dashboard-action-card" href="/submit-job">
            <div class="dashboard-action-icon">➕</div>
            <h3>Post a Job Opening</h3>
            <p>Publish a job listing to recruit qualified talent across the Middle East network.</p>
          </a>
        </div>
      </div>
    </main>`;
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
    const users = JSON.parse(localStorage.getItem('trikonet_users_cms') || '[]');
    const user = users.find(item => item.username === session.username && item.email === session.email);
    if (!user || !user.passwordHash || user.status === 'inactive') return null;
    if (user.role !== 'Administrator' && user.role !== 'Editor') return null;
    return { ...session, name: user.name, role: user.role };
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

    let cmsUsers = [];
    try {
      const raw = localStorage.getItem('trikonet_users_cms');
      if (raw) cmsUsers = JSON.parse(raw);
    } catch {}

    const allowedList = cmsUsers.filter(u =>
      (u.role === 'Administrator' || u.role === 'Editor') &&
      u.status !== 'inactive' &&
      Boolean(u.passwordHash)
    );
    const lowerUser = userInput.toLowerCase();
    const matched = allowedList.find(u => 
      (u.username && u.username.toLowerCase() === lowerUser) ||
      (u.email && u.email.toLowerCase() === lowerUser)
    );

    if (!matched || await hashAdminPassword(passInput) !== matched.passwordHash) {
      if (errBox) {
        errBox.textContent = 'Invalid administrator username or password.';
        errBox.style.display = 'block';
      }
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Verifying credentials…'; }

    const session = {
      username: matched.username,
      email: matched.email,
      role: matched.role,
      name: matched.name,
      token: 'adm_' + Math.random().toString(36).slice(2) + Date.now(),
      loginAt: new Date().toISOString(),
      expiresAt: Date.now() + (8 * 60 * 60 * 1000)
    };

    localStorage.removeItem('trikonet_admin_session');
    sessionStorage.setItem('trikonet_admin_session', JSON.stringify(session));

    window.location.href = '/admin';
  });
}

function isResumeBuilderPath(p) {
  return p === '/services/resume-maker' ||
         p === '/resume-maker' ||
         p === '/services/resume-builder' ||
         p === '/resume-builder' ||
         p === '/services/ats-resume-builder' ||
         p === '/ats-resume-builder' ||
         p === '/cv-builder' ||
         p === '/services/cv-builder';
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
  else if (path === '/login' || path === '/signin' || path === '/sign-in' || path === '/login-register' || path === '/register' || path === '/signup' || path === '/sign-up') body = accountPage();
  else if (path === '/email-campaigns') body = campaignsPage();
  else if (path === '/nurse-jobs-in-uae') body = nurseJobsPage();
  else if (path.startsWith('/category/')) body = categoryPage();
  else if (path === '/jobs' || path === '/job-list' || path === '/job-openings') body = jobs();
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
  else if (path.startsWith('/job/')) {
    const local = data.jobs.find(j => j.local && path === `/job/${j.slug}`);
    const employer = wpEmployer || (local ? data.employers?.find(e => e.slug === local.employerSlug || e.title === local.company) : null) || (data.employers?.find(e => wpRecord?.metas?._job_employer_name && e.title?.toLowerCase() === wpRecord.metas._job_employer_name.toLowerCase())) || null;
    body = renderJobDetail(local || wpRecord || data.jobs.find(j => path.endsWith(j.slug)), employer, path, orgJobs);
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
await Promise.all([loadLocalJobs(),loadLocalEmployers(),loadTopEmployers(),loadCounts(),loadWordPressRecord(),loadConnectedContent(),loadAccount()]);
// Published article data comes from the backend. The admin screen also keeps
// local draft/mock records, but those must never replace database content on
// the public site.
document.querySelector('#app').innerHTML=render();
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
      const secondBottom = paragraphs[1].getBoundingClientRect().bottom - copyTop;
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
      canonical.href=`${location.origin}${getPostUrl(record)}`;
    } else {
      canonical.href=`${location.origin}${path==='/'?'/':`/${record.slug}`}`;
    }
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
const hambBtn=document.querySelector('.hamb');
hambBtn?.addEventListener('click',function(){
  const links=document.querySelector('.links');
  const isOpen=links?.classList.toggle('open');
  this.classList.toggle('open',!!isOpen);
  this.setAttribute('aria-expanded',isOpen?'true':'false');
});
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
});
document.querySelector('#logoutBtn')?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/'});
document.querySelector('#mobileLogoutBtn')?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/'});
document.querySelector('#dashboardLogoutBtn')?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/'});

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
    const safeRedirect=requestedRedirect&&requestedRedirect.startsWith('/')&&!requestedRedirect.startsWith('//')?requestedRedirect:'/email-campaigns';
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
    if (track) track.scrollBy({ left: 272 * 2, behavior: 'smooth' });
    return;
  }
  const prevBtn = e.target.closest('.carousel-arrow-prev');
  if (prevBtn) {
    const wrap = prevBtn.closest('.featured-companies-carousel-wrap');
    const track = wrap?.querySelector('.featured-companies-track');
    if (track) track.scrollBy({ left: -272 * 2, behavior: 'smooth' });
    return;
  }
});

// Employer Directory Top Categories Strip Navigation
document.addEventListener('click', e => {
  const nextBtn = e.target.closest('#empTopNextBtn');
  if (nextBtn) {
    const track = document.getElementById('empTopHiringTrack');
    if (track) track.scrollBy({ left: 240 * 2, behavior: 'smooth' });
  }
});

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
    const isFollowing = followBtn.classList.toggle('following');
    followBtn.textContent = isFollowing ? '✓ Following' : '+ Follow';
    return;
  }
});
