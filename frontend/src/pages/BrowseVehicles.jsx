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
      <h2 className="text-2xl font-bold mb-4">Browse Vehicles</h2>
      <div className="filter-panel mb-4">
        <Filters onSearch={(q)=>{ setQuery(q); doSearch(q); }} />
      </div>
        <div className="my-3 flex justify-between items-center">
        <div className="text-sm text-slate-600">Showing {results.total || 0} vehicles</div>
        <div><button className="btn btn-primary btn-compare inline-flex items-center px-4 py-2 rounded-md" onClick={compare}>Compare ({selected.length})</button></div>
      </div>
      <div className="listing-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.items && results.items.map(l => <ListingCard key={l._id} listing={l} onSelect={toggleSelect} selected={selected.includes(l._id)} />)}
      </div>
    </div>
  )
}
