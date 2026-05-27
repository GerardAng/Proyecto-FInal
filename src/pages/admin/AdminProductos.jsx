import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);

  const cargar = () => api.get('/productos/admin/todos').then(r => setProductos(r.data));
  useEffect(() => { cargar(); }, []);

  const aprobar = async (id) => { await api.patch(`/productos/${id}/aprobar`); cargar(); };
  const eliminar = async (id) => {
    if (!confirm('¿Eliminar producto?')) return;
    await api.delete(`/productos/${id}`); cargar();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', padding: '48px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ color: '#b09880', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '8px' }}>ADMINISTRACIÓN</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '2.2rem', color: '#2d2d2d', fontWeight: 600, marginBottom: '8px' }}>Gestión de productos</h1>
        <p style={{ color: '#8a7f75', fontSize: '0.9rem', marginBottom: '32px' }}>{productos.length} productos en total</p>

        <div style={{ background: '#fff', border: '1px solid #1e1e1e', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr', padding: '16px 24px', borderBottom: '1px solid #1e1e1e' }}>
            {['PRODUCTO', 'VENDEDOR', 'PRECIO', 'ESTADO', 'APROBADO', 'ACCIONES'].map(h => (
              <span key={h} style={{ color: '#444', fontSize: '0.7rem', letterSpacing: '0.15em', fontWeight: 600 }}>{h}</span>
            ))}
          </div>

          {productos.map((p, i) => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr',
              padding: '16px 24px', alignItems: 'center',
              borderBottom: i < productos.length - 1 ? '1px solid #161616' : 'none',
              transition: 'background 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.background='#f5ede6'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: '#1a1a1a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                  {p.imagen_url
                    ? <img src={p.imagen_url} alt={p.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '1.2rem' }}>👕</span>}
                </div>
                <div>
                  <p style={{ color: '#2d2d2d', fontSize: '0.85rem', fontWeight: 600 }}>{p.titulo}</p>
                  <p style={{ color: '#8a7f75', fontSize: '0.75rem' }}>{p.categoria_nombre}</p>
                </div>
              </div>

              <span style={{ color: '#666', fontSize: '0.85rem' }}>{p.vendedor_nombre}</span>
              <span style={{ color: '#b09880', fontWeight: 700, fontSize: '0.9rem' }}>${Number(p.precio).toLocaleString('es-CO')}</span>

              <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, width: 'fit-content',
                background: p.estado_producto === 'disponible' ? '#f5ede6' : 'rgba(255,255,255,0.05)',
                color: p.estado_producto === 'disponible' ? '#4ade80' : '#555',
                border: `1px solid ${p.estado_producto === 'disponible' ? '#d4c5b2' : '#2a2a2a'}` }}>
                {p.estado_producto}
              </span>

              <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, width: 'fit-content',
                background: p.aprobado ? '#f5ede6' : 'rgba(251,191,36,0.1)',
                color: p.aprobado ? '#4ade80' : '#fbbf24',
                border: `1px solid ${p.aprobado ? '#d4c5b2' : 'rgba(251,191,36,0.3)'}` }}>
                {p.aprobado ? 'Aprobado' : 'Pendiente'}
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                {!p.aprobado && (
                  <button onClick={() => aprobar(p.id)} style={{
                    background: '#f5ede6', border: '1px solid rgba(74,222,128,0.3)',
                    color: '#b09880', padding: '5px 12px', borderRadius: '999px',
                    fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600
                  }}>Aprobar</button>
                )}
                <button onClick={() => eliminar(p.id)} style={{
                  background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
                  color: '#f87171', padding: '5px 12px', borderRadius: '999px',
                  fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600
                }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}