import {initJobNavigation} from './job-navigation.js?v=20261102-early-1';
initJobNavigation();
globalThis.window?.dispatchEvent?.(new Event('trikonet:navigation-ready'));
// A failed module or stalled request must never leave the full-page loader open.
export function showLoadingRecovery(error) {
  console.warn('Trikonet page initialization interrupted:', error);
  const app = document.getElementById('app');
  const skeleton = app?.querySelector('.jobs-loading-shell');
  globalThis.window?.dispatchEvent?.(new Event('trikonet:failed'));
  const hasServerContent = app?.hasAttribute('data-server-rendered') ||
    app?.hasAttribute('data-seo-pending') ||
    (app?.querySelector('main') && !skeleton);
  const hasSkeleton = skeleton && app.contains(skeleton);
  if (app && (hasSkeleton || !hasServerContent)) {
    const jobLookup = app.hasAttribute('data-recover-job-url');
    const missingJob = jobLookup && error?.code === 'JOB_NOT_FOUND';
    const main = document.createElement('main');
    main.style.cssText = 'max-width:720px;margin:48px auto;padding:24px;font-family:system-ui,sans-serif';
    const title = document.createElement('h1');
    title.textContent = missingJob ? 'This job is no longer available' :
      jobLookup ? 'Could not load this job' : 'Could not load this page';
    const mainLink = document.createElement('a');
    mainLink.href = '/jobs';
    mainLink.textContent = 'Browse jobs';
    mainLink.setAttribute('data-google-vignette','false');
    main.append(title);
    if (!missingJob) {
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = 'Retry';
      retry.style.marginRight = '20px';
      retry.addEventListener('click', () => location.reload());
      main.append(retry);
    }
    main.append(mainLink);
    if (hasSkeleton) skeleton.replaceWith(main);
    else app.replaceChildren(main);
  }
  app?.removeAttribute('inert');app?.removeAttribute('aria-busy');app?.removeAttribute('data-seo-pending');
  document.documentElement.classList.remove('page-loading');
  document.getElementById('page-preloader')?.remove();document.getElementById('seo-loading')?.remove();
}
// A slow transfer is not a failed module. Keep the useful page and let loading continue.
const timeout = setTimeout(() => {
  const status = document.getElementById('initial-loading-status');
  if (status) status.textContent = 'Your connection is taking a little longer. You can still use search and navigation.';
  // Keep initialization alive; only a rejected module should replace the page.
  // Slow authentication or a busy server is not a failed editor.
}, 12000);
import('./app.js?v=20261117-recovery-state').catch(showLoadingRecovery).finally(() => clearTimeout(timeout));
