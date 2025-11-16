import React, { useEffect, useState } from 'react'
import { getConversations, getMessages } from '../api'
import { Link, useNavigate } from 'react-router-dom'

export default function MessagesInbox({ user }){
  const [convos, setConvos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token) { setLoading(false); return; }
    let mounted = true;
    getConversations(token).then(r=>{ if(mounted){ setConvos(r || []); setLoading(false); } }).catch(()=>{ if(mounted) setLoading(false); });
    return ()=> mounted = false;
  },[]);

  const refresh = async () => {
    const token = localStorage.getItem('token');
    if(!token) return;
    setLoading(true);
    try{
      const data = await getConversations(token);
      setConvos(data || []);
    }catch(e){}
    setLoading(false);
  }

  const formatTime = (iso) => {
    if(!iso) return '';
    try{
      const d = new Date(iso);
      return d.toLocaleString();
    }catch(e){ return iso; }
  }

  const markAsRead = async (listing) => {
    const token = localStorage.getItem('token');
    if(!token) return;
    const listingId = listing && (listing._id || listing);
    if(!listingId) return;
    try{
      await getMessages(listingId, token); // endpoint marks incoming messages as read
      // refresh convos
      await refresh();
    }catch(e){ /* ignore */ }
  }

  if(loading) return <div className="container"><p>Loading conversations...</p></div>

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <div>
          <h1 style={{margin:0}}>Messages</h1>
          <div className="muted">Conversations by listing</div>
        </div>
        <div>
          <Link to="/buyer" className="btn btn-outline">← Back</Link>
        </div>
      </div>

      {convos.length === 0 ? (
        <div className="feature-card">No conversations yet.</div>
      ) : (
        <div className="inbox-list">
          {convos.map((c, i) => (
            <div key={i} className="inbox-card">
              <div className="inbox-left">
                <div className="inbox-avatar" aria-hidden>
                  { (c.participant && (c.participant.name || c.participant.email)) ? (c.participant.name ? c.participant.name.split(' ').map(s=>s[0]).slice(0,2).join('') : (c.participant.email||'U').slice(0,2).toUpperCase()) : 'U' }
                </div>
              </div>
              <div className="inbox-meta">
                <div className="inbox-title">{c.listing?.make ? `${c.listing.make} ${c.listing.model} (${c.listing.year})` : c.listing?.title || 'Listing'}</div>
                <div className="inbox-sub muted">With {c.participant?.name || c.participant?.email || 'User'}</div>
                <div className="inbox-snippet">{c.lastMessage?.text ? c.lastMessage.text.slice(0,140) : ''}</div>
              </div>
              <div className="inbox-right">
                <div className="inbox-time">{formatTime(c.lastMessage?.createdAt || c.lastMessage?.created)}</div>
                {c.unreadCount > 0 && <div className="unread-badge">{c.unreadCount}</div>}
                <div className="inbox-actions">
                  <button className="btn btn-outline" onClick={() => {
                    const listingId = c.listing && (c.listing._id || c.listing);
                    const otherId = c.participant && (c.participant._id || c.participant.id || c.participant);
                    if(listingId){
                      navigate(`/buyer/listing/${listingId}?openMessages=1&recipient=${otherId}`);
                    }
                  }}>Open</button>
                  <button className="btn" style={{marginLeft:8}} onClick={() => markAsRead(c.listing)}>{c.unreadCount>0? 'Mark read' : 'Refresh'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
