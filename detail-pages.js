const bateelJobs = [
  ['Corporate Accounting Manager','corporate-accounting-manager','Accountant, Accounting or Finance','Dubai'],
  ['Human Resources Business Partner','human-resources-business-partner-9','Human Resource','Dubai'],
  ['Financial Planning and Analysis Manager','financial-planning-and-analysis-manager-2','Accounting or Finance','Dubai'],
  ['Accountant','accountant-347','Accountant, Accounting or Finance','Dubai'],
  ['Assistant Manager Internal Audit','assistant-manager-internal-audit-6','Accounting or Finance','Dubai'],
];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const decode = value => {
  if (typeof document !== 'undefined') {
    const node = document.createElement('textarea');
    node.innerHTML = String(value ?? '');
    return node.value;
  }
  return String(value ?? '').replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll('&#8211;', '–');
};
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

function jobCard([title,slug,category,location,type],logo='') {
  const cleanTitle = decode(title);
  const cleanCat = decode(category);
  const cleanLoc = decode(location);
  const meta = [
    cleanCat ? `▣ &nbsp;${esc(cleanCat)}` : '',
    cleanLoc ? `⌖ &nbsp;${esc(cleanLoc)}` : ''
  ].filter(Boolean).join(' &nbsp;&nbsp;');
  const fallback = esc((cleanTitle || 'J').charAt(0));
  const logoHtml = logo
    ? `<img src="${esc(logo)}" alt="" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="detail-job-logo-fallback" hidden>${fallback}</div>`
    : `<div class="detail-job-logo-fallback">${fallback}</div>`;
  return `<a class="detail-job-row" href="/job/${esc(slug)}">${logoHtml}<div class="detail-job-row-main"><h3>${esc(cleanTitle)}</h3>${meta ? `<p>${meta}</p>` : ''}<span class="detail-pill">${esc(type || 'Full Time')}</span></div><span class="detail-bookmark" aria-hidden="true">♧</span></a>`;
}

