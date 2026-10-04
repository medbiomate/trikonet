// The async AdSense loader is already included once in index.html.
import { isPrivatePage } from './indexing-policy.js';

export function initDisplayAds() {
  initJobDetailAd();
  initAdditionalFeedAd();
  if (document.querySelector('[data-trikonet-display-ad]')) return;
  const article = document.querySelector('.post-article-content');
  const home = location.pathname === '/' && document.querySelector('.recent-section');
  const jobs = document.querySelector('.jobs-layout, .nurse-results-layout');
  const desktopJobs = jobs && window.matchMedia('(min-width: 1024px)').matches;
  if (!article && !home && !jobs) return;

  const placement = document.createElement('aside');
  placement.className = 'site-ad';
  placement.dataset.trikonetDisplayAd = '';
  placement.setAttribute('aria-label', 'Advertisement');
  placement.style.cssText = 'width:100%;max-width:1100px;min-width:0;clear:both;';
  placement.innerHTML = '<div style="text-align:center;font:11px/1.5 system-ui;color:#64748b;margin-bottom:8px">Advertisement</div><ins class="adsbygoogle" style="display:block;min-height:100px" data-ad-client="ca-pub-4310822705633659" data-ad-slot="9017818388" data-ad-format="auto" data-full-width-responsive="true"></ins>';
  if (jobs && !article && !home) {
    placement.style.gridColumn = '1 / -1';
    const slot = desktopJobs ? '1669636395' : '4340031766';
    const layout = desktopJobs ? '-fi-1w-35-hv+1jv' : '-gh-1r-14-7s+wc';
    placement.querySelector('ins').outerHTML = `<ins class="adsbygoogle" style="display:block" data-ad-format="fluid" data-ad-layout-key="${layout}" data-ad-client="ca-pub-4310822705633659" data-ad-slot="${slot}"></ins>`;
  }
  if (article) {
    placement.querySelector('ins').outerHTML = '<ins class="adsbygoogle" style="display:block;text-align:center" data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-4310822705633659" data-ad-slot="1198863108"></ins>';
    const paragraphs = Array.from(article.children).filter(el => el.tagName === 'P');
    if (paragraphs.length >= 3) paragraphs[2].after(placement);
    else {
      const feedback = article.querySelector('.content-feedback-section');
      if (feedback) feedback.before(placement);
      else article.append(placement);
    }
  } else if (home) home.before(placement);
  else if (jobs) {
    const feed = jobs.querySelector('.job-grid, .nurse-job-list');
    if (feed && feed.children.length >= 3) feed.children[2].after(placement);
    else (jobs.querySelector('.nurse-results-main, .jobs-main-content') || jobs).append(placement);
  }

  initializeAd(placement.querySelector('ins'));
  if (article) {
    const recommendations = document.createElement('aside');
    recommendations.className = 'site-ad';
    recommendations.dataset.trikonetMultiplexAd = '';
    recommendations.setAttribute('aria-label', 'Advertisement');
    recommendations.style.cssText = 'width:100%;min-width:0;clear:both;';
    recommendations.innerHTML = '<div style="text-align:center;font:11px/1.5 system-ui;color:#64748b;margin-bottom:8px">Advertisement</div><ins class="adsbygoogle" style="display:block" data-ad-format="autorelaxed" data-ad-client="ca-pub-4310822705633659" data-ad-slot="8043473058"></ins>';
    article.append(recommendations);
    initializeAd(recommendations.querySelector('ins'));
  }
}

function initJobDetailAd() {
  if (!window.matchMedia('(max-width: 850px)').matches) return;
  if (isPrivatePage(location.pathname, new URLSearchParams(location.search))) return;
  const main = document.querySelector('.detail-page.detail-exact:not(.employer-detail-page)');
  const grid = main?.querySelector('.detail-grid:not(.employer-detail-grid)');
  if (!grid || main.querySelector('[data-trikonet-job-detail-ad]')) return;
  const placement = document.createElement('aside');
  placement.className = 'site-ad';
  placement.dataset.trikonetJobDetailAd = '';
  placement.className = 'site-ad job-detail-ad';
  placement.setAttribute('aria-label', 'Advertisement');
  placement.innerHTML = '<div class="job-detail-ad-label">Advertisement</div><ins class="adsbygoogle" style="display:block;width:100%;height:100px" data-ad-client="ca-pub-4310822705633659" data-ad-slot="9017818388" data-ad-format="horizontal" data-full-width-responsive="false"></ins>';
  grid.before(placement);
  initializeAd(placement.querySelector('ins'));
}

function initAdditionalFeedAd() {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/' || isPrivatePage(path, new URLSearchParams(location.search))) return;
  if (document.querySelector('[data-trikonet-additional-feed-ad], #cv-builder-root, .not-found-page')) return;
  if (/^404\b|page not found/i.test(document.title)) return;
  const main = document.querySelector('#app main');
  if (!main) return;
  const placement = document.createElement('aside');
  placement.className = 'site-ad';
  placement.dataset.trikonetAdditionalFeedAd = '';
  placement.setAttribute('aria-label', 'Advertisement');
  placement.style.cssText = 'width:calc(100% - 32px);max-width:1100px;min-width:0;clear:both;';
  placement.innerHTML = '<div style="text-align:center;font:11px/1.5 system-ui;color:#64748b;margin-bottom:8px">Advertisement</div><ins class="adsbygoogle" style="display:block" data-ad-format="fluid" data-ad-layout-key="-6f+dq-1k-5h+pz" data-ad-client="ca-pub-4310822705633659" data-ad-slot="7101926479"></ins>';
  main.append(placement);
  initializeAd(placement.querySelector('ins'));
}

function initializeAd(ad) {
  // Request only once, once the responsive container has a measurable width.
  const resize = new ResizeObserver(() => {
    if (!ad.isConnected || ad.getBoundingClientRect().width <= 0) return;
    resize.disconnect();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn('Trikonet display ad could not initialize:', error);
    }
  });
  resize.observe(ad);
}
