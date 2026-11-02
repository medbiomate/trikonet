# Trikonet website performance audit

> Historical initial audit. The later approved deployment and fully passing regression results are recorded in [RELEASE-FOLLOWUP.md](RELEASE-FOLLOWUP.md).

2 November 2026 — **Local review release; not deployed.**

## Outcome and scope

Implemented six targeted optimizations with regression coverage. They address duplicate runtime downloads, repeated logo DOM scans, repeated search normalization/ranking, expired session retention, pre-authentication catalogue reads, and repeated JSON extraction in admin login. No production records, schemas, advertising services, consent rules, URLs, metadata or visible layouts were changed.

This is a codebase audit pass with measured local improvements, **not certification that every feature works or that production restarts are resolved**. Existing full suites are not green, and production hosting/runtime access is unavailable. Do not deploy until the remaining regression and production checks are reviewed.

## A. Architecture and inventory

- Website repository: vanilla ES modules/CSS, Node HTTP server, server-rendered listings/detail/SEO pages, client enhancement, API fetch wrapper. Admin code is dynamically loaded.
- API repository: Node HTTP server, MySQL pool, JSON application state, indexed admin job/employer tables, imported WordPress records, persistent sessions, media normalization, SEO registry and outbound workers.
- Production API admin UI is a browser-asset copy under `backend/public/admin-web`; applicable fixes were mirrored there. Legacy `backend/public/admin.js` has pre-existing uncommitted edits, preserved and excluded.
- Inventoried **162 website** and **155 API/legacy-admin JS/CSS/test modules**, excluding node_modules, data, uploads and the copied admin-web tree. These counts describe inventory, not line-by-line semantic review of every module.
- Extracted **49 website** and **91 API route literals**. Dynamic routes are not distinct URLs in these counts. Details and base commits are in `inventory.json`.
- Syntax-checked **156 non-test JavaScript modules**; all passed. Both npm check scripts also passed.
- Reviewed startup imports, compression/cache behavior, logo processing, listing/search/pagination, account/session/login stores, catalogue projections, pool setup, indexed admin reads, worker scheduling, SEO response paths, ads bootstrap, image/font discovery and domain routing.
- Native mobile app, Flutter migration, root legacy server and Medbimate are separate applications and were not changed or asserted fully audited here.

## B. Fixes implemented

| Files | Confirmed cause | Fix and validation |
|---|---|---|
| `frontend/index.html`, `frontend/app.js`; matching API admin copies | Preload and execution used different app query versions; navigation imports also used two URLs | Match module URLs. Chrome fixture proves app requests fall from two to one with one execution. Tests check both runtime copies. |
| `frontend/app.js`, API admin copy | Every loaded logo reran the global image selector | One pending callback per image processes only that image. Lazy source, crop math and original URL tests pass. Forty sequential logos: 41 scans/1,640 visits become one scan/40 visits. Browser event deduplication already prevented exponential identical listeners; the proven cost was repeated global scanning. |
| `backend/public-directory.mjs` | Description/metadata normalization repeated for each search word and sort comparison | Normalize once per examined job, retain only numeric scores and times. No cross-request cache of descriptions. Preserve rank tiers, empty-title behavior, ties, filters, duplicate preference, pagination and remote exclusions. Compare page output against base implementation in benchmark. |
| `backend/persistent-sessions.mjs` | Expired entries were rejected but remained in process memory | Remove expired entries on access and periodically during writes; exclude expired entries from iteration/size. Preserve active identities, hashed-key logout, persistence and restart semantics. No production session rows are deleted. |
| `backend/server.mjs` | Two admin job GET paths read catalogue before checking session | Reject signed-out admin requests before catalogue SQL. Behavioral tests assert 401 and zero catalogue reads. Public job access unchanged. |
| `backend/admin-login-account.mjs` | Separate field extractions repeatedly traversed large JSON payload | Read credential strings through JSON_TABLE columns in one pass; preserve ID JSON type. Isolated MariaDB fixture verifies identity, credentials, case matching, inactive status and missing users. Target production engine still requires review. |

