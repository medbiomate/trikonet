import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const require=createRequire('/Users/saneen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const results=[];
for(const mobile of [false,true])for(const path of ['/','/jobs','/employers']){
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,deviceScaleFactor:1});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
   window.audit={lcp:0,cls:0,longTasks:0,blockingMs:0};
   for(const type of ['largest-contentful-paint','layout-shift','longtask'])try{new PerformanceObserver(list=>{for(const e of list.getEntries()){if(type==='largest-contentful-paint')window.audit.lcp=e.startTime;if(type==='layout-shift'&&!e.hadRecentInput)window.audit.cls+=e.value;if(type==='longtask'){window.audit.longTasks++;window.audit.blockingMs+=Math.max(0,e.duration-50);}}}).observe({type,buffered:true});}catch{}
 });
 try{
  const response=await page.goto('https://trikonet.com'+path,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(8000);
  const metrics=await page.evaluate(()=>{const nav=performance.getEntriesByType('navigation')[0],resources=performance.getEntriesByType('resource');return {...window.audit,ttfbMs:nav.responseStart-nav.requestStart,domContentLoadedMs:nav.domContentLoadedEventEnd,fcpMs:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,resources:resources.length,reportedTransferBytes:resources.reduce((sum,r)=>sum+r.transferSize,nav.transferSize),appModules:resources.filter(r=>new URL(r.name).pathname.endsWith('/app.js')).map(r=>({url:r.name,transfer:r.transferSize})),canonical:document.querySelector('link[rel=canonical]')?.href,title:document.title,bodyChars:document.body.innerText.length};});
  results.push({mobile,path,status:response.status(),...metrics,errors});
 }catch(e){results.push({mobile,path,error:e.message});}
 console.log(JSON.stringify(results.at(-1)));await context.close();
}
await browser.close();await writeFile(new URL('./live-baseline.json',import.meta.url),JSON.stringify({note:'One cold-cache run per page/device. No throttling. Lab observations; not field p75. Cross-origin transfer sizes may be unavailable.',results},null,2));
