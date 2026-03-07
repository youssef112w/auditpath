// src/pages/Register.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]     = useState({ username: '', email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setError(''); setLoading(true)
    try {
      await register(form.username, form.email, form.password)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.error || 'خطأ في إنشاء الحساب')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-title">AuditPath</div>
        <div className="auth-sub">// إنشاء حساب جديد</div>
        {error && <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'10px 14px',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--accent4)',marginBottom:16}}>{error}</div>}
        <div className="form-group">
          <label className="form-label">اسم المستخدم</label>
          <input className="form-input" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="auditor_pro" />
        </div>
        <div className="form-group">
          <label className="form-label">البريد الإلكتروني</label>
          <input className="form-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">كلمة المرور</label>
          <input className="form-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="8+ أحرف" onKeyDown={e=>e.key==='Enter'&&submit()} />
        </div>
        <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}} onClick={submit} disabled={loading}>
          {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
        </button>
        <div style={{textAlign:'center',marginTop:20,fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text3)'}}>
          لديك حساب؟ <Link to="/login" style={{color:'var(--accent)',textDecoration:'none'}}>تسجيل دخول</Link>
        </div>
      </div>
    </div>
  )
}