Added focused tests for module URL matching, per-image processing, private read ordering and real login SQL. Expanded directory ranking/pagination and session tests. Benchmarks are in `backend/scripts/audit-*.mjs`.

## C. Cleanup, dependencies and assets

- Consolidated redundant module requests/evaluation; no features or dependencies removed.
- App source is about 296 KB. Live browser baseline recorded two app transfers of **71,728 bytes each**. Matching URLs removes the redundant request; post-deployment transfer still needs confirmation.
- Source code size did not decrease; small safeguards were added. This is a network/CPU reduction, not a source bundle reduction. No new minifier/bundler was introduced without production-equivalent build validation.
- Admin source remains about 819 KB raw but loads on admin paths. Legal content contributes roughly 42 KB through a static import; splitting requires preserving synchronous route detection and SEO behavior.
- Five Google font weights are discovered via CSS import. Moving discovery earlier is a future controlled test; fonts/design were not changed speculatively.
- WebP hero variants already exist. Older PNG/JPEG/GIF files were not deleted or recompressed merely because of size; active artwork and dynamic references require verification.
- Ads wait for the app ready event; feed placements already use lazy observation and reserved space. Ads, analytics, consent, tracking IDs and integrations were preserved.
- Backend `npm audit --omit=dev` reported zero vulnerabilities at audit time; exact metadata is in `dependency-summary.json`. This does not establish complete application security.
- No CSS selectors, media, packages or runtime code were removed based solely on apparent static non-use.

## D. Before/after measurements

These are **local fixtures, not production or field p75**. Search benchmark uses 10,000 synthetic jobs, 4,050-byte descriptions, five paired runs with alternating order. Page JSON is asserted equivalent. Raw runs include JIT/GC/hardware variability.

| Metric | Before | After | Improvement |
|---|---:|---:|---|
| Unfiltered synthetic directory processing, median | 198.2 ms | 47.0 ms | 76.3% less |
| Four-word synthetic search processing, median | 6,384.2 ms | 322.4 ms | 94.9% less |
| Search + location + category processing, median | 3,618.7 ms | 207.6 ms | 94.3% less |
| Credential-only SQL projection, 9.7 MB state, five paired medians | 88.0 ms | 21.9 ms | 75.1% less local query time |
| Credential response size | 204 bytes | 204 bytes | unchanged |
| App requests in Chrome request-identity fixture | 2 | 1 | duplicate removed |
| Logo DOM scans for 40 sequential loads | 41 | 1 | 40 scans removed |
| Image visits in same fixture | 1,640 | 40 | 1,600 visits removed |
| Expired session entries after cleanup access | 1,000 | 0 | active session preserved |
| Catalogue reads on signed-out admin job request | 1 | 0 | auth checked first |
| Production homepage load after change | unavailable | unavailable | audit not deployed |
| Mobile Lighthouse performance | unavailable | unavailable | no valid comparable run |
| Field LCP/INP/CLS at p75 | unavailable | unavailable | real-user monitoring needed |
| Production SQL plans/locks/latency | unavailable | unavailable | no production DB access |
| Production CPU/RSS/restarts | unavailable | unavailable | hosting connection unavailable |

SQL fixture is local MariaDB 13, not production MySQL. Baseline is the existing credential-only query, not the older full-state query. Full state in this fixture transfers 9,703,371 bytes versus 204 credential bytes; full-state reads can be faster on local MariaDB but consume much more application memory. This tradeoff is explicitly retained in the raw results rather than claiming every JSON projection beats a full-state query.

### Live HTTP baseline, no after-deployment comparison

Three sequential samples per route from the same machine. Median TTFB: homepage 230 ms, jobs 206 ms, employers 339 ms, job categories 257 ms, blog 163 ms, privacy 180 ms. First jobs response took 2,851 ms, showing cold/warm variability. Raw status, compression and decoded lengths are in `http-baseline.json`.

