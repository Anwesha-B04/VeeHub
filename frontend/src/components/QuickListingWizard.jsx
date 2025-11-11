import React, {useState} from 'react'
import { createListing, priceSuggestion } from '../api'

export default function QuickListingWizard({onPreview, onCreated}){
  const [data, setData] = useState({
    make:'', model:'', year:'', price:'', mileage:'', color:'', fuelType:'Gasoline', transmission:'Automatic', bodyType:'Sedan', condition:'good', location:'', vin:'', description:''
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem('token');

  const handleChange = (key, value) => setData(d=>({...d, [key]: value}));

  const submit = async (e) => {
    e && e.preventDefault();
    setSubmitting(true);
    try{
      const fd = new FormData();
      Object.keys(data).forEach(k=> fd.append(k, data[k]));
      images.slice(0,5).forEach(img=> fd.append('images', img));
      const res = await createListing(fd, token);
      alert('Listing created');
      if(onCreated) onCreated(res);
    }catch(err){
      console.error(err);
      alert('Failed to create listing');
    }
    setSubmitting(false);
  }

  const suggest = async () => {
    // Provide a heuristic-based dummy suggestion between 500k and 1.5M INR.
    // Require core fields (make, model, year, mileage, condition) to be filled; otherwise prompt the user.
    try{
      const required = ['make','model','year','mileage','condition'];
      const missing = required.filter(k => {
        const v = data[k];
        return v === undefined || v === null || String(v).trim() === '';
      });
      if(missing.length){
        alert('Please fill Make, Model, Year, Mileage and Condition to get a price suggestion');
        return;
      }

      const min = 500000;
      const max = 1500000;
      const baseMid = Math.floor((min + max) / 2); // 1,000,000

      const currentYear = new Date().getFullYear();
      const yearNum = Number(data.year) || currentYear;
      const mileageNum = Math.max(0, Number(data.mileage) || 0);
      const condition = String(data.condition || '').toLowerCase();

      // year factor: newer cars => higher price. Age penalty ~3% per year, clamp between 0.6 and 1.2
      const age = Math.max(0, currentYear - yearNum);
      const yearFactor = Math.max(0.6, Math.min(1.2, 1 - age * 0.03));

      // mileage factor: more mileage reduces price up to 40% at 200k km
      const mileageRatio = Math.min(1, mileageNum / 200000);
      const mileageFactor = 1 - (mileageRatio * 0.4);

      // condition factor
      const condMap = { 'excellent': 1.15, 'good': 1.0, 'fair': 0.85, 'poor': 0.7 };
      const conditionFactor = condMap[condition] || 1.0;

      // combine factors
      const combined = yearFactor * mileageFactor * conditionFactor;

      // base suggestion and small randomness (+/-6%) to vary results
      const baseSuggestion = Math.round(baseMid * combined);
      const noise = Math.floor(baseSuggestion * (Math.random() * 0.12 - 0.06));
      let suggested = baseSuggestion + noise;

      // clamp to allowed range and round to nearest 1000
      suggested = Math.max(min, Math.min(max, suggested));
      suggested = Math.round(suggested / 1000) * 1000;

      setData(d=>({...d, price: suggested}));
    }catch(e){
      console.error('Error generating suggestion', e);
      alert('Error generating suggestion');
    }
  }

  return (
    <div className="listing-form">
      <h2>List Your Vehicle</h2>
      <form onSubmit={submit} className="form-card" style={{marginTop:12}}>
        <div className="form-grid">
          <label className="form-field">
            <div className="label">Make</div>
            <input className="form-input" value={data.make} onChange={e=>handleChange('make', e.target.value)} />
          </label>

          <label className="form-field">
            <div className="label">Model</div>
            <input className="form-input" value={data.model} onChange={e=>handleChange('model', e.target.value)} />
          </label>

          <label className="form-field">
            <div className="label">Year</div>
            <input type="number" className="form-input" value={data.year} onChange={e=>handleChange('year', e.target.value)} />
          </label>

          <label className="form-field">
            <div className="label">Price (₹)</div>
            <input type="number" className="form-input" value={data.price} onChange={e=>handleChange('price', e.target.value)} />
          </label>

          <label className="form-field">
            <div className="label">Mileage</div>
            <input type="number" className="form-input" value={data.mileage} onChange={e=>handleChange('mileage', e.target.value)} />
          </label>

          <label className="form-field">
            <div className="label">Color</div>
            <input className="form-input" value={data.color} onChange={e=>handleChange('color', e.target.value)} />
          </label>

          <label className="form-field">
            <div className="label">Fuel Type</div>
            <select className="form-input" value={data.fuelType} onChange={e=>handleChange('fuelType', e.target.value)}>
              <option>Gasoline</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </label>

          <label className="form-field">
            <div className="label">Transmission</div>
            <select className="form-input" value={data.transmission} onChange={e=>handleChange('transmission', e.target.value)}>
              <option>Automatic</option>
              <option>Manual</option>
            </select>
          </label>

          <label className="form-field">
            <div className="label">Body Type</div>
            <select className="form-input" value={data.bodyType} onChange={e=>handleChange('bodyType', e.target.value)}>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Hatchback</option>
              <option>MPV</option>
            </select>
          </label>

          <label className="form-field">
            <div className="label">Condition</div>
            <select className="form-input" value={data.condition} onChange={e=>handleChange('condition', e.target.value)}>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </label>

          <label className="form-field" style={{gridColumn:'1 / -1'}}>
            <div className="label">Location</div>
            <input className="form-input" value={data.location} onChange={e=>handleChange('location', e.target.value)} />
          </label>

          <label className="form-field" style={{gridColumn:'1 / -1'}}>
            <div className="label">VIN (Optional)</div>
            <input className="form-input" value={data.vin} onChange={e=>handleChange('vin', e.target.value)} />
          </label>

          <label className="form-field" style={{gridColumn:'1 / -1'}}>
            <div className="label">Description</div>
            <textarea className="form-input" rows={5} value={data.description} onChange={e=>handleChange('description', e.target.value)} />
          </label>

          <label className="form-field" style={{gridColumn:'1 / -1'}}>
            <div className="label">Vehicle Images (Max 5)</div>
            <input type="file" className="form-input" onChange={e=>setImages(Array.from(e.target.files || []))} multiple accept="image/*" />
          </label>
        </div>

        <div style={{display:'flex', gap:12, marginTop:18, justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <button type="button" className="btn btn-outline" onClick={()=>{ if(onPreview) onPreview({...data, images: images.map(i=>i.name)}); }}>Preview</button>
          </div>
          <div style={{display:'flex', gap:10}}>
            <button type="button" className="btn" onClick={suggest}>Suggest Price</button>
            <button type="submit" className="btn btn-gradient" disabled={submitting}>{submitting? 'Listing...' : 'List Vehicle'}</button>
          </div>
        </div>
      </form>
    </div>
  )
}
