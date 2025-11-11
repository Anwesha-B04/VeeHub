import React, {useEffect, useState} from 'react'
import { searchListings, compareListings, tradeInEstimate } from '../api'
import ListingCard from '../components/ListingCard'
import Filters from '../components/Filters'

export default function BuyerDashboard(){
  const [query, setQuery] = useState({page:1, limit:12});
  const [results, setResults] = useState({items:[], total:0});
  const [selected, setSelected] = useState([]);

  const doSearch = async (q= query) => {
    const res = await searchListings(q);
    setResults(res);
  }

  useEffect(()=>{ doSearch(); },[]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id].slice(0,3));
  }

  const compare = async () => {
    if(selected.length<2){ alert('Select 2-3 vehicles'); return }
    const res = await compareListings(selected);
    // open comparison in new window or show inline — for prototype we'll alert
    window.__comparison = res.items;
    window.alert('Comparison saved to window.__comparison — open console to inspect');
  }

  return (
    <div>
      <h2>Buyer Dashboard</h2>
      <Filters onSearch={(q)=>{ setQuery(q); doSearch(q); }} />
      <div>
        <button onClick={compare}>Compare ({selected.length})</button>
      </div>
      <div className="listing-grid">
        {results.items && results.items.map(l => <ListingCard key={l._id} listing={l} onSelect={toggleSelect} selected={selected.includes(l._id)} />)}
      </div>
    </div>
  )
}
