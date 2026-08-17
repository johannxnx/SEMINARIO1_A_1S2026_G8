import { useState, useEffect } from 'react'
import api from '../services/api'
import Navbar from '../components/Navbar'

const PlusIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const CheckIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const EditIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const AlertIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const CalIcon   = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const XIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const BoardIcon = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>

export default function Tasks() {
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [form, setForm]       = useState({ title: '', description: '' })
  const [error, setError]     = useState('')

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try { const r = await api.get('/api/tasks'); setTasks(r.data) }
    catch { setError('Error al cargar tareas') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editTask) {
        const r = await api.put(`/api/tasks/${editTask.id}`, form)
        setTasks(tasks.map(t => t.id === editTask.id ? r.data : t))
      } else {
        const r = await api.post('/api/tasks', form)
        setTasks([r.data, ...tasks])
      }
      setForm({ title: '', description: '' }); setShowForm(false); setEditTask(null)
    } catch { setError('Error al guardar tarea') }
  }

  const handleComplete = async (task) => {
    try {
      const r = await api.patch(`/api/tasks/${task.id}/complete`)
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: r.data.completed } : t))
    } catch { setError('Error al actualizar tarea') }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta tarea?')) return
    try { await api.delete(`/api/tasks/${id}`); setTasks(tasks.filter(t => t.id !== id)) }
    catch { setError('Error al eliminar tarea') }
  }

  const handleEdit = (task) => {
    setEditTask(task); setForm({ title: task.title, description: task.description || '' }); setShowForm(true)
  }

  const pending = tasks.filter(t => !t.completed).length
  const done    = tasks.filter(t =>  t.completed).length

  return (
    <div style={{ minHeight:'100vh', background:'#080810', fontFamily:'"DM Sans",system-ui,sans-serif', position:'relative', overflow:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Syne:wght@700;800&display=swap');
        * { box-sizing:border-box; }
        @keyframes b1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(70px,-50px) scale(1.18)}66%{transform:translate(-40px,60px) scale(0.9)}}
        @keyframes b2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-80px,40px) scale(1.12)}66%{transform:translate(55px,-70px) scale(0.94)}}
        @keyframes b3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(50px,80px) scale(1.14)}}
        .blob{position:fixed;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0}
        .b1{animation:b1 10s ease-in-out infinite}.b2{animation:b2 13s ease-in-out infinite}.b3{animation:b3 15s ease-in-out infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .task-card{transition:border-color .2s,transform .15s}
        .task-card:hover{border-color:rgba(255,255,255,.14)!important;transform:translateY(-1px)}
        .ic-btn{transition:all .15s;cursor:pointer}
        .edit-b:hover{color:#818cf8!important;background:rgba(99,102,241,.12)!important}
        .del-b:hover{color:#f87171!important;background:rgba(239,68,68,.1)!important}
        .check-r{transition:background .2s,border-color .2s,transform .15s;cursor:pointer}
        .check-r:hover{border-color:#818cf8!important;transform:scale(1.1)}
        .new-btn{transition:all .2s;cursor:pointer}
        .new-btn:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 10px 28px rgba(99,102,241,.45)!important}
        .ti{transition:border-color .2s,box-shadow .2s;background:rgba(255,255,255,.05)!important}
        .ti:focus{outline:none;border-color:#818cf8!important;box-shadow:0 0 0 3px rgba(129,140,248,.15)}
        .save-b{transition:all .15s;cursor:pointer}.save-b:hover{filter:brightness(1.1)}
        .cancel-b{transition:all .15s;cursor:pointer}.cancel-b:hover{background:rgba(255,255,255,.07)!important}
      `}</style>

      {/* Mesh */}
      <div className="blob b1" style={{ width:560,height:560,background:'radial-gradient(circle,rgba(99,102,241,.38) 0%,transparent 70%)',top:'-140px',left:'-120px' }}/>
      <div className="blob b2" style={{ width:500,height:500,background:'radial-gradient(circle,rgba(168,85,247,.32) 0%,transparent 70%)',bottom:'-100px',right:'-100px' }}/>
      <div className="blob b3" style={{ width:360,height:360,background:'radial-gradient(circle,rgba(34,211,238,.12) 0%,transparent 70%)',top:'40%',right:'5%' }}/>

      <div style={{ position:'relative',zIndex:1 }}>
        <Navbar />
        <div style={{ maxWidth:680,margin:'0 auto',padding:'36px 20px' }}>

          {/* Header */}
          <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:28 }}>
            <div>
              <h2 style={{ fontFamily:'"Syne",sans-serif',fontSize:26,fontWeight:800,color:'#fff',marginBottom:6 }}>Mis Tareas</h2>
              <div style={{ display:'flex',gap:16 }}>
                <span style={{ fontSize:12,color:'rgba(255,255,255,.3)' }}><span style={{ color:'#818cf8',fontWeight:600 }}>{pending}</span> pendientes</span>
                <span style={{ fontSize:12,color:'rgba(255,255,255,.3)' }}><span style={{ color:'#4ade80',fontWeight:600 }}>{done}</span> completadas</span>
              </div>
            </div>
            <button onClick={() => { setShowForm(!showForm); setEditTask(null); setForm({ title:'',description:'' }) }} className="new-btn"
              style={{ display:'flex',alignItems:'center',gap:6,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:10,padding:'10px 16px',fontSize:13,fontWeight:600,fontFamily:'inherit',boxShadow:'0 4px 18px rgba(99,102,241,.35)' }}>
              <PlusIcon /> Nueva Tarea
            </button>
          </div>

          {error && (
            <div style={{ display:'flex',alignItems:'center',gap:8,background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',color:'#fca5a5',fontSize:13,borderRadius:10,padding:'10px 14px',marginBottom:20 }}>
              <AlertIcon /> {error}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div style={{ background:'rgba(255,255,255,.06)',border:'1px solid rgba(129,140,248,.3)',borderRadius:16,padding:22,marginBottom:20,backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)' }}>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
                <h3 style={{ fontSize:14,fontWeight:600,color:'#fff' }}>{editTask ? 'Editar tarea' : 'Nueva tarea'}</h3>
                <button onClick={() => { setShowForm(false); setEditTask(null); setForm({ title:'',description:'' }) }}
                  style={{ background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',display:'flex',alignItems:'center' }}><XIcon /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:12 }}>
                <input type="text" className="ti" value={form.title} onChange={e => setForm({ ...form,title:e.target.value })} placeholder="Título de la tarea" required
                  style={{ width:'100%',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:'11px 14px',color:'#fff',fontSize:14,fontFamily:'inherit' }}/>
                <textarea className="ti" value={form.description} onChange={e => setForm({ ...form,description:e.target.value })} placeholder="Descripción (opcional)" rows={3}
                  style={{ width:'100%',border:'1px solid rgba(255,255,255,.1)',borderRadius:10,padding:'11px 14px',color:'#fff',fontSize:14,fontFamily:'inherit',resize:'none' }}/>
                <div style={{ display:'flex',gap:8 }}>
                  <button type="submit" className="save-b"
                    style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:8,padding:'9px 18px',fontSize:13,fontWeight:600,fontFamily:'inherit' }}>
                    {editTask ? 'Guardar cambios' : 'Crear tarea'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditTask(null); setForm({ title:'',description:'' }) }} className="cancel-b"
                    style={{ background:'rgba(255,255,255,.05)',color:'rgba(255,255,255,.5)',border:'1px solid rgba(255,255,255,.08)',borderRadius:8,padding:'9px 16px',fontSize:13,fontFamily:'inherit' }}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div style={{ display:'flex',justifyContent:'center',padding:'60px 0' }}>
              <div style={{ width:32,height:32,borderRadius:'50%',border:'2.5px solid rgba(99,102,241,.2)',borderTopColor:'#818cf8',animation:'spin .8s linear infinite' }}/>
            </div>
          ) : tasks.length === 0 ? (
            <div style={{ textAlign:'center',padding:'64px 0' }}>
              <div style={{ display:'flex',justifyContent:'center',marginBottom:14,color:'rgba(255,255,255,.15)' }}><BoardIcon /></div>
              <p style={{ color:'rgba(255,255,255,.3)',fontSize:14 }}>No tienes tareas aún. ¡Crea una!</p>
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {tasks.map(task => (
                <div key={task.id} className="task-card" style={{
                  background: task.completed ? 'rgba(255,255,255,.02)' : 'rgba(255,255,255,.04)',
                  border:`1px solid ${task.completed ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.09)'}`,
                  borderRadius:13, padding:'16px 18px',
                  opacity: task.completed ? 0.55 : 1,
                  backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)'
                }}>
                  <div style={{ display:'flex',alignItems:'flex-start',gap:14 }}>
                    <button onClick={() => handleComplete(task)} className="check-r"
                      style={{ flexShrink:0,marginTop:2,width:20,height:20,borderRadius:'50%',border:task.completed?'none':'2px solid rgba(255,255,255,.2)',background:task.completed?'#22c55e':'transparent',display:'flex',alignItems:'center',justifyContent:'center',padding:0 }}>
                      {task.completed && <CheckIcon />}
                    </button>
                    <div style={{ flex:1,minWidth:0 }}>
                      <p style={{ fontSize:14,fontWeight:500,color:task.completed?'rgba(255,255,255,.35)':'#fff',textDecoration:task.completed?'line-through':'none',marginBottom:task.description?4:0 }}>{task.title}</p>
                      {task.description && <p style={{ fontSize:13,color:'rgba(255,255,255,.4)',lineHeight:1.5 }}>{task.description}</p>}
                      <div style={{ display:'flex',alignItems:'center',gap:5,marginTop:8,color:'rgba(255,255,255,.25)' }}>
                        <CalIcon /><span style={{ fontSize:11 }}>{new Date(task.created_at).toLocaleDateString('es-GT')}</span>
                      </div>
                    </div>
                    <div style={{ display:'flex',gap:4,flexShrink:0 }}>
                      {['edit','del'].map(t => (
                        <button key={t} onClick={() => t==='edit'?handleEdit(task):handleDelete(task.id)}
                          className={`ic-btn ${t}-b`}
                          style={{ background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.07)',borderRadius:7,padding:'6px',color:'rgba(255,255,255,.35)',display:'flex',alignItems:'center' }}>
                          {t==='edit' ? <EditIcon /> : <TrashIcon />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}