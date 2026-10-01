// Deliberate in-flow placements; never place ads in account or CV workflows.
export function mountContentAd() {
  const path = location.pathname;
  const allowed = path === '/' || path === '/jobs' || path.startsWith('/category/') ||
    path.startsWith('/job/') || path === '/blogs' || path.startsWith('/blog/') ||
    /-jobs(?:-in-[a-z-]+)?$/.test(path);
  if (!allowed || document.querySelector('.content-ad')) return;
  const main = document.querySelector('#app main');
  if (!main) return;
  const cards = main.querySelectorAll('.standard-job-card, .nurse-job-card');
  const isFeed = !path.startsWith('/job/') && cards.length >= 4;
  const ad = document.createElement('aside');
  ad.className = 'content-ad';
  ad.setAttribute('aria-label', 'Advertisement');
  ad.innerHTML = `<span class="content-ad-label">Advertisement</span>` + (isFeed
    ? `<ins class="adsbygoogle" style="display:block" data-ad-format="fluid"
        data-ad-layout-key="-g9-2j-3e-76+19w" data-ad-client="ca-pub-4310822705633659"
        data-ad-slot="6043393037"></ins>`
    : `
    <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-4310822705633659"
      data-ad-slot="7540393250" data-ad-format="auto" data-full-width-responsive="true"></ins>`);
  if (isFeed) cards[3].after(ad);
  else if (path === '/' && main.children.length > 2) main.children[1].after(ad);
  else main.append(ad);
  // Request only when the placement approaches the viewport, not on startup.
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting) || !ad.clientWidth) return;
    observer.disconnect();
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, { rootMargin: '200px' });
  observer.observe(ad);
}
