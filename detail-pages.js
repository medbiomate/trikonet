const relatedAccounting = [
  ['Accountant','accountant-421','Dubai, UAE'],
  ['Accounting','accounting-5','Abu Dhabi, UAE'],
  ['SENIOR ANALYST, FINANCIAL','senior-analyst-financial-2','Abu Dhabi, UAE'],
  ['Accountant','accountant-143','Dubai'],
];
const bateelJobs = [
  ['Corporate Accounting Manager','corporate-accounting-manager','Accountant, Accounting or Finance','Dubai'],
  ['Human Resources Business Partner','human-resources-business-partner-9','Human Resource','Dubai'],
  ['Financial Planning and Analysis Manager','financial-planning-and-analysis-manager-2','Accounting or Finance','Dubai'],
  ['Accountant','accountant-347','Accountant, Accounting or Finance','Dubai'],
  ['Assistant Manager Internal Audit','assistant-manager-internal-audit-6','Accounting or Finance','Dubai'],
];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const decode = value => { const node = document.createElement('textarea'); node.innerHTML = String(value ?? ''); return node.value; };
const values = value => value && typeof value === 'object' ? Object.values(value).map(decode).join(', ') : '';
const orderedValues = (value,ids) => value && typeof value === 'object' ? (ids?.length ? ids.map(id=>value[id]).filter(Boolean) : Object.values(value)).map(decode).join(', ') : '';
export const formatJobDate = value => {
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
};

export const resolveJobDate = record => {
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
};

export const resolveJobDeadline = record => {
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
};

const dateLabel = formatJobDate;
const phoneMask = value => value ? `${value.slice(0,-3)}***` : '';
const slugFromUrl = value => { try { return new URL(value).pathname; } catch { return '#'; } };

function jobCard([title,slug,category,location],logo='') {
  const meta = [
    category ? `▣ &nbsp;${esc(category)}` : '',
    location ? `⌖ &nbsp;${esc(location)}` : ''
  ].filter(Boolean).join(' &nbsp;&nbsp;');
  return `<a class="detail-job-row" href="/job/${esc(slug)}">${logo ? `<img src="${esc(logo)}" alt="">` : `<div class="detail-job-logo-fallback">${esc((title || 'J').charAt(0))}</div>`}<div class="detail-job-row-main"><h3>${esc(title)}</h3>${meta ? `<p>${meta}</p>` : ''}<span class="detail-pill">Full Time</span></div><span class="detail-bookmark" aria-hidden="true">♧</span></a>`;
}

