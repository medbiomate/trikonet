import { sendAsset } from './asset-response.mjs';
import {logoFor,socialHead} from './social-preview.js';
import { isPrivatePage, isPublishedRecord } from './indexing-policy.js';
import http from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import dns from 'node:dns';
import { renderSeoLanding, seoHead } from './seo-public.js';
import { JOBS_SEO_TITLE, JOBS_SEO_DESCRIPTION } from './jobs-seo.js';
import { renderCategoryLinks, renderAllCategories } from './category-links.js';

// The hosting API edge denies this server's IPv6 route; its IPv4 route is
// healthy. Prefer IPv4 for server-side API calls without bypassing TLS/CDN.
dns.setDefaultResultOrder('ipv4first');

const root = fileURLToPath(new URL('.', import.meta.url));
const localDataDir = join(root, 'data');
const backendDataDir = join(root, '../backend/data');
const dataDir = existsSync(localDataDir) ? localDataDir : backendDataDir;
const localDbPath = existsSync(join(localDataDir, 'local-db.json')) ? join(localDataDir, 'local-db.json') : join(backendDataDir, 'local-db.json');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
let categorySnapshot=[];
let categorySnapshotAt=0;
let categorySnapshotRefresh;
function refreshCategorySnapshot(){
  if(!categorySnapshotRefresh)categorySnapshotRefresh=fetch(`${process.env.TRIKONET_API_BASE || 'https://api.trikonet.com'}/api/job-category-links`,{signal:AbortSignal.timeout(15000)}).then(async response=>{if(!response.ok)throw new Error('Category API unavailable');categorySnapshot=await response.json();categorySnapshotAt=Date.now();return categorySnapshot;}).finally(()=>{categorySnapshotRefresh=null;});
  return categorySnapshotRefresh;
}
async function getCategorySnapshot(){
  if(Date.now()-categorySnapshotAt>60000)refreshCategorySnapshot().catch(()=>{});
  if(categorySnapshot.length)return categorySnapshot;
  return Promise.race([refreshCategorySnapshot(),new Promise(resolve=>setTimeout(()=>resolve([]),2000))]);
}
refreshCategorySnapshot().catch(()=>{});

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.xsl': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Cached in-memory datasets
let memoryTaxonomies = null;
let memoryPosts = null;
let memoryJobs = null;
let memoryEmployers = null;
const sessions = new Map();
const adminSessions = new Map();
const MAX_RESUMES_PER_USER = 3;
const MAX_PROFILE_PHOTO_BYTES = 100 * 1024;

function passwordMatches(password, user) {
  if (!user || !password) return false;
  const salt = user.passwordSalt || user.salt;
  const hash = user.passwordHash || user.hash;
  if (!salt || !hash) return false;
  try {
    const scryptHash = crypto.scryptSync(password, salt, 64).toString('hex');
    const expected = Buffer.from(hash, 'hex');
    const actual = Buffer.from(scryptHash, 'hex');
    if (expected.length === actual.length && crypto.timingSafeEqual(actual, expected)) return true;
  } catch {}
  try {
    const pbkdf2Hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    const expected = Buffer.from(hash, 'hex');
    const actual = Buffer.from(pbkdf2Hash, 'hex');
    if (expected.length === actual.length && crypto.timingSafeEqual(actual, expected)) return true;
  } catch {}
  return hash === password;
}

async function loadData(filename) {
  try {
    const raw = await readFile(join(dataDir, filename), 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

async function getLocalDb() {
  try {
    const raw = await readFile(localDbPath, 'utf-8');
    const parsed = JSON.parse(raw);
    parsed.users = parsed.users || [];
    parsed.emailCampaigns = parsed.emailCampaigns || [];
    parsed.savedJobs = parsed.savedJobs || [];
    parsed.employerClaims = parsed.employerClaims || [];
    parsed.resumes = parsed.resumes || [];
    parsed.jobReports = parsed.jobReports || [];
    return parsed;
  } catch {
    return { users: [], emailCampaigns: [], savedJobs: [], employerClaims: [], resumes: [], jobReports: [] };
  }
}

async function saveLocalDb(db) {
  try {
    await writeFile(localDbPath, JSON.stringify(db, null, 2), 'utf-8');
  } catch {}
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(JSON.stringify(data));
}

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (!rc) return list;
  rc.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
}

async function readJsonBody(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 2_000_000) throw new Error('Request too large');
  }
  return body ? JSON.parse(body) : {};
}

