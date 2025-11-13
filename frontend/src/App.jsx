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
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      getMe(token).then(u=>{ if(u) setUser(u); }).catch(()=>{});
    }
  },[]);

  const logout = () => { localStorage.removeItem('token'); setUser(null); navigate('/'); }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="brand-link flex items-center gap-3">
                <span className="logo" aria-hidden>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11l2-3h14l2 3v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-4z" stroke="#2B7CFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="7.5" cy="16.5" r="1.5" fill="#2B7CFF"/><circle cx="16.5" cy="16.5" r="1.5" fill="#2B7CFF"/></svg>
                </span>
                <span className="brand-text font-extrabold text-lg">VeeHub</span>
              </Link>
            </div>

            <div className="hidden md:flex md:items-center md:gap-4">
              {!user && (
                <>
                  <Link className="nav-link header-signin text-slate-700 hover:text-white hover:bg-brand px-3 py-2 rounded-md transition" to="/auth">Sign In</Link>
                  <Link className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-brand to-brand-light text-white font-semibold shadow-md hover:shadow-lg transform-gpu hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand header-cta" to="/auth">Get Started</Link>
                </>
              )}
              {user && (
                <div className="nav-right flex items-center gap-3">
                  {user.role === 'buyer' && <Link className="nav-label text-slate-600" to="/buyer">Buyer Dashboard</Link>}
                  {user.role === 'seller' && <Link className="nav-label text-slate-600" to="/seller">Seller Dashboard</Link>}
                  <button className="signout-btn inline-flex items-center gap-2 bg-white border border-slate-100 px-3 py-2 rounded-md" onClick={logout} aria-label="Sign Out">
                    <span className="btn-text">Sign Out</span>
                    <span className="btn-icon" aria-hidden>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 17l5-5-5-5" stroke="#0B2545" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 12H9" stroke="#0B2545" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen} aria-label="Toggle navigation" className="p-2 rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {navOpen ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {navOpen && (
          <nav className="md:hidden bg-white border-t">
            <div className="px-4 py-3 flex flex-col gap-2">
              {!user && (
                <>
                  <Link onClick={() => setNavOpen(false)} className="nav-link header-signin text-slate-700 block hover:text-white hover:bg-brand px-3 py-2 rounded-md transition" to="/auth">Sign In</Link>
                  <Link onClick={() => setNavOpen(false)} className="btn btn-primary inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-brand to-brand-light text-white font-semibold" to="/auth">Get Started</Link>
                </>
              )}
              {user && (
                <>
                  {user.role === 'buyer' && <Link onClick={() => setNavOpen(false)} className="nav-label block" to="/buyer">Buyer Dashboard</Link>}
                  {user.role === 'seller' && <Link onClick={() => setNavOpen(false)} className="nav-label block" to="/seller">Seller Dashboard</Link>}
                  <button onClick={() => { setNavOpen(false); logout(); }} className="signout-btn inline-flex items-center gap-2 bg-white border border-slate-100 px-3 py-2 rounded-md">Sign Out</button>
                </>
              )}
            </div>
          </nav>
        )}

      </header>

      <main className="container py-8">
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
