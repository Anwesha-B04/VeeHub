import React from 'react'
import { Link } from 'react-router-dom'

const apiBase = (import.meta.env.VITE_API_BASE || 'http://localhost:5000/api').replace(/\/api$/,'');

export default function ListingCard({listing, onSelect, selected}){
  let img = '/hero.jpg';
  if(listing.images && listing.images[0]){
    img = listing.images[0].url;
    if(img.startsWith('/')) img = `${apiBase}${img}`;
  }
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="thumb h-44 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        <img src={img} alt="thumb" className="w-full h-full object-cover" />
      </div>
      <div className="card-body p-4">
        <h4 className="text-lg font-semibold">{listing.make} {listing.model} ({listing.year})</h4>
        <p className="price text-brand font-bold mt-2">₹{listing.price?.toLocaleString()}</p>
        <p className="text-sm text-slate-600 mt-1">{listing.mileage} km • {listing.fuelType} • {listing.location}</p>
        <div className="flex items-center gap-3 mt-3">
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" className="form-checkbox" checked={selected} onChange={()=>onSelect(listing._id)} /> Compare</label>
          <Link className="btn btn-outline inline-flex items-center px-3 py-2 rounded-md" to={`/buyer/listing/${listing._id}`}>View Details</Link>
        </div>
      </div>
    </div>
  )
}
