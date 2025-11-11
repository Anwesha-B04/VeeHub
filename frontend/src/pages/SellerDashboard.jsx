import React, {useEffect, useState} from 'react'
import QuickListingWizard from '../components/QuickListingWizard'
import ListingCard from '../components/ListingCard'
import { searchListings } from '../api'

export default function SellerDashboard({user}){
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  const load = async ()=>{
    setLoading(true);
    try{
      const sellerId = user?._id || user?.id;
      const res = await searchListings({seller: sellerId, limit: 100});
      setListings(res.items || []);
    }catch(e){
      setListings([]);
    }
    setLoading(false);
  }

  useEffect(()=>{ if(user && (user._id || user.id)) load(); },[user]);

  const onCreated = (newListing) => {
    // refresh
    load();
    setShowWizard(false);
  }

  const activeCount = listings.length;
  const totalViews = listings.reduce((s,l)=> s + (l.views || 0), 0);

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <div>
          <h1 style={{margin:0}}>Seller Dashboard</h1>
          <div className="muted">Manage your vehicle listings</div>
        </div>
        <div>
          <button className="btn btn-primary seller-add-btn" onClick={()=>setShowWizard(true)}>+ List New Vehicle</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18, marginBottom:20}}>
        <div className="feature-card">
          <div style={{fontSize:34, fontWeight:700}}>{activeCount}</div>
          <div className="muted">Active Listings</div>
        </div>
        <div className="feature-card" style={{background: 'linear-gradient(90deg,#ff8a00,#e85900)', color:'#fff'}}>
          <div style={{fontSize:34, fontWeight:700}}>{totalViews}</div>
          <div className="muted" style={{opacity:0.9, color:'rgba(255,255,255,0.9)'}}>Total Views</div>
        </div>
        <div className="feature-card">
          <div style={{fontSize:34, fontWeight:700}}>{listings.length}</div>
          <div className="muted">Total Listings</div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
        <div className="feature-card">
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <div className="feature-icon">📋</div>
            <div>
              <h3>Quick Listing Wizard</h3>
              <p className="muted">List your vehicle in minutes with our easy step-by-step wizard</p>
            </div>
          </div>
        </div>

        <div className="feature-card">
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <div className="feature-icon">📈</div>
            <div>
              <h3>Market Pricing</h3>
              <p className="muted">Get AI-driven pricing suggestions based on current market trends</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{marginTop:24}} className="feature-card">
        <h3>Your Listings</h3>
        {loading ? <p>Loading...</p> : (
          listings.length ? (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:12, marginTop:12}}>
              {listings.map(l=> <ListingCard key={l._id} listing={l} onSelect={()=>{}} />)}
            </div>
          ) : (
            <div style={{textAlign:'center', padding:40}}>
              <p className="muted">You haven't listed any vehicles yet</p>
              <button className="btn btn-primary" onClick={()=>setShowWizard(true)}>+ Create Your First Listing</button>
            </div>
          )
        )}
      </div>

      {showWizard && (
        <div className="modal-overlay">
          <div className="modal-card" role="dialog" aria-modal="true" aria-label="List a vehicle">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{margin:0}}>List a Vehicle</h3>
              <button className="btn btn-outline" onClick={()=>setShowWizard(false)}>Close</button>
            </div>
            <div style={{marginTop:12}}>
              <QuickListingWizard onCreated={onCreated} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