Desktop/mobile Chrome homepage and employer visits received HTTP 403 despite rendered content. Jobs visits lost their navigation context. Their paint values in `live-baseline.json` are **not valid normal-page Core Web Vitals**. Browser/network/hosting response behavior must be investigated. Separate ordinary HTTP requests returned 200. The report does not substitute successful HTTP fetches for browser success.

## E. Verification and existing failures

- **28 focused tests passed** covering cache, assets, logos, search, sessions, authentication ordering and preload consistency.
- Isolated MariaDB login identity/credential integration: **1 passed**.
- Worker projection and cross-instance scheduling integration: **1 passed**.
- Indexed job/employer database suites: **6 passed**, including two 15,000-record transactional fixtures. Five indexed reads took about 2 ms in each local fixture. No production index created or altered.
- Chrome request-count fixture passed: two requests before, one after, one module execution in both.
- All 156 source syntax checks and both npm checks passed.
- Frontend full suite before: **208 pass, 34 fail / 242**. After: **213 pass, same 34 fail / 247**. No added failure names.
- Backend full suite before: **278 pass, 2 fail, 3 skip / 283**. After: **286 pass, same 2 fail, 4 skip / 292**. New optional SQL test skips by default and passed when explicitly run on the isolated socket.

Existing failures are not hidden, marked passed or fixed by weakening assertions. Many frontend tests extract source fragments into VM contexts with outdated function boundaries or missing URL/window/formatters/legal helpers/dynamic import callbacks. The frontend SEO server integration also fails. Backend failures are an integration test requiring the default MySQL socket and a repository test expecting different automatic SEO main-page registration behavior. These need separate harness repair and functional diagnosis; SEO business rules were not changed to force green assertions.

Not verified end-to-end with real accounts: all cross-device sign-in/out flows, registration/deletion, dashboard mutations, job publish/update, file uploads, EMS, Google indexing, actual ad impressions or analytics receipt. No real credentials or production records were used for testing.

## F. Remaining issues and release gates

1. Restore hosting account access. Website lists are empty and deployment lookups cannot find either domain. Need real worker counts, OOM/restart logs, per-process RSS/heap, slow requests and deployment settings. The resource graph alone cannot distinguish leaks from worker recycling or aggregate hosting usage. This audit does **not** claim the recurring incident resolved.
2. Investigate Chrome HTTP 403/navigation behavior before trusting mobile/Lighthouse comparisons. No security rules were disabled.
3. Repair/diagnose baseline regression failures and exercise signed-in workflows on staging. Preserve intended SEO thresholds, aliases and metadata while resolving test mismatch.
4. Verify production DB engine/version and query plans. MariaDB fixture validates behavior, not production MySQL capacity, indexes, lock contention or latency. The credential SQL change remains staged for review.
5. Remaining heavy paths: generic full-JSON-state account reads/writes, candidate password login reading all users, per-request presence table initialization, imported fallback catalogue residency per worker, and some broad response contracts. Replacing storage or adding request rejection requires production measurement and staging tests; no schema rewrite or speculative concurrency shedding added.
6. Cache limits alone cannot cap total process memory: active requests, worker count, catalogue size and external buffers also contribute. No arbitrary heap cap or scheduled process killing installed.
7. Duplicated admin UI sources can drift. Applicable runtime changes were mirrored, but an explicit build/sync process needs a separate reviewed change. Blind copying server/data files is unsafe.

## Rollback and deployment

Website base: `788df86` (full hash in inventory). API base: `c49024a`. Both repositories use local `audit/performance-20261102` branches. Audit commits are local only; **nothing in this audit was pushed or deployed**. Roll back any approved future release by redeploying the recorded base commit. No data rollback is required; no data migration occurred.

Pre-existing backend legacy admin edits are excluded and preserved. Database fixtures use dedicated temporary local sockets, disable network listeners, create/drop only fixture databases, and must be stopped after testing. Do not point fixture scripts at production.

Approval for production deployment is a later step, after the release gates are addressed. This report demonstrates specific improvements and explicit limits; it is not an assertion that all requested audit phases or every workflow have been fully validated.
