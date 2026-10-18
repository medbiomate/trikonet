import { mkdir, writeFile } from 'node:fs/promises';
import { legalPageForPath, renderLegalDocument } from '../legal-pages.js';

for (const path of ['/employer-terms', '/privacy-policy', '/privacy', '/terms', '/terms-and-conditions']) {
  const folder = new URL(`..${path}/`, import.meta.url);
  await mkdir(folder, { recursive: true });
  await writeFile(new URL('index.html', folder), renderLegalDocument(legalPageForPath(path)).replace(/[ \t]+$/gm, ''));
}
console.log('Built public Terms and Privacy Policy pages, including legacy aliases.');
