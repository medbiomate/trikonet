export function createFormRecovery(form, type, account) {
  const view = form.closest('.admin-view');
  let key, dirty = false, restoring = false;
  const fields = () => [...view.querySelectorAll('input,textarea,select,[contenteditable="true"]')].filter(el => !['password','file'].includes(el.type));
  const id = (el, i) => el.id || `${el.name || 'field'}:${i}`;
  const notice = document.createElement('div');
  notice.style.cssText = 'padding:10px 16px;background:#eff6ff;color:#334155;font-size:13px;display:none';
  view.prepend(notice);
  function save() {
    if (!key || !dirty || restoring) return;
    try {
      const values = fields().map((el, i) => ({ key: id(el, i), value: el.isContentEditable ? el.innerHTML : el.value, checked: el.checked, rich: el.isContentEditable }));
      localStorage.setItem(key, JSON.stringify({ values, date: Date.now(), status: 'draft' }));
      notice.style.display = 'block';
      notice.textContent = 'Recovery draft saved on this device. Not published.';
    } catch {
      notice.style.display = 'block';
      notice.textContent = 'Draft could not be saved on this device. Keep this tab open and save manually.';
    }
  }
  view.addEventListener('input', () => { dirty = true; save(); });
  view.addEventListener('change', () => { dirty = true; save(); });
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  return {
    open(slug = '') {
      dirty = false;
      key = `trikonet-recovery:${encodeURIComponent(account)}:${type}:${encodeURIComponent(slug || 'new')}`;
      notice.style.display = 'none';
      let draft;
      try { draft = JSON.parse(localStorage.getItem(key) || 'null'); } catch {}
      if (!draft?.values) return;
      notice.style.display = 'block';
      notice.textContent = 'An unfinished draft is available on this device. ';
      const restore = document.createElement('button');
      restore.type = 'button'; restore.textContent = 'Restore Draft';
      restore.addEventListener('click', () => {
        restoring = true;
        try {
          const map = new Map(draft.values.map(value => [value.key, value]));
          for (const [i, el] of fields().entries()) {
            const value = map.get(id(el, i));
            if (!value) continue;
            if (value.rich) el.innerHTML = value.value; else el.value = value.value;
            if (typeof value.checked === 'boolean') el.checked = value.checked;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } finally { restoring = false; }
        dirty = true; save();
      });
      notice.append(restore);
    },
    clear() { if (key) localStorage.removeItem(key); dirty = false; notice.style.display = 'none'; }
  };
}
