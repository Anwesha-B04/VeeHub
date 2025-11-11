import React, {useEffect, useState} from 'react'
import { getListing } from '../api'
import Gallery360 from '../components/Gallery360'
import { useParams, Link } from 'react-router-dom'

export default function ListingDetail(){
  const {id} = useParams();
  const [listing, setListing] = useState(null);

  useEffect(()=>{
    if(!id) return;
    getListing(id).then(l=>setListing(l)).catch(()=>{});
  },[id]);

  return (
    <div className="container listing-detail">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <h2 style={{margin:0}}>Listing</h2>
        <Link className="btn btn-outline" to="/buyer">← Back</Link>
      </div>
      {listing ? (
        <div>
          <h3 style={{marginTop:6, marginBottom:12}}>{listing.make} {listing.model} <span style={{color:'#6b7c93', fontWeight:600}}>({listing.year})</span></h3>
          <div className="listing-grid-detail">
            <div className="listing-left">
              <Gallery360 images={listing.images} />
            </div>
            <aside className="listing-right info-card">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12}}>
                <div>
                  <div style={{fontSize:22, fontWeight:800, color:'#0b2545'}}>₹{listing.price?.toLocaleString()}</div>
                  <div className="muted" style={{marginTop:6}}>{listing.mileage} km • {listing.fuelType}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="muted">Location</div>
                  <div style={{fontWeight:700}}>{listing.location}</div>
                </div>
              </div>

              <div style={{marginTop:16}}>
                <p style={{margin:0, color:'#33475b', fontWeight:600}}>Condition</p>
                <p className="muted" style={{marginTop:6}}>{listing.condition || 'Used'}</p>
              </div>

              <div style={{marginTop:14}}>
                <p style={{margin:0, color:'#33475b', fontWeight:600}}>Description</p>
                <p className="muted" style={{marginTop:6}}>{listing.description || 'No description provided.'}</p>
              </div>

              <div style={{display:'flex', gap:10, marginTop:18}}>
                <button className="btn btn-gradient">Contact Seller</button>
                <button className="btn btn-outline">Save</button>
              </div>

              <div style={{marginTop:18, borderTop:'1px solid #eef4fb', paddingTop:12}}>
                <p style={{margin:0, fontSize:13, color:'#6b7c93'}}>Seller</p>
                <p style={{margin:'6px 0 0', fontWeight:700}}>Demo Seller</p>
                <small className="muted">seller@veehub.test</small>
              </div>
            </aside>
          </div>
        </div>
      ) : <p>Loading...</p>}
    </div>
  )
}
