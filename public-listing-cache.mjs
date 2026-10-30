/** Share bounded public listing reads; never cache private/account responses. */
export function createPublicListingCache(fetcher,{now=Date.now,ttl=30000,stale=300000,max=40}={}){
 const entries=new Map();
 return async function read(url){
  const existing=entries.get(url),time=now();
  if(existing?.value&&time-existing.at<ttl)return structuredClone(existing.value);
  if(existing?.pending){if(existing.value&&time-existing.at<stale)return structuredClone(existing.value);return structuredClone(await existing.pending)}
  const entry=existing||{at:0};
  const pending=(async()=>{const response=await fetcher(url,{signal:AbortSignal.timeout(8000)});if(!response.ok)throw Error('Public listing unavailable');const value=await response.json();entry.value=value;entry.at=now();return value})().finally(()=>{entry.pending=undefined;if(!entry.value)entries.delete(url)});
  entry.pending=pending;if(entries.size>=max&&!entries.has(url))entries.delete(entries.keys().next().value);entries.set(url,entry);
  if(existing?.value&&time-existing.at<stale){void pending.catch(()=>{});return structuredClone(existing.value)}
  return structuredClone(await pending);
 }
}
