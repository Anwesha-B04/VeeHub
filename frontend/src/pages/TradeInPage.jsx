import React from 'react'
import TradeInCalculator from '../components/TradeInCalculator'
import { Link } from 'react-router-dom'

export default function TradeInPage(){
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Trade-In Calculator</h2>
        <Link className="btn btn-outline" to="/buyer">← Back</Link>
      </div>
      <div style={{marginTop:12}}>
        <TradeInCalculator />
      </div>
    </div>
  )
}
