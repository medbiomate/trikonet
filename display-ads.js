// The async AdSense loader is already included once in index.html.
export function initDisplayAds() {
  if (document.querySelector('[data-trikonet-display-ad]')) return;
  const article = document.querySelector('.post-article-content');
  const home = location.pathname === '/' && document.querySelector('.recent-section');
  const jobs = document.querySelector('.jobs-layout, .nurse-results-layout');
  const desktopJobs = jobs && window.matchMedia('(min-width: 1024px)').matches;
  if (!article && !home && !jobs) return;

  const placement = document.createElement('aside');
  placement.dataset.trikonetDisplayAd = '';
  placement.setAttribute('aria-label', 'Advertisement');
  placement.style.cssText = 'width:100%;max-width:1100px;min-width:0;margin:32px auto;clear:both;';
  placement.innerHTML = '<div style="text-align:center;font:11px/1.5 system-ui;color:#64748b;margin-bottom:8px">Advertisement</div><ins class="adsbygoogle" style="display:block;min-height:100px" data-ad-client="ca-pub-4310822705633659" data-ad-slot="9017818388" data-ad-format="auto" data-full-width-responsive="true"></ins>';
  if (desktopJobs && !article && !home) {
    placement.style.gridColumn = '1 / -1';
    placement.querySelector('ins').outerHTML = '<ins class="adsbygoogle" style="display:block" data-ad-format="fluid" data-ad-layout-key="-fi-1w-35-hv+1jv" data-ad-client="ca-pub-4310822705633659" data-ad-slot="1669636395"></ins>';
  }
  if (article) {
    const paragraphs = Array.from(article.children).filter(el => el.tagName === 'P');
    if (paragraphs.length >= 3) paragraphs[2].after(placement);
    else {
      const feedback = article.querySelector('.content-feedback-section');
      if (feedback) feedback.before(placement);
      else article.append(placement);
    }
  } else if (home) home.before(placement);
  else if (desktopJobs) {
    const feed = jobs.querySelector('.job-grid, .nurse-job-list');
    if (feed && feed.children.length >= 3) feed.children[2].after(placement);
    else (jobs.querySelector('.nurse-results-main, .jobs-main-content') || jobs).append(placement);
  } else jobs.after(placement);

  const ad = placement.querySelector('ins');
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
