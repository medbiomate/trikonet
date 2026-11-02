# Approved release and follow-up fixes

2 November 2026. This supersedes the initial report's test-failure and local-only status.

## Release scope

The user approved deployment. Initial audit commits were pushed to both production deployment branches. Website bootstrap and API admin runtime were verified live by their new module version and per-image callback code.

Follow-up backend changes:

- Password sign-in selects only the matching account and its ordinal index, rather than transferring every user. Bound email parameters, trimmed/case-normalized matching, byte comparison and original ordinal preference are retained. Existing password lockout, profile response and ID-guarded write behavior remain tested.
- Candidate profile reads and writes select only the requested account. Writes retain the transaction and row lock, then update that account's JSON path. Isolated SQL tests verify numeric/string IDs, missing users, successful edits, unchanged unrelated account and unchanged resume state.
- Job-editing presence table setup is shared per process, with retry after initialization failure. The schema and actual presence API behavior are unchanged.
- Health response carries a non-sensitive release header for verifying the backend build without hosting control-panel access.

## Regression repair

The 36 baseline failures were investigated. Source-extraction test fixtures were missing browser globals/helpers or used outdated function signatures/import versions. Other expectations described older count refresh intervals, older ad positions, company names inferred from unsaved jobs, or old empty-state wording. They now test the current approved behavior. No production ad placement, company-selection logic or SEO generation policy was changed to satisfy these assertions.

Important assertions remain: saved data wins over concurrently started imported reads; session verification is mandatory; superseded job responses cannot overwrite newer results; failed deletion preserves records; pagination retains server totals; profile-load errors block empty editable views; ad placements are not duplicated; metadata, aliases, indexing, drafts and persistent SEO settings remain checked.

The database SEO integration test no longer silently depends on an arbitrary default development database. It is opt-in, restricted to the isolated audit socket, creates/drops its own fixture database and refreshes the repository when simulating changed catalogue data. It passed explicitly; it was not merely skipped to claim success.

## Final checks

- Frontend: **247 passed, 0 failed, 0 skipped**.
- Backend with isolated database variables enabled: **295 passed, 0 failed, 0 skipped**.
- Combined: **542 passed**, including real local SQL integration checks.
- Both application syntax/check commands passed.
- SQL fixture is local MariaDB 13, with no production records used or changed.

## Still not established

The underlying generic shared JSON storage is unchanged; some lower-traffic paths still read/write full state. A wholesale schema migration is a separate high-risk change requiring production plans, backup and staging verification. Targeted high-traffic account/login/profile paths now avoid transferring all users.

Hostinger's connected account still reports no matching websites, so production runtime logs, worker counts, memory per process and restart causes cannot be inspected. Browser integration also reports that local browser use is disabled, so no signed-in hosting-session fallback is available. Initial live browser 403 observations and the recurring hosting memory spikes are **not proven resolved** by passing unit/integration tests or successful public HTTP responses.

Release rollback bases: website 788df86, API c49024a. Pre-existing legacy admin edits remain excluded. No schema or production data migration is required for these releases.
