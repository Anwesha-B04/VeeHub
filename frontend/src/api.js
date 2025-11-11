const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const API_ORIGIN = API_BASE.replace(/\/api$/,'');

async function parseResponse(res){
  const txt = await res.text();
  try { return txt ? JSON.parse(txt) : null; } catch(e){ return txt; }
}

export async function postJSON(path, body, token){
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {})
    },
    body: JSON.stringify(body)
  });
  const data = await parseResponse(res);
  if(!res.ok){
    const msg = data && (data.msg || data.message) ? (data.msg || data.message) : `API error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function getJSON(path, token){
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {...(token?{Authorization:`Bearer ${token}`}:{})}
  });
  const data = await parseResponse(res);
  if(!res.ok){
    const msg = data && (data.msg || data.message) ? (data.msg || data.message) : `API error ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function register(data){ return postJSON('/auth/register', data); }
export async function login(data){ return postJSON('/auth/login', data); }
export async function getMe(token){ try{ return await getJSON('/auth/me', token); }catch(e){return null} }
export async function searchListings(q){
  const params = new URLSearchParams(q).toString();
  const res = await fetch(`${API_BASE}/listings/search?${params}`);
  const data = await res.json();
  // normalize relative image urls to absolute backend origin
  if(data && data.items){
    data.items = data.items.map(item => ({
      ...item,
      images: (item.images||[]).map(im => ({...im, url: im.url && im.url.startsWith('/') ? `${API_ORIGIN}${im.url}` : im.url}))
    }));
  }
  return data;
}
export async function getListing(id){ 
  const res = await fetch(`${API_BASE}/listings/${id}`);
  const data = await res.json();
  if(data && data.images){
    data.images = data.images.map(im => ({...im, url: im.url && im.url.startsWith('/') ? `${API_ORIGIN}${im.url}` : im.url}));
  }
  return data;
}
export async function compareListings(ids){ return postJSON('/listings/compare', {ids}); }
export async function tradeInEstimate(data){ return postJSON('/listings/tradein', data); }
export async function priceSuggestion(data){ return postJSON('/listings/price-suggestion', data); }
export async function createListing(formData, token){
  const res = await fetch(`${API_BASE}/listings`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
  return res.json();
}
