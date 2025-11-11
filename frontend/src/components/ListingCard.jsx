import React from 'react'

const apiBase = (import.meta.env.VITE_API_BASE || 'http://localhost:5000/api').replace(/\/api$/,'');

export default function ListingCard({listing, onSelect, selected}){
  let img = '/hero.jpg';
  if(listing.images && listing.images[0]){
    img = listing.images[0].url;
    if(img.startsWith('/')) img = `${apiBase}${img}`;
  }
  return (
    <div className="card">
      <div className="thumb">
        <img src={img} alt="thumb" style={{maxWidth:'100%', maxHeight:'100%', objectFit:'cover'}} />
      </div>
      <div className="card-body">
        <h4>{listing.make} {listing.model} ({listing.year})</h4>
        <p className="price">₹{listing.price?.toLocaleString()}</p>
        <p>{listing.mileage} km • {listing.fuelType} • {listing.location}</p>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <label style={{display:'flex', alignItems:'center', gap:6}}><input type="checkbox" checked={selected} onChange={()=>onSelect(listing._id)} /> Compare</label>
          <a className="btn btn-outline" href={`/buyer/listing/${listing._id}`} onClick={(e)=>{ e.preventDefault(); window.location.href=`/buyer/listing/${listing._id}` }}>View Details</a>
        </div>
      </div>
    </div>
  )
}
