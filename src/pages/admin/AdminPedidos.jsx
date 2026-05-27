import { useState, useEffect } from 'react';
import api from '../../api/axios';

const estados = {
  pendiente: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
  enviado:   { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)' },
  entregado: { color: '#b09880', bg: '#f5ede6', border: '#d4c5b2' },
  cancelado: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
};

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);

  const cargar = () => api.get('/pedidos').then(r => setPedidos(r.data));
  useEffect(() => { cargar(); }, []);

  const cambiarEstado = async (id, estado) => {
    await api.patch(`/pedidos/${id}/estado`, { estado });
    cargar();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', padding: '48px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ color: '#b09880', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '8px' }}>ADMINISTRACIÓN</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '2.2rem', color: '#2d2d2d', fontWeight: 600, marginBottom: '8px' }}>Gestión de pedidos</h1>
        <p style={{ color: '#8a7f75', fontSize: '0.9rem', marginBottom: '32px' }}>{pedidos.length} pedidos en total</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pedidos.map(p => {
            const e = estados[p.estado] || estados.pendiente;
            return (
              <div key={p.id} style={{ background: '#fff', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '20px 24px', display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 160px', alignItems: 'center', gap: '16px', transition: 'border-color 0.2s' }}
                onMouseEnter={e2 => e2.currentTarget.style.borderColor='#333'}
                onMouseLeave={e2 => e2.currentTarget.style.borderColor='#ede5d8'}>

                <div>
                  <p style={{ color: '#444', fontSize: '0.7rem', letterSpacing: '0.1em' }}>PEDIDO</p>
                  <p style={{ color: '#2d2d2d', fontWeight: 700 }}>#{p.id}</p>
                </div>

                <div>
                  <p style={{ color: '#444', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '2px' }}>COMPRADOR</p>
                  <p style={{ color: '#2d2d2d', fontSize: '0.9rem' }}>{p.comprador}</p>
                  <p style={{ color: '#8a7f75', fontSize: '0.75rem' }}>{new Date(p.fecha_pedido).toLocaleDateString('es-CO')}</p>
                </div>

                <div>
                  <p style={{ color: '#444', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '2px' }}>DIRECCIÓN</p>
                  <p style={{ color: '#666', fontSize: '0.85rem' }}>{p.direccion_envio}</p>
                </div>

                <div>
                  <p style={{ color: '#444', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '4px' }}>TOTAL</p>
                  <p style={{ color: '#b09880', fontWeight: 700, fontSize: '1.1rem' }}>${Number(p.total).toLocaleString('es-CO')}</p>
                </div>

                <div>
                  <p style={{ color: '#444', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '8px' }}>ESTADO</p>
                  <select value={p.estado} onChange={ev => cambiarEstado(p.id, ev.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, width: '100%', outline: 'none', background: e.bg, color: e.color, border: `1px solid ${e.border}` }}>
                    <option value="pendiente">⏳ Pendiente</option>
                    <option value="enviado">🚚 Enviado</option>
                    <option value="entregado">✅ Entregado</option>
                    <option value="cancelado">❌ Cancelado</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}