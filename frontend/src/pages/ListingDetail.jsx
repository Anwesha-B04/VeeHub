import React, {useEffect, useState} from 'react'
import { getListing } from '../api'
import Gallery360 from '../components/Gallery360'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import ChatBox from '../components/ChatBox'

export default function ListingDetail({ user }){
  const {id} = useParams();
  const [listing, setListing] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    if(!id) return;
    getListing(id).then(l=>setListing(l)).catch(()=>{});
  },[id]);

  // If URL contains ?openMessages=1 and current user is the listing seller, auto-open chat
  useEffect(()=>{
    if(!listing || !user) return;
    try{
      const params = new URLSearchParams(location.search);
      const open = params.get('openMessages') === '1' || params.get('openMessages') === 'true';
      const listingSellerId = listing.seller && (listing.seller._id || listing.seller.id || listing.seller);
      const currentUserId = user && (user._id || user.id);
      // Auto-open chat when openMessages=1 for either the listing seller (to view incoming) or a buyer (to message the seller)
      if(open && listingSellerId && currentUserId){
        const isSeller = String(listingSellerId) === String(currentUserId);
        const isBuyer = user && user.role === 'buyer';
        if(isSeller || isBuyer){
          setChatOpen(true);
        }
      }
      // also capture recipient param if present
      const recipient = params.get('recipient');
      if(recipient){
        setTimeout(()=>{
          // pass recipient via state by storing to local state and letting ChatBox pick it up via prop
          const evt = new CustomEvent('veehub:setRecipient', { detail: { recipient } });
          window.dispatchEvent(evt);
        }, 250);
      }
    }catch(e){/* ignore */}
  },[listing, user, location.search]);

  const onContact = () => {
    const token = localStorage.getItem('token');
    if(!token || !user){
      // redirect to auth
      navigate('/auth');
      return;
    }
    // only buyers can contact sellers in this prototype
    if(user.role !== 'buyer'){
      alert('Only buyers can contact sellers.');
      return;
    }
    setChatOpen(true);
  }

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
                <button
                  className="btn btn-gradient contact-seller-btn"
                  onClick={onContact}
                  style={{
                    background: 'linear-gradient(90deg,#0f9d58,#2bb673)',
                    color: '#fff',
                    boxShadow: '0 14px 36px rgba(11,160,95,0.12)',
                    border: '0',
                    fontWeight: 800,
                    padding: '10px 16px'
                  }}
                >Contact Seller</button>
                <button className="btn btn-outline">Save</button>
              </div>

              {chatOpen && listing.seller && (
                <div className="modal-overlay" role="dialog" aria-modal="true">
                  <div className="modal-card" style={{maxWidth:720, width:'95%'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <h3 style={{margin:0}}>Chat with seller</h3>
                      <button className="btn btn-outline" onClick={()=>setChatOpen(false)}>Close</button>
                    </div>
                    <div style={{marginTop:12}}>
                      <ChatBox listingId={listing._id} seller={listing.seller} user={user} />
                    </div>
                  </div>
                </div>
              )}

              <div style={{marginTop:18, borderTop:'1px solid #eef4fb', paddingTop:12}}>
                <p style={{margin:0, fontSize:13, color:'#6b7c93'}}>Seller</p>
                <p style={{margin:'6px 0 0', fontWeight:700}}>{listing.seller?.name || 'Demo Seller'}</p>
                <small className="muted">{listing.seller?.email || 'seller@veehub.test'}</small>
              </div>
            </aside>
          </div>
        </div>
      ) : <p>Loading...</p>}
    </div>
  )
}