function relatedJobCard(record, employerLogo = '') {
  const m = record?.metas || {};
  const title = record?.title?.rendered || record?.title || '';
  const category = record?.local ? (record.categories || []).join(', ') : orderedValues(m._job_category, record?.job_listing_category) || record?.category || '';
  const location = record?.local ? (record.locations || []).join(', ') : values(m._job_location) || record?.location || '';
  const type = record?.local ? (record.types || []).join(', ') : values(m._job_type) || record?.type || '';
  const logo = record?.logo || m._job_logo || employerLogo;
  return jobCard([title, record?.slug || '', category, location, type], logo);
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

function resolveEmployerProfile(record, jobEmployerUrl = '', company = '') {
  if (record?.slug) return `/employer/${record.slug}`;
  if (record?.local && record?.slug) return `/employer/${record.slug}`;
  if (jobEmployerUrl) {
    try {
      const p = new URL(jobEmployerUrl).pathname;
      if (p && p !== '/' && p !== '#') return p;
    } catch {
      if (typeof jobEmployerUrl === 'string' && jobEmployerUrl.startsWith('/')) return jobEmployerUrl;
    }
  }
  if (record?.link) {
    try {
      const p = new URL(record.link).pathname;
      if (p && p !== '/' && p !== '#') return p;
    } catch {
      if (typeof record.link === 'string' && record.link.startsWith('/')) return record.link;
    }
  }
  if (company) {
    const slug = company.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (slug) return `/employer/${slug}`;
  }
  return '/employers';
}

function renderAboutCompanySection(employer, company, logo, location, jobEmployerUrl = '', website = '', category = '') {
  if (!employer && !company) return '';
  const m = employer?.metas || {};
  const compName = decode(employer?.title?.rendered || employer?.title || company || 'Company');
  const profileUrl = resolveEmployerProfile(employer, jobEmployerUrl, compName);
  const empLogo = logo || employer?.logo || m._employer_logo || m._employer_featured_image_img || '';
  
  // Category
  const compCat = category || (employer?.local ? (employer.categories || []).join(', ') : values(m._employer_category)) || '';
  // Location
  const compLoc = location || (employer?.local ? (employer.locations || []).join(', ') : values(m._employer_location)) || 'United Arab Emirates';
  // Size
  const compSize = employer?.companySize || m._employer_company_size || '';
  // Founded
  const compFounded = employer?.foundedDate || m._employer_founded_date || '';
  // Website
  const compWebsite = website || employer?.website || m._employer_website || '';
  // Tagline
  const compTagline = employer?.tagline || m._employer_tagline || compLoc;

  // Rating
  const explicitRating = employer?.rating || m._employer_rating || null;
  const explicitReviewCount = employer?.reviewCount || m._employer_review_count || 0;
  const hasRating = Boolean(explicitRating && Number(explicitRating) > 0);
  const ratingScore = hasRating ? Number(explicitRating).toFixed(1) : null;

  // Bio / Content taken from the employer page
  const empDesc = employer?.description || '';
  const hasEmpHtml = /<[a-z][\s\S]*>/i.test(empDesc);
  const rawContent = employer?.local
    ? (hasEmpHtml ? empDesc : (empDesc ? empDesc.split(/\n\s*\n/).map(p => `<p>${esc(p).replaceAll('\n', '<br>')}</p>`).join('') : ''))
    : employer?.content?.rendered || '';

  const cleanBio = rawContent || `<p>${esc(compName)} is a leading employer operating across the UAE and GCC region, providing top-tier professional career opportunities, modern workplace culture, and continuous development for talent.</p>`;
  const socialsHtml = formatSocialLinks(employer?.socials, compWebsite);

  return `
    <section class="detail-about-company-card" aria-label="About ${esc(compName)}">
      <div class="detail-about-company-header">
        <a href="${esc(profileUrl)}" class="detail-about-company-logo-link">
          ${empLogo ? `<img src="${esc(empLogo)}" alt="${esc(compName)}" class="detail-about-company-logo">` : `<div class="detail-about-company-fallback">${esc((compName || 'CO').slice(0, 2).toUpperCase())}</div>`}
        </a>
        <div class="detail-about-company-meta-col">
          <div class="detail-about-company-name-row">
            <h3 class="detail-about-company-name"><a href="${esc(profileUrl)}">${esc(compName)}</a></h3>
          </div>

          ${hasRating ? `
            <div class="detail-about-rating-row">
              <span class="emp-rating-star">★</span>
              <strong>${ratingScore}</strong>
              <span class="detail-about-rating-count">(${explicitReviewCount} reviews)</span>
            </div>
          ` : ''}

          ${compTagline ? `<p class="detail-about-company-tagline">${esc(compTagline)}</p>` : ''}

          <div class="detail-about-company-pills">
            ${compCat ? `<span class="detail-about-pill">🏢 ${esc(compCat)}</span>` : ''}
            ${compLoc ? `<span class="detail-about-pill">📍 ${esc(compLoc)}</span>` : ''}
            ${compSize ? `<span class="detail-about-pill">👥 ${esc(compSize)}</span>` : ''}
            ${compFounded ? `<span class="detail-about-pill">🗓 Founded ${esc(compFounded)}</span>` : ''}
          </div>
        </div>

        <div class="detail-about-company-action">
          <a href="${esc(profileUrl)}" class="detail-about-profile-btn">
            View Company Profile
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      <div class="detail-about-company-body">
        <h4 class="detail-about-heading">About ${esc(compName)}</h4>
        <div class="wordpress-content detail-about-bio">
          ${cleanBio}
        </div>
      </div>

      ${(compWebsite || socialsHtml) ? `
        <div class="detail-about-company-footer">
          ${compWebsite ? `<a href="${esc(compWebsite)}" target="_blank" rel="noopener noreferrer" class="detail-about-website-btn">🌐 Official Website ↗</a>` : ''}
          ${socialsHtml}
        </div>
      ` : ''}
    </section>
  `;
}

function renderSameOrgJobsSidebar(orgJobs, company, employer, employerPath) {
  const compName = decode(company || employer?.title?.rendered || employer?.title || 'Organisation');
  const totalCount = Array.isArray(orgJobs) ? orgJobs.length : 0;
  
  return `
    <aside class="detail-org-jobs-box">
      <div class="detail-org-jobs-header">
        <div class="detail-org-jobs-heading-wrap">
          <span class="detail-org-jobs-eyebrow">SAME ORGANISATION</span>
          <h3 class="detail-org-jobs-title">Other Jobs at ${esc(compName)}</h3>
        </div>
        ${totalCount > 0 ? `<span class="detail-org-jobs-badge">${totalCount} Active</span>` : ''}
      </div>

      <div class="detail-org-jobs-list">
        ${totalCount > 0 ? orgJobs.slice(0, 5).map(job => {
          const jTitle = decode(job.title?.rendered || job.title || 'Job Opening');
          const jCat = job.category || (job.categories || []).join(', ') || values(job.metas?._job_category) || '';
          const jLoc = job.location || (job.locations || []).join(', ') || values(job.metas?._job_location) || '';
          const jType = job.type || values(job.metas?._job_type) || 'Full Time';
          const jDate = resolveJobDate(job);
          return `
            <a class="detail-org-job-card" href="/job/${esc(job.slug)}">
              <div class="detail-org-job-info">
                <h4 class="detail-org-job-title">${esc(jTitle)}</h4>
                <div class="detail-org-job-subline">
                  ${jLoc ? `<span class="detail-org-job-loc">${esc(jLoc)}</span>` : ''}
                  ${(jLoc && jCat) ? `<span class="detail-org-job-sep">•</span>` : ''}
                  ${jCat ? `<span class="detail-org-job-cat">${esc(jCat)}</span>` : ''}
                </div>
                <div class="detail-org-job-meta-row">
                  <span class="detail-org-job-type-pill">${esc(jType)}</span>
                  ${jDate ? `<span class="detail-org-job-date">${esc(jDate)}</span>` : ''}
                </div>
              </div>
              <div class="detail-org-job-arrow" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </a>
          `;
        }).join('') : `
          <div class="detail-org-jobs-empty">
            <p>No other active vacancies posted currently by ${esc(compName)}.</p>
            <a href="${esc(employerPath)}" class="detail-org-jobs-viewall-btn">View All ${esc(compName)} Details →</a>
          </div>
        `}
      </div>

      ${totalCount > 0 ? `
        <div class="detail-org-jobs-footer">
          <a href="${esc(employerPath)}" class="detail-org-jobs-all-link">
            Explore All ${totalCount + 1} Openings at ${esc(compName)} →
          </a>
        </div>
      ` : ''}
    </aside>
  `;
}

export function renderJobDetail(record, employer, path, orgJobs = []) {
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
  const employerPath=resolveEmployerProfile(employer, record.employerUrl||m._job_employer_url, company);
  const desc=record.description||'';
  const hasHtml=/<[a-z][\s\S]*>/i.test(desc);
  const content=record.content?.rendered|| (record.local?(hasHtml?desc:(desc?desc.split(/\n\s*\n/).map(p=>`<p>${esc(p).replaceAll('\n','<br>')}</p>`).join(''):'<p>Job description is not available.</p>')):'<p>Job description is not available.</p>');
  const experience=record.experience||m['custom-text-27987527']||'';
  const qualification=record.qualification||m['custom-text-28953441']||'';
  const shareUrl=encodeURIComponent(`https://www.trikonet.com${path}`);
  const related=(orgJobs || []).filter(item => item && item.slug !== record.slug).slice(0, 4);
  const metaSpans = [
    category ? `<span><svg class="meta-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>${esc(category)}</span>` : '',
    location ? `<span><svg class="meta-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${esc(location)}</span>` : '',
    date ? `<span><svg class="meta-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${esc(date)}</span>` : ''
  ].filter(Boolean).join('');

  const aboutCompanyHtml = renderAboutCompanySection(employer, company, logo, location, record.employerUrl||m._job_employer_url, employer?.website||m._job_employer_website, category);
  const orgJobsHtml = renderSameOrgJobsSidebar(orgJobs, company, employer, employerPath);

  return `<main class="detail-page detail-exact">
    <section class="detail-hero">
      <div class="wrap detail-hero-inner">
        <a href="${esc(employerPath)}" class="detail-logo-card">
          ${logo ? `<img class="detail-logo" src="${esc(logo)}" alt="${esc(company)}">` : `<div class="detail-logo-fallback">${esc((company || title || 'J').charAt(0))}</div>`}
        </a>
        <div class="detail-title">
          <h1>${esc(title)}</h1>
          ${metaSpans ? `<div class="detail-meta">${metaSpans}</div>` : ''}
          ${type ? `<span class="detail-pill">${esc(type)}</span>` : ''}
        </div>
        <div class="detail-actions">
          <a class="primary apply" href="${esc(record.applyUrl||m._job_apply_url||'#')}">Apply Now</a>
          <button class="save" type="button" aria-label="Save job"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
        </div>
      </div>
    </section>
    <div class="wrap detail-grid">
      <article class="job-description">
        <h2 class="job-desc-heading">
          <span>Job Description</span>
        </h2>
        <div class="job-description-copy" id="jobDescriptionCopy">
          <div class="wordpress-content">${content}</div>
        </div>
        <button type="button" class="job-description-toggle" id="jobDescriptionToggle" aria-expanded="false" aria-controls="jobDescriptionCopy">
          <span>Read more</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <p class="detail-tags">Tags: ${esc(record.local?(record.tags||[]).join(', ')||'No tags for this post.':'No tags for this post.')}</p>

        <!-- About The Company (Bottom Below Job Description) -->
        ${aboutCompanyHtml}

        <div class="share">
          <h3>Share this post</h3>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${shareUrl}">Facebook</a>
          <a href="https://twitter.com/intent/tweet?url=${shareUrl}">Twitter</a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}">LinkedIn</a>
        </div>
        ${related.length?`<section class="related-list"><h3>Related Jobs</h3>${related.map(item => relatedJobCard(item, logo)).join('')}</section>`:''}
      </article>

      <div class="detail-sidebar">
        <aside class="overview">
          <h2>Job Overview</h2>
          <div class="overview-list">
            ${date ? `
            <div class="overview-item">
              <div class="overview-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b00008" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
                </svg>
              </div>
              <div class="overview-content">
                <span class="overview-title">Date Posted</span>
                <span class="overview-val">${esc(date)}</span>
              </div>
            </div>` : ''}

            ${location ? `
            <div class="overview-item">
              <div class="overview-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b00008" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="overview-content">
                <span class="overview-title">Location</span>
                <span class="overview-val">${esc(location)}</span>
              </div>
            </div>` : ''}


            ${experience ? `
            <div class="overview-item">
              <div class="overview-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b00008" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <div class="overview-content">
                <span class="overview-title">Experience</span>
                <span class="overview-val">${esc(experience)}</span>
              </div>
            </div>` : ''}

            ${qualification ? `
            <div class="overview-item">
              <div class="overview-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b00008" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div class="overview-content">
                <span class="overview-title">Qualification</span>
                <span class="overview-val">${esc(qualification)}</span>
              </div>
            </div>` : ''}
          </div>
        </aside>

        <!-- Same Organisation Other Jobs (Right Side Sidebar) -->
        ${orgJobsHtml}
      </div>
    </div>
  </main>`;
}

export function renderEmployerDetail(record, path, jobs = []) {
  if (!record) return '<main class="detail-page"><div class="wrap detail-empty"><h1>Employer not found</h1><a href="/employers">Browse Employers</a></div></main>';
  const m = record.metas || {};
  const title = decode(record.title?.rendered || record.title || '');
  const category = record.local ? (record.categories || []).join(', ') : values(m._employer_category);
  const location = record.local ? (record.locations || []).join(', ') : values(m._employer_location);
  const isBateel = record.slug === 'bateel-international';
  const logo = record.logo || m._employer_logo || (isBateel ? '/assets/bateel.jpg' : '');
  const phone = record.phone || m._employer_phone || '';
  const email = record.email || m._employer_email || '';
  const website = record.website || m._employer_website || '';
  const founded = record.foundedDate || m._employer_founded_date || '2012';
  const size = record.companySize || m._employer_company_size || '501-1,000';
  const hq = location || 'Dubai, United Arab Emirates';
  
  let positions = [];
  if (Array.isArray(jobs) && jobs.length) {
    positions = jobs.map(job => {
      if (Array.isArray(job)) return job;
      return [
        job.title || '',
        job.slug || '',
        (job.categories || []).join(', ') || job.category || '',
        (job.locations || []).join(', ') || job.location || '',
        job.type || 'Full Time'
      ];
    });
  }
  if (!positions.length && isBateel) positions = bateelJobs;

  const totalOpenJobs = positions.length || record.openJobs || (m._employer_open_jobs ? Number(m._employer_open_jobs) : 0);
  const empDesc = record.description || '';
  const hasEmpHtml = /<[a-z][\s\S]*>/i.test(empDesc);
  const rawContent = record.local
    ? (hasEmpHtml ? empDesc : (empDesc ? empDesc.split(/\n\s*\n/).map(p => `<p>${esc(p).replaceAll('\n', '<br>')}</p>`).join('') : ''))
    : record.content?.rendered || '';

  const cleanBio = rawContent || `<p>${esc(title)} is a leading employer operating across the UAE and GCC region, providing top-tier professional career opportunities, modern workplace culture, and continuous development for talent.</p>`;

  // Extract primary company category
  let companyCategory = '';
  if (typeof category === 'string' && category.trim() && !category.startsWith('a:')) {
    companyCategory = category.split(',')[0].trim();
  } else if (category && typeof category === 'object') {
    const vals = Object.values(category).filter(v => typeof v === 'string' && v.trim() && !v.startsWith('a:'));
    if (vals.length) companyCategory = vals[0].trim();
  }
  if (!companyCategory && Array.isArray(record.categories) && record.categories.length) {
    const valid = record.categories.find(c => typeof c === 'string' && c.trim() && !c.startsWith('a:'));
    if (valid) companyCategory = valid.trim();
  }
  if (!companyCategory && typeof record.category === 'string' && record.category.trim() && !record.category.startsWith('a:')) {
    companyCategory = record.category.split(',')[0].trim();
  }
  if (!companyCategory && m._employer_category) {
    if (typeof m._employer_category === 'object') {
      const vals = Object.values(m._employer_category).filter(v => typeof v === 'string' && v.trim() && !v.startsWith('a:'));
      if (vals.length) companyCategory = vals[0].trim();
    } else if (typeof m._employer_category === 'string') {
      const raw = m._employer_category.trim();
      if (!raw.startsWith('a:')) {
        companyCategory = raw.split(',')[0].trim();
      } else {
        const idMatch = raw.match(/i:\d+;i:(\d+);/) || raw.match(/i:(\d+);/);
        if (idMatch) {
          const termMap = {
            187: 'Healthcare', 207: 'Construction', 267: 'Agriculture and Forestry',
            268: 'Mining and Extraction', 269: 'Construction', 270: 'Manufacturing',
            271: 'Utilities', 272: 'Warehousing and Logistics', 273: 'Information Technology',
            274: 'Telecommunications', 275: 'Retail', 276: 'Finance and Insurance',
            277: 'Real Estate', 278: 'Healthcare', 279: 'Educational Services',
            280: 'Entertainment', 281: 'Other Services', 282: 'Food and Dining',
            283: 'Automotive', 294: 'Construction & Engineering', 297: 'Wholesale',
            300: 'Conglomerate', 330: 'Accounting', 350: 'Business Consulting and Services',
            595: 'Airlines and Aviation', 599: 'Oil and Gas', 600: 'Advertising Services',
            602: 'Banking', 626: 'Transportation', 627: 'Procurement and Supply Chain',
            636: 'Hospital', 637: 'Medical Company', 638: 'Medical Clinic',
            639: 'Medical Center', 641: 'Healthcare Group', 642: 'Pharmacy',
            757: 'Hospitality', 759: 'Legal Services', 760: 'Architecture and Planning',
            779: 'Investment Management', 782: 'Wellness & Fitness', 795: 'Pharmaceutical Manufacturing',
            816: 'Marketing Services', 862: 'Software Development', 892: 'Staffing and Recruiting',
            899: 'School', 988: 'University', 1008: 'Food & Beverages', 1022: 'IT Services and IT Consulting'
          };
          companyCategory = termMap[Number(idMatch[1])] || '';
        }
      }
    }
  }
  if (!companyCategory && Array.isArray(positions) && positions.length) {
    for (const pos of positions) {
      const posCat = Array.isArray(pos) ? pos[2] : (pos.category || (pos.categories || []).join(', '));
      if (posCat && typeof posCat === 'string' && posCat.trim()) {
        companyCategory = posCat.split(',')[0].trim();
        break;
      }
    }
  }
  if (!companyCategory) {
    const fullText = `${title} ${record.description || record.content?.rendered || record.content || ''}`.toLowerCase();
    if (/hospital|clinic|healthcare|medical|medicine|patient care|doctor|nursing/.test(fullText)) companyCategory = 'Healthcare';
    else if (/school|college|university|education|academy|nursery/.test(fullText)) companyCategory = 'Educational Services';
    else if (/bank|financial|insurance|investment|exchange|accounting|audit/.test(fullText)) companyCategory = 'Finance and Banking';
    else if (/hotel|resort|restaurant|catering|hospitality|cafe/.test(fullText)) companyCategory = 'Hospitality';
    else if (/construction|contracting|electromechanical|engineering|building materials/.test(fullText)) companyCategory = 'Construction';
    else if (/software|technology|it services|digital|tech/.test(fullText)) companyCategory = 'Information Technology';
    else if (/logistics|freight|transportation|shipping|supply chain/.test(fullText)) companyCategory = 'Warehousing and Logistics';
    else if (/real estate|properties|property|realty/.test(fullText)) companyCategory = 'Real Estate';
    else if (/retail|supermarket|hypermarket|fashion|store|mall/.test(fullText)) companyCategory = 'Retail';
    else companyCategory = 'Corporate & Business';
  }

  // Rating: ONLY if there is any real rating! Otherwise NO NEED.
  const explicitRating = record.rating || m._employer_rating || null;
  const explicitReviewCount = record.reviewCount || m._employer_review_count || 0;
  const hasRating = Boolean(explicitRating && Number(explicitRating) > 0);
  const ratingScore = hasRating ? Number(explicitRating).toFixed(1) : null;
  const reviewCount = explicitReviewCount;

  // Short tagline / subtitle
  let tagline = record.tagline || m._employer_tagline || '';
  if (!tagline && location) {
    tagline = location;
  }

  return `
  <main class="emp-profile-page">
    <div class="wrap">
      
      <!-- Top Profile Header Card -->
      <section class="emp-profile-header-card" aria-label="Employer Profile Header">
        <div class="emp-profile-header-main">
          <div class="emp-profile-logo-wrap">
            ${logo ? `<img src="${esc(logo)}" alt="${esc(title)}" class="emp-profile-logo-img">` : `<div class="emp-profile-logo-fallback">${esc(title.slice(0, 2).toUpperCase() || 'CO')}</div>`}
          </div>
          
          <div class="emp-profile-meta-col">
            <div class="emp-profile-name-row">
              <h1 class="emp-profile-name">${esc(title)}</h1>
            </div>

            <!-- Rating: ONLY if there is any real rating! -->
            <div id="empHeaderRatingRow" class="emp-profile-rating-row" style="${hasRating ? '' : 'display:none;'}">
              <span class="emp-rating-star">★</span>
              <strong class="emp-rating-num" id="empHeaderRatingVal">${ratingScore || '0.0'}</strong>
              <span class="emp-rating-count" id="empHeaderReviewCnt">(${reviewCount} reviews)</span>
            </div>

            <!-- Subtitle / Tagline / Location -->
            ${tagline ? `<p class="emp-profile-tagline">${esc(tagline)}</p>` : ''}

            <!-- Company Category only -->
            ${companyCategory ? `
              <div class="emp-profile-pills-row">
                <span class="emp-meta-pill emp-cat-pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right:5px;display:inline-block;vertical-align:-1px;"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>${esc(companyCategory)}</span>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="emp-profile-header-actions">
          <div class="emp-header-rate-widget emp-rate-widget">
            <div class="emp-rate-head">
              <div class="emp-rate-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div>
                <strong>Worked at ${esc(title)}?</strong>
                <p>Share your experience and help other job seekers.</p>
              </div>
            </div>
            <button type="button" class="emp-rate-btn emp-open-rate-modal" id="openRateCompanyBtnHeader">Write review</button>
            <div class="emp-claim-prompt-row">
              <span class="emp-claim-question">Represent this company?</span>
              <button type="button" class="emp-claim-cta-btn" id="empOpenClaimBtn" data-slug="${esc(record.slug)}" data-name="${esc(title)}">Claim this profile</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Navigation Tabs Bar -->
      <div class="emp-profile-tabs-strip">
        <button type="button" class="emp-profile-tab-item active" data-tab="overview">Overview</button>
        <button type="button" class="emp-profile-tab-item" data-tab="jobs">Jobs <span class="emp-tab-badge">${totalOpenJobs}</span></button>
        <button type="button" class="emp-profile-tab-item" data-tab="reviews">Reviews <span class="emp-tab-badge" id="empTabReviewsBadge">${reviewCount || 0}</span></button>
      </div>

      <!-- Main Layout: 2 Columns -->
      <div class="emp-profile-layout">
        
        <!-- Left Content Pane -->
        <div class="emp-profile-left-col">
          
          <!-- Tab 1: Overview Tab Panel -->
          <div class="emp-tab-panel active" id="panel-overview" data-panel="overview">
            
            <!-- About Company Card -->
            <section class="emp-card-block emp-about-block">
              <h2 class="emp-card-title">About ${esc(title)}</h2>
              <div class="emp-about-content" id="empAboutText">
                <div class="emp-about-rendered wordpress-content">
                  ${cleanBio}
                </div>
              </div>
              <button type="button" class="emp-readmore-btn" id="empReadMoreBtn" onclick="const p = document.getElementById('empAboutText'); p.classList.toggle('expanded'); this.textContent = p.classList.contains('expanded') ? 'Show less' : 'Read more';">Read more</button>
            </section>

            <!-- More Information Card -->
            <section class="emp-card-block">
              <h2 class="emp-card-title">More Information</h2>
              <div class="emp-info-grid">
                <div class="emp-info-item">
                  <span class="emp-info-label">Type</span>
                  <span class="emp-info-val">Private</span>
                </div>
                <div class="emp-info-item">
                  <span class="emp-info-label">Founded</span>
                  <span class="emp-info-val">${esc(founded)}</span>
                </div>
                <div class="emp-info-item">
                  <span class="emp-info-label">Company Size</span>
                  <span class="emp-info-val">${esc(size)} employees</span>
                </div>
                <div class="emp-info-item">
                  <span class="emp-info-label">Headquarters</span>
                  <span class="emp-info-val">${esc(hq)}</span>
                </div>
                <div class="emp-info-item emp-info-full">
                  <span class="emp-info-label">Website</span>
                  <span class="emp-info-val">
                    ${website ? `<a href="${esc(website)}" target="_blank" rel="noopener noreferrer" class="emp-link-external">${esc(website)} ↗</a>` : '—'}
                  </span>
                </div>
                ${category ? `
                  <div class="emp-info-item emp-info-full">
                    <span class="emp-info-label">Industry Sectors</span>
                    <span class="emp-info-val">${esc(category)}</span>
                  </div>
                ` : ''}
              </div>
            </section>

          </div>

          <!-- Tab 2: Jobs Tab Panel -->
          <div class="emp-tab-panel" id="panel-jobs" data-panel="jobs">
            <section class="emp-card-block">
              <div class="emp-card-header-flex">
                <h2 class="emp-card-title">Open Positions at ${esc(title)} (${totalOpenJobs})</h2>
                <a href="/jobs?q=${encodeURIComponent(title)}" class="emp-card-sublink">View all on search portal →</a>
              </div>
              <div class="emp-positions-list">
                ${positions.length ? positions.map(item => jobCard(item, logo)).join('') : `
                  <div class="emp-no-jobs-box">
                    <p>No active openings currently published for ${esc(title)}. Check back regularly for new vacancies.</p>
                  </div>
                `}
              </div>
            </section>
          </div>

          <!-- Tab 3: Reviews Tab Panel -->
          <div class="emp-tab-panel" id="panel-reviews" data-panel="reviews">
            <section class="emp-card-block">
              <div class="emp-card-header-flex">
                <div>
                  <h2 class="emp-card-title">Employee Reviews & Workplace Feedback</h2>
                  <p class="emp-card-desc">Verified feedback and ratings from current and former employees</p>
                </div>
                <div class="emp-reviews-header-actions">
                  <span class="emp-rating-pill-lg" id="empReviewsHeaderRatingPill" style="display:none;">★ 0.0 Overall Rating</span>
                  <button type="button" class="emp-rate-company-btn" id="openRateCompanyBtn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    Rate Company
                  </button>
                </div>
              </div>

              <!-- Rating Score Overview Card (Dynamic - shown only when reviews exist) -->
              <div class="emp-rating-score-banner" id="empRatingScoreBanner" style="display:none;">
                <div class="emp-rating-big-score">
                  <div class="num" id="empBigOverallScore">5.0</div>
                  <div class="stars-gold" id="empBigOverallStars">★★★★★</div>
                  <div class="label" id="empReviewsCountLabel">Based on employee reviews</div>
                </div>
                <div class="emp-rating-score-stats">
                  <div class="stat-item">
                    <span class="val" id="empRecommendVal">100%</span>
                    <span class="lbl">Recommend to a friend</span>
                  </div>
                  <div class="stat-divider"></div>
                  <div class="stat-item">
                    <span class="val" id="empLeadershipVal">100%</span>
                    <span class="lbl">Approve of workplace</span>
                  </div>
                  <div class="stat-divider"></div>
                  <div class="stat-item">
                    <span class="val" id="empSecurityVal">5.0</span>
                    <span class="lbl">Job security index</span>
                  </div>
                </div>
              </div>

              <!-- Category Ratings Breakdown (Dynamic) -->
              <div class="emp-speaks-list" id="empSpeaksListWrapper" style="display:none; margin-top: 24px;">
                <div class="emp-speaks-row">
                  <span class="label">Salary & Benefits</span>
                  <div class="progress-bar"><div class="fill" id="fill_salary" style="width: 100%;"></div></div>
                  <span class="stars" id="score_salary">★ 5.0</span>
                </div>
                <div class="emp-speaks-row">
                  <span class="label">Work Life Balance</span>
                  <div class="progress-bar"><div class="fill" id="fill_workLife" style="width: 100%;"></div></div>
                  <span class="stars" id="score_workLife">★ 5.0</span>
                </div>
                <div class="emp-speaks-row">
                  <span class="label">Work Satisfaction</span>
                  <div class="progress-bar"><div class="fill" id="fill_satisfaction" style="width: 100%;"></div></div>
                  <span class="stars" id="score_satisfaction">★ 5.0</span>
                </div>
                <div class="emp-speaks-row">
                  <span class="label">Skill Development</span>
                  <div class="progress-bar"><div class="fill" id="fill_skills" style="width: 100%;"></div></div>
                  <span class="stars" id="score_skills">★ 5.0</span>
                </div>
                <div class="emp-speaks-row">
                  <span class="label">Company Culture</span>
                  <div class="progress-bar"><div class="fill" id="fill_culture" style="width: 100%;"></div></div>
                  <span class="stars" id="score_culture">★ 5.0</span>
                </div>
                <div class="emp-speaks-row">
                  <span class="label">Job Security</span>
                  <div class="progress-bar"><div class="fill" id="fill_security" style="width: 100%;"></div></div>
                  <span class="stars" id="score_security">★ 5.0</span>
                </div>
              </div>

              <!-- Prompt Callout to Rate -->
              <div class="emp-rate-callout-box">
                <div class="emp-rate-callout-content">
                  <div class="emp-rate-callout-icon">✨</div>
                  <div>
                    <h4>Worked at ${esc(title)}?</h4>
                    <p>Share your authentic workplace experience, salary insights, and culture feedback to assist UAE job seekers.</p>
                  </div>
                </div>
                <button type="button" class="emp-rate-callout-btn" id="openRateCompanyCalloutBtn">
                  ★ Add Your Rating
                </button>
              </div>

              <!-- Live User Reviews Feed (NO DUMMY REVIEWS) -->
              <div class="emp-reviews-feed" style="margin-top: 28px;">
                <h3 class="emp-feed-heading">Recent Workplace Reviews</h3>
                <div id="empUserReviewsList" class="emp-reviews-container">
                  <!-- Dynamically populated from submitted reviews -->
                </div>
                <div id="empNoReviewsEmptyState" class="emp-empty-reviews-state">
                  <div class="emp-empty-reviews-icon">★</div>
                  <h4>No reviews yet for ${esc(title)}</h4>
                  <p>Be the first employee to share your workplace rating and experience with fellow job seekers.</p>
                  <button type="button" class="emp-rate-callout-btn" id="openRateCompanyEmptyBtn">★ Add First Rating</button>
                </div>
              </div>

            </section>
          </div>

        </div>

        <!-- Right Sidebar Pane -->
        <aside class="emp-profile-right-col">
          
          <!-- Recruiter CTA Widget -->
          <div class="emp-sidebar-widget emp-recruiter-widget">
            <div class="emp-recruiter-content">
              <h3>Love jobs by ${esc(title)}?</h3>
              <p>Register with Trikonet and let employer talent scouts and recruiters discover your profile directly.</p>
              <a href="/register" class="emp-recruiter-btn">Register Now</a>
            </div>
            <div class="emp-recruiter-icon-wrap" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
            </div>
          </div>

          <!-- Rate Workplace CTA (Mobile View) -->
          <div class="emp-sidebar-widget emp-rate-widget emp-sidebar-rate-widget">
            <div class="emp-rate-head">
              <div class="emp-rate-icon">⭐</div>
              <div>
                <strong>Rate ${esc(title)}</strong>
                <p>Share your employee review to assist fellow UAE job seekers.</p>
              </div>
            </div>
            <button type="button" class="emp-rate-btn emp-open-rate-modal" id="openRateCompanyBtnSidebar">Write review</button>
          </div>

        </aside>

      </div>

    </div>

    <!-- Claim Company Verification Modal -->
    <div class="emp-claim-modal-overlay" id="empClaimModal" style="display:none;" aria-hidden="true" role="dialog" aria-labelledby="claimModalTitle">
      <div class="emp-claim-modal-card">
        <button type="button" class="emp-modal-close" id="empCloseClaimBtn" aria-label="Close modal">×</button>
        
        <!-- Step 1: Claim Submission Form -->
        <div id="empClaimFormWrap">
          <div class="emp-modal-head">
            <div class="emp-modal-shield-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <h2 id="claimModalTitle">Claim ${esc(title)} Profile</h2>
              <p>Submit official business verification to claim ownership of this employer page. Once approved, login credentials will be dispatched to manage profile details and post vacancies.</p>
            </div>
          </div>

          <form id="empClaimSubmitForm" class="emp-claim-form" onsubmit="event.preventDefault(); window.handleEmployerClaimSubmit && window.handleEmployerClaimSubmit(this);">
            <input type="hidden" name="employerSlug" value="${esc(record.slug)}">
            <input type="hidden" name="employerName" value="${esc(title)}">

            <div class="emp-form-row">
              <label>
                <span>Authorized Representative Name *</span>
                <input type="text" name="applicantName" placeholder="e.g. Sarah Al Hashimi" required>
              </label>
              <label>
                <span>Official Designation / Title *</span>
                <input type="text" name="designation" placeholder="e.g. Head of Human Resources" required>
              </label>
            </div>

            <div class="emp-form-row">
              <label>
                <span>Work / Corporate Email *</span>
                <input type="email" name="workEmail" placeholder="e.g. hr@${esc(record.slug)}.ae" required>
                <small class="emp-field-hint">Must match official company domain</small>
              </label>
              <label>
                <span>Phone / WhatsApp Contact *</span>
                <input type="tel" name="phone" placeholder="+971 50 123 4567" required>
              </label>
            </div>

            <div class="emp-form-row">
              <label>
                <span>Verification Document Type *</span>
                <select name="documentType" required>
                  <option value="UAE Trade License">UAE Trade License / Commercial License</option>
                  <option value="Company Establishment Card">Company Establishment Card (MOHRE / Immigration)</option>
                  <option value="Power of Attorney / Authorization Letter">Power of Attorney / Official Authorization Letter</option>
                  <option value="VAT / TRN Certificate">Federal Tax Authority (TRN) Certificate</option>
                </select>
              </label>
            </div>

            <div class="emp-form-group">
              <label>
                <span>Upload Official Verification Document (PDF, JPG, PNG) *</span>
                <div class="emp-doc-upload-box" id="empDocDropBox">
                  <input type="file" id="empDocFileInput" name="documentFile" accept=".pdf,.jpg,.jpeg,.png" required style="display:none;" onchange="window.handleClaimFileSelect && window.handleClaimFileSelect(this)">
                  <div class="emp-upload-prompt" onclick="document.getElementById('empDocFileInput').click()">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span id="empUploadLabelText">Click or drag & drop trade license / document here</span>
                    <small>Maximum size: 10MB (PDF, PNG, JPG)</small>
                  </div>
                </div>
              </label>
            </div>

            <div class="emp-form-group">
              <label>
                <span>Additional Remarks / Corporate Verification Notes</span>
                <textarea name="notes" rows="2" placeholder="Provide any additional verification notes, branch details, or official verification links."></textarea>
              </label>
            </div>

            <div class="emp-modal-footer">
              <button type="button" class="emp-btn-cancel" onclick="document.getElementById('empClaimModal').style.display='none'">Cancel</button>
              <button type="submit" class="emp-btn-submit" id="empClaimSubmitBtn">Submit Claim Request</button>
            </div>
          </form>
        </div>

        <!-- Step 2: Submission Success State -->
        <div id="empClaimSuccessWrap" style="display:none;" class="emp-claim-success-wrap">
          <div class="emp-success-icon-badge">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3>Claim Request Submitted!</h3>
          <p class="emp-success-msg">Your claim request for <strong>${esc(title)}</strong> has been registered with reference <code id="empClaimRefCode">#CLM-109283</code>.</p>
          <div class="emp-success-steps-box">
            <h4>What happens next?</h4>
            <ol>
              <li>Our verification team will review your business credentials and company domain within <strong>24 – 48 business hours</strong>.</li>
              <li>Once authenticated, official administrative login credentials (username and temporary password) will be sent to your work email address.</li>
              <li>You can log in to Trikonet Console to edit your employer profile, publish job listings, and manage applicants directly.</li>
            </ol>
          </div>
          <button type="button" class="emp-btn-close-success" onclick="document.getElementById('empClaimModal').style.display='none'">Done</button>
        </div>

      </div>
    </div>

    <!-- Rate & Review Employer Modal -->
    <div class="emp-claim-modal-overlay" id="empRateModal" style="display:none;" aria-hidden="true" role="dialog" aria-labelledby="rateModalTitle">
      <div class="emp-claim-modal-card emp-rate-modal-card">
        <button type="button" class="emp-modal-close" id="empCloseRateBtn" aria-label="Close modal">×</button>
        
        <!-- Step 1: Rate Submission Form -->
        <div id="empRateFormWrap">
          <div class="emp-modal-head">
            <div class="emp-modal-star-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div>
              <h2 id="rateModalTitle">Rate ${esc(title)}</h2>
              <p>Share your authentic workplace experience, salary insights, and culture feedback to assist fellow job seekers.</p>
            </div>
          </div>

          <form id="empRateSubmitForm" class="emp-claim-form" onsubmit="event.preventDefault(); window.handleEmployerRateSubmit && window.handleEmployerRateSubmit(this);">
            <input type="hidden" name="employerSlug" value="${esc(record.slug)}">
            <input type="hidden" name="employerName" value="${esc(title)}">
            <input type="hidden" id="empSelectedRatingScore" name="ratingScore" value="5">

            <!-- Rate Each Section / Workplace Aspect (Interactive) -->
            <div class="emp-section-ratings-block">
              <div class="emp-section-ratings-header">
                <span class="emp-rate-picker-label">Rate Each Workplace Aspect (1 to 5 Stars) *</span>
                <span class="emp-rate-picker-hint">Click stars for each section to rate your experience</span>
              </div>

              <div class="emp-section-ratings-grid">
                <!-- 1. Salary & Benefits -->
                <div class="emp-section-star-row" data-section="salary">
                  <div class="emp-sec-label-box">
                    <span class="emp-sec-icon">💰</span>
                    <span class="emp-sec-title">Salary & Benefits</span>
                  </div>
                  <div class="emp-sec-stars-group">
                    <button type="button" class="emp-sec-star-btn active" data-section="salary" data-rating="1">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="salary" data-rating="2">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="salary" data-rating="3">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="salary" data-rating="4">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="salary" data-rating="5">★</button>
                    <span class="emp-sec-score-badge" id="scoreBadge_salary">5.0</span>
                    <input type="hidden" name="rating_salary" id="input_rating_salary" value="5">
                  </div>
                </div>

                <!-- 2. Work Life Balance -->
                <div class="emp-section-star-row" data-section="workLife">
                  <div class="emp-sec-label-box">
                    <span class="emp-sec-icon">⚖️</span>
                    <span class="emp-sec-title">Work Life Balance</span>
                  </div>
                  <div class="emp-sec-stars-group">
                    <button type="button" class="emp-sec-star-btn active" data-section="workLife" data-rating="1">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="workLife" data-rating="2">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="workLife" data-rating="3">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="workLife" data-rating="4">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="workLife" data-rating="5">★</button>
                    <span class="emp-sec-score-badge" id="scoreBadge_workLife">5.0</span>
                    <input type="hidden" name="rating_workLife" id="input_rating_workLife" value="5">
                  </div>
                </div>

                <!-- 3. Work Satisfaction -->
                <div class="emp-section-star-row" data-section="satisfaction">
                  <div class="emp-sec-label-box">
                    <span class="emp-sec-icon">🎯</span>
                    <span class="emp-sec-title">Work Satisfaction</span>
                  </div>
                  <div class="emp-sec-stars-group">
                    <button type="button" class="emp-sec-star-btn active" data-section="satisfaction" data-rating="1">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="satisfaction" data-rating="2">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="satisfaction" data-rating="3">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="satisfaction" data-rating="4">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="satisfaction" data-rating="5">★</button>
                    <span class="emp-sec-score-badge" id="scoreBadge_satisfaction">5.0</span>
                    <input type="hidden" name="rating_satisfaction" id="input_rating_satisfaction" value="5">
                  </div>
                </div>

                <!-- 4. Skill Development -->
                <div class="emp-section-star-row" data-section="skills">
                  <div class="emp-sec-label-box">
                    <span class="emp-sec-icon">🚀</span>
                    <span class="emp-sec-title">Skill Development</span>
                  </div>
                  <div class="emp-sec-stars-group">
                    <button type="button" class="emp-sec-star-btn active" data-section="skills" data-rating="1">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="skills" data-rating="2">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="skills" data-rating="3">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="skills" data-rating="4">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="skills" data-rating="5">★</button>
                    <span class="emp-sec-score-badge" id="scoreBadge_skills">5.0</span>
                    <input type="hidden" name="rating_skills" id="input_rating_skills" value="5">
                  </div>
                </div>

                <!-- 5. Company Culture -->
                <div class="emp-section-star-row" data-section="culture">
                  <div class="emp-sec-label-box">
                    <span class="emp-sec-icon">🤝</span>
                    <span class="emp-sec-title">Company Culture</span>
                  </div>
                  <div class="emp-sec-stars-group">
                    <button type="button" class="emp-sec-star-btn active" data-section="culture" data-rating="1">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="culture" data-rating="2">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="culture" data-rating="3">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="culture" data-rating="4">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="culture" data-rating="5">★</button>
                    <span class="emp-sec-score-badge" id="scoreBadge_culture">5.0</span>
                    <input type="hidden" name="rating_culture" id="input_rating_culture" value="5">
                  </div>
                </div>

                <!-- 6. Job Security -->
                <div class="emp-section-star-row" data-section="security">
                  <div class="emp-sec-label-box">
                    <span class="emp-sec-icon">🛡️</span>
                    <span class="emp-sec-title">Job Security</span>
                  </div>
                  <div class="emp-sec-stars-group">
                    <button type="button" class="emp-sec-star-btn active" data-section="security" data-rating="1">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="security" data-rating="2">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="security" data-rating="3">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="security" data-rating="4">★</button>
                    <button type="button" class="emp-sec-star-btn active" data-section="security" data-rating="5">★</button>
                    <span class="emp-sec-score-badge" id="scoreBadge_security">5.0</span>
                    <input type="hidden" name="rating_security" id="input_rating_security" value="5">
                  </div>
                </div>
              </div>

              <!-- Overall Computed Score -->
              <div class="emp-overall-calc-box">
                <div class="emp-overall-calc-label">
                  <span>Overall Rating:</span>
                  <strong class="emp-calc-overall-num" id="empCalcOverallVal">5.0</strong>
                  <span class="emp-star-status-tag" id="empStarStatusTag">5.0 - Excellent</span>
                </div>
              </div>
            </div>

            <div class="emp-form-row">
              <label>
                <span>Your Role / Job Title *</span>
                <input type="text" name="jobTitle" placeholder="e.g. Registered Nurse, Accountant, Sales Associate" required>
              </label>
              <label>
                <span>Employment Status *</span>
                <select name="employmentStatus" required>
                  <option value="Current Employee">Current Employee</option>
                  <option value="Former Employee">Former Employee</option>
                  <option value="Contractor / Consultant">Contractor / Consultant</option>
                  <option value="Intern">Intern</option>
                </select>
              </label>
            </div>

            <div class="emp-form-row">
              <label>
                <span>Location / City</span>
                <input type="text" name="location" placeholder="e.g. Dubai, Abu Dhabi, Sharjah">
              </label>
              <label>
                <span>Years of Experience at Company</span>
                <select name="yearsExp">
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1 to 2 years">1 to 2 years</option>
                  <option value="3 to 5 years">3 to 5 years</option>
                  <option value="More than 5 years">More than 5 years</option>
                </select>
              </label>
            </div>

            <div class="emp-form-group">
              <label>
                <span>Review Title *</span>
                <input type="text" name="reviewTitle" placeholder="e.g. Supportive leadership, great team environment and prompt salary" required>
              </label>
            </div>

            <div class="emp-form-group">
              <label>
                <span>Your Workplace Feedback / Experience *</span>
                <textarea name="feedback" rows="3" placeholder="Share specific details about what you liked, company benefits, work-life balance, and advice for future candidates." required></textarea>
              </label>
            </div>

            <div class="emp-modal-footer">
              <button type="button" class="emp-btn-cancel" onclick="document.getElementById('empRateModal').style.display='none'">Cancel</button>
              <button type="submit" class="emp-btn-submit" id="empRateSubmitBtn">Submit Rating</button>
            </div>
          </form>
        </div>

        <!-- Step 2: Rating Success State -->
        <div id="empRateSuccessWrap" style="display:none;" class="emp-claim-success-wrap">
          <div class="emp-success-icon-badge" style="background: #fefce8; color: #ca8a04;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <h3>Thank You for Rating!</h3>
          <p class="emp-success-msg">Your rating and workplace feedback for <strong>${esc(title)}</strong> has been verified and published.</p>
          <div class="emp-success-steps-box">
            <h4>Your contribution helps the community</h4>
            <p style="font-size:13.5px;color:#475569;margin:0;">Job seekers on Trikonet rely on authentic feedback from professionals like you to evaluate workplace culture and compensation.</p>
          </div>
          <button type="button" class="emp-btn-close-success" onclick="document.getElementById('empRateModal').style.display='none'">Done</button>
        </div>

      </div>
    </div>

  </main>`;
}
