import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const estados = {
  pendiente: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', icon: '⏳' },
  enviado:   { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)', icon: '🚚' },
  entregado: { color: '#b09880', bg: '#f5ede6', border: '#d4c5b2', icon: '✅' },
  cancelado: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)', icon: '❌' },
};

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    api.get('/pedidos/mis-pedidos').then(r => setPedidos(r.data));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', padding: '48px 24px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        <p style={{ color: '#b09880', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '8px' }}>HISTORIAL</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '2.2rem', color: '#2d2d2d', fontWeight: 600, marginBottom: '32px' }}>Mis pedidos</h1>

        {pedidos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px dashed #222', borderRadius: '20px' }}>
            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</p>
            <p style={{ color: '#8a7f75', marginBottom: '24px' }}>Aún no tienes pedidos</p>
            <Link to="/" style={{ color: '#b09880', fontSize: '0.85rem', textDecoration: 'none' }}>Explorar productos →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pedidos.map(p => {
              const e = estados[p.estado] || estados.pendiente;
              return (
                <div key={p.id} style={{ background: '#fff', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '24px', transition: 'border-color 0.2s' }}
                  onMouseEnter={e2 => e2.currentTarget.style.borderColor='#333'}
                  onMouseLeave={e2 => e2.currentTarget.style.borderColor='#ede5d8'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <p style={{ color: '#8a7f75', fontSize: '0.75rem', letterSpacing: '0.1em', marginBottom: '4px' }}>PEDIDO #{p.id}</p>
                      <p style={{ color: '#2d2d2d', fontWeight: 600 }}>{p.productos}</p>
                    </div>
                    <span style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: e.bg, color: e.color, border: `1px solid ${e.border}` }}>
                      {e.icon} {p.estado.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #1e1e1e' }}>
                    <div>
                      <p style={{ color: '#8a7f75', fontSize: '0.8rem', marginBottom: '2px' }}>📍 {p.direccion_envio}</p>
                      <p style={{ color: '#444', fontSize: '0.75rem' }}>{new Date(p.fecha_pedido).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <p style={{ color: '#b09880', fontWeight: 700, fontSize: '1.2rem' }}>${Number(p.total).toLocaleString('es-CO')}</p>
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