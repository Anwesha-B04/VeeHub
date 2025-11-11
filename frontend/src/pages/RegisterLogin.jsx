import React, {useState} from 'react'
import { register, login } from '../api'
import {useNavigate} from 'react-router-dom'

export default function RegisterLogin({onAuth}){
  const [tab, setTab] = useState('signin'); // 'signin' or 'signup'
  const [signin, setSignin] = useState({email:'', password:''});
  const [signup, setSignup] = useState({name:'', email:'', password:'', role:'buyer'});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const doSignin = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    try{
      const res = await login(signin);
      if(res.token){
        localStorage.setItem('token', res.token);
        onAuth && onAuth(res.user);
        navigate(res.user.role === 'seller' ? '/seller' : '/buyer');
      }
    }catch(err){
      alert(err.message || 'Sign in failed');
    } finally{ setLoading(false); }
  }

  const doSignup = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    try{
      const res = await register(signup);
      if(res.token){
        localStorage.setItem('token', res.token);
        onAuth && onAuth(res.user);
        navigate(res.user.role === 'seller' ? '/seller' : '/buyer');
      }
    }catch(err){
      alert(err.message || 'Sign up failed');
    } finally{ setLoading(false); }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand"><h2>VeeHub</h2></div>
        <h3>Welcome</h3>
        <p className="muted">Sign in to your account or create a new one</p>

        <div className="tabs">
          <button className={tab==='signin' ? 'active' : ''} onClick={()=>setTab('signin')}>Sign In</button>
          <button className={tab==='signup' ? 'active' : ''} onClick={()=>setTab('signup')}>Sign Up</button>
        </div>

        {tab === 'signin' ? (
          <form onSubmit={doSignin} className="auth-form">
            <label>Email</label>
            <input type="email" value={signin.email} onChange={e=>setSignin({...signin,email:e.target.value})} placeholder="your@email.com" required />
            <label>Password</label>
            <input type="password" value={signin.password} onChange={e=>setSignin({...signin,password:e.target.value})} required />
            <button className="btn btn-primary full" type="submit" disabled={loading}>{loading? 'Signing in...' : 'Sign In'}</button>
          </form>
        ) : (
          <form onSubmit={doSignup} className="auth-form">
            <label>Full Name</label>
            <input value={signup.name} onChange={e=>setSignup({...signup,name:e.target.value})} placeholder="John Doe" required />
            <label>Email</label>
            <input type="email" value={signup.email} onChange={e=>setSignup({...signup,email:e.target.value})} placeholder="your@email.com" required />
            <label>Password</label>
            <input type="password" value={signup.password} onChange={e=>setSignup({...signup,password:e.target.value})} required />
            <div className="role-select">
              <label>I am a</label>
              <label><input type="radio" name="role" value="buyer" checked={signup.role==='buyer'} onChange={e=>setSignup({...signup,role:e.target.value})} /> Buyer - Looking to purchase a vehicle</label>
              <label><input type="radio" name="role" value="seller" checked={signup.role==='seller'} onChange={e=>setSignup({...signup,role:e.target.value})} /> Seller - Looking to sell a vehicle</label>
            </div>
            <button className="btn btn-primary full" type="submit" disabled={loading}>{loading? 'Creating...' : 'Create Account'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
