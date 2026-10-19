const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const columns = ['jobsAdded','jobsEdited','employersAdded','employersEdited','total'];
export const teamActivityView = () => `<div class="admin-view" id="view-team-activity">
  <div class="modern-page-header"><div><h1 class="modern-page-title">Team Activity</h1><p class="modern-page-subtitle">Daily job and employer counts in Trikonet · India time (IST)</p></div></div>
  <div class="modern-card" style="padding:24px"><form id="team-activity-filter" style="display:flex;gap:16px;align-items:end;flex-wrap:wrap"><label class="admin-field"><span>Date (IST)</span><input type="date" name="date" required></label><button class="admin-btn" type="submit">Refresh counts</button></form>
  <p id="team-activity-status" role="status" aria-live="polite"></p>
  <div style="overflow-x:auto"><table class="admin-table" style="width:100%;text-align:left"><caption style="text-align:left;padding:16px 0;font-weight:700">Operator performance</caption><thead><tr><th>Team member</th><th>Jobs added</th><th>Jobs edited</th><th>Employers added</th><th>Employers edited</th><th>Total</th></tr></thead><tbody id="team-activity-rows"></tbody><tfoot id="team-activity-totals"></tfoot></table></div>
  <p style="color:#64748b;margin-top:20px">Counts cover published records with saved team attribution. Drafts and autosaves are excluded. Repeated edits count once per record; a creator’s same-day edits remain a new record. Historical edits reflect the latest saved editor only, so these counts may differ from a complete activity log.</p></div></div>`;
export function initTeamActivity() {
  const form = document.getElementById('team-activity-filter');
  form.elements.date.value = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  let request = 0;
  async function load() {
    const current = ++request;
    const status = document.getElementById('team-activity-status');
    const rows = document.getElementById('team-activity-rows');
    const totals = document.getElementById('team-activity-totals');
    rows.replaceChildren(); totals.replaceChildren(); status.textContent = 'Loading activity…';
    try {
      const response = await fetch(`/api/admin/team-activity?date=${encodeURIComponent(form.elements.date.value)}`,{cache:'no-store'});
      if (!response.ok) throw new Error('Unable to load activity. Refresh and try again.');
      const data = await response.json();
      if (current !== request) return;
      rows.innerHTML = data.rows.map(row=>`<tr><th scope="row">${escape(row.name)}</th>${columns.map(key=>`<td>${Number(row[key]) || 0}</td>`).join('')}</tr>`).join('');
      totals.innerHTML = `<tr><th scope="row">Total</th>${columns.map(key=>`<td><strong>${Number(data.totals[key]) || 0}</strong></td>`).join('')}</tr>`;
      status.textContent = data.rows.length ? `Activity for ${data.date} (IST)` : 'No attributed published activity for this date.';
    } catch(error) { if (current === request) status.textContent = error.message; }
  }
  form.addEventListener('submit',event=>{event.preventDefault();if(form.reportValidity())void load();});
  return load;
}
