// Keep startup changes behind one overlay. Offscreen lazy images never delay it.
export async function revealPage() {
  const app = document.getElementById('app');
  const images = Array.from(app?.querySelectorAll('img') || []).filter(image => {
    const box = image.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && box.top < innerHeight && box.bottom > 0;
  });
  const imageReady = image => image.complete ? Promise.resolve() : new Promise(resolve => {
    image.addEventListener('load', resolve, { once: true });
    image.addEventListener('error', resolve, { once: true });
  });
  let timer;
  await Promise.race([
    Promise.all([document.fonts?.ready, ...images.map(imageReady)]),
    new Promise(resolve => { timer = setTimeout(resolve, 2500); })
  ]);
  clearTimeout(timer);
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  app?.removeAttribute('inert');
  app?.removeAttribute('aria-busy');
  document.documentElement.classList.remove('page-loading');
  document.getElementById('page-preloader')?.remove();
  window.clearTimeout(window.trikonetLoadingTimer);
}
