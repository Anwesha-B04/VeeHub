import React, {useRef, useState} from 'react'

// Simple gallery with main image + thumbnails
export default function Gallery360({images=[]}){
  const [idx, setIdx] = useState(0);
  const apiBase = (import.meta.env.VITE_API_BASE || 'http://localhost:5000/api').replace(/\/api$/,'');
  const normImages = (images||[]).map(im=> ({...im, url: im.url && im.url.startsWith('/') ? `${apiBase}${im.url}` : im.url}));
  const next = ()=> setIdx(i => (i+1)%normImages.length);
  const prev = ()=> setIdx(i => (i-1+normImages.length)%normImages.length);
  if(!normImages.length) return <div className="gallery-360">No images</div>
  return (
    <div className="gallery-360">
      <div className="thumb-main">
        <button className="gallery-arrow" onClick={prev} aria-label="Previous image">‹</button>
        <img src={normImages[idx].url} alt={normImages[idx].alt} className="main-image" />
        <button className="gallery-arrow" onClick={next} aria-label="Next image">›</button>
      </div>
      <div className="thumbs-row">
        {normImages.map((im,i)=> (
          <button key={i} className={`thumb-btn ${i===idx? 'active':''}`} onClick={()=>setIdx(i)}>
            <img src={im.url} alt={im.alt} />
          </button>
        ))}
      </div>
    </div>
  )
}
