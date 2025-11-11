import React from 'react'
import { Link } from 'react-router-dom'

const Icon = ({name}) => {
  switch(name){
    case 'search': return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35" stroke="#2B7CFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="#2B7CFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )
    case 'gallery': return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#FF8A33" strokeWidth="1.6"/><circle cx="8.5" cy="9.5" r="1.6" fill="#FF8A33"/><path d="M21 19l-6-6-4 4-3-3-3 6" stroke="#FF8A33" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
    )
    case 'compare': return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 6h8" stroke="#2B7CFF" strokeWidth="1.6" strokeLinecap="round"/><path d="M8 12h8" stroke="#2B7CFF" strokeWidth="1.6" strokeLinecap="round"/><path d="M8 18h8" stroke="#2B7CFF" strokeWidth="1.6" strokeLinecap="round"/></svg>
    )
    case 'calculator': return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#FF8A33" strokeWidth="1.6"/><path d="M8 7h8" stroke="#FF8A33" strokeWidth="1.4" strokeLinecap="round"/><path d="M9 11h1M12 11h1M15 11h1M9 14h1M12 14h1M15 14h1" stroke="#FF8A33" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )
    default: return null
  }
}

export default function BuyerHome(){
  const features = [
    {title:'Browse Vehicles', desc:'Search and filter through thousands of vehicles with our advanced search tools', to:'/buyer/browse', icon:'search'},
    {title:'360° Gallery', desc:'View high-resolution photos and interactive 360° views of each vehicle', to:'/buyer/browse', icon:'gallery'},
    {title:'Compare Vehicles', desc:'Compare up to three vehicles side-by-side to make an informed decision', to:'/buyer/compare', icon:'compare'},
    {title:'Trade-In Calculator', desc:"Get an instant valuation for your current vehicle's trade-in value", to:'/buyer/tradein', icon:'calculator'}
  ];

  return (
    <div className="buyer-home">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2>Welcome Back!</h2>
          <p className="muted">Explore our features to find your perfect vehicle</p>
        </div>
      </div>
      <div className="cards-grid buyer-cards">
        {features.map((f,i)=> (
          <Link key={i} to={f.to} className="feature-card feature-link">
            <div className="feature-icon-circle"> <Icon name={f.icon} /> </div>
            <div className="feature-content">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
            <div className="feature-cta">→</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
