import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Icons ─────────────────────────────────────────────────────────────────────
const icons = {
  User:   () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Mail:   () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Lock:   () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Camera: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Arrow:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Alert:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Plus:   () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Eye:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Check:  () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  XMark:  () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
}

const LogoMark = () => (
  <svg width="34" height="34" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="11" fill="url(#rlmg)"/>
    <path d="M11 19l6 6 11-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs><linearGradient id="rlmg" x1="0" y1="0" x2="38" y2="38"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
  </svg>
)

// ── Password strength ─────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getStrength = (pw) => {
  const rules = [
    { id: 'len',   label: 'Mínimo 8 caracteres',          ok: pw.length >= 8 },
    { id: 'upper', label: 'Al menos una mayúscula',        ok: /[A-Z]/.test(pw) },
    { id: 'lower', label: 'Al menos una minúscula',        ok: /[a-z]/.test(pw) },
    { id: 'num',   label: 'Al menos un número',            ok: /\d/.test(pw) },
    { id: 'sym',   label: 'Al menos un símbolo (!@#$...)', ok: /[^A-Za-z0-9]/.test(pw) },
  ]
  const score = rules.filter(r => r.ok).length
  const levels = [
    { label: '',           color: 'rgba(255,255,255,.08)', text: 'transparent' },
    { label: 'Muy débil',  color: '#ef4444',               text: '#ef4444' },
    { label: 'Débil',      color: '#f97316',               text: '#f97316' },
    { label: 'Regular',    color: '#eab308',               text: '#eab308' },
    { label: 'Fuerte',     color: '#22c55e',               text: '#22c55e' },
    { label: 'Muy fuerte', color: '#10b981',               text: '#10b981' },
  ]
  return { rules, score, level: levels[score] }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Register() {
  const [form, setForm]       = useState({ username: '', email: '', password: '', confirm_password: '' })
  const [profilePic, setProfilePic] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')
  const [showPw, setShowPw]   = useState({ password: false, confirm: false })
  const [touched, setTouched] = useState({})
  const { register }          = useAuth()
  const navigate              = useNavigate()

  const strength   = useMemo(() => getStrength(form.password), [form.password])
  const emailValid = EMAIL_RE.test(form.email)
  const pwMatch    = form.confirm_password === '' ? null : form.password === form.confirm_password

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) { setProfilePic(file); setPreview(URL.createObjectURL(file)) }
  }

  const touch = (key) => setTouched(t => ({ ...t, [key]: true }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!emailValid)                             return setError('El correo electrónico no es válido')
    if (strength.score < 3)                      return setError('La contraseña es demasiado débil')
    if (form.password !== form.confirm_password) return setError('Las contraseñas no coinciden')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (profilePic) fd.append('profile_pic', profilePic)
      await register(fd)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  const ic = (f) => focused === f ? '#818cf8' : 'rgba(255,255,255,0.22)'
  const emailBorder = touched.email && form.email
    ? (emailValid ? 'rgba(34,197,94,.45)' : 'rgba(239,68,68,.45)')
    : 'rgba(255,255,255,.1)'
  const confirmBorder = pwMatch === null ? 'rgba(255,255,255,.1)'
    : pwMatch ? 'rgba(34,197,94,.45)' : 'rgba(239,68,68,.45)'

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 24px 40px', fontFamily:'"DM Sans",system-ui,sans-serif', position:'relative', overflow:'hidden', background:'#080810' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Syne:wght@700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes b1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(70px,-50px) scale(1.18)}66%{transform:translate(-40px,60px) scale(0.9)}}
        @keyframes b2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-80px,40px) scale(1.12)}66%{transform:translate(55px,-70px) scale(0.94)}}
        @keyframes b3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(50px,80px) scale(1.14)}}
        @keyframes b4{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-55px,-35px) scale(1.1)}80%{transform:translate(35px,45px) scale(0.88)}}
        .blob{position:fixed;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0}
        .b1{animation:b1 10s ease-in-out infinite}.b2{animation:b2 13s ease-in-out infinite}
        .b3{animation:b3 15s ease-in-out infinite}.b4{animation:b4 9s ease-in-out infinite}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .card{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) forwards}
        .ri{transition:border-color .2s,box-shadow .2s;background:rgba(255,255,255,.05)!important}
        .ri:focus{outline:none;border-color:#818cf8!important;box-shadow:0 0 0 3px rgba(129,140,248,.15)}
        .sbtn{transition:all .2s;cursor:pointer}
        .sbtn:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 12px 32px rgba(99,102,241,.5)!important}
        .sbtn:disabled{opacity:.55;cursor:not-allowed}
        .rlink{transition:color .15s}.rlink:hover{color:#c4b5fd!important}
        .av-wrap:hover .av-ring{border-color:rgba(129,140,248,.6)!important}
        .eye-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:2px;transition:color .15s}
        .eye-btn:hover{color:#818cf8!important}
        .seg{height:4px;border-radius:3px;transition:background .4s,transform .2s}
        .rule-row{display:flex;align-items:center;gap:6px;font-size:11px;transition:color .2s;line-height:1.3}
      `}</style>

      {/* Blobs */}
      <div className="blob b1" style={{ width:560,height:560,background:'radial-gradient(circle,rgba(99,102,241,.48) 0%,transparent 70%)',top:'-140px',left:'-120px' }}/>
      <div className="blob b2" style={{ width:500,height:500,background:'radial-gradient(circle,rgba(168,85,247,.4) 0%,transparent 70%)',bottom:'-100px',right:'-100px' }}/>
      <div className="blob b3" style={{ width:360,height:360,background:'radial-gradient(circle,rgba(34,211,238,.15) 0%,transparent 70%)',top:'35%',right:'8%' }}/>
      <div className="blob b4" style={{ width:320,height:320,background:'radial-gradient(circle,rgba(251,113,133,.13) 0%,transparent 70%)',bottom:'12%',left:'4%' }}/>

      <div className="card" style={{ width:'100%',maxWidth:440,position:'relative',zIndex:2 }}>

        {/* Logo */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:11,marginBottom:28 }}>
          <LogoMark />
          <div>
            <div style={{ fontFamily:'"Syne",sans-serif',fontSize:20,fontWeight:800,color:'#fff',letterSpacing:'-0.4px',lineHeight:1 }}>
              TaskFlow<span style={{color:'#818cf8'}}>+</span>CloudDrive
            </div>
            <div style={{ fontSize:10,color:'rgba(255,255,255,.22)',letterSpacing:'0.08em',marginTop:3 }}>
              SEMINARIO DE SISTEMAS 1 · GRUPO 8
            </div>
          </div>
        </div>

        {/* Glass card */}
        <div style={{ background:'rgba(255,255,255,.055)',border:'1px solid rgba(255,255,255,.11)',borderRadius:22,padding:'32px 28px',backdropFilter:'blur(32px)',WebkitBackdropFilter:'blur(32px)',boxShadow:'0 0 0 1px rgba(255,255,255,.04) inset,0 32px 80px rgba(0,0,0,.5)' }}>
          <h2 style={{ fontFamily:'"Syne",sans-serif',fontSize:21,fontWeight:800,color:'#fff',marginBottom:4,letterSpacing:'-0.3px' }}>Crear cuenta</h2>
          <p style={{ fontSize:13,color:'rgba(255,255,255,.3)',marginBottom:22 }}>Únete a la plataforma en segundos</p>

          {error && (
            <div style={{ display:'flex',alignItems:'center',gap:8,background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',color:'#fca5a5',fontSize:13,borderRadius:10,padding:'10px 14px',marginBottom:18 }}>
              <icons.Alert /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:14 }}>

            {/* ── Avatar ── */}
            <div style={{ display:'flex',justifyContent:'center',marginBottom:4 }}>
              <label className="av-wrap" style={{ cursor:'pointer',position:'relative' }}>
                <div className="av-ring" style={{ width:72,height:72,borderRadius:'50%',background:'rgba(99,102,241,.12)',border:'2px solid rgba(255,255,255,.1)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',transition:'border-color .2s' }}>
                  {preview ? <img src={preview} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }}/> : <span style={{ color:'rgba(255,255,255,.25)' }}><icons.Camera /></span>}
                </div>
                <div style={{ position:'absolute',bottom:0,right:0,width:22,height:22,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #080810' }}>
                  <icons.Plus />
                </div>
                <input type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }}/>
              </label>
            </div>

            {/* ── Username ── */}
            <div>
              <label style={{ display:'block',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.35)',marginBottom:7,letterSpacing:'0.07em' }}>USUARIO</label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:ic('username'),transition:'color .2s',pointerEvents:'none' }}><icons.User /></div>
                <input type="text" className="ri" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  onFocus={() => setFocused('username')} onBlur={() => { setFocused(''); touch('username') }}
                  placeholder="tu_usuario" required
                  style={{ width:'100%',border:'1px solid rgba(255,255,255,.1)',borderRadius:11,padding:'11px 14px 11px 44px',color:'#fff',fontSize:14,fontFamily:'inherit' }}
                />
              </div>
            </div>

            {/* ── Email ── */}
            <div>
              <label style={{ display:'block',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.35)',marginBottom:7,letterSpacing:'0.07em' }}>CORREO ELECTRÓNICO</label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:ic('email'),transition:'color .2s',pointerEvents:'none' }}><icons.Mail /></div>
                <input type="email" className="ri" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')} onBlur={() => { setFocused(''); touch('email') }}
                  placeholder="correo@ejemplo.com" required
                  style={{ width:'100%',border:`1px solid ${emailBorder}`,borderRadius:11,padding:'11px 40px 11px 44px',color:'#fff',fontSize:14,fontFamily:'inherit' }}
                />
                {touched.email && form.email && (
                  <div style={{ position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',color: emailValid ? '#22c55e' : '#ef4444',display:'flex',alignItems:'center' }}>
                    {emailValid ? <icons.Check /> : <icons.XMark />}
                  </div>
                )}
              </div>
              {touched.email && form.email && !emailValid && (
                <p style={{ fontSize:11,color:'#f87171',marginTop:5,paddingLeft:2 }}>
                  Ingresa un correo válido — ej: nombre@dominio.com
                </p>
              )}
            </div>

            {/* ── Password ── */}
            <div>
              <label style={{ display:'block',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.35)',marginBottom:7,letterSpacing:'0.07em' }}>CONTRASEÑA</label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:ic('password'),transition:'color .2s',pointerEvents:'none' }}><icons.Lock /></div>
                <input
                  type={showPw.password ? 'text' : 'password'} className="ri"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('password')} onBlur={() => { setFocused(''); touch('password') }}
                  placeholder="••••••••" required
                  style={{ width:'100%',border:'1px solid rgba(255,255,255,.1)',borderRadius:11,padding:'11px 44px 11px 44px',color:'#fff',fontSize:14,fontFamily:'inherit' }}
                />
                <button type="button" className="eye-btn"
                  onClick={() => setShowPw(s => ({ ...s, password: !s.password }))}
                  style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,.3)' }}>
                  {showPw.password ? <icons.EyeOff /> : <icons.Eye />}
                </button>
              </div>

              {/* Strength indicator */}
              {form.password.length > 0 && (
                <div style={{ marginTop:10 }}>
                  {/* Bar */}
                  <div style={{ display:'flex',gap:3,marginBottom:6 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="seg" style={{
                        flex:1,
                        background: i <= strength.score ? strength.level.color : 'rgba(255,255,255,.07)',
                        transform: i <= strength.score ? 'scaleY(1.25)' : 'scaleY(1)',
                      }}/>
                    ))}
                  </div>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                    <span style={{ fontSize:11,color:'rgba(255,255,255,.28)' }}>Seguridad</span>
                    <span style={{ fontSize:11,fontWeight:600,color:strength.level.text }}>{strength.level.label}</span>
                  </div>
                  {/* Checklist */}
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px 12px',padding:'10px 12px',background:'rgba(0,0,0,.25)',borderRadius:10,border:'1px solid rgba(255,255,255,.06)' }}>
                    {strength.rules.map(r => (
                      <div key={r.id} className="rule-row" style={{ color: r.ok ? '#4ade80' : 'rgba(255,255,255,.28)' }}>
                        <div style={{
                          width:15,height:15,borderRadius:'50%',flexShrink:0,
                          background: r.ok ? 'rgba(74,222,128,.12)' : 'rgba(255,255,255,.04)',
                          border:`1px solid ${r.ok ? 'rgba(74,222,128,.35)' : 'rgba(255,255,255,.08)'}`,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          transition:'all .25s'
                        }}>
                          {r.ok && <icons.Check />}
                        </div>
                        {r.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Confirm password ── */}
            <div>
              <label style={{ display:'block',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.35)',marginBottom:7,letterSpacing:'0.07em' }}>CONFIRMAR CONTRASEÑA</label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:ic('confirm'),transition:'color .2s',pointerEvents:'none' }}><icons.Lock /></div>
                <input
                  type={showPw.confirm ? 'text' : 'password'} className="ri"
                  value={form.confirm_password}
                  onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                  onFocus={() => setFocused('confirm')} onBlur={() => setFocused('')}
                  placeholder="••••••••" required
                  style={{ width:'100%',border:`1px solid ${confirmBorder}`,borderRadius:11,padding:'11px 44px 11px 44px',color:'#fff',fontSize:14,fontFamily:'inherit' }}
                />
                <button type="button" className="eye-btn"
                  onClick={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))}
                  style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,.3)' }}>
                  {showPw.confirm ? <icons.EyeOff /> : <icons.Eye />}
                </button>
              </div>
              {pwMatch === false && <p style={{ fontSize:11,color:'#f87171',marginTop:5,paddingLeft:2 }}>Las contraseñas no coinciden</p>}
              {pwMatch === true  && <p style={{ fontSize:11,color:'#4ade80',marginTop:5,paddingLeft:2 }}>✓ Las contraseñas coinciden</p>}
            </div>

            {/* ── Submit ── */}
            <button type="submit" disabled={loading} className="sbtn"
              style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',color:'#fff',border:'none',borderRadius:11,padding:'13px',fontSize:14,fontWeight:600,fontFamily:'inherit',marginTop:4,boxShadow:'0 4px 22px rgba(99,102,241,.4)' }}>
              {loading ? 'Creando cuenta...' : (<>Crear Cuenta <icons.Arrow /></>)}
            </button>
          </form>

          <p style={{ textAlign:'center',fontSize:13,color:'rgba(255,255,255,.28)',marginTop:22 }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="rlink" style={{ color:'#a5b4fc',textDecoration:'none',fontWeight:500 }}>Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}