function formatSocialLinks(socials, website) {
  const links = [];
  if (website) links.push({ name: 'Website', url: website });
  if (socials && typeof socials === 'object') {
    if (Array.isArray(socials.items)) {
      socials.items.forEach(it => {
        if (it?.url) links.push({ name: it.platform ? it.platform.charAt(0).toUpperCase() + it.platform.slice(1) : 'Link', url: it.url });
      });
    } else {
      Object.keys(socials).forEach(k => {
        if (k !== 'items' && typeof socials[k] === 'string' && socials[k].trim()) {
          links.push({ name: k.charAt(0).toUpperCase() + k.slice(1), url: socials[k].trim() });
        }
      });
    }
  }
  const unique = [];
  const seen = new Set();
  links.forEach(l => {
    if (!seen.has(l.url)) {
      seen.add(l.url);
      unique.push(l);
    }
  });
  if (!unique.length) return '';
  return `<div class="detail-social-links" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;">${unique.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" class="detail-social-pill" style="display:inline-flex;align-items:center;padding:2px 8px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;font-size:11.5px;color:#1d4ed8;text-decoration:none;">${esc(l.name)} ↗</a>`).join('')}</div>`;
}

function employerSidebar(record,company,logo,location) {
  const m=record?.metas||{};
  const category=record?.local?(record.categories||[]).join(', '):values(m._employer_category)||'';
  const url=record?.website||m._employer_website;
  const phone=record?.phone||m._employer_phone||'';
  const email=record?.email||m._employer_email||'';
  const profile=record?.local?`/employer/${record.slug}`:slugFromUrl(record?.link||'#');
  const socialsHtml = formatSocialLinks(record?.socials, url);
  return `<aside class="detail-company-box">${logo ? `<img src="${esc(logo)}" alt="${esc(company)}">` : `<div class="detail-logo-fallback" style="margin:0 auto 15px auto;">${esc((company || 'E').charAt(0))}</div>`}<h3>${esc(company)}</h3><a class="profile-link" href="${esc(profile)}">View Company Profile</a><div class="company-facts">${category?`<h4>Categories:</h4><p>${esc(category)}</p>`:''}${location?`<h4>Location:</h4><p>${esc(location)}</p>`:''}${phone?`<h4>Phone Number:</h4><p>${esc(phoneMask(phone))}</p>`:''}${email?`<h4>Email:</h4><p>${esc(email)}</p>`:''}${socialsHtml?`<h4>Socials & Links:</h4>${socialsHtml}`:''}</div></aside>`;
}

export function renderJobDetail(record,employer,path) {
  if (!record) return '<main class="detail-page"><div class="wrap detail-empty"><h1>Job not found</h1><a href="/jobs">Browse Jobs</a></div></main>';
  const m=record.metas||{};
  const title=decode(record.title?.rendered||record.title);
  const company=m._job_employer_name||record.company||'';
  const category=record.local?(record.categories||[]).join(', '):orderedValues(m._job_category,record.job_listing_category)||record.category||'';
  const location=record.local?(record.locations||[]).join(', '):values(m._job_location)||record.location||'';
  const type=record.local?(record.types||[]).join(', '):values(m._job_type)||record.type||'';
  const date=resolveJobDate(record);
  const expiry=resolveJobDeadline(record);
  const isBateel = record.slug === 'bateel-international' || employer?.slug === 'bateel-international';
  const logo = record.logo || m._job_logo || employer?.metas?._employer_logo || employer?.metas?._employer_featured_image_img || employer?.metas?._employer_featured_image || (isBateel ? '/assets/bateel.jpg' : '');
  const employerPath=slugFromUrl(record.employerUrl||m._job_employer_url||employer?.link||'#');
  const desc=record.description||'';
  const hasHtml=/<[a-z][\s\S]*>/i.test(desc);
  const content=record.content?.rendered|| (record.local?(hasHtml?desc:(desc?desc.split(/\n\s*\n/).map(p=>`<p>${esc(p).replaceAll('\n','<br>')}</p>`).join(''):'<p>Job description is not available.</p>')):'<p>Job description is not available.</p>');
  const experience=record.experience||m['custom-text-27987527']||'';
  const qualification=record.qualification||m['custom-text-28953441']||'';
  const shareUrl=encodeURIComponent(`https://www.trikonet.com${path}`);
  const related=category.toLowerCase().includes('account')?relatedAccounting:[];
  const metaSpans = [
    category ? `<span>▣ &nbsp;${esc(category)}</span>` : '',
    location ? `<span>⌖ &nbsp;${esc(location)}</span>` : '',
    date ? `<span>◷ &nbsp;${esc(date)}</span>` : ''
  ].filter(Boolean).join('');
  return `<main class="detail-page detail-exact"><section class="detail-hero"><div class="wrap detail-hero-inner"><a href="${esc(employerPath)}">${logo ? `<img class="detail-logo" src="${esc(logo)}" alt="${esc(company)}">` : `<div class="detail-logo-fallback">${esc((company || title || 'J').charAt(0))}</div>`}</a><div class="detail-title"><h1>${esc(title)}</h1>${metaSpans ? `<div class="detail-meta">${metaSpans}</div>` : ''}${type ? `<span class="detail-pill">${esc(type)}</span>` : ''}</div><div class="detail-actions"><a class="primary apply" href="${esc(record.applyUrl||m._job_apply_url||'#')}">Apply Now</a><button class="save" type="button" aria-label="Save job"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5h12a1 1 0 0 1 1 1v16l-7-5-7 5v-16a1 1 0 0 1 1-1Z"/></svg></button></div></div></section><div class="wrap detail-grid"><article class="job-description"><h2>▣ Job Description</h2><div class="wordpress-content">${content}</div><p class="detail-tags">Tags: ${esc(record.local?(record.tags||[]).join(', ')||'No tags for this post.':'No tags for this post.')}</p><div class="share"><h3>Share this post</h3><a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}">Facebook</a><a href="https://twitter.com/intent/tweet?url=${shareUrl}">Twitter</a><a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}">LinkedIn</a></div>${related.length?`<section class="related-list"><h3>Related Jobs</h3>${related.map(item=>jobCard(item)).join('')}</section>`:''}</article><div class="detail-sidebar"><aside class="overview"><h2>Job Overview</h2><dl>${date ? `<dt>▣</dt><dd><b>Date Posted</b><span>${esc(date)}</span></dd>` : ''}${location ? `<dt>⌖</dt><dd><b>Location</b><span>${esc(location)}</span></dd>` : ''}<dt>⌛</dt><dd><b>Expiration date</b><span>${esc(expiry)}</span></dd>${experience?`<dt>◉</dt><dd><b>Experience</b><span>${esc(experience)}</span></dd>`:''}${qualification?`<dt>◇</dt><dd><b>Qualification</b><span>${esc(qualification)}</span></dd>`:''}</dl></aside>${employerSidebar(employer,company,logo,location)}</div></div></main>`;
}

