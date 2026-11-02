import {writeFile} from 'node:fs/promises';
const paths=['/','/jobs','/employers','/job-categories','/blog','/privacy-policy'];const results=[];
for(const path of paths)for(let run=0;run<3;run++){
 const start=performance.now();try{const response=await fetch('https://trikonet.com'+path,{signal:AbortSignal.timeout(15000)});const ttfb=performance.now()-start;const body=await response.arrayBuffer();results.push({path,run,status:response.status,ttfbMs:Math.round(ttfb),totalMs:Math.round(performance.now()-start),decodedBytes:body.byteLength,cache:response.headers.get('cache-control'),encoding:response.headers.get('content-encoding')});}catch(e){results.push({path,run,error:e.message});}
}
await writeFile(new URL('./http-baseline.json',import.meta.url),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
