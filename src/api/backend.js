const BASE = import.meta.env.VITE_API_URL || '';
export async function api(path,{method='GET',body,token}={}){const res=await fetch(BASE+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});if(res.status===204)return null;const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.error||`HTTP ${res.status}`);return data}
export const getManga=(q='')=>api('/api/manga?q='+encodeURIComponent(q));
export const getDetail=id=>api('/api/manga/'+id);
export const getChapters=id=>api('/api/manga/'+id+'/chapters?lang=th,en');
export const getPages=id=>api('/api/chapters/'+id+'/pages');
