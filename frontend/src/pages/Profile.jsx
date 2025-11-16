import React from 'react'

export default function Profile({ user }){
  if(!user) return (
    <div className="container"><div className="feature-card">You need to be signed in to view your profile.</div></div>
  )

  const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : null;

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <div>
          <h1 style={{margin:0}}>Profile</h1>
          <div className="muted">Account details</div>
        </div>
      </div>

      <div style={{maxWidth:720}}>
        <div className="info-card">
          <h4>Basic information</h4>
          <div style={{marginTop:12}}>
            <div style={{display:'flex', gap:12, alignItems:'center'}}>
              <div style={{width:64, height:64, borderRadius:12, background:'linear-gradient(90deg,#2b7cff,#3aa0ff)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:20}}>
                { (user.name || user.email || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase() }
              </div>
              <div>
                <div style={{fontWeight:800, fontSize:18}}>{user.name || 'Anonymous'}</div>
                <div className="muted">{user.email}</div>
              </div>
            </div>

            <div style={{marginTop:18}}>
              <div style={{fontSize:13, color:'#445d6b'}}><strong>Role:</strong> {user.role}</div>
              {joined && <div style={{fontSize:13, color:'#445d6b', marginTop:6}}><strong>Member since:</strong> {joined}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
