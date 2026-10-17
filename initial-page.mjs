import {renderSiteHeader} from './site-header.js';
import {renderHomeHero} from './home-hero.js';
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function initialPage(path='/') {
 if(path!=='/') return '';
 const customSelect=(name,items,label)=>`<select class="hero-minimal-input" name="${escape(name)}" aria-label="${escape(label)}"><option value="">${escape(label)}</option>${items.map(item=>`<option>${escape(item.name||item)}</option>`).join('')}</select>`;
 const hero=renderHomeHero({}, {data:{taxonomies:{locations:['Dubai','Abu Dhabi','Sharjah','Ajman','UAE']}},queryParams:new URLSearchParams(),customSelect});
 return renderSiteHeader({path})+'<main>'+hero+'</main>';
}
