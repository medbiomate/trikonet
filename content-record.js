// Check both sources concurrently; a transient local failure must not hide an imported record.
export async function loadContentRecord(fetcher, base, type, slug) {
  const encoded = encodeURIComponent(slug);
  const options = () => ({signal:AbortSignal.timeout(20000)});
  const remote = () => fetcher(`${base}/api/wp/${type}?slug=${encoded}`, options()).then(async r => {
    if (!r.ok) throw new Error('Imported content unavailable');
    return (await r.json())[0] || null;
  });
  if (type === 'posts') return remote();
  const local = fetcher(`${base}/api/local/${type === 'employer' ? 'employers' : 'jobs'}/${encoded}`, options()).then(async r => {
    if (r.ok) return r.json();
    if (r.status === 404) return null;
    throw new Error('Saved content unavailable');
  });
  const [saved, imported] = await Promise.allSettled([local, remote()]);
  if (saved.status === 'fulfilled' && saved.value) return saved.value;
  if (imported.status === 'fulfilled' && imported.value) return imported.value;
  if (saved.status === 'fulfilled' && imported.status === 'fulfilled') return null;
  throw new Error('Content temporarily unavailable');
}
