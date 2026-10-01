import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./admin-session.js', import.meta.url), 'utf8').replaceAll('export ', '');
function harness(response) {
  const local = new Map(), session = new Map(), calls = [];
  const storage = values => ({ getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) });
  const context = vm.createContext({ Date, Math, localStorage: storage(local), sessionStorage: storage(session), fetch: async (url, options) => { calls.push({ url, options }); return response; } });
  vm.runInContext(source, context);
  return { context, local, session, calls, refresh: () => vm.runInContext('refreshAdminSession()', context), current: () => vm.runInContext('getVerifiedAdmin()', context) };
}
const admin = { role: 'Administrator', name: 'Admin', expiresAt: Date.now() + 60000 };

test('a fresh tab restores its admin session using the server cookie', async () => {
  const h = harness({ ok: true, json: async () => ({ admin }) });
  assert.equal(h.current(), null);
  assert.equal((await h.refresh()).name, 'Admin');
  assert.equal(JSON.parse(h.session.get('trikonet_admin_session')).role, 'Administrator');
  assert.equal(h.calls[0].url, '/api/admin/me');
  assert.equal(h.calls[0].options.credentials, 'include');
  assert.equal(h.calls[0].options.cache, 'no-store');
});

test('cached admin data cannot enable the bar after logout', async () => {
  const h = harness({ ok: false });
  h.local.set('trikonet_admin_session', JSON.stringify(admin));
  h.session.set('trikonet_admin_session', JSON.stringify(admin));
  assert.equal(await h.refresh(), null);
  assert.equal(h.current(), null);
  assert.equal(h.local.size, 0);
  assert.equal(h.session.size, 0);
});

for (const invalid of [{ role: 'Candidate', expiresAt: admin.expiresAt }, { ...admin, expiresAt: Date.now() - 1 }]) {
  test(`rejects ${invalid.role} session with expiry ${invalid.expiresAt}`, async () => {
    const h = harness({ ok: true, json: async () => ({ admin: invalid }) });
    assert.equal(await h.refresh(), null);
    assert.equal(h.current(), null);
  });
}

test('overlapping checks reuse one request', async () => {
  const h = harness({ ok: true, json: async () => ({ admin }) });
  await Promise.all([h.refresh(), h.refresh()]);
  assert.equal(h.calls.length, 1);
});

test('session change signals other tabs without storing credentials', () => {
  const h = harness({ ok: false });
  vm.runInContext('signalAdminSessionChange()', h.context);
  assert.equal(h.local.has('trikonet_admin_session_changed'), true);
  assert.equal(h.local.has('trikonet_admin_session'), false);
});

function barDom(h) {
  let mounted = null;
  const classes = new Set(), listeners = new Map();
  const document = {
    hidden: false,
    head: { append() {} },
    body: { classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } }, prepend(element) { mounted = element; } },
    getElementById() { return mounted; },
    addEventListener(name, callback) { listeners.set(name, callback); },
    createElement() {
      const children = new Map();
      return { setAttribute() {}, remove() { mounted = null; }, querySelector(selector) {
        if (!children.has(selector)) children.set(selector, { textContent: '', addEventListener(name, callback) { this[name] = callback; } });
        return children.get(selector);
      } };
    }
  };
  Object.assign(h.context, { document, location: { pathname: '/jobs' }, window: { addEventListener(name, callback) { listeners.set(name, callback); } }, setTimeout() { return 1; }, clearTimeout() {}, setInterval() {} });
  return { classes, listeners, mounted: () => mounted };
}

test('verified admins get shortcuts and safely rendered account names', async () => {
  const h = harness({ ok: true, json: async () => ({ admin: { ...admin, name: '<script>bad</script>' } }) });
  await h.refresh();
  const ui = barDom(h);
  vm.runInContext('initPublicAdminBar()', h.context);
  assert.equal(ui.classes.has('has-public-admin-bar'), true);
  assert.match(ui.mounted().innerHTML, /href="\/admin#jobs"/);
  assert.match(ui.mounted().innerHTML, /href="\/admin#job-new"/);
  assert.doesNotMatch(ui.mounted().innerHTML, /<script>/);
  assert.equal(ui.mounted().querySelector('.public-admin-account').textContent, 'Hello, <script>bad</script>');
  assert.equal(ui.listeners.has('storage'), true);
  assert.equal(ui.listeners.has('focus'), true);
});

test('normal visitors have no bar or header offset', async () => {
  const h = harness({ ok: false });
  await h.refresh();
  const ui = barDom(h);
  vm.runInContext('initPublicAdminBar()', h.context);
  assert.equal(ui.mounted(), null);
  assert.equal(ui.classes.has('has-public-admin-bar'), false);
});

test('admin logout removes the bar and preserves normal member storage', async () => {
  const h = harness({ ok: true, json: async () => ({ admin }) });
  await h.refresh();
  h.local.set('trikonet_member_session', 'member');
  const ui = barDom(h);
  vm.runInContext('initPublicAdminBar()', h.context);
  const button = ui.mounted().querySelector('button');
  await button.click({ currentTarget: button });
  assert.equal(h.calls.at(-1).url, '/api/admin/logout');
  assert.equal(h.calls.at(-1).options.method, 'POST');
  assert.equal(ui.mounted(), null);
  assert.equal(ui.classes.has('has-public-admin-bar'), false);
  assert.equal(h.local.get('trikonet_member_session'), 'member');
  assert.equal(h.session.has('trikonet_admin_session'), false);
});
