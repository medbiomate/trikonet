// Browser request-identity fixture, not a full-page Web Vitals benchmark.
import http from 'node:http';import {createRequire} from 'node:module';import {writeFile} from 'node:fs/promises';import {gzipSync} from 'node:zlib';import assert from 'node:assert/strict';
const require=createRequire('/Users/saneen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');const {chromium}=require('playwright');
const results=[];let aligned=false,requests=[];
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://fixture.invalid');
 if(url.pathname==='/app.js'){requests.push(req.url);const body=gzipSync('window.moduleExecuted=(window.moduleExecuted||0)+1;');res.writeHead(200,{'Content-Type':'text/javascript','Content-Encoding':'gzip','Cache-Control':'no-store'});return res.end(body);}
 if(url.pathname==='/bootstrap.js'){res.writeHead(200,{'Content-Type':'text/javascript'});return res.end("import('/app.js?v=current')");}
 res.writeHead(200,{'Content-Type':'text/html'});res.end(`<link rel="modulepreload" href="/app.js?v=${aligned?'current':'old'}"><script type="module" src="/bootstrap.js"></script><h1>Request identity fixture</h1>`);
});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{for(const match of [false,true]){aligned=match;requests=[];const context=await browser.newContext();const page=await context.newPage();await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.moduleExecuted===1);await page.waitForTimeout(200);results.push({aligned:match,appRequests:requests.length,urls:[...requests],executions:await page.evaluate(()=>window.moduleExecuted)});await context.close();}assert.equal(results[0].appRequests,2);assert.equal(results[1].appRequests,1);}
finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
await writeFile(new URL('./module-network-benchmark.json',import.meta.url),JSON.stringify({note:'Controlled browser request-count fixture. Timing and payload are not representative website load metrics.',results},null,2));console.log(JSON.stringify(results));
