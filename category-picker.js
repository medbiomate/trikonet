export function categorySuggestions(options, query) {
  const q = query.trim().toLowerCase();
  const matches = options.filter(option => !q || option.label.toLowerCase().includes(q));
  if (q) matches.sort((a,b) => Number(b.label.toLowerCase().startsWith(q))-Number(a.label.toLowerCase().startsWith(q)));
  return matches.slice(0,5);
}
export function initSearchCategoryPickers(root = document) {
  for (const select of root.querySelectorAll('.searchbar select[name="category"]')) {
    if (select.dataset.searchable) continue;
    select.dataset.searchable = 'true';
    const options = [...select.options].map(option => ({value:option.value,label:option.textContent}));
    const wrap = document.createElement('div');
    wrap.className = 'search-category-picker';
    const button = document.createElement('button');
    button.type = 'button';button.className = 'search-category-trigger';
    button.setAttribute('aria-label','Category');button.setAttribute('aria-expanded','false');button.setAttribute('aria-haspopup','listbox');
    const panel = document.createElement('div');panel.className = 'search-category-panel';panel.hidden = true;
    const search = document.createElement('input');search.type = 'search';search.placeholder = 'Search categories…';search.setAttribute('aria-label','Search categories');search.autocomplete = 'off';
    const list = document.createElement('div');list.setAttribute('role','listbox');list.setAttribute('aria-label','Categories');
    panel.append(search,list);wrap.append(button,panel);
    // Replace the wrapping label: interactive search controls need their own labels.
    const field = select.parentElement;const container = document.createElement('div');container.className = field.className;
    field.replaceWith(container);container.append(select,wrap);select.hidden = true;
    const close = () => {panel.hidden = true;button.setAttribute('aria-expanded','false');};
    const update = () => {button.textContent = (select.selectedOptions[0]?.textContent || 'All Categories') + ' ▾';};
    const render = () => {
      list.replaceChildren();
      for (const option of categorySuggestions(options,search.value)) {
        const item = document.createElement('button');item.type = 'button';item.setAttribute('role','option');item.setAttribute('aria-selected',String(select.value===option.value));item.textContent = option.label;
        item.addEventListener('click',()=>{select.value = option.value;select.dispatchEvent(new Event('change',{bubbles:true}));update();close();button.focus();});list.append(item);
      }
      if (!list.children.length) {const empty=document.createElement('p');empty.textContent='No matching categories';empty.setAttribute('role','status');list.append(empty);}
    };
    button.addEventListener('click',()=>{if(!panel.hidden){close();return;}search.value='';render();panel.hidden=false;button.setAttribute('aria-expanded','true');search.focus();});
    search.addEventListener('input',render);
    wrap.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();close();button.focus();}
      if(event.key==='Enter' && event.target===search){event.preventDefault();list.querySelector('button')?.click();}
      if(event.key==='ArrowDown'||event.key==='ArrowUp'){
        event.preventDefault();const items=[...list.querySelectorAll('button')];const index=items.indexOf(document.activeElement);items[(index+(event.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus();
      }
    });
    document.addEventListener('click',event=>{if(!wrap.contains(event.target))close();});
    wrap.addEventListener('focusout',event=>{if(!wrap.contains(event.relatedTarget))close();});
    select.addEventListener('change',update);update();
  }
}
