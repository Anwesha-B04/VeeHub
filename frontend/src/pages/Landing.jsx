import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  const features = [
    {key: 'search', title: 'Advanced Search', desc: 'Filter by make, model, year, price, mileage, and more to find exactly what you need'},
    {key: 'gallery', title: '360° Gallery', desc: 'High-resolution photos and interactive 360° views for every listing'},
    {key: 'compare', title: 'Compare Vehicles', desc: 'Side-by-side comparison of up to three vehicles with detailed specs'},
    {key: 'tradein', title: 'Trade-In Calculator', desc: 'Get instant valuations for your trade-in based on market data'},
    {key: 'wizard', title: 'Quick Listing Wizard', desc: 'Easy step-by-step process to list your vehicle in minutes'},
    {key: 'pricing', title: 'Market Pricing', desc: 'AI-driven pricing suggestions based on current market trends'}
  ];

  return (
    <div>
      <section className="hero">
        <div className="hero-inner">
          <h1>Find Your Perfect Vehicle</h1>
          <p className="lead">VeeHub connects buyers and sellers in a seamless, transparent marketplace for quality vehicles</p>
          <div className="hero-cta">
            <Link className="btn btn-primary large" to="/buyer/browse">Browse Vehicles</Link>
            <Link className="btn btn-outline large" to="/seller">List Your Vehicle</Link>
          </div>
        </div>
      </section>

      <section className="features container buyer-home">
        <h2 className="section-title">Why Choose VeeHub?</h2>
        <p className="section-sub">Our platform offers cutting-edge features for both buyers and sellers</p>
        <div className="buyer-cards">
          {features.map((f, i) => (
            <a key={f.key} className="feature-link" href="#">
              <div className="feature-icon-circle">
                <img src={`/assets/icons/${f.key}.svg`} alt="" width="28" height="28" />
              </div>
              <div className="feature-content">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-inner">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of buyers and sellers on VeeHub today</p>
          <Link className="btn btn-primary" to="/auth">Create Your Account</Link>
        </div>
      </section>
    </div>
  )
}
