import {renderJobDetail} from './detail-pages.js';
import {renderSiteHeader} from './site-header.js';
import {renderSiteFooter} from './site-footer.js';
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
// The initial HTML must never execute scripts stored in a job description.
// Show safe readable text; the browser renderer supplies the formatted content.
function readableDescription(value) {
  return escape(String(value || '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<\/(?:p|div|h[1-6]|li|ul|ol)>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim());
}
export function renderInitialJob(record, path) {
  const description = readableDescription(record.description || record.content?.rendered || '');
  const safeRecord = {...record, description, content:{rendered:description}};
  const html = renderSiteHeader({path}) + renderJobDetail(safeRecord, null, path) + renderSiteFooter();
  return html.replace(/<a\s/g, '<a data-google-vignette="false" ');
}
export function injectInitialJob(html, record, path) {
  return html.replace("document.documentElement.classList.add('page-loading');", '')
    .replace(/<div id="page-preloader"[\s\S]*?(?=<div id="app">)/, '')
    .replace(/<div id="app">[\s\S]*?<\/div>(?=<style>)/, `<div id="app" data-server-rendered="job">${renderInitialJob(record,path)}</div>`)
    .replace('</head>', '<style>#app[data-server-rendered="job"] #jobDescriptionCopy{white-space:pre-line}</style></head>');
}
