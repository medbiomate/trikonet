import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('./app.js',import.meta.url),'utf8');
const code=source.slice(source.indexOf('function addStructuredData(){'),source.indexOf('\naddStructuredData();'))+'\naddStructuredData();';
for(const kind of ['employer','author'])test(`${kind} profile links its required named main entity`,()=>{
 let output;
 const path=`/${kind}/amina-healthcare`;
 const document={querySelector:()=>({textContent:'Amina Healthcare Group'}),querySelectorAll:()=>[],createElement:()=>({}),head:{append(script){output=JSON.parse(script.textContent);}}};
 vm.runInNewContext(code,{path,document,SITE_ORIGIN:'https://www.trikonet.com',resolvedJobUrl:null,location:{pathname:path},LOGO_VERSION:'1',queryParams:new URLSearchParams(),data:{posts:[],employers:[]},wpRecord:{title:'Amina Healthcare Group'},cleanSchemaText:value=>String(value||''),isoSchemaDate:()=>''});
 const profile=output['@graph'].find(item=>item['@type']==='ProfilePage');
 assert.ok(profile?.mainEntity?.['@id']);
 const entity=output['@graph'].find(item=>item['@id']===profile.mainEntity['@id']);
 assert.equal(entity['@type'],kind==='employer'?'Organization':'Person');assert.ok(entity.name);
});
