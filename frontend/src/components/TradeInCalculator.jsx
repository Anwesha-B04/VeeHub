import React, {useState} from 'react'
import { tradeInEstimate } from '../api'

export default function TradeInCalculator(){
  const [form, setForm] = useState({vin:'', year:new Date().getFullYear()-5, mileage:45000, condition:'Good', make:'', model:''});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errs = {};
    const currentYear = new Date().getFullYear();
    const year = Number(form.year);
    if(!year || year < 1980 || year > currentYear) errs.year = `Enter a year between 1980 and ${currentYear}`;
    if(form.mileage === '' || form.mileage === null || form.mileage === undefined) errs.mileage = 'Enter mileage';
    else if(Number(form.mileage) < 0 || Number(form.mileage) > 2000000) errs.mileage = 'Enter a valid mileage';
    if(form.vin && form.vin.trim() !== ''){
      const vin = form.vin.trim();
      // VINs are 17 chars and typically exclude I,O,Q
      if(vin.length !== 17 || !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) errs.vin = 'VIN must be 17 characters (alphanumeric, no I/O/Q)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const run = async (e) => {
    if(e && e.preventDefault) e.preventDefault();
    if(!validateForm()) return;
    setLoading(true);
    try{
      const res = await tradeInEstimate(form);
      setResult(res);
    }catch(err){
      setResult({ error: 'Unable to calculate at this time' })
    }finally{
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="form-card">
        <div className="section-header">
          <div className="section-icon"> 
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="16" rx="2" stroke="#0b2545" strokeWidth="1.4"/><path d="M7 8h10" stroke="#0b2545" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </div>
          <div>
            <h4 className="section-title">Vehicle Information</h4>
          </div>
        </div>

        <form onSubmit={run} className="tradein-form">
          <div className="form-field">
            <label>Make</label>
            <input className="form-input" placeholder="e.g., Toyota" value={form.make} onChange={e=>{ setForm({...form,make:e.target.value}); setErrors(prev=>({...prev, make:undefined})); }} />
          </div>

          <div className="form-field">
            <label>Model</label>
            <input className="form-input" placeholder="e.g., Camry" value={form.model} onChange={e=>setForm({...form,model:e.target.value})} />
          </div>

          <div className="form-field">
            <label>Year</label>
            <input className={`form-input ${errors.year ? 'invalid' : ''}`} type="number" placeholder="e.g., 2020" value={form.year} onChange={e=>{ setForm({...form,year:+e.target.value}); setErrors(prev=>({...prev, year:undefined})); }} />
            {errors.year && <div className="field-error">{errors.year}</div>}
          </div>

          <div className="form-field">
            <label>Mileage</label>
            <input className={`form-input ${errors.mileage ? 'invalid' : ''}`} type="number" placeholder="e.g., 45000" value={form.mileage} onChange={e=>{ setForm({...form,mileage:+e.target.value}); setErrors(prev=>({...prev, mileage:undefined})); }} />
            {errors.mileage && <div className="field-error">{errors.mileage}</div>}
          </div>

          <div className="form-field">
            <label>Condition</label>
            <select className="form-input" value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})}>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Poor</option>
            </select>
          </div>

          <div className="form-field">
            <label>VIN (Optional)</label>
            <input className={`form-input ${errors.vin ? 'invalid' : ''}`} placeholder="17-character VIN" value={form.vin} onChange={e=>{ setForm({...form,vin:e.target.value}); setErrors(prev=>({...prev, vin:undefined})); }} />
            {errors.vin && <div className="field-error">{errors.vin}</div>}
          </div>

          <div style={{marginTop:12}}>
            <button className="btn btn-gradient full" type="submit" disabled={loading}>{loading ? 'Calculating…' : 'Calculate Trade-In Value'}</button>
          </div>
        </form>

        {result && (
          <div className="result-block" style={{marginTop:18}}>
            {result.error ? <div className="muted">{result.error}</div> : (
              <div>
                <h4>Estimate</h4>
                <p style={{fontSize:20, color:'#2b7cff', fontWeight:700}}>₹{result.min?.toLocaleString()} - ₹{result.max?.toLocaleString()}</p>
                {result.note && <p className="muted">{result.note}</p>}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="info-card" style={{marginTop:24}}>
        <h4>About Trade-In Valuation</h4>
        <p className="muted">Our trade-in calculator uses advanced market analytics to provide you with an accurate estimate of your vehicle's value.</p>
        <p style={{fontWeight:700}}>Factors we consider:</p>
        <ul>
          <li>Current market demand</li>
          <li>Vehicle age and mileage</li>
          <li>Overall condition</li>
          <li>Recent comparable sales</li>
          <li>Regional pricing trends</li>
        </ul>
        <p className="muted">Fill out the form to get your instant valuation estimate.</p>
      </div>
    </div>
  )
}
