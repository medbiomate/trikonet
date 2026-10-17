import test from 'node:test';
import assert from 'node:assert/strict';
import {initJobNavigation} from './job-navigation.js';
function fixture({href='/jobs/sample',target='',interactive=false,card=false}={}) {
 const calls=[],attributes={},classes=new Set();
 const link={target,getAttribute:()=>href,hasAttribute:()=>false,setAttribute:(key,value)=>attributes[key]=value,removeAttribute:key=>delete attributes[key],classList:{add:name=>classes.add(name),remove:name=>classes.delete(name)}};
 const root={addEventListener:(name,callback,capture)=>{assert.equal(capture,true);root.click=callback;},removeEventListener(){},querySelectorAll:()=>[link]};
 const old=globalThis.location;globalThis.location={origin:'https://trikonet.com'};
 initJobNavigation(root,href=>calls.push(href));
 const event={button:0,target:{closest:selector=>selector==='a[href]'?(card?null:link):selector==='.nurse-job-card'?(card?{querySelector:()=>link}:null):interactive?{}:null},preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}};
 return {root,event,calls,attributes,restore:()=>globalThis.location=old};
}
test('a plain first click navigates once before a downstream click interceptor',()=>{
 const f=fixture();try{f.root.click(f.event);assert.deepEqual(f.calls,['https://trikonet.com/jobs/sample']);assert.ok(f.event.prevented&&f.event.stopped);assert.equal(f.attributes['aria-busy'],'true');}finally{f.restore();}
});
test('clicking the job card background opens the job on the first click',()=>{
 const f=fixture({card:true});try{f.root.click(f.event);assert.equal(f.calls.length,1);}finally{f.restore();}
});
for(const options of [{href:'https://other.com/jobs/sample'},{href:'/employer/company'},{target:'_blank'},{card:true,interactive:true}])test(`preserves unrelated controls ${JSON.stringify(options)}`,()=>{
 const f=fixture(options);try{f.root.click(f.event);assert.equal(f.calls.length,0);assert.ok(!f.event.prevented);}finally{f.restore();}
});
for(const override of [{ctrlKey:true},{metaKey:true},{shiftKey:true},{altKey:true},{button:1},{defaultPrevented:true}])test(`browser controls modified clicks ${JSON.stringify(override)}`,()=>{
 const f=fixture();try{f.root.click({...f.event,...override});assert.equal(f.calls.length,0);}finally{f.restore();}
});
