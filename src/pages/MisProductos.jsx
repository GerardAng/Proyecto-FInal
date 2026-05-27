import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function MisProductos() {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const cargar = () => api.get('/productos/mis-productos').then(r => setProductos(r.data));
  useEffect(() => { cargar(); }, []);

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/productos/${id}`);
      setMensaje('Producto eliminado');
      cargar();
    } catch (err) {
      setMensaje(err.response?.data?.mensaje || 'Error');
    }
  };

  const estadoColor = {
    disponible: { bg: '#f5ede6', color: '#b09880', border: '#d4c5b2' },
    vendido:    { bg: 'rgba(255,255,255,0.05)', color: '#666', border: '#2a2a2a' },
    pausado:    { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', padding: '48px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <p style={{ color: '#b09880', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '8px' }}>MI TIENDA</p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '2.2rem', color: '#2d2d2d', fontWeight: 600 }}>Mis productos</h1>
          </div>
+<Link to="/publicar" style={{
  background: 'transparent', color: '#8a7f75',
  padding: '7px 16px', borderRadius: '999px',
  fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em',
  textDecoration: 'none', border: '1px solid #d4c5b2',
  transition: 'border-color 0.2s, color 0.2s, background 0.2s'
}}
  onMouseEnter={e => { e.target.style.borderColor='#4ade80'; e.target.style.color='#16a34a'; e.target.style.background='rgba(74,222,128,0.08)'; }}
  onMouseLeave={e => { e.target.style.borderColor='#d4c5b2'; e.target.style.color='#8a7f75'; e.target.style.background='transparent'; }}
>+ PUBLICAR PRODUCTO</Link>
        </div>

        {mensaje && (
          <div style={{ background: '#f5ede6', border: '1px solid rgba(74,222,128,0.3)', color: '#b09880', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.85rem' }}>
            {mensaje}
          </div>
        )}

        {productos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px dashed #222', borderRadius: '20px' }}>
            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>👗</p>
            <p style={{ color: '#8a7f75', marginBottom: '24px' }}>Aún no tienes productos publicados</p>
            <Link to="/publicar" style={{ color: '#b09880', fontSize: '0.85rem', textDecoration: 'none' }}>Publica tu primer producto →</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {productos.map(p => {
              const ec = estadoColor[p.estado_producto] || estadoColor.pausado;
              return (
                <div key={p.id} style={{ background: '#fff', border: '1px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='#333'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='#ede5d8'}>
                  <div style={{ height: '200px', background: '#f5ede6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {p.imagen_url
                      ? <img src={p.imagen_url} alt={p.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '4rem' }}>👕</span>}
                    <span style={{
                      position: 'absolute', top: '12px', right: '12px',
                      padding: '4px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600,
                      background: ec.bg, color: ec.color, border: `1px solid ${ec.border}`
                    }}>{p.estado_producto}</span>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <p style={{ color: '#b09880', fontSize: '0.65rem', letterSpacing: '0.15em', marginBottom: '4px' }}>{p.categoria_nombre?.toUpperCase()}</p>
                    <h3 style={{ color: '#2d2d2d', fontWeight: 600, marginBottom: '4px' }}>{p.titulo}</h3>
                    <p style={{ color: '#b09880', fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px' }}>${Number(p.precio).toLocaleString('es-CO')}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#8a7f75', fontSize: '0.75rem' }}>
                        {p.aprobado ? '✅ Aprobado' : '⏳ Pendiente'}
                      </span>
                      <button onClick={() => eliminar(p.id)} style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        color: '#f87171', padding: '6px 14px', borderRadius: '999px',
                        fontSize: '0.75rem', cursor: 'pointer'
                      }}>Eliminar</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}