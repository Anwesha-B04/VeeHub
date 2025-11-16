import React, { useEffect, useRef, useState } from 'react'
import { getMessages, sendMessage } from '../api'

export default function ChatBox({ listingId, seller, user }){
  const [messages, setMessages] = useState([]);
  const [recipients, setRecipients] = useState([]); // for seller: list of buyer participants
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const scrollRef = useRef();

  const fetchMessages = async () => {
    try{
      const res = await getMessages(listingId, token);
      const msgs = res || [];
      setMessages(msgs);

      // if current user is seller, compute list of other participants (buyers)
      const currentUserId = user && (user._id || user.id);
      const sellerId = seller && (seller._id || seller.id || seller);
      if(user && currentUserId && sellerId && String(currentUserId) === String(sellerId)){
        // collect unique other users (either from or to) excluding seller
        const map = new Map();
        // iterate in reverse chronological (msgs are sorted asc by server) -> reverse
        for(let i=msgs.length-1;i>=0;i--){
          const m = msgs[i];
          const from = m.from && (m.from._id || m.from.id || m.from);
          const to = m.to && (m.to._id || m.to.id || m.to);
          if(from && String(from) !== String(sellerId)){
            if(!map.has(String(from))) map.set(String(from), m.from);
          }
          if(to && String(to) !== String(sellerId)){
            if(!map.has(String(to))) map.set(String(to), m.to);
          }
        }
        const list = Array.from(map.entries()).map(([id, userObj]) => ({ id, name: (userObj && (userObj.name || userObj.email)) || id }));
        setRecipients(list);
        if(list.length && !selectedRecipient){
          setSelectedRecipient(list[0].id);
        }
      }
    }catch(e){
      // ignore for now
    }
  }

  useEffect(()=>{
    fetchMessages();
    const iv = setInterval(fetchMessages, 3000);
    return () => clearInterval(iv);
  },[listingId]);

  // listen for external recipient selection (inbox -> listing detail) via custom event
  useEffect(()=>{
    const onSet = (e) => {
      const r = e && e.detail && e.detail.recipient;
      if(r) setSelectedRecipient(r);
    };
    window.addEventListener('veehub:setRecipient', onSet);
    return () => window.removeEventListener('veehub:setRecipient', onSet);
  },[]);

  useEffect(()=>{ if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const onSend = async () => {
    if(!text.trim()) return;
    setLoading(true);
    try{
      let toId = seller._id || seller.id || seller; // default recipient is listing seller
      // if current user is seller, send to selected recipient (buyer)
      const currentUserId = user && (user._id || user.id);
      const sellerId = seller && (seller._id || seller.id || seller);
      if(currentUserId && sellerId && String(currentUserId) === String(sellerId)){
        // seller sending reply
        if(!selectedRecipient){
          alert('Select a buyer to send this message to.');
          setLoading(false);
          return;
        }
        toId = selectedRecipient;
      }

      await sendMessage(listingId, toId, text.trim(), token);
      setText('');
      await fetchMessages();
    }catch(err){
      console.error('send error', err);
    }finally{ setLoading(false); }
  }

  return (
    <div className="info-card" style={{marginTop:14}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div style={{fontWeight:700}}>Chat with seller</div>
          <div className="muted" style={{fontSize:13}}>{seller?.name || 'Seller'}</div>
        </div>
      </div>

      {/* recipient selector for sellers */}
      {user && seller && (user._id || user.id) && String(user._id || user.id) === String(seller._id || seller.id || seller) && (
        <div style={{marginTop:8}}>
          <label className="muted" style={{fontSize:13}}>Send to:</label>
          <div style={{marginTop:6}}>
            {recipients.length ? (
              <select value={selectedRecipient || ''} onChange={e=>setSelectedRecipient(e.target.value)} className="form-select">
                {recipients.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            ) : (
              <div className="muted">No buyers have messaged yet.</div>
            )}
          </div>
        </div>
      )}

      <div ref={scrollRef} style={{maxHeight:260, overflowY:'auto', marginTop:12, padding:8, border:'1px solid #eef4fb', borderRadius:6, background:'#fff'}}>
        {messages.length===0 && <div className="muted" style={{padding:12}}>No messages yet. Say hello 👋</div>}
        {messages.map(m => {
          const fromId = m.from && (m.from._id || m.from.id || m.from);
          const currentUserId = user && (user._id || user.id);
          const mine = String(fromId) === String(currentUserId);
          return (
            <div key={m._id} style={{display:'flex', marginBottom:8, justifyContent: mine ? 'flex-end' : 'flex-start'}}>
              <div style={{maxWidth:'78%', padding:10, borderRadius:8, background: mine ? '#2B7CFF' : '#f1f6fb', color: mine ? '#fff' : '#0b2545'}}>
                <div style={{fontSize:13, marginBottom:6}}>{m.text}</div>
                <div className="muted" style={{fontSize:11, textAlign:'right'}}>{new Date(m.createdAt).toLocaleString()}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a message..." className="form-input" style={{flex:1}} />
        <button className="btn btn-gradient" onClick={onSend} disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
      </div>
    </div>
  )
}
