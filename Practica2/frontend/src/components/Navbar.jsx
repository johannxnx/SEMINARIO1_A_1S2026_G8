import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TasksIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
const FilesIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
const LogoutIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>

const LogoMark = () => (
  <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="9" fill="url(#nvg)"/>
    <path d="M11 19l6 6 11-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs><linearGradient id="nvg" x1="0" y1="0" x2="38" y2="38"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#a855f7"/></linearGradient></defs>
  </svg>
)

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }
  const is = (p) => location.pathname === p

  return (
    <nav style={{
      background: 'rgba(8,8,16,0.7)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      fontFamily: '"DM Sans",system-ui,sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Syne:wght@700;800&display=swap');
        .nl{text-decoration:none;transition:color .15s,background .15s,border-color .15s}
        .nl:hover{color:#fff!important;background:rgba(255,255,255,.06)!important}
        .lo-btn{transition:all .15s;cursor:pointer}
        .lo-btn:hover{color:#f87171!important;background:rgba(239,68,68,.1)!important;border-color:rgba(239,68,68,.25)!important}
      `}</style>
      <div style={{ maxWidth:960,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between' }}>

        {/* Logo */}
        <div style={{ display:'flex',alignItems:'center',gap:9 }}>
          <LogoMark />
          <span style={{ fontFamily:'"Syne",sans-serif',fontSize:15,fontWeight:800,color:'#fff',letterSpacing:'-0.3px' }}>
            TaskFlow<span style={{ color:'#818cf8' }}>+</span>CloudDrive
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display:'flex',alignItems:'center',gap:3 }}>
          {[
            { to:'/tasks', label:'Tareas',   Icon:TasksIcon,  ac:'#818cf8', abg:'rgba(99,102,241,.12)',  ab:'rgba(99,102,241,.25)' },
            { to:'/files', label:'Archivos', Icon:FilesIcon,  ac:'#c4b5fd', abg:'rgba(168,85,247,.12)',  ab:'rgba(168,85,247,.25)' },
          ].map(({ to, label, Icon, ac, abg, ab }) => (
            <Link key={to} to={to} className="nl" style={{
              display:'flex',alignItems:'center',gap:7,
              fontSize:13,fontWeight:500,
              color: is(to) ? ac : 'rgba(255,255,255,.45)',
              background: is(to) ? abg : 'transparent',
              border: `1px solid ${is(to) ? ab : 'transparent'}`,
              borderRadius:8, padding:'6px 12px',
            }}>
              <Icon />{label}
            </Link>
          ))}
        </div>

        {/* User */}
        <div style={{ display:'flex',alignItems:'center',gap:10,paddingLeft:16,borderLeft:'1px solid rgba(255,255,255,.08)' }}>
          {user?.profile_pic
            ? <img src={user.profile_pic} alt="perfil" style={{ width:28,height:28,borderRadius:'50%',objectFit:'cover',border:'1.5px solid rgba(129,140,248,.4)' }}/>
            : <div style={{ width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',flexShrink:0 }}>
                {user?.username?.[0]?.toUpperCase()}
              </div>
          }
          <span style={{ fontSize:13,color:'rgba(255,255,255,.7)',fontWeight:500 }}>{user?.username}</span>
          <button onClick={handleLogout} className="lo-btn"
            style={{ display:'flex',alignItems:'center',gap:5,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',borderRadius:7,padding:'5px 10px',fontSize:12,color:'rgba(255,255,255,.4)',fontFamily:'inherit' }}>
            <LogoutIcon /> Salir
          </button>
        </div>
      </div>
    </nav>
  )
}