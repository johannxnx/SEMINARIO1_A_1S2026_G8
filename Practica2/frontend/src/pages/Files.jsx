import { useState, useEffect } from 'react'
import api from '../services/api'
import Navbar from '../components/Navbar'

const UploadIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
const ImgIcon   = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
const TxtIcon   = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const FileIcon  = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const EyeIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const XIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const AlertIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const FolderIcon= () => <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>

const typeMap = {
  image: { Icon: ImgIcon, color: '#a78bfa', bg: 'rgba(167,139,250,.15)' },
  text:  { Icon: TxtIcon, color: '#818cf8', bg: 'rgba(129,140,248,.14)' },
}
const getT = (t) => typeMap[t] || { Icon: FileIcon, color: 'rgba(255,255,255,.4)', bg: 'rgba(255,255,255,.07)' }

const fmtSize = (b) => {
  if (!b) return '—'
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`
  return `${(b/1048576).toFixed(1)} MB`
}

const IS_AZURE = import.meta.env.VITE_CLOUD_PROVIDER === 'azure'

// ─── Sube el archivo al serverless (Lambda o Azure Function) ───────────────
async function uploadToServerless(file, base64) {
  const isImage = file.type.startsWith('image/')

  // Seleccionar URL según proveedor y tipo
  const uploadUrl = IS_AZURE
    ? (isImage
        ? import.meta.env.VITE_AZURE_UPLOAD_IMAGES
        : import.meta.env.VITE_AZURE_UPLOAD_DOCUMENTS)
    : (isImage
        ? import.meta.env.VITE_LAMBDA_UPLOAD_IMAGES
        : import.meta.env.VITE_LAMBDA_UPLOAD_DOCUMENTS)

  if (!uploadUrl) {
    throw new Error(
      `Variable de entorno no definida: ${IS_AZURE
        ? (isImage ? 'VITE_AZURE_UPLOAD_IMAGES' : 'VITE_AZURE_UPLOAD_DOCUMENTS')
        : (isImage ? 'VITE_LAMBDA_UPLOAD_IMAGES' : 'VITE_LAMBDA_UPLOAD_DOCUMENTS')}`
    )
  }

  // FIX PRINCIPAL: Azure Functions v3 requiere que el body sea string JSON
  // explícito y el Content-Type debe incluir charset=utf-8 para que el runtime
  // lo parsee correctamente como objeto en req.body.
  const payload = JSON.stringify({
    filename:    file.name,
    contentType: file.type,
    fileData:    base64,
  })

  const res = await fetch(uploadUrl, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: payload,
  })

  // Intentar leer el body siempre, incluso en error, para mostrar el mensaje real
  let data
  try {
    data = await res.json()
  } catch {
    throw new Error(`Respuesta no-JSON del serverless (status ${res.status})`)
  }

  if (!res.ok) {
    // data.error viene del catch de la Azure Function / Lambda
    throw new Error(`Error en serverless (${res.status}): ${data?.error || 'sin detalle'}`)
  }

  if (!data?.url) {
    throw new Error('El serverless respondió 200 pero no devolvió una URL')
  }

  return { url: data.url, isImage }
}

// ─── Guarda la referencia en la DB via backend ────────────────────────────
async function saveFileRecord(file, url, isImage) {
  const r = await api.post('/api/files/upload-url', {
    filename:  file.name,
    file_type: isImage ? 'image' : 'text',
    file_url:  url,
    file_size: file.size,
  })
  return r.data
}

export default function Files() {
  const [files, setFiles]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [preview, setPreview]     = useState(null)

  useEffect(() => { fetchFiles() }, [])

  const fetchFiles = async () => {
    try {
      // GET /api/files  — el 308 en Flask ya se resuelve con strict_slashes=False
      // en app.py; desde el frontend llamamos SIN trailing slash.
      const r = await api.get('/api/files')
      setFiles(r.data)
    } catch (err) {
      setError('Error al cargar archivos')
      console.error('[fetchFiles]', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      // 1. Convertir a base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload  = () => resolve(reader.result.split(',')[1])
        reader.onerror = () => reject(new Error('Error al leer el archivo'))
        reader.readAsDataURL(file)
      })

      // 2. Subir al serverless (Lambda / Azure Function)
      const { url, isImage } = await uploadToServerless(file, base64)

      // 3. Registrar en la DB via backend
      const newFile = await saveFileRecord(file, url, isImage)

      setFiles(prev => [newFile, ...prev])
    } catch (err) {
      console.error('[handleUpload]', err)
      setError(`Error al subir archivo: ${err.message}`)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este archivo?')) return
    try {
      await api.delete(`/api/files/${id}`)
      setFiles(prev => prev.filter(f => f.id !== id))
      if (preview?.id === id) setPreview(null)
    } catch {
      setError('Error al eliminar archivo')
    }
  }

  return (
    <div style={{ minHeight:'100vh',background:'#080810',fontFamily:'"DM Sans",system-ui,sans-serif',position:'relative',overflow:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Syne:wght@700;800&display=swap');
        * { box-sizing:border-box; }
        @keyframes b1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(70px,-50px) scale(1.18)}66%{transform:translate(-40px,60px) scale(0.9)}}
        @keyframes b2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-80px,40px) scale(1.12)}66%{transform:translate(55px,-70px) scale(0.94)}}
        @keyframes b3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(50px,80px) scale(1.14)}}
        .blob{position:fixed;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0}
        .b1{animation:b1 10s ease-in-out infinite}.b2{animation:b2 13s ease-in-out infinite}.b3{animation:b3 15s ease-in-out infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .fc{transition:border-color .2s,transform .15s,box-shadow .2s}
        .fc:hover{border-color:rgba(255,255,255,.15)!important;transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,0,0,.3)!important}
        .up-btn{transition:all .2s;cursor:pointer}
        .up-btn:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 10px 28px rgba(99,102,241,.45)!important}
        .vb{transition:all .15s;cursor:pointer}
        .vb:hover{background:rgba(99,102,241,.18)!important;border-color:rgba(129,140,248,.4)!important;color:#c4b5fd!important}
        .db{transition:all .15s;cursor:pointer}
        .db:hover{background:rgba(239,68,68,.1)!important;border-color:rgba(239,68,68,.3)!important;color:#f87171!important}
        .mcl{transition:color .15s;cursor:pointer}
        .mcl:hover{color:#fff!important}
      `}</style>

      {/* Mesh */}
      <div className="blob b1" style={{ width:560,height:560,background:'radial-gradient(circle,rgba(99,102,241,.36) 0%,transparent 70%)',top:'-140px',left:'-120px' }}/>
      <div className="blob b2" style={{ width:500,height:500,background:'radial-gradient(circle,rgba(168,85,247,.3) 0%,transparent 70%)',bottom:'-100px',right:'-100px' }}/>
      <div className="blob b3" style={{ width:360,height:360,background:'radial-gradient(circle,rgba(34,211,238,.11) 0%,transparent 70%)',top:'40%',right:'5%' }}/>

      <div style={{ position:'relative',zIndex:1 }}>
        <Navbar />
        <div style={{ maxWidth:960,margin:'0 auto',padding:'36px 20px' }}>

          {/* Header */}
          <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:28 }}>
            <div>
              <h2 style={{ fontFamily:'"Syne",sans-serif',fontSize:26,fontWeight:800,color:'#fff',marginBottom:6 }}>Mis Archivos</h2>
              <p style={{ fontSize:12,color:'rgba(255,255,255,.3)' }}>
                <span style={{ color:'#a78bfa',fontWeight:600 }}>{files.length}</span> archivo{files.length!==1?'s':''} almacenado{files.length!==1?'s':''}
              </p>
            </div>
            <label
              className="up-btn"
              style={{ display:'flex',alignItems:'center',gap:7,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',borderRadius:10,padding:'10px 16px',fontSize:13,fontWeight:600,cursor:uploading?'not-allowed':'pointer',opacity:uploading?0.7:1,boxShadow:'0 4px 18px rgba(99,102,241,.35)' }}
            >
              <UploadIcon /> {uploading ? 'Subiendo…' : 'Subir Archivo'}
              <input
                type="file"
                onChange={handleUpload}
                disabled={uploading}
                style={{ display:'none' }}
                accept="image/*,text/*,.pdf,.doc,.docx"
              />
            </label>
          </div>

          {error && (
            <div style={{ display:'flex',alignItems:'center',gap:8,background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.25)',color:'#fca5a5',fontSize:13,borderRadius:10,padding:'10px 14px',marginBottom:20 }}>
              <AlertIcon /> {error}
            </div>
          )}

          {/* Modal preview */}
          {preview && (
            <div
              onClick={() => setPreview(null)}
              style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.88)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:24,backdropFilter:'blur(6px)' }}
            >
              <div
                onClick={e => e.stopPropagation()}
                style={{ background:'rgba(12,12,22,.95)',border:'1px solid rgba(255,255,255,.1)',borderRadius:20,padding:24,maxWidth:720,width:'100%',maxHeight:'80vh',overflow:'auto' }}
              >
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    <span style={{ color:getT(preview.file_type).color }}>
                      {(() => { const Icon = getT(preview.file_type).Icon; return <Icon /> })()}
                    </span>
                    <span style={{ color:'#fff',fontSize:14,fontWeight:500 }}>{preview.filename}</span>
                  </div>
                  <button onClick={() => setPreview(null)} className="mcl" style={{ background:'none',border:'none',color:'rgba(255,255,255,.4)',display:'flex',alignItems:'center',cursor:'pointer' }}>
                    <XIcon />
                  </button>
                </div>
                {preview.file_type === 'image'
                  ? <img src={preview.file_url} alt={preview.filename} style={{ maxWidth:'100%',borderRadius:10 }}/>
                  : <iframe src={preview.file_url} style={{ width:'100%',height:380,borderRadius:10,background:'#fff',border:'none' }} title={preview.filename}/>
                }
              </div>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div style={{ display:'flex',justifyContent:'center',padding:'60px 0' }}>
              <div style={{ width:32,height:32,borderRadius:'50%',border:'2.5px solid rgba(167,139,250,.2)',borderTopColor:'#a78bfa',animation:'spin .8s linear infinite' }}/>
            </div>
          ) : files.length === 0 ? (
            <div style={{ textAlign:'center',padding:'64px 0' }}>
              <div style={{ display:'flex',justifyContent:'center',marginBottom:14,color:'rgba(255,255,255,.15)' }}><FolderIcon /></div>
              <p style={{ color:'rgba(255,255,255,.3)',fontSize:14 }}>No tienes archivos aún. ¡Sube uno!</p>
            </div>
          ) : (
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:14 }}>
              {files.map(file => {
                const { Icon, color, bg } = getT(file.file_type)
                return (
                  <div key={file.id} className="fc" style={{ background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:14,padding:18,display:'flex',flexDirection:'column',backdropFilter:'blur(14px)',WebkitBackdropFilter:'blur(14px)' }}>
                    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14 }}>
                      <div style={{ width:42,height:42,borderRadius:10,background:bg,display:'flex',alignItems:'center',justifyContent:'center',color }}><Icon /></div>
                      <button onClick={() => handleDelete(file.id)} className="db"
                        style={{ background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:7,padding:6,color:'rgba(255,255,255,.35)',display:'flex',alignItems:'center',cursor:'pointer' }}>
                        <TrashIcon />
                      </button>
                    </div>
                    <p style={{ color:'#fff',fontSize:13,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginBottom:4 }}>{file.filename}</p>
                    <p style={{ color:'rgba(255,255,255,.3)',fontSize:11,marginBottom:14,textTransform:'capitalize' }}>{file.file_type} · {fmtSize(file.file_size)}</p>
                    <button onClick={() => setPreview(file)} className="vb"
                      style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:'rgba(99,102,241,.1)',border:'1px solid rgba(99,102,241,.25)',borderRadius:8,padding:'8px',color:'#a5b4fc',fontSize:12,fontWeight:500,fontFamily:'inherit',marginTop:'auto',cursor:'pointer' }}>
                      <EyeIcon /> Ver archivo
                    </button>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}