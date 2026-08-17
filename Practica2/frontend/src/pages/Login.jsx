import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Icons ─────────────────────────────────────────────────────────────────────
const UserIcon  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const LockIcon  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const ArrowIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
const AlertIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const EyeIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOffIcon= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
const CheckIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>

const LogoMark = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="11" fill="url(#lmg)"/>
    <path d="M11 19l6 6 11-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="lmg" x1="0" y1="0" x2="38" y2="38">
        <stop stopColor="#6366f1"/><stop offset="1" stopColor="#a855f7"/>
      </linearGradient>
    </defs>
  </svg>
)

// ── Loading overlay ───────────────────────────────────────────────────────────
function LoadingOverlay({ phase }) {
  // phase: 'verifying' | 'success' | null
  if (!phase) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(8,8,16,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      animation: 'overlayIn .2s ease forwards',
    }}>
      <style>{`
        @keyframes overlayIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes spinRing   { to   { transform: rotate(360deg) } }
        @keyframes scaleIn    { from { transform: scale(0.5); opacity:0 } to { transform: scale(1); opacity:1 } }
        @keyframes drawCheck  { from { stroke-dashoffset: 40 } to { stroke-dashoffset: 0 } }
        @keyframes pulseRing  {
          0%   { transform: scale(1);   opacity:.6 }
          100% { transform: scale(1.9); opacity:0 }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(10px) }
          to   { opacity:1; transform:translateY(0) }
        }
      `}</style>

      {phase === 'verifying' && (
        <>
          {/* Spinner */}
          <div style={{ position:'relative', width:64, height:64, marginBottom:24 }}>
            <div style={{
              position:'absolute', inset:0, borderRadius:'50%',
              border:'2.5px solid rgba(129,140,248,.15)',
              borderTopColor:'#818cf8',
              animation:'spinRing .75s linear infinite'
            }}/>
            <div style={{ position:'absolute', inset:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <LogoMark size={30}/>
            </div>
          </div>
          <p style={{ color:'rgba(255,255,255,.7)', fontSize:14, fontWeight:500, animation:'slideUp .3s ease forwards', fontFamily:'"DM Sans",system-ui,sans-serif' }}>
            Verificando credenciales...
          </p>
          <p style={{ color:'rgba(255,255,255,.28)', fontSize:12, marginTop:6, animation:'slideUp .3s .1s ease both', fontFamily:'"DM Sans",system-ui,sans-serif' }}>
            Un momento por favor
          </p>
        </>
      )}

      {phase === 'success' && (
        <>
          {/* Success circle with pulse */}
          <div style={{ position:'relative', width:72, height:72, marginBottom:24, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{
              position:'absolute', inset:0, borderRadius:'50%',
              background:'rgba(74,222,128,.12)',
              animation:'pulseRing .6s ease-out forwards'
            }}/>
            <div style={{
              width:64, height:64, borderRadius:'50%',
              background:'linear-gradient(135deg,rgba(74,222,128,.2),rgba(34,197,94,.15))',
              border:'2px solid rgba(74,222,128,.4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#4ade80',
              animation:'scaleIn .35s cubic-bezier(.16,1,.3,1) forwards'
            }}>
              <CheckIcon />
            </div>
          </div>
          <p style={{ color:'#4ade80', fontSize:14, fontWeight:600, animation:'slideUp .3s ease forwards', fontFamily:'"DM Sans",system-ui,sans-serif' }}>
            ¡Sesión iniciada!
          </p>
          <p style={{ color:'rgba(255,255,255,.35)', fontSize:12, marginTop:6, animation:'slideUp .3s .1s ease both', fontFamily:'"DM Sans",system-ui,sans-serif' }}>
            Redirigiendo a tus tareas...
          </p>
        </>
      )}
    </div>
  )
}

// ── Login ─────────────────────────────────────────────────────────────────────
export default function Login() {
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [phase, setPhase]   = useState(null) // 'verifying' | 'success' | null
  const { login }           = useAuth()
  const navigate            = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setPhase('verifying')

    try {
      await login(form.username, form.password)
      // Show success screen briefly before redirecting
      setPhase('success')
      setTimeout(() => navigate('/tasks'), 1200)
    } catch (err) {
      setPhase(null)
      setError(err.response?.data?.error || 'Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: '"DM Sans",system-ui,sans-serif',
      position: 'relative', overflow: 'hidden', background: '#080810',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Syne:wght@700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }

        @keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(70px,-50px) scale(1.18)}66%{transform:translate(-40px,60px) scale(0.9)}}
        @keyframes blob2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-80px,40px) scale(1.12)}66%{transform:translate(55px,-70px) scale(0.94)}}
        @keyframes blob3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(50px,80px) scale(1.14)}}
        @keyframes blob4{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-55px,-35px) scale(1.1)}80%{transform:translate(35px,45px) scale(0.88)}}
        .blob{position:fixed;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0}
        .b1{animation:blob1 10s ease-in-out infinite}
        .b2{animation:blob2 13s ease-in-out infinite}
        .b3{animation:blob3 15s ease-in-out infinite}
        .b4{animation:blob4  9s ease-in-out infinite}

        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .card{animation:fadeUp .55s cubic-bezier(.16,1,.3,1) forwards}

        .li{transition:border-color .2s,box-shadow .2s;background:rgba(255,255,255,.05)!important}
        .li:focus{outline:none;border-color:#818cf8!important;box-shadow:0 0 0 3px rgba(129,140,248,.18)}

        .sbtn{transition:all .2s;cursor:pointer}
        .sbtn:hover:not(:disabled){filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 12px 32px rgba(99,102,241,.5)!important}
        .sbtn:disabled{opacity:.55;cursor:not-allowed}

        .rlink{transition:color .15s}.rlink:hover{color:#c4b5fd!important}

        .eye-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;padding:3px;transition:color .15s}
        .eye-btn:hover{color:#818cf8!important}

        @keyframes shakeX{
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-5px)}
          80%{transform:translateX(5px)}
        }
        .shake{animation:shakeX .4s ease}
      `}</style>

      {/* Loading overlay */}
      <LoadingOverlay phase={phase} />

      {/* Mesh blobs */}
      <div className="blob b1" style={{ width:560,height:560,background:'radial-gradient(circle,rgba(99,102,241,.5) 0%,transparent 70%)',top:'-140px',left:'-120px' }}/>
      <div className="blob b2" style={{ width:500,height:500,background:'radial-gradient(circle,rgba(168,85,247,.42) 0%,transparent 70%)',bottom:'-100px',right:'-100px' }}/>
      <div className="blob b3" style={{ width:360,height:360,background:'radial-gradient(circle,rgba(34,211,238,.18) 0%,transparent 70%)',top:'35%',right:'8%' }}/>
      <div className="blob b4" style={{ width:320,height:320,background:'radial-gradient(circle,rgba(251,113,133,.16) 0%,transparent 70%)',bottom:'12%',left:'4%' }}/>

      {/* Card */}
      <div className="card" style={{ width:'100%',maxWidth:420,position:'relative',zIndex:2 }}>

        {/* Logo */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginBottom:34 }}>
          <LogoMark size={38}/>
          <div>
            <div style={{ fontFamily:'"Syne",sans-serif',fontSize:21,fontWeight:800,color:'#fff',letterSpacing:'-0.4px',lineHeight:1 }}>
              TaskFlow<span style={{color:'#818cf8'}}>+</span>CloudDrive
            </div>
            <div style={{ fontSize:10,color:'rgba(255,255,255,.22)',letterSpacing:'0.08em',marginTop:3 }}>
              SEMINARIO DE SISTEMAS 1 · GRUPO 8
            </div>
          </div>
        </div>

        {/* Glass card */}
        <div style={{
          background:'rgba(255,255,255,.055)', border:'1px solid rgba(255,255,255,.11)',
          borderRadius:22, padding:'36px 32px',
          backdropFilter:'blur(32px)', WebkitBackdropFilter:'blur(32px)',
          boxShadow:'0 0 0 1px rgba(255,255,255,.04) inset,0 32px 80px rgba(0,0,0,.5)',
        }}>
          <h2 style={{ fontFamily:'"Syne",sans-serif',fontSize:22,fontWeight:800,color:'#fff',marginBottom:5,letterSpacing:'-0.3px' }}>
            Bienvenido de vuelta
          </h2>
          <p style={{ fontSize:13,color:'rgba(255,255,255,.32)',marginBottom:28 }}>
            Ingresa tus credenciales para continuar
          </p>

          {/* Error */}
          {error && (
            <div className="shake" style={{
              display:'flex',alignItems:'center',gap:8,
              background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.28)',
              color:'#fca5a5',fontSize:13,borderRadius:10,padding:'10px 14px',marginBottom:20
            }}>
              <AlertIcon /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:18 }}>

            {/* Usuario */}
            <div>
              <label style={{ display:'block',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.35)',marginBottom:8,letterSpacing:'0.07em' }}>USUARIO</label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:focused==='u'?'#818cf8':'rgba(255,255,255,.22)',transition:'color .2s',pointerEvents:'none' }}>
                  <UserIcon />
                </div>
                <input type="text" className="li" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  onFocus={() => setFocused('u')} onBlur={() => setFocused('')}
                  placeholder="tu_usuario" required
                  style={{ width:'100%',border:'1px solid rgba(255,255,255,.1)',borderRadius:11,padding:'12px 14px 12px 44px',color:'#fff',fontSize:14,fontFamily:'inherit' }}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label style={{ display:'block',fontSize:11,fontWeight:600,color:'rgba(255,255,255,.35)',marginBottom:8,letterSpacing:'0.07em' }}>CONTRASEÑA</label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:focused==='p'?'#818cf8':'rgba(255,255,255,.22)',transition:'color .2s',pointerEvents:'none' }}>
                  <LockIcon />
                </div>
                <input
                  type={showPw ? 'text' : 'password'} className="li"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocused('p')} onBlur={() => setFocused('')}
                  placeholder="••••••••" required
                  style={{ width:'100%',border:'1px solid rgba(255,255,255,.1)',borderRadius:11,padding:'12px 44px 12px 44px',color:'#fff',fontSize:14,fontFamily:'inherit' }}
                />
                <button type="button" className="eye-btn"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,.3)' }}>
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="sbtn"
              style={{
                display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                background:'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',
                color:'#fff',border:'none',borderRadius:11,padding:'13px',
                fontSize:14,fontWeight:600,fontFamily:'inherit',marginTop:4,
                boxShadow:'0 4px 22px rgba(99,102,241,.4)',
              }}>
              Iniciar Sesión <ArrowIcon />
            </button>
          </form>

          <p style={{ textAlign:'center',fontSize:13,color:'rgba(255,255,255,.28)',marginTop:24 }}>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="rlink" style={{ color:'#a5b4fc',textDecoration:'none',fontWeight:500 }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}