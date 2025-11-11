import React, {useEffect, useState} from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Landing from './pages/Landing'
import RegisterLogin from './pages/RegisterLogin'
import BuyerHome from './pages/BuyerHome'
import BrowseVehicles from './pages/BrowseVehicles'
import ListingDetail from './pages/ListingDetail'
import ComparePage from './pages/ComparePage'
import TradeInPage from './pages/TradeInPage'
import SellerDashboard from './pages/SellerDashboard'
import { getMe } from './api'

export default function App(){
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      getMe(token).then(u=>{ if(u) setUser(u); }).catch(()=>{});
    }
  },[]);

  const logout = () => { localStorage.removeItem('token'); setUser(null); navigate('/'); }

  return (
    <div>
      <header className="topbar">
        <div className="brand">
          <Link to="/" className="brand-link">
            <span className="logo" aria-hidden>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11l2-3h14l2 3v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4z" stroke="#2B7CFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="7.5" cy="16.5" r="1.5" fill="#2B7CFF"/><circle cx="16.5" cy="16.5" r="1.5" fill="#2B7CFF"/></svg>
            </span>
            <span className="brand-text">VeeHub</span>
          </Link>
        </div>
        <nav className="topnav">
          {!user && (
            <>
              <Link className="nav-link" to="/auth">Sign In</Link>
              <Link className="btn btn-primary" to="/auth">Get Started</Link>
            </>
          )}
          {user && (
            <div className="nav-right">
              {user.role === 'buyer' && <Link className="nav-label" to="/buyer">Buyer Dashboard</Link>}
              {user.role === 'seller' && <Link className="nav-label" to="/seller">Seller Dashboard</Link>}
              <button className="signout-btn" onClick={logout} aria-label="Sign Out">
                <span className="btn-text">Sign Out</span>
                <span className="btn-icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 17l5-5-5-5" stroke="#0B2545" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 12H9" stroke="#0B2545" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </button>
            </div>
          )}
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<RegisterLogin onAuth={u=>setUser(u)} />} />
          <Route path="/buyer" element={<BuyerHome user={user} />} />
          <Route path="/buyer/browse" element={<BrowseVehicles user={user} />} />
          <Route path="/buyer/listing/:id" element={<ListingDetail user={user} />} />
          <Route path="/buyer/compare" element={<ComparePage user={user} />} />
          <Route path="/buyer/tradein" element={<TradeInPage user={user} />} />
          <Route path="/seller" element={<SellerDashboard user={user} />} />
        </Routes>
      </main>
    </div>
  )
}
