import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function PublicarProducto() {
  const [form, setForm] = useState({ titulo: '', descripcion: '', precio: '', talla: 'M', imagen_url: '', id_categoria: '' });
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [imagenPrincipal, setImagenPrincipal] = useState('');
  const fileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => { api.get('/categorias').then(r => setCategorias(r.data)); }, []);

  const handleImagenes = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setSubiendo(true);
    const nuevas = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('imagen', file);
      try {
        const { data } = await api.post('/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        nuevas.push(data.url);
      } catch {
        setError('Error al subir una imagen');
      }
    }
    const todas = [...imagenes, ...nuevas];
    setImagenes(todas);
    if (!imagenPrincipal && todas.length > 0) {
      setImagenPrincipal(todas[0]);
      setForm(f => ({ ...f, imagen_url: todas[0] }));
    }
    setSubiendo(false);
  };

  const seleccionarPrincipal = (url) => {
    setImagenPrincipal(url);
    setForm(f => ({ ...f, imagen_url: url }));
  };

  const eliminarImagen = (url) => {
    const nuevas = imagenes.filter(i => i !== url);
    setImagenes(nuevas);
    if (imagenPrincipal === url) {
      const nueva = nuevas[0] || '';
      setImagenPrincipal(nueva);
      setForm(f => ({ ...f, imagen_url: nueva }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id_categoria) return setError('Selecciona una categoría');
    try {
      await api.post('/productos', form);
      setMensaje('✅ Producto publicado. Pendiente de aprobación.');
      setTimeout(() => navigate('/mis-productos'), 1500);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al publicar');
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px',
    background: '#fff', border: '1px solid #d4c5b2',
    borderRadius: '10px', color: '#2d2d2d',
    fontSize: '0.95rem', outline: 'none',
    fontFamily: 'Jost, sans-serif'
  };
  const labelStyle = { color: '#8a7f75', fontSize: '0.72rem', letterSpacing: '0.12em', display: 'block', marginBottom: '8px', fontWeight: 500 };

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', padding: '48px 24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        <p style={{ color: '#b09880', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '8px' }}>NUEVA PUBLICACIÓN</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '2.2rem', color: '#2d2d2d', fontWeight: 600, marginBottom: '32px' }}>
          Publicar producto
        </h1>

        {mensaje && <div style={{ background: '#f0faf0', border: '1px solid #c6e8c6', color: '#5a8a5a', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem' }}>{mensaje}</div>}
        {error && <div style={{ background: '#fdecea', border: '1px solid #f5c6c2', color: '#c9645a', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Gestor de imágenes */}
          <div>
            <label style={labelStyle}>FOTOS DEL PRODUCTO</label>

            {/* Zona de subida */}
            <div onClick={() => fileRef.current.click()}
              style={{
                border: '2px dashed #d4c5b2', borderRadius: '16px',
                padding: '32px', textAlign: 'center', cursor: 'pointer',
                background: '#fff', transition: 'all 0.2s', marginBottom: '16px'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#b09880'; e.currentTarget.style.background='#f5ede6'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#d4c5b2'; e.currentTarget.style.background='#fff'; }}>
              <input ref={fileRef} type="file" accept="image/*" multiple
                onChange={handleImagenes} style={{ display: 'none' }} />
              {subiendo ? (
                <p style={{ color: '#b09880', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.1rem' }}>Subiendo imágenes...</p>
              ) : (
                <>
                  <p style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📸</p>
                  <p style={{ color: '#6b5e52', fontWeight: 500, marginBottom: '4px', fontSize: '0.9rem' }}>Haz clic para subir fotos</p>
                  <p style={{ color: '#8a7f75', fontSize: '0.8rem' }}>JPG, PNG o WEBP · Máximo 5MB por imagen · Puedes subir varias</p>
                </>
              )}
            </div>

            {/* Galería de imágenes subidas */}
            {imagenes.length > 0 && (
              <div>
                <p style={{ color: '#8a7f75', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  SELECCIONA LA IMAGEN PRINCIPAL (toca una foto)
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                  {imagenes.map((url, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <div onClick={() => seleccionarPrincipal(url)}
                        style={{
                          height: '120px', borderRadius: '10px', overflow: 'hidden',
                          cursor: 'pointer', border: `3px solid ${imagenPrincipal === url ? '#b09880' : '#ede5d8'}`,
                          transition: 'border-color 0.2s'
                        }}>
                        <img src={url} alt={`img-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {imagenPrincipal === url && (
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(176,152,128,0.9)', padding: '4px', textAlign: 'center', fontSize: '0.65rem', color: '#fff', letterSpacing: '0.1em', fontWeight: 600 }}>
                            PRINCIPAL
                          </div>
                        )}
                      </div>
                      <button type="button" onClick={() => eliminarImagen(url)}
                        style={{
                          position: 'absolute', top: '-8px', right: '-8px',
                          background: '#c9645a', color: '#fff', border: 'none',
                          borderRadius: '50%', width: '22px', height: '22px',
                          fontSize: '0.7rem', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', fontWeight: 700
                        }}>✕</button>
                    </div>
                  ))}
                  {/* Botón agregar más */}
                  <div onClick={() => fileRef.current.click()}
                    style={{
                      height: '120px', borderRadius: '10px', border: '2px dashed #d4c5b2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', background: '#faf8f5', flexDirection: 'column', gap: '4px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='#b09880'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='#d4c5b2'}>
                    <span style={{ fontSize: '1.5rem', color: '#b09880' }}>+</span>
                    <span style={{ fontSize: '0.7rem', color: '#8a7f75' }}>Agregar</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resto del formulario */}
          <div>
            <label style={labelStyle}>TÍTULO</label>
            <input type="text" required style={inputStyle} value={form.titulo}
              onChange={e => setForm({...form, titulo: e.target.value})}
              onFocus={e => e.target.style.borderColor='#b09880'}
              onBlur={e => e.target.style.borderColor='#d4c5b2'} />
          </div>

          <div>
            <label style={labelStyle}>DESCRIPCIÓN</label>
            <textarea rows={3} style={{...inputStyle, resize: 'none'}} value={form.descripcion}
              onChange={e => setForm({...form, descripcion: e.target.value})}
              onFocus={e => e.target.style.borderColor='#b09880'}
              onBlur={e => e.target.style.borderColor='#d4c5b2'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>PRECIO (COP)</label>
              <input type="number" required min="0" style={inputStyle} value={form.precio}
                onChange={e => setForm({...form, precio: e.target.value})}
                onFocus={e => e.target.style.borderColor='#b09880'}
                onBlur={e => e.target.style.borderColor='#d4c5b2'} />
            </div>
            <div>
              <label style={labelStyle}>TALLA</label>
              <select style={{...inputStyle, cursor: 'pointer'}} value={form.talla}
                onChange={e => setForm({...form, talla: e.target.value})}>
                {['XS','S','M','L','XL','XXL'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>CATEGORÍA</label>
            <select required style={{...inputStyle, cursor: 'pointer'}} value={form.id_categoria}
              onChange={e => setForm({...form, id_categoria: e.target.value})}>
              <option value="">Seleccionar categoría</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
            </select>
          </div>

          <button type="submit" style={{
            background: '#2d2d2d', color: '#faf8f5', padding: '15px',
            borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600,
            letterSpacing: '0.15em', border: 'none', cursor: 'pointer',
            fontFamily: 'Jost, sans-serif', marginTop: '8px'
          }}
            onMouseEnter={e => e.target.style.background='#444'}
            onMouseLeave={e => e.target.style.background='#2d2d2d'}>
            PUBLICAR PRODUCTO
          </button>
        </form>
      </div>
    </div>
  );
}