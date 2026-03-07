// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setError(''); setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.error || 'خطأ في تسجيل الدخول')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-title">AuditPath</div>
        <div className="auth-sub">// تسجيل دخول</div>
        {error && <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'10px 14px',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--accent4)',marginBottom:16}}>{error}</div>}
        <div className="form-group">
          <label className="form-label">البريد الإلكتروني</label>
          <input className="form-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" onKeyDown={e=>e.key==='Enter'&&submit()} />
        </div>
        <div className="form-group">
          <label className="form-label">كلمة المرور</label>
          <input className="form-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&submit()} />
        </div>
        <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}} onClick={submit} disabled={loading}>
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
        <div style={{textAlign:'center',marginTop:20,fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text3)'}}>
          ليس لديك حساب؟ <Link to="/register" style={{color:'var(--accent)',textDecoration:'none'}}>إنشاء حساب</Link>
        </div>
      </div>
    </div>
  )
}