export function renderEmployerDetail(record,path,jobs=[]) {
  if (!record) return '<main class="detail-page"><div class="wrap detail-empty"><h1>Employer not found</h1><a href="/employers">Browse Employers</a></div></main>';
  const m=record.metas||{};
  const title=decode(record.title?.rendered||record.title||'');
  const category=record.local?(record.categories||[]).join(', '):values(m._employer_category);
  const location=record.local?(record.locations||[]).join(', '):values(m._employer_location);
  const isBateel=record.slug==='bateel-international';
  const logo=record.logo||m._employer_logo||(isBateel ? '/assets/bateel.jpg' : '');
  const phone=record.phone||m._employer_phone||'';
  const email=record.email||m._employer_email||'';
  const localJobs=record.local?jobs.filter(job=>job.employerSlug===record.slug||job.company===record.title||String(job.employerUrl||'').includes(`/employer/${record.slug}`)).map(job=>[job.title,job.slug,(job.categories||[]).join(', ')||job.category||'',(job.locations||[]).join(', ')||job.location||'']):[];
  const positions=localJobs.length?localJobs:(isBateel?bateelJobs:[]);
  const empDesc=record.description||'';
  const hasEmpHtml=/<[a-z][\s\S]*>/i.test(empDesc);
  const content=record.local?(hasEmpHtml?empDesc:(empDesc?empDesc.split(/\n\s*\n/).map(p=>`<p>${esc(p).replaceAll('\n','<br>')}</p>`).join(''):'')):record.content?.rendered||'';
  const website=record.website||m._employer_website||'';
  const socialsHtml = formatSocialLinks(record.socials, website);
  const metaSpans = [
    category ? `<span>▣ &nbsp;${esc(category)}</span>` : '',
    location ? `<span>⌖ &nbsp;${esc(location)}</span>` : '',
    phone ? `<span>♧ &nbsp;${esc(phoneMask(phone))} <button class="show-phone" type="button" data-phone="${esc(phone)}">Show</button></span>` : ''
  ].filter(Boolean).join('');
  return `<main class="detail-page detail-exact"><section class="detail-hero employer-hero"><div class="wrap detail-hero-inner">${logo ? `<img class="detail-logo" src="${esc(logo)}" alt="${esc(title)}">` : `<div class="detail-logo-fallback">${esc((title || 'E').charAt(0))}</div>`}<div class="detail-title"><h1>${esc(title)}</h1>${metaSpans ? `<div class="detail-meta">${metaSpans}</div>` : ''}${email ? `<div class="detail-meta"><span>✉ &nbsp;${esc(email)}</span></div>` : ''}<span class="detail-pill">Open Jobs${positions.length?` - ${positions.length}`:''}</span></div><button class="save" type="button" aria-label="Save employer">♧</button></div></section><div class="wrap detail-grid employer-detail-grid"><article class="job-description"><h2>About Company</h2><div class="wordpress-content">${content}</div><section class="related-list"><div class="related-heading"><h3>Open Position</h3><a href="/jobs">Browse Full List →</a></div>${positions.length?positions.map(item=>jobCard(item,logo)).join(''):'<p>No current positions are listed here.</p>'}</section><section class="review-section"><h3>Be the first to review “${esc(title)}”</h3><p>Your review will remain in this local preview.</p><textarea aria-label="Review" placeholder="Your review"></textarea><button class="primary" type="button">Submit review</button></section></article><aside class="employer-facts"><div class="overview employer-info"><dl>${category ? `<dt></dt><dd><b>Categories:</b><span>${esc(category)}</span></dd>` : ''}${record.companySize||m._employer_company_size ? `<dt></dt><dd><b>Company Size:</b><span>${esc(record.companySize||m._employer_company_size)}</span></dd>` : ''}${record.foundedDate||m._employer_founded_date ? `<dt></dt><dd><b>Founded:</b><span>${esc(record.foundedDate||m._employer_founded_date)}</span></dd>` : ''}${location ? `<dt></dt><dd><b>Location:</b><span>${esc(location)}</span></dd>` : ''}${phone?`<dt></dt><dd><b>Phone Number:</b><span>${esc(phoneMask(phone))}</dd>`:''}${email?`<dt></dt><dd><b>Email:</b><span>${esc(email)}</span></dd>`:''}${socialsHtml?`<dt></dt><dd><b>Socials & Links:</b>${socialsHtml}</dd>`:(website?`<dt></dt><dd><b>Website:</b><span><a href="${esc(website)}" target="_blank" rel="noopener">${esc(website)}</a></span></dd>`:'')}</dl></div></aside></div></main>`;
}
