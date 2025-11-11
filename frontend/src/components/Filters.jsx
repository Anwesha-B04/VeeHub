import React, {useState} from 'react'

export default function Filters({onSearch}){
  const priceOptions = [
    {label: 'All Prices', min: '', max: ''},
    {label: 'Under ₹2 L', min: '', max: '200000'},
    {label: '₹2 L - ₹5 L', min: '200000', max: '500000'},
    {label: '₹5 L - ₹10 L', min: '500000', max: '1000000'},
    {label: 'Above ₹10 L', min: '1000000', max: ''}
  ];

  const [q, setQ] = useState({make:'', model:'', yearMin:'', yearMax:'', priceMin:'', priceMax:'', priceRange: priceOptions[0].label, mileageMax:'', page:1, fuelType:'', sort:'-createdAt'});
  const submit = (e) => { e && e.preventDefault(); onSearch(q); }
  const clear = (e) => { e && e.preventDefault(); const empty = {make:'', model:'', yearMin:'', yearMax:'', priceMin:'', priceMax:'', priceRange: priceOptions[0].label, mileageMax:'', page:1, fuelType:'', sort:'-createdAt'}; setQ(empty); onSearch(empty); }
  return (
    <form onSubmit={submit} className="filters">
      <div className="filters-grid">
        <div className="field"><label>Search</label><input placeholder="Make or model..." value={q.make} onChange={e=>setQ({...q,make:e.target.value})} /></div>
        <div className="field"><label>Make</label><select value={q.model} onChange={e=>setQ({...q,model:e.target.value})}><option value="">All Makes</option></select></div>
  <div className="field"><label>Year Range</label><div className="range-inputs"><input className="range-input" placeholder="Min" type="number" value={q.yearMin} onChange={e=>setQ({...q,yearMin:e.target.value})} /><input className="range-input" placeholder="Max" type="number" value={q.yearMax} onChange={e=>setQ({...q,yearMax:e.target.value})} /></div></div>
        <div className="field"><label>Price Range (₹)</label>
          <select value={q.priceRange} onChange={e=>{
            const sel = priceOptions.find(p => p.label === e.target.value) || priceOptions[0];
            setQ({...q, priceRange: sel.label, priceMin: sel.min, priceMax: sel.max});
          }}>
            {priceOptions.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}
          </select>
        </div>
        <div className="field"><label>Fuel Type</label><select value={q.fuelType} onChange={e=>setQ({...q,fuelType:e.target.value})}><option value="">All Types</option><option>Petrol</option><option>Diesel</option><option>Electric</option></select></div>
        <div className="field"><label>Sort By</label><select value={q.sort} onChange={e=>setQ({...q,sort:e.target.value})}><option value="-createdAt">Newest First</option><option value="price">Price: Low to High</option></select></div>
      </div>
      <div className="filters-actions"><button className="btn btn-outline" onClick={clear}>Clear Filters</button><button className="btn btn-primary" type="submit">Apply</button></div>
    </form>
  )
}
