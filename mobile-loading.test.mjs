import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

for (const file of ['./app.js', '../public/app.js']) {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8');
  const start = source.indexOf("if (path.startsWith('/job/') || path.startsWith('/employer/')) {");
  const end = source.indexOf('\n}', start) + 2;
  const loader = source.slice(start, end).replace("import('./detail-pages.js?v=20261009-info-first')", 'loadDetailModule()');
  test(`${file}: ordinary routes skip detail downloads; detail routes wait for their renderer`, async () => {
    for (const path of ['/', '/jobs', '/blog', '/profile', '/job/sample', '/employer/sample']) {
      let release, requests = 0;
      const renderJobDetail = () => 'job', renderEmployerDetail = () => 'employer';
      const context = vm.createContext({ path, initialLoads: [], loadDetailModule() {
        requests++;
        return new Promise(resolve => { release = () => resolve({ renderJobDetail, renderEmployerDetail }); });
      } });
      vm.runInContext(loader, context);
      const detail = path.startsWith('/job/') || path.startsWith('/employer/');
      assert.equal(requests, detail ? 1 : 0);
      if (detail) {
        assert.equal(context.renderJobDetail, undefined);
        assert.equal(context.initialLoads.length, 1);
        release();
        await Promise.all(context.initialLoads);
        assert.equal(context.renderJobDetail(), 'job');
        assert.equal(context.renderEmployerDetail(), 'employer');
      }
    }
  });
}
