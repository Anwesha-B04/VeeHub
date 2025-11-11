import React, {useEffect, useState} from 'react'
import { compareListings } from '../api'
import { useLocation, Link } from 'react-router-dom'

function useQuery(){ return new URLSearchParams(useLocation().search); }

export default function ComparePage(){
  const q = useQuery();
  const ids = q.get('ids') ? q.get('ids').split(',') : [];
  const [items, setItems] = useState([]);
  const [modalVehicle, setModalVehicle] = useState(null);

  useEffect(()=>{
    if(!ids.length) return;
    compareListings(ids).then(r=>setItems(r.items)).catch(()=>{});
  },[q]);

  // compute best values per metric
  const priceValues = items.map(i=> (i.price===undefined || i.price===null) ? Infinity : Number(i.price));
  const minPrice = priceValues.length ? Math.min(...priceValues) : Infinity;

  const mileageValues = items.map(i=> (i.mileage===undefined || i.mileage===null) ? Infinity : Number(i.mileage));
  const minMileage = mileageValues.length ? Math.min(...mileageValues) : Infinity;

  const openModal = (item)=> setModalVehicle(item);
  const closeModal = ()=> setModalVehicle(null);
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Compare Vehicles</h2>
        <Link className="btn btn-outline" to="/buyer">← Back</Link>
      </div>

      {items.length ? (
        <div className="compare-wrap">
          <div className="compare-table" role="table" aria-label="Vehicle comparison">
            <div className="compare-row header">
              <div className="compare-cell attr-col"></div>
              {items.map(item => (
                <div key={item._id} className="compare-cell vehicle-col">
                  <div className="vehicle-card">
                        <div className="vehicle-thumb" role="button" tabIndex={0} onClick={()=>openModal(item)} onKeyDown={(e)=>{ if(e.key==='Enter') openModal(item)}}>
                                {item.images && item.images.length ? (
                                  (() => {
                                    const img = item.images[0].url && item.images[0].url.startsWith('/') ?
                                      `${(import.meta.env.VITE_API_BASE || 'http://localhost:5000/api').replace(/\/api$/,'')}${item.images[0].url}` : item.images[0].url;
                                    return <img src={img} alt={`${item.make} ${item.model}`} />
                                  })()
                                ) : (
                                  <div className="vehicle-placeholder">🚗</div>
                                )}
                        </div>
                    <div className="vehicle-title">{item.make} {item.model}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* attributes rows */}
            <div className="compare-row">
              <div className="compare-cell attr-col label">Price</div>
              {items.map(i=> {
                const isBest = (i.price !== undefined && i.price !== null && Number(i.price) === minPrice);
                return <div key={i._id} className={`compare-cell value-col compare-price ${isBest ? 'best' : ''}`}>₹{i.price?.toLocaleString()}</div>
              })}
            </div>
            <div className="compare-row">
              <div className="compare-cell attr-col label">Year</div>
              {items.map(i=> <div key={i._id} className="compare-cell value-col">{i.year}</div>)}
            </div>
            <div className="compare-row">
              <div className="compare-cell attr-col label">Mileage</div>
              {items.map(i=> {
                const isBestM = (i.mileage !== undefined && i.mileage !== null && Number(i.mileage) === minMileage);
                return <div key={i._id} className={`compare-cell value-col ${isBestM ? 'best' : ''}`}>{i.mileage} km</div>
              })}
            </div>
            <div className="compare-row">
              <div className="compare-cell attr-col label">Fuel</div>
              {items.map(i=> <div key={i._id} className="compare-cell value-col">{i.fuelType}</div>)}
            </div>
          </div>
        </div>
      ) : (
        <div className="feature-card" style={{textAlign:'center'}}>
          <div style={{fontSize:40}}>🚗</div>
          <p>Select vehicles from the listings to compare their specifications</p>
          <Link className="btn btn-primary btn-browse-compare" to="/buyer/browse">Browse Vehicles</Link>
        </div>
      )}
      {modalVehicle && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <button className="modal-close" onClick={closeModal} aria-label="Close">✕</button>
            <div className="modal-body">
              <div className="modal-left">
                {modalVehicle.images && modalVehicle.images.length ? (
                  (() => {
                    const img = modalVehicle.images[0].url && modalVehicle.images[0].url.startsWith('/') ?
                      `${(import.meta.env.VITE_API_BASE || 'http://localhost:5000/api').replace(/\/api$/,'')}${modalVehicle.images[0].url}` : modalVehicle.images[0].url;
                    return <img src={img} alt={`${modalVehicle.make} ${modalVehicle.model}`} />
                  })()
                ) : (
                  <div className="vehicle-placeholder large">🚗</div>
                )}
              </div>
              <div className="modal-right">
                <h3>{modalVehicle.make} {modalVehicle.model}</h3>
                <p className="muted">{modalVehicle.year} • {modalVehicle.mileage} km • {modalVehicle.fuelType}</p>
                <p style={{marginTop:18, fontSize:20, color:'#2b7cff', fontWeight:700}}>₹{modalVehicle.price?.toLocaleString()}</p>
                <p style={{marginTop:12}}>{modalVehicle.description}</p>
                <div style={{marginTop:18}}>
                  <Link className="btn btn-outline" to={`/buyer/listing/${modalVehicle._id}`} onClick={closeModal}>View Listing</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
