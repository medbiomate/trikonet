// Keep successful pages visible even if a later request fails.
export async function loadAdminJobs({ fetchPage, fetchCount, onProgress = () => {}, onError = () => {}, batchSize = 1000, concurrency = 3 }) {
  const pages = new Map();
  const combined = () => [...pages.entries()].sort((a, b) => a[0] - b[0]).flatMap(([, rows]) => rows);
  async function loadPage(page) {
    let error;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const rows = await fetchPage(page);
        if (!Array.isArray(rows)) throw new Error('Invalid jobs response');
        pages.set(page, rows);
        onProgress(combined());
        return rows;
      } catch (failure) { error = failure; }
    }
    throw error;
  }
  try {
    const first = await loadPage(1);
    if (first.length < batchSize) return combined();
    let count;
    try { count = await fetchCount(); } catch {}
    if (Number.isInteger(count) && count >= first.length) {
      let nextPage = 2;
      const lastPage = Math.ceil(count / batchSize);
      const failures = [];
      await Promise.all(Array.from({ length: concurrency }, async () => {
        while (nextPage <= lastPage) {
          const page = nextPage++;
          try { await loadPage(page); } catch (error) { failures.push(error); }
        }
      }));
      if (failures.length) throw failures[0];
    } else {
      // Hosts without a count endpoint still support complete pagination.
      for (let page = 2; ; page++) {
        if ((await loadPage(page)).length < batchSize) break;
      }
    }
  } catch (error) { onError(error); }
  return combined();
}
