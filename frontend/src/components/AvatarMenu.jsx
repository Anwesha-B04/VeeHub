import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function AvatarMenu({ user, onLogout }){
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(()=>{
    const onDoc = (e) => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('click', onDoc);
    return ()=> document.removeEventListener('click', onDoc);
  },[]);

  if(!user) return null;

  const initials = (user.name || user.email || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();

  return (
    <div className="avatar-menu" ref={ref} style={{position:'relative'}}>
      <button className="avatar-btn" onClick={()=>setOpen(o=>!o)} title={user.name || user.email} aria-haspopup="true" aria-expanded={open}>
        <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#2b7cff"/><stop offset="1" stopColor="#3aa0ff"/></linearGradient>
          </defs>
          <rect width="36" height="36" rx="9" fill="url(#g1)" />
          <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="14" fill="#fff">{initials}</text>
        </svg>
      </button>
      {open && (
        <div className="profile-dropdown" role="menu" aria-label="Profile menu">
          <div className="profile-card">
            <div style={{display:'flex', gap:12, alignItems:'center'}}>
              <div style={{flex:'0 0 auto'}}>
                <div style={{width:56, height:56, borderRadius:12, background:'linear-gradient(90deg,#2b7cff,#3aa0ff)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800}}>{initials}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800}}>{user.name || 'Anonymous'}</div>
                <div className="muted" style={{fontSize:13}}>{user.email}</div>
              </div>
            </div>
            <div style={{marginTop:12, display:'flex', gap:8}}>
              <Link className="btn btn-outline" to="/profile" onClick={()=>setOpen(false)}>View Profile</Link>
              <button className="btn btn-primary" onClick={()=>{ setOpen(false); onLogout && onLogout(); }}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
