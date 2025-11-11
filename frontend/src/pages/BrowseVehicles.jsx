import React, {useEffect, useState} from 'react'
import { searchListings } from '../api'
import ListingCard from '../components/ListingCard'
import Filters from '../components/Filters'
import { useNavigate } from 'react-router-dom'

export default function BrowseVehicles(){
  const [query, setQuery] = useState({page:1, limit:12});
  const [results, setResults] = useState({items:[], total:0});
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const doSearch = async (q= query) => {
    const res = await searchListings(q);
    setResults(res);
  }

  useEffect(()=>{ doSearch(); },[]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id].slice(0,3));
  }

  const compare = () => {
    if(selected.length<2){ alert('Select 2-3 vehicles'); return }
    const qs = selected.join(',');
    navigate(`/buyer/compare?ids=${qs}`);
  }

  return (
    <div>
      <h2>Browse Vehicles</h2>
      <div className="filter-panel">
        <Filters onSearch={(q)=>{ setQuery(q); doSearch(q); }} />
      </div>
        <div style={{margin:'12px 0', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>Showing {results.total || 0} vehicles</div>
        <div><button className="btn btn-primary btn-compare" onClick={compare}>Compare ({selected.length})</button></div>
      </div>
      <div className="listing-grid">
        {results.items && results.items.map(l => <ListingCard key={l._id} listing={l} onSelect={toggleSelect} selected={selected.includes(l._id)} />)}
      </div>
    </div>
  )
}