function dataUrlBytes(value) {
  const match = String(value || '').match(/^data:[^;,]+;base64,(.+)$/);
  if (!match) return 0;
  return Math.max(0, Math.floor(match[1].length * 3 / 4) - (match[1].endsWith('==') ? 2 : match[1].endsWith('=') ? 1 : 0));
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let path = decodeURIComponent(requestUrl.pathname);
  let resolvedJobUrl = null;
  // One production address; preserve the complete path and query string.
  // Do not redirect API, development or local requests.
  if (requestUrl.hostname === 'trikonet.com') {
    res.writeHead(308, { Location: `https://www.trikonet.com${requestUrl.pathname}${requestUrl.search}` });
    return res.end();
  }
  // Only our public raster media can be read for logo whitespace fitting.
  // Keep this same-origin; the CDN intentionally has no canvas CORS headers.
  if (path === '/logo-source' && req.method === 'GET') {
    try {
      const source = new URL(requestUrl.searchParams.get('src'));
      if (source.protocol !== 'https:' || source.hostname !== 'media.trikonet.com' ||
          source.port || source.username || source.password ||
          !/^\/images\/[a-zA-Z0-9._-]+\.(png|jpe?g|webp)$/i.test(source.pathname)) {
        return sendJson(res, 400, { error: 'Invalid logo source' });
      }
      source.search = '';
      const upstream = await fetch(source, { redirect: 'error', signal: AbortSignal.timeout(5000) });
      if (!upstream.ok || !/^image\/(png|jpeg|webp)/i.test(upstream.headers.get('content-type') || '')) {
        return sendJson(res, 502, { error: 'Logo unavailable' });
      }
      const chunks = [];
      let size = 0;
      for await (const chunk of upstream.body) {
        size += chunk.length;
        if (size > 3 * 1024 * 1024) throw new Error('Logo too large');
        chunks.push(chunk);
      }
      res.writeHead(200, { 'Content-Type': upstream.headers.get('content-type'),
        'Cache-Control': 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff' });
      return res.end(Buffer.concat(chunks));
    } catch {
      return sendJson(res, 502, { error: 'Logo unavailable' });
    }
  }
  if (/^\/(job|jobs)\/[^/]+\/?$/.test(path) && ['GET','HEAD'].includes(req.method) && !requestUrl.searchParams.has('preview') && !requestUrl.searchParams.has('draft')) {
    try {
      const response = await fetch(`${process.env.TRIKONET_API_BASE || 'https://api.trikonet.com'}/api/job-url?path=${encodeURIComponent(path)}`, {signal:AbortSignal.timeout(10000)});
      if (response.ok) {
        resolvedJobUrl = await response.json();
        if (path !== resolvedJobUrl.publicPath) { res.writeHead(301,{Location:resolvedJobUrl.publicPath}); return res.end(); }
        path = `/job/${resolvedJobUrl.slug}`;
      } else if (response.status === 404) { res.writeHead(404,{'Content-Type':'text/html','X-Robots-Tag':'noindex'}); return res.end('<h1>Page Not Found</h1>'); }
      else throw new Error('Job URL service unavailable');
    } catch { res.writeHead(503,{'Content-Type':'text/html','Cache-Control':'no-store'}); return res.end('<h1>Page temporarily unavailable</h1>'); }
  }
  const legacyJob = path.match(/^\/jobs\/([^/]+)\/?$/);
  if (legacyJob && ['GET','HEAD'].includes(req.method)) {
    res.writeHead(301,{Location:`/job/${encodeURIComponent(legacyJob[1])}${requestUrl.search}`});
    return res.end();
  }

  // Health check
  if (path === '/healthz' || path === '/api/health') {
    return sendJson(res, 200, { status: 'ok', domain: requestUrl.hostname });
  }

  if (path === '/api/job-reports' && req.method === 'POST') {
    try {
      const payload = await readJsonBody(req);
      const allowedReasons = ['broken_link', 'expired', 'incorrect', 'duplicate', 'suspicious', 'other'];
      const jobSlug = String(payload.jobSlug || '').trim();
      const jobTitle = String(payload.jobTitle || '').trim();
      const reason = String(payload.reason || '').trim();
      const details = String(payload.details || '').trim().slice(0, 1000);
      if (!jobSlug || !jobTitle || !allowedReasons.includes(reason)) {
        return sendJson(res, 400, { error: 'Please select a valid reason for reporting this job.' });
      }
      const session = sessions.get(parseCookies(req).trikonet_session);
      const db = await getLocalDb();
      const report = {
        id: crypto.randomUUID(),
        jobSlug,
        jobTitle,
        jobPath: String(payload.jobPath || '').slice(0, 500),
        reason,
        details,
        reporterUserId: session?.id || null,
        reporterEmail: session?.email || null,
        status: 'new',
        createdAt: new Date().toISOString()
      };
      db.jobReports.push(report);
      await saveLocalDb(db);
      return sendJson(res, 201, { ok: true, reportId: report.id });
    } catch {
      return sendJson(res, 400, { error: 'Unable to submit this report.' });
    }
  }

  // API: Taxonomies (Job Categories, Locations, Types)
  if (path === '/api/wp/taxonomies' || path === '/api/local/taxonomies') {
    if (req.method === 'PUT') {
      try {
        const body = await readJsonBody(req);
        const db = await getLocalDb();
        db.taxonomies = { ...(db.taxonomies || {}), ...body };
        await saveLocalDb(db);
        memoryTaxonomies = db.taxonomies;
        return sendJson(res, 200, db.taxonomies);
      } catch {
        return sendJson(res, 400, { error: 'Failed to update taxonomies' });
      }
    }
    if (!memoryTaxonomies) {
      memoryTaxonomies = await loadData('taxonomies.json');
    }
    return sendJson(res, 200, memoryTaxonomies || { types: [], categories: [], locations: [], tags: [] });
  }

  // Helpers for filtering dataset
  function filterJobs(list, params) {
    const slug = params.get('slug');
    if (slug) {
      return list.filter(item => item.slug === slug || item.id === Number(slug));
    }
    const query = (params.get('q') || '').trim().toLowerCase();
    const location = (params.get('location') || '').trim();
    const category = (params.get('category') || '').trim();
    const jobType = (params.get('job_type') || '').trim();
    const employerId = Number(params.get('employer_id'));

    let filtered = [...list];

    if (query) {
      const terms = [...new Set(query.split(/\s+/).filter(Boolean))];
      const searchableText = item => {
        const metas = item.metas || {};
        const metaText = Object.entries(metas)
          .filter(([key]) => key.startsWith('_job_') || key.startsWith('custom-text-'))
          .flatMap(([, value]) => typeof value === 'object' && value ? Object.values(value) : [value]);
        return [
          item.title?.rendered || item.title,
          item.content?.rendered || item.content,
          item.excerpt?.rendered || item.excerpt,
          item.company,
          ...(item.categories || []), ...(item.locations || []), ...(item.types || []), ...(item.tags || []),
          ...metaText
        ].filter(Boolean).join(' ').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
      };
      const score = item => {
        const title = String(item.title?.rendered || item.title || '').toLowerCase();
        const company = String(item.metas?._job_employer_name || item.company || '').toLowerCase();
        const body = searchableText(item);
        if (title === query) return 100;
        if (title.startsWith(query)) return 90;
        if (title.includes(query)) return 80;
        if (company === query) return 75;
        if (company.includes(query)) return 65;
        return body.includes(query) ? 40 : 20;
      };
      filtered = filtered.filter(item => {
        const text = searchableText(item);
        return terms.every(term => text.includes(term));
      }).sort((a, b) => score(b) - score(a));
    }

    if (location && location !== 'Country or City' && location !== 'All Locations') {
      filtered = filtered.filter(item => {
        const locs = Object.values(item.metas?._job_location || {});
        return locs.some(l => l.toLowerCase() === location.toLowerCase());
      });
    }

    if (category && category !== 'All Categories') {
      filtered = filtered.filter(item => {
        const cats = Object.values(item.metas?._job_category || {});
        return cats.some(c => c.toLowerCase() === category.toLowerCase());
      });
    }

    if (jobType) {
      filtered = filtered.filter(item => {
        const types = Object.values(item.metas?._job_type || {});
        return types.some(t => t.toLowerCase() === jobType.toLowerCase());
      });
    }

    if (employerId) {
      filtered = filtered.filter(item => Number(item.metas?._job_employer_posted_by) === employerId);
    }

    const employerSlug = (params.get('employer_slug') || '').trim().toLowerCase();
    if (employerSlug) {
      filtered = filtered.filter(item => {
        const url = (item.metas?._job_employer_url || '').toLowerCase();
        const slug = (item.metas?._job_employer_slug || '').toLowerCase();
        return slug === employerSlug || url.endsWith(`/${employerSlug}`) || url.endsWith(`/${employerSlug}/`);
      });
    }

    return filtered;
  }

  function filterEmployers(list, params) {
    const slug = params.get('slug');
    if (slug) {
      return list.filter(item => item.slug === slug || item.id === Number(slug));
    }
    const query = (params.get('q') || '').trim().toLowerCase();
    const location = (params.get('location') || '').trim();
    const category = (params.get('category') || '').trim();
    const minJobs = Number(params.get('min_jobs'));

    let filtered = list;

    if (query) {
      filtered = filtered.filter(item => {
        const title = (item.title?.rendered || item.title || '').toLowerCase();
        const cats = Object.values(item.metas?._employer_category || {}).join(' ').toLowerCase();
        const locs = Object.values(item.metas?._employer_location || {}).join(' ').toLowerCase();
        return title.includes(query) || cats.includes(query) || locs.includes(query);
      });
    }

    if (location && location !== 'City or postcode' && location !== 'All Locations' && location !== 'Country or City') {
      filtered = filtered.filter(item => {
        const locs = Object.values(item.metas?._employer_location || {});
        return locs.some(l => l.toLowerCase().includes(location.toLowerCase()));
      });
    }

    if (category && category !== 'All Categories') {
      filtered = filtered.filter(item => {
        const cats = Object.values(item.metas?._employer_category || {});
        return cats.some(c => c.toLowerCase().includes(category.toLowerCase()));
      });
    }

    if (minJobs) {
      filtered = filtered.filter(item => (Number(item.metas?._employer_open_jobs) || 0) >= minJobs);
    }

    return filtered;
  }

  // API: Counts (live dynamic counts)
  if (path === '/api/wp/counts') {
    if (!memoryJobs) memoryJobs = await loadData('jobs.json');
    if (!memoryEmployers) memoryEmployers = await loadData('employers.json');
    if (!memoryPosts) memoryPosts = await loadData('posts.json');
    const db = await getLocalDb();
    const baseJobs = Array.isArray(memoryJobs) ? memoryJobs.length : 13621;
    const localJobsCount = Array.isArray(db.jobs) ? db.jobs.length : 0;
    const baseEmployers = Array.isArray(memoryEmployers) ? memoryEmployers.length : 2728;
    const localEmployersCount = Array.isArray(db.employers) ? db.employers.length : 0;
    const basePosts = Array.isArray(memoryPosts) ? memoryPosts.length : 30;

    return sendJson(res, 200, {
      job_listing: baseJobs + localJobsCount,
      employer: baseEmployers + localEmployersCount,
      post: basePosts
    });
  }

  if (path === '/api/wp/count') {
    const type = requestUrl.searchParams.get('type') || 'job_listing';
    const db = await getLocalDb();
    if (type === 'employer') {
      if (!memoryEmployers) memoryEmployers = await loadData('employers.json');
      const baseEmployers = Array.isArray(memoryEmployers) ? memoryEmployers : [];
      const localEmployers = Array.isArray(db.employers) ? db.employers : [];
      const allEmployers = [...localEmployers, ...baseEmployers];
      const filtered = filterEmployers(allEmployers, requestUrl.searchParams);
      return sendJson(res, 200, { total: filtered.length });
    }
    if (!memoryJobs) memoryJobs = await loadData('jobs.json');
    const baseJobs = Array.isArray(memoryJobs) ? memoryJobs : [];
    const localJobs = Array.isArray(db.jobs) ? db.jobs : [];
    const allJobs = [...localJobs, ...baseJobs];
    const filtered = filterJobs(allJobs, requestUrl.searchParams);
    return sendJson(res, 200, { total: filtered.length });
  }

  // API: Posts / Blogs
  if (path === '/api/wp/posts') {
    if (!memoryPosts) {
      memoryPosts = await loadData('posts.json');
    }
    const perPage = Number(requestUrl.searchParams.get('per_page')) || 30;
    const posts = Array.isArray(memoryPosts) ? memoryPosts.slice(0, perPage) : [];
    return sendJson(res, 200, posts);
  }

  // API: Local user-created database
  if (path === '/api/local/jobs' && req.method === 'GET') {
    const db = await getLocalDb();
    return sendJson(res, 200, db.jobs || []);
  }

  if (path.startsWith('/api/local/jobs/') && req.method === 'GET') {
    const slug = decodeURIComponent(path.slice('/api/local/jobs/'.length));
    const db = await getLocalDb();
    const job = (db.jobs || []).find(item => item.slug === slug);
    return sendJson(res, job ? 200 : 404, job || { error: 'Job not found' });
  }

  if (path === '/api/local/jobs' && (req.method === 'POST' || req.method === 'PUT')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const job = JSON.parse(body || '{}');
        if (!job.title?.trim()) {
          return sendJson(res, 400, { error: 'Title is required' });
        }
        if (!job.slug?.trim()) {
          job.slug = job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        job.slug = job.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const nowIso = new Date().toISOString();
        job.createdAt = job.createdAt || nowIso;
        job.updatedAt = nowIso;
        job.local = true;

        const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const db = await getLocalDb();
        if (!db.jobs) db.jobs = [];
        const index = db.jobs.findIndex(item => item.slug === job.originalSlug || item.slug === job.slug);
        delete job.originalSlug;

        if (index >= 0) {
          job.updatedDate = formattedDate;
          job.date = formattedDate;
          db.jobs[index] = job;
        } else {
          job.publishedDate = formattedDate;
          job.date = formattedDate;
          db.jobs.unshift(job);
        }
        await saveLocalDb(db);
        return sendJson(res, 200, job);
      } catch (err) {
        return sendJson(res, 400, { error: err.message });
      }
    });
    return;
  }

  if (path.startsWith('/api/local/jobs/') && req.method === 'DELETE') {
    const slug = decodeURIComponent(path.slice('/api/local/jobs/'.length));
    const db = await getLocalDb();
    const before = (db.jobs || []).length;
    db.jobs = (db.jobs || []).filter(item => item.slug !== slug);
    await saveLocalDb(db);
    return sendJson(res, 200, { deleted: true, count: db.jobs.length });
  }

  if (path === '/api/local/employers') {
    const db = await getLocalDb();
    return sendJson(res, 200, db.employers || []);
  }

  // API: Employer Profile Claims (Verification & Login Issuance)
  if (path === '/api/local/employer-claims' && req.method === 'GET') {
    const db = await getLocalDb();
    return sendJson(res, 200, db.employerClaims || []);
  }

  if (path === '/api/local/employer-claims' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const employerSlug = String(payload.employerSlug || '').trim();
        const employerName = String(payload.employerName || '').trim();
        const applicantName = String(payload.applicantName || '').trim();
        const workEmail = String(payload.workEmail || '').trim().toLowerCase();
        const phone = String(payload.phone || '').trim();
        const designation = String(payload.designation || '').trim();
        const documentType = String(payload.documentType || 'UAE Trade License').trim();
        const documentName = String(payload.documentName || '').trim();
        const documentData = payload.documentData || '';
        const notes = String(payload.notes || '').trim();

        if (!employerSlug || !applicantName || !workEmail || !phone) {
          return sendJson(res, 400, { error: 'Please provide full name, official work email, phone number, and employer.' });
        }

        const db = await getLocalDb();
        db.employerClaims = db.employerClaims || [];

        const claim = {
          id: 'CLM-' + Math.floor(100000 + Math.random() * 900000),
          employerSlug,
          employerName: employerName || employerSlug,
          applicantName,
          workEmail,
          phone,
          designation,
          documentType,
          documentName,
          documentData,
          notes,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        db.employerClaims.unshift(claim);
        await saveLocalDb(db);
        return sendJson(res, 201, { ok: true, claim });
      } catch (err) {
        return sendJson(res, 400, { error: 'Failed to process claim submission.' });
      }
    });
    return;
  }

  if (path === '/api/local/employer-claims/approve' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { claimId } = JSON.parse(body || '{}');
        const db = await getLocalDb();
        db.employerClaims = db.employerClaims || [];
        const claim = db.employerClaims.find(c => c.id === claimId);
        if (!claim) {
          return sendJson(res, 404, { error: 'Claim request not found.' });
        }

        const tempPassword = `Trikonet@${Math.floor(1000 + Math.random() * 9000)}!`;
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(tempPassword, salt, 1000, 64, 'sha512').toString('hex');

        db.users = db.users || [];
        let existingUser = db.users.find(u => u.email === claim.workEmail);
        if (existingUser) {
          existingUser.salt = salt;
          existingUser.hash = hash;
          existingUser.role = 'employer';
          existingUser.employerSlug = claim.employerSlug;
          existingUser.employerName = claim.employerName;
        } else {
          db.users.push({
            id: crypto.randomUUID(),
            name: claim.applicantName,
            email: claim.workEmail,
            role: 'employer',
            employerSlug: claim.employerSlug,
            employerName: claim.employerName,
            salt,
            hash,
            createdAt: new Date().toISOString()
          });
        }

        claim.status = 'approved';
        claim.approvedAt = new Date().toISOString();
        claim.issuedUsername = claim.workEmail;
        claim.issuedPassword = tempPassword;

        await saveLocalDb(db);
        return sendJson(res, 200, {
          ok: true,
          claimId: claim.id,
          username: claim.workEmail,
          password: tempPassword,
          employerName: claim.employerName
        });
      } catch (err) {
        return sendJson(res, 400, { error: 'Failed to approve claim.' });
      }
    });
    return;
  }

  if (path === '/api/local/employer-claims/reject' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { claimId, reason } = JSON.parse(body || '{}');
        const db = await getLocalDb();
        db.employerClaims = db.employerClaims || [];
        const claim = db.employerClaims.find(c => c.id === claimId);
        if (!claim) {
          return sendJson(res, 404, { error: 'Claim request not found.' });
        }
        claim.status = 'rejected';
        claim.rejectedAt = new Date().toISOString();
        claim.rejectReason = reason || 'Documentation could not be verified.';
        await saveLocalDb(db);
        return sendJson(res, 200, { ok: true, claim });
      } catch (err) {
        return sendJson(res, 400, { error: 'Failed to reject claim.' });
      }
    });
    return;
  }

  if (path === '/api/local/posts') {
    if (!memoryPosts) memoryPosts = await loadData('posts.json');
    return sendJson(res, 200, memoryPosts || []);
  }

  // API: Top Employers actively hiring (20+ open jobs)
  if (path === '/api/wp/top-employers' || (path === '/api/wp/employer' && requestUrl.searchParams.get('top') === 'true')) {
    if (!memoryEmployers) memoryEmployers = await loadData('employers.json');
    const minJobs = Number(requestUrl.searchParams.get('min_jobs')) || 20;
    const limit = Number(requestUrl.searchParams.get('limit')) || 12;
    const list = Array.isArray(memoryEmployers) ? memoryEmployers : [];
    const sorted = [...list]
      .filter(e => (Number(e.metas?._employer_open_jobs) || 0) >= minJobs)
      .sort((a, b) => (Number(b.metas?._employer_open_jobs) || 0) - (Number(a.metas?._employer_open_jobs) || 0));
    return sendJson(res, 200, sorted.slice(0, limit));
  }

  // API: WordPress database jobs list (13,600+ records)
  if (path === '/api/wp/job_listing') {
    if (!memoryJobs) {
      memoryJobs = await loadData('jobs.json');
    }
    const perPage = Number(requestUrl.searchParams.get('per_page')) || 30;
    const page = Math.max(Number(requestUrl.searchParams.get('page')) || 1, 1);
    const filtered = filterJobs(memoryJobs || [], requestUrl.searchParams);
    const start = (page - 1) * perPage;
    return sendJson(res, 200, filtered.slice(start, start + perPage));
  }

  // API: Employers list (2,700+ records)
  if (path === '/api/wp/employer') {
    if (!memoryEmployers) {
      memoryEmployers = await loadData('employers.json');
    }
    const perPage = Number(requestUrl.searchParams.get('per_page')) || 30;
    const page = Math.max(Number(requestUrl.searchParams.get('page')) || 1, 1);
    const slug = requestUrl.searchParams.get('slug');
    const employersList = Array.isArray(memoryEmployers) ? memoryEmployers : [];
    if (slug) {
      const match = employersList.filter(e => e.slug === slug || e.id === Number(slug));
      return sendJson(res, 200, match);
    }
    const filtered = filterEmployers(employersList, requestUrl.searchParams);
    const start = (page - 1) * perPage;
    return sendJson(res, 200, filtered.slice(start, start + perPage));
  }

  // API: Auth - Register
  if (path === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const email = String(data.email || '').trim().toLowerCase();
        const name = String(data.name || '').trim();
        const password = String(data.password || '');
        if (!name || !email || password.length < 8) {
          return sendJson(res, 400, { error: 'Valid name, email, and password (at least 8 chars) required.' });
        }
        const db = await getLocalDb();
        if (db.users.some(u => u.email === email)) {
          return sendJson(res, 409, { error: 'An account with this email already exists.' });
        }
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        const user = { id: crypto.randomUUID(), name, email, salt, hash, createdAt: new Date().toISOString() };
        db.users.push(user);
        await saveLocalDb(db);
        const token = crypto.randomUUID();
        sessions.set(token, { userId: user.id, email: user.email, name: user.name });
        res.setHeader('Set-Cookie', `trikonet_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
        return sendJson(res, 201, { user: { id: user.id, name: user.name, email: user.email } });
      } catch (err) {
        return sendJson(res, 400, { error: 'Invalid request data.' });
      }
    });
    return;
  }

  // API: Auth - Login
  if (path === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const email = String(data.email || '').trim().toLowerCase();
        const password = String(data.password || '');
        const db = await getLocalDb();
        const user = db.users.find(u => u.email === email);
        if (!user) {
          return sendJson(res, 401, { error: 'Invalid email or password.' });
        }
        const testHash = crypto.pbkdf2Sync(password, user.salt || user.passwordSalt, 1000, 64, 'sha512').toString('hex');
        if (testHash !== (user.hash || user.passwordHash)) {
          return sendJson(res, 401, { error: 'Invalid email or password.' });
        }
        const token = crypto.randomUUID();
        sessions.set(token, { userId: user.id, email: user.email, name: user.name });
        res.setHeader('Set-Cookie', `trikonet_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
        return sendJson(res, 200, { user: { id: user.id, name: user.name, email: user.email } });
      } catch (err) {
        return sendJson(res, 400, { error: 'Invalid login data.' });
      }
    });
    return;
  }

  // API: Admin - Login
  if (path === '/api/admin/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const identity = String(data.identity || '').trim().toLowerCase();
        const password = String(data.password || '');
        const db = await getLocalDb();
        const user = (db.users || []).find(u => String(u.email || '').toLowerCase() === identity || String(u.username || '').toLowerCase() === identity);
        const role = String(user?.role || '').toLowerCase();
        if (!user || user.status === 'inactive' || !['administrator', 'editor', 'content editor'].includes(role) || !passwordMatches(password, user)) {
          return sendJson(res, 401, { error: 'Invalid administrator username or password.' });
        }
        const token = crypto.randomUUID();
        const roleLabel = role === 'administrator' ? 'Administrator' : role === 'content editor' ? 'Content Editor' : 'Editor';
        const admin = {
          userId: user.id,
          username: user.username || user.email,
          email: user.email,
          name: user.name || user.username || 'Administrator',
          role: roleLabel,
          expiresAt: Date.now() + (8 * 60 * 60 * 1000)
        };
        adminSessions.set(token, admin);
        res.setHeader('Set-Cookie', `trikonet_admin_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`);
        return sendJson(res, 200, { admin });
      } catch (err) {
        return sendJson(res, 400, { error: 'Unable to sign in. Please try again.' });
      }
    });
    return;
  }

  // API: Admin - Me
  if (path === '/api/admin/me' && req.method === 'GET') {
    const cookies = parseCookies(req);
    const admin = adminSessions.get(cookies.trikonet_admin_session);
    if (!admin || admin.expiresAt <= Date.now()) return sendJson(res, 401, { error: 'Administrator authentication required' });
    return sendJson(res, 200, { admin });
  }

  // API: Admin - Users
  if (path === '/api/admin/users' && req.method === 'GET') {
    const admin = adminSessions.get(parseCookies(req).trikonet_admin_session);
    if (!admin || admin.expiresAt <= Date.now() || admin.role !== 'Administrator') {
      return sendJson(res, 403, { error: 'Administrator access required' });
    }
    const db = await getLocalDb();
    const allowedRoles = new Set(['administrator', 'editor', 'content editor']);
    const users = (db.users || [])
      .filter(user => allowedRoles.has(String(user.role || '').toLowerCase()))
      .map(user => ({
        id: user.id,
        username: user.username || user.email,
        name: user.name || user.username || '',
        email: user.email || '',
        role: String(user.role || 'Editor').replace(/\b\w/g, char => char.toUpperCase()),
        status: user.status || 'active',
        website: user.website || '',
        bio: user.bio || '',
        posts: Number(user.posts) || 0,
        createdAt: user.createdAt || '',
        hasPassword: Boolean(user.passwordHash || user.hash)
      }));
    return sendJson(res, 200, users);
  }

  if ((path === '/api/admin/user-save' || path === '/api/admin/users') && req.method === 'POST') {
    const admin = adminSessions.get(parseCookies(req).trikonet_admin_session);
    if (!admin || admin.expiresAt <= Date.now() || admin.role !== 'Administrator') {
      return sendJson(res, 403, { error: 'Administrator access required' });
    }
    try {
      const body = await readJsonBody(req);
      const db = await getLocalDb();
      const username = String(body.username || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const name = String(body.name || username).trim();
      const roleInput = String(body.role || 'Editor').trim().toLowerCase();
      const role = roleInput === 'administrator' ? 'Administrator' : roleInput === 'content editor' ? 'Content Editor' : 'Editor';
      const password = String(body.password || '');
      if (!username || !/^\S+@\S+\.\S+$/.test(email)) {
        return sendJson(res, 400, { error: 'Username and a valid email are required.' });
      }
      db.users = db.users || [];
      let user = db.users.find(item =>
        String(item.id) === String(body.id || '') ||
        String(item.email || '').toLowerCase() === email ||
        String(item.username || '').toLowerCase() === username.toLowerCase()
      );
      if (!user && password.length < 8) {
        return sendJson(res, 400, { error: 'Set a password of at least 8 characters for this login.' });
      }
      if (db.users.some(item => item !== user && String(item.email || '').toLowerCase() === email)) {
        return sendJson(res, 409, { error: 'Email address is already assigned to another user.' });
      }
      if (db.users.some(item => item !== user && String(item.username || '').toLowerCase() === username.toLowerCase())) {
        return sendJson(res, 409, { error: 'Username is already taken.' });
      }
      if (!user) {
        user = { id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        db.users.push(user);
      }
      Object.assign(user, {
        username,
        email,
        name,
        role,
        status: body.status === 'inactive' ? 'inactive' : 'active',
        website: String(body.website || ''),
        bio: String(body.bio || ''),
        posts: Number(body.posts) || Number(user.posts) || 0,
        updatedAt: new Date().toISOString()
      });
      if (password) {
        const salt = crypto.randomBytes(16).toString('hex');
        user.passwordSalt = salt;
        user.passwordHash = crypto.scryptSync(password, salt, 64).toString('hex');
        delete user.salt;
        delete user.hash;
      }
      await saveLocalDb(db);
      return sendJson(res, 200, {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        website: user.website,
        bio: user.bio,
        posts: user.posts,
        createdAt: user.createdAt,
        hasPassword: Boolean(user.passwordHash)
      });
    } catch (error) {
      return sendJson(res, 400, { error: error.message || 'Unable to save user.' });
    }
  }

  if (path.startsWith('/api/admin/users/') && req.method === 'DELETE') {
    const admin = adminSessions.get(parseCookies(req).trikonet_admin_session);
    if (!admin || admin.expiresAt <= Date.now() || admin.role !== 'Administrator') {
      return sendJson(res, 403, { error: 'Administrator access required' });
    }
    const id = path.slice('/api/admin/users/'.length);
    const db = await getLocalDb();
    const target = (db.users || []).find(user => String(user.id) === id);
    if (!target) return sendJson(res, 404, { error: 'User not found' });
    if (String(target.id) === String(admin.userId)) {
      return sendJson(res, 400, { error: 'You cannot delete the account you are currently using.' });
    }
    const administrators = (db.users || []).filter(user => String(user.role || '').toLowerCase() === 'administrator');
    if (String(target.role || '').toLowerCase() === 'administrator' && administrators.length <= 1) {
      return sendJson(res, 400, { error: 'You cannot delete the last administrator account.' });
    }
    db.users = db.users.filter(user => String(user.id) !== id);
    await saveLocalDb(db);
    return sendJson(res, 200, { ok: true });
  }

  // API: Admin - Logout
  if (path === '/api/admin/logout' && req.method === 'POST') {
    const cookies = parseCookies(req);
    adminSessions.delete(cookies.trikonet_admin_session);
    res.setHeader('Set-Cookie', 'trikonet_admin_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
    return sendJson(res, 200, { ok: true });
  }

  function calculateProfileCompletion(profile) {
    if (!profile || typeof profile !== 'object') return 0;
    let score = 0;
    if (profile.name?.trim()) score += 5;
    if (profile.email?.trim()) score += 5;
    if (profile.phone?.trim()) score += 5;
    if (profile.nationality?.trim()) score += 5;
    if (profile.currentLocation?.trim()) score += 5;
    if (profile.industry?.trim()) score += 5;
    if (profile.category?.trim()) score += 5;
    if (profile.role?.trim()) score += 5;
    if (profile.currentDesignation?.trim()) score += 5;
    if (profile.experience?.trim()) score += 5;
    if (profile.qualification?.trim()) score += 5;
    if (profile.degree?.trim()) score += 5;
    if (profile.specialization?.trim()) score += 5;
    if ((Array.isArray(profile.licenses) && profile.licenses.length > 0) || profile.licenseStatus?.trim()) score += 5;
    if ((Array.isArray(profile.languages) && profile.languages.length > 0) || (typeof profile.languages === 'string' && profile.languages.trim())) score += 5;
    if (profile.salaryExpectation?.trim()) score += 5;
    if (profile.availability?.trim()) score += 5;
    if (profile.noticePeriod?.trim() || profile.hospitalType?.trim()) score += 5;
    if (Array.isArray(profile.locations) && profile.locations.length > 0) score += 5;
    if (profile.summary?.trim() || profile.photo) score += 5;
    return Math.min(100, Math.max(0, score));
  }

  // API: Auth - Me
  if (path === '/api/auth/me' && req.method === 'GET') {
    const cookies = parseCookies(req);
    const session = sessions.get(cookies.trikonet_session);
    if (!session) return sendJson(res, 401, { error: 'Not authenticated' });
    const db = await getLocalDb();
    const user = (db.users || []).find(u => u.id === session.userId || u.email === session.email);
    const profile = user?.profile || session.profile || null;
    const completionPercentage = profile ? calculateProfileCompletion(profile) : 0;
    return sendJson(res, 200, {
      user: {
        id: session.userId || user?.id,
        name: user?.name || session.name,
        email: user?.email || session.email,
        role: user?.role || session.role || 'candidate',
        avatar: user?.avatar || session.avatar || profile?.photo || '',
        profile,
        completionPercentage
      }
    });
  }

  // API: Candidate Profile
  if (path === '/api/candidate/profile' && req.method === 'GET') {
    const cookies = parseCookies(req);
    const session = sessions.get(cookies.trikonet_session);
    if (!session) return sendJson(res, 401, { error: 'Authentication required' });
    const db = await getLocalDb();
    const user = (db.users || []).find(u => u.id === session.userId || u.email === session.email);
    if (!user) return sendJson(res, 404, { error: 'User not found' });
    const profile = user.profile || {
      name: user.name || '',
      email: user.email || '',
      phone: '',
      photo: user.avatar || '',
      industry: 'Information Technology & Software',
      category: 'Software & IT',
      languages: ['English']
    };
    const completionPercentage = calculateProfileCompletion(profile);
    return sendJson(res, 200, { profile, completionPercentage });
  }

  if (path === '/api/candidate/profile' && (req.method === 'POST' || req.method === 'PUT')) {
    const cookies = parseCookies(req);
    const session = sessions.get(cookies.trikonet_session);
    if (!session) return sendJson(res, 401, { error: 'Authentication required' });
    try {
      const body = await readBody(req);
      const db = await getLocalDb();
      let user = (db.users || []).find(u => u.id === session.userId || u.email === session.email);
      if (!user) return sendJson(res, 404, { error: 'User not found' });
      const MAX_PHOTO_BYTES = 1000 * 1024;
      if (body.photo && dataUrlBytes(body.photo) > MAX_PHOTO_BYTES) {
        return sendJson(res, 413, { error: 'Profile photo must be smaller than 1 MB.' });
      }
      const existingProfile = user.profile || {};
      const updatedProfile = {
        ...existingProfile,
        name: String(body.name || user.name || '').trim(),
        email: String(body.email || user.email || '').trim().toLowerCase(),
        phone: String(body.phone ?? existingProfile.phone ?? '').trim(),
        nationality: String(body.nationality ?? existingProfile.nationality ?? '').trim(),
        currentLocation: String(body.currentLocation ?? existingProfile.currentLocation ?? '').trim(),
        photo: body.photo !== undefined ? String(body.photo) : (existingProfile.photo || user.avatar || ''),
        industry: String(body.industry ?? existingProfile.industry ?? 'Information Technology & Software').trim(),
        category: String(body.category ?? existingProfile.category ?? 'Software & IT').trim(),
        role: String(body.role ?? existingProfile.role ?? '').trim(),
        currentDesignation: String(body.currentDesignation ?? existingProfile.currentDesignation ?? '').trim(),
        experience: String(body.experience ?? existingProfile.experience ?? '').trim(),
        qualification: String(body.qualification ?? existingProfile.qualification ?? '').trim(),
        degree: String(body.degree ?? existingProfile.degree ?? '').trim(),
        specialization: String(body.specialization ?? existingProfile.specialization ?? '').trim(),
        university: String(body.university ?? existingProfile.university ?? '').trim(),
        licenses: Array.isArray(body.licenses) ? body.licenses : (existingProfile.licenses || []),
        licenseStatus: String(body.licenseStatus ?? existingProfile.licenseStatus ?? '').trim(),
        languages: Array.isArray(body.languages) ? body.languages : (typeof body.languages === 'string' ? body.languages.split(',').map(s=>s.trim()).filter(Boolean) : (existingProfile.languages || ['English'])),
        previousEmployers: String(body.previousEmployers ?? existingProfile.previousEmployers ?? '').trim(),
        salaryExpectation: String(body.salaryExpectation ?? existingProfile.salaryExpectation ?? '').trim(),
        availability: String(body.availability ?? existingProfile.availability ?? '').trim(),
        noticePeriod: String(body.noticePeriod ?? existingProfile.noticePeriod ?? '').trim(),
        hospitalType: String(body.hospitalType ?? existingProfile.hospitalType ?? '').trim(),
        visaStatus: String(body.visaStatus ?? existingProfile.visaStatus ?? '').trim(),
        locations: Array.isArray(body.locations) ? body.locations : (existingProfile.locations || []),
        summary: String(body.summary ?? existingProfile.summary ?? '').trim(),
        updatedAt: new Date().toISOString()
      };
      const completionPercentage = calculateProfileCompletion(updatedProfile);
      updatedProfile.completionPercentage = completionPercentage;
      user.profile = updatedProfile;
      if (updatedProfile.name) user.name = updatedProfile.name;
      if (updatedProfile.photo) user.avatar = updatedProfile.photo;
      await saveLocalDb(db);
      session.name = user.name;
      session.avatar = user.avatar;
      session.profile = user.profile;
      session.completionPercentage = completionPercentage;
      return sendJson(res, 200, { ok: true, profile: user.profile, completionPercentage });
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  if (path === '/api/candidate/photo' && req.method === 'POST') {
    const cookies = parseCookies(req);
    const session = sessions.get(cookies.trikonet_session);
    if (!session) return sendJson(res, 401, { error: 'Authentication required' });
    try {
      const body = await readBody(req);
      const photo = String(body.photo || '').trim();
      if (!photo) return sendJson(res, 400, { error: 'Photo data required' });
      const db = await getLocalDb();
      let user = (db.users || []).find(u => u.id === session.userId || u.email === session.email);
      if (!user) return sendJson(res, 404, { error: 'User not found' });
      user.avatar = photo;
      if (!user.profile) user.profile = {};
      user.profile.photo = photo;
      user.profile.completionPercentage = calculateProfileCompletion(user.profile);
      await saveLocalDb(db);
      session.avatar = photo;
      session.profile = user.profile;
      return sendJson(res, 200, { ok: true, photo });
    } catch (error) {
      return sendJson(res, 400, { error: error.message });
    }
  }

  // API: Auth - Logout
  if (path === '/api/auth/logout' && req.method === 'POST') {
    const cookies = parseCookies(req);
    sessions.delete(cookies.trikonet_session);
    res.setHeader('Set-Cookie', 'trikonet_session=; Path=/; HttpOnly; Max-Age=0');
    return sendJson(res, 200, { ok: true });
  }

  // API: User résumé cloud library
  if (path === '/api/resumes' && req.method === 'GET') {
    const session = sessions.get(parseCookies(req).trikonet_session);
    if (!session) return sendJson(res, 401, { error: 'Sign in to access your résumé library.' });
    const db = await getLocalDb();
    const resumes = db.resumes
      .filter(item => item.userId === session.userId)
      .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
    return sendJson(res, 200, { resumes, limit: MAX_RESUMES_PER_USER });
  }

  if (path === '/api/resumes' && (req.method === 'POST' || req.method === 'PUT')) {
    const session = sessions.get(parseCookies(req).trikonet_session);
    if (!session) return sendJson(res, 401, { error: 'Sign in to save a résumé.' });
    try {
      const body = await readJsonBody(req);
      const id = String(body.id || '').trim();
      const state = body.state && typeof body.state === 'object' ? body.state : null;
      if (!id || !state) return sendJson(res, 400, { error: 'A valid résumé is required.' });
      if (dataUrlBytes(state.photo) > MAX_PROFILE_PHOTO_BYTES) {
        return sendJson(res, 413, { error: 'Profile photo must be smaller than 100 KB.' });
      }
      const db = await getLocalDb();
      const existingIndex = db.resumes.findIndex(item => item.id === id && item.userId === session.userId);
      const userCount = db.resumes.filter(item => item.userId === session.userId).length;
      if (existingIndex < 0 && userCount >= MAX_RESUMES_PER_USER) {
        return sendJson(res, 409, { error: `You can save up to ${MAX_RESUMES_PER_USER} résumés. Delete one before creating another.` });
      }
      const now = Date.now();
      const existing = existingIndex >= 0 ? db.resumes[existingIndex] : null;
      const resume = {
        id,
        userId: session.userId,
        name: String(body.name || 'My professional résumé').slice(0, 120),
        template: String(body.template || 'classic').slice(0, 40),
        state,
        previewImage: dataUrlBytes(body.previewImage) <= MAX_PROFILE_PHOTO_BYTES ? String(body.previewImage || '') : '',
        createdAt: existing?.createdAt || now,
        updatedAt: now
      };
      if (existingIndex >= 0) db.resumes[existingIndex] = resume;
      else db.resumes.push(resume);
      await saveLocalDb(db);
      return sendJson(res, existingIndex >= 0 ? 200 : 201, { resume, limit: MAX_RESUMES_PER_USER });
    } catch (error) {
      return sendJson(res, error.message === 'Request too large' ? 413 : 400, { error: error.message || 'Unable to save résumé.' });
    }
  }

  if (path.startsWith('/api/resumes/') && req.method === 'DELETE') {
    const session = sessions.get(parseCookies(req).trikonet_session);
    if (!session) return sendJson(res, 401, { error: 'Sign in to delete a résumé.' });
    const id = path.slice('/api/resumes/'.length);
    const db = await getLocalDb();
    const before = db.resumes.length;
    db.resumes = db.resumes.filter(item => !(item.id === id && item.userId === session.userId));
    if (db.resumes.length === before) return sendJson(res, 404, { error: 'Résumé not found.' });
    await saveLocalDb(db);
    return sendJson(res, 200, { ok: true });
  }

  // Static File Serving & SPA Fallback
  if(/^\/uploads\/(employers|media)\/\d+\.[a-z]+$/i.test(path) && !existsSync(join(root,path.slice(1)))){
    res.writeHead(302,{Location:`https://api.trikonet.com${path}`});
    return res.end();
  }
  const seoApiBase = process.env.TRIKONET_API_BASE || 'https://api.trikonet.com';
  const privatePage = isPrivatePage(path, requestUrl.searchParams);
  if (privatePage || path.startsWith('/api/')) res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  const contentParts = path.split('/').filter(Boolean);
  const contentType = contentParts.length === 2 ? ({job:'job_listing',employer:'employer',blog:'posts',insurance:'posts','career-tips':'posts',health:'posts','part-time-job':'posts',visa:'posts',guides:'posts',interview:'posts','types-of-jobs':'posts',exam:'posts',general:'posts'}[contentParts[0]]) : null;
  let shareHead = '';
  if (contentType && !privatePage) {
    try {
      const slug = decodeURIComponent(contentParts[1]);
      let published = false;
      let contentRecord;
      let checkWordPress = true;
      if (contentType !== 'posts') {
        const collection = contentType === 'employer' ? 'employers' : 'jobs';
        const localResponse = await fetch(`${seoApiBase}/api/local/${collection}/${encodeURIComponent(slug)}`, {signal:AbortSignal.timeout(10000)});
        if (localResponse.ok) { contentRecord=await localResponse.json(); published = isPublishedRecord(contentRecord); checkWordPress = false; }
        else if (localResponse.status !== 404) throw new Error('Content unavailable');
      }
      if (checkWordPress) {
        const response = await fetch(`${seoApiBase}/api/wp/${contentType}?slug=${encodeURIComponent(slug)}`, {signal:AbortSignal.timeout(10000)});
        if (!response.ok) throw new Error('Content unavailable');
        contentRecord=(await response.json()).find(isPublishedRecord);
        published = Boolean(contentRecord);
      }
      if (!published) { res.writeHead(404, {'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex, nofollow','Cache-Control':'no-store'}); return res.end('<h1>Page Not Found</h1>'); }
      if (['job_listing','employer'].includes(contentType)) {
        let logo=logoFor(contentRecord,contentType);
        if(contentType==='job_listing' && !logo) {
          const m=contentRecord.metas || {};
          const employerSlug=contentRecord.employerSlug || String(contentRecord.employerUrl || m._job_employer_url || '').split('/').filter(Boolean).pop();
          const params=new URLSearchParams();
          if(employerSlug)params.set('slug',employerSlug);
          else if(m._job_employer_posted_by)params.set('id',m._job_employer_posted_by);
          if(params.size) {
            try {
              const r=await fetch(`${seoApiBase}/api/wp/employer?${params}`,{signal:AbortSignal.timeout(10000)});
              let employer=r.ok?(await r.json())[0]:null;
              if(!employer && employerSlug){const local=await fetch(`${seoApiBase}/api/local/employers/${encodeURIComponent(employerSlug)}`,{signal:AbortSignal.timeout(10000)});if(local.ok)employer=await local.json();}
              logo=logoFor(employer,'employer');
            }catch(error){console.warn('Share logo unavailable:',error.message);}
          }
        }
        shareHead=socialHead(contentRecord,contentType,resolvedJobUrl?.publicPath || path,logo);
      }

    } catch { res.writeHead(503, {'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex','Cache-Control':'no-store'}); return res.end('<h1>Page temporarily unavailable</h1>'); }
  }

  if (['/sitemap-jobs.xml','/job_listing-sitemap.xml'].includes(path)) {
    try {
      const response = await fetch(`${seoApiBase}/api/local/jobs`, {signal:AbortSignal.timeout(15000)});
      if (!response.ok) throw new Error('Jobs unavailable');
      const jobs = (await response.json()).filter(isPublishedRecord);
      let xml = await readFile(join(root,path.slice(1)),'utf8');
      const escapeXml = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      for (const job of jobs) {
        const canonical = `https://www.trikonet.com${job.publicPath || `/job/${job.slug}`}`;
        for (const alias of job.urlAliases || []) xml = xml.split(`https://www.trikonet.com${alias}`).join(escapeXml(canonical));
        if (!xml.includes(escapeXml(canonical))) xml = xml.replace('</urlset>', `<url><loc>${escapeXml(canonical)}</loc></url></urlset>`);
      }
      res.writeHead(200,{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'no-store'}); return res.end(xml);
    } catch { res.writeHead(503); return res.end('Sitemap temporarily unavailable'); }
  }
  if (path === '/sitemap-seo-job-pages.xml') {
    try {
      const response = await fetch(`${seoApiBase}/sitemap-seo-job-pages.xml`, {signal:AbortSignal.timeout(15000)});
      res.writeHead(response.status,{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'no-store'});
      return res.end(await response.text());
    } catch {res.writeHead(503);return res.end('Sitemap temporarily unavailable');}
  }
  const isResumeAppRoute = /^\/(resume-library|resume-maker|resume-builder|ats-resume-builder|cv-builder)\/?$/.test(path);
  if (!isResumeAppRoute && /^\/[^/.]+\/?$/.test(path) && !/^\/(admin|admin-login|login|signin|register|signup|logout|profile|jobs|job-categories|employers|blog|about|contact|faq|services|resume|cv|saved-jobs|applied-jobs|followed-companies|email-campaigns|submit-job|nurse-jobs-in-uae)\/?$/.test(path)) {
    try {
      const slug=path.replace(/^\/|\/$/g,'');
      const pageNumber=Math.max(1,Number(requestUrl.searchParams.get('page'))||1);
      const response=await fetch(`${seoApiBase}/api/seo-job-pages/${encodeURIComponent(slug)}?page=${pageNumber}`,{signal:AbortSignal.timeout(15000)});
      const payload=await response.json();
      if(response.ok){
        let html=await readFile(join(root,'index.html'),'utf8');
        html=html.replace(/<title>[\s\S]*?<\/title>/,'').replace(/<meta name="description"[^>]*>/,'').replace(/<link rel="canonical"[^>]*>/,'').replace('</head>',seoHead(payload.page)+'</head>');
        const content=renderSeoLanding(payload,pageNumber,payload.links || []);
        const start=html.indexOf('<div id="app">'),end=html.indexOf('<style>',start);
        if(start>=0&&end>start)html=html.slice(0,start)+`<style>#app[data-seo-pending]{visibility:hidden}#seo-loading{position:fixed;inset:0;display:grid;place-items:center;background:#fff;color:#64748b;font:14px system-ui;z-index:10}</style><noscript><style>#app[data-seo-pending]{visibility:visible}#seo-loading{display:none!important}</style></noscript><div id="seo-loading" role="status" aria-label="Loading"><video class="loading-scene-video" autoplay muted loop playsinline preload="auto" onplaying="this.style.opacity=1" aria-hidden="true"><source src="/assets/loading-scene-mobile.mp4" media="(max-width: 768px)" type="video/mp4"><source src="/assets/loading-scene-smooth.mp4" type="video/mp4"></video></div><div id="app" data-seo-pending>${content}</div>`+html.slice(end);
        res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':payload.page.indexingStatus==='Noindex'?'noindex,follow':'index,follow'});
        return res.end(html);
      }
      if(payload.seoPage){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex'});return res.end('<h1>Page Not Found</h1>');}
      if(response.status>=500){res.writeHead(503,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex','Cache-Control':'no-store'});return res.end('<h1>Page temporarily unavailable</h1>');}
    }catch{res.writeHead(503,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex','Cache-Control':'no-store'});return res.end('<h1>Page temporarily unavailable</h1>');}
  }
  if (path === '/sitmap.xml') {
    res.writeHead(301, { Location: '/sitemap.xml', 'Cache-Control': 'no-store' });
    return res.end();
  }
  let target = normalize(join(root, path === '/' ? 'index.html' : path.slice(1)));
  if (!target.startsWith(root)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  try {
    const s = await stat(target);
    if (s.isDirectory()) {
      target = join(target, 'index.html');
    }
  } catch {
    // SPA fallback: Route all paths without extensions to index.html
    if (!extname(path)) {
      target = join(root, 'index.html');
    }
  }

  try {
    let fileBody = await readFile(target);
    if(target===join(root,'index.html') && (path==='/jobs' || path==='/job-categories' || path.startsWith('/category/'))){
      try {
        const links=await getCategorySnapshot();
        const current=links.find(p=>p.href===path || (path.startsWith('/category/') && p.categorySlug===path.slice('/category/'.length)));
        const category=requestUrl.searchParams.get('category') || current?.category || '';
        const markup=path==='/job-categories'?renderAllCategories(links):`<main>${renderCategoryLinks(links,{category,slug:path.slice(1),categoriesOnly:path==='/jobs'&&!category,limit:path==='/jobs'&&!category?28:Infinity})}</main>`;
        let html=fileBody.toString();
        const start=html.indexOf('<div id="app">'),end=html.indexOf('<style>',start);
        if(start>=0 && end>start){
          // Preserve crawlable category links without flashing this partial
          // server-rendered page before the complete jobs UI is ready.
          const pending=path!=='/job-categories';
          const loading=pending?`<style>#app[data-seo-pending]{visibility:hidden}#seo-loading{position:fixed;inset:0;display:grid;place-items:center;background:#fff;z-index:10}</style><noscript><style>#app[data-seo-pending]{visibility:visible}#seo-loading{display:none!important}</style></noscript><div id="seo-loading" role="status" aria-label="Loading jobs"><video class="loading-scene-video" autoplay muted loop playsinline preload="auto" onplaying="this.style.opacity=1" aria-hidden="true"><source src="/assets/loading-scene-mobile.mp4" media="(max-width: 768px)" type="video/mp4"><source src="/assets/loading-scene-smooth.mp4" type="video/mp4"></video></div>`:'';
          html=html.slice(0,start)+`${loading}<div id="app"${pending?' data-seo-pending':''}>${markup}</div><script id="category-directory-data" type="application/json">${JSON.stringify(links).replace(/</g,'\\u003c')}</script>`+html.slice(end);
        }
        if(path==='/job-categories')html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>Job Categories in UAE | Trikonet</title>').replace(/<link rel="canonical"[^>]*>/,'<link rel="canonical" href="https://www.trikonet.com/job-categories">');
        fileBody=html;
      }catch(error){console.warn('Category SSR unavailable:',error.message);}
    }
    if(target===join(root,'index.html') && ['/jobs','/job-list','/job-openings'].includes(path)){
      fileBody=fileBody.toString()
        .replace(/<title>[\s\S]*?<\/title>/,`<title>${JOBS_SEO_TITLE}</title>`)
        .replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${JOBS_SEO_DESCRIPTION}">`)
        .replace(/<link rel="canonical"[^>]*>/,'<link rel="canonical" href="https://www.trikonet.com/jobs">');
    }
    if (shareHead && target === join(root,'index.html')) {
      fileBody=fileBody.toString().replace(/<title>[\s\S]*?<\/title>/gi,'').replace(/<meta[^>]+(?:name=["'](?:description|twitter:[^"']+)|property=["']og:[^"']+)["'][^>]*>/gi,'').replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi,'').replace('</head>',shareHead+'</head>');
    }
    if (resolvedJobUrl && target === join(root,'index.html')) fileBody = fileBody.toString().replace('</head>', `<script id="job-url-data" type="application/json">${JSON.stringify(resolvedJobUrl).replace(/</g,'\u003c')}</script></head>`);
    if (privatePage && target === join(root,'index.html')) {
      fileBody = fileBody.toString().replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, '').replace('</head>', '<meta name="robots" content="noindex,nofollow,noarchive"></head>');
    }
    await sendAsset(req, res, fileBody, types[extname(target)] || 'application/octet-stream', {
      html: target === join(root, 'index.html'),
      versioned: requestUrl.searchParams.has('v') || ['.png','.jpg','.jpeg','.webp','.gif','.avif','.svg','.mp4','.woff','.woff2'].includes(extname(target))
    });
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(port, host, () => {
  console.log(`Trikonet Server listening on http://${host}:${port}`);
});
