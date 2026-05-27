import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const cargar = () => api.get('/usuarios').then(r => setUsuarios(r.data));
  useEffect(() => { cargar(); }, []);

  const toggleActivo = async (id, activo) => {
    await api.patch(`/usuarios/${id}/activo`, { activo: !activo });
    cargar();
  };

  const rolColor = {
    admin:    { color: '#c084fc', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.3)' },
    vendedor: { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.3)' },
    cliente:  { color: '#b09880', bg: '#f5ede6',  border: '#d4c5b2' },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', padding: '48px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ color: '#b09880', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '8px' }}>ADMINISTRACIÓN</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '2.2rem', color: '#2d2d2d', fontWeight: 600, marginBottom: '8px' }}>Gestión de usuarios</h1>
        <p style={{ color: '#8a7f75', fontSize: '0.9rem', marginBottom: '32px' }}>{usuarios.length} usuarios registrados</p>

        <div style={{ background: '#fff', border: '1px solid #1e1e1e', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '16px 24px', borderBottom: '1px solid #1e1e1e' }}>
            {['NOMBRE', 'EMAIL', 'ROL', 'ESTADO', 'ACCIÓN'].map(h => (
              <span key={h} style={{ color: '#444', fontSize: '0.7rem', letterSpacing: '0.15em', fontWeight: 600 }}>{h}</span>
            ))}
          </div>

          {usuarios.map((u, i) => {
            const rc = rolColor[u.rol] || rolColor.cliente;
            return (
              <div key={u.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                padding: '16px 24px', alignItems: 'center',
                borderBottom: i < usuarios.length - 1 ? '1px solid #161616' : 'none',
                transition: 'background 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background='#f5ede6'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: rc.bg, border: `1px solid ${rc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rc.color, fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                    {u.nombre.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: '#2d2d2d', fontSize: '0.9rem', fontWeight: 500 }}>{u.nombre}</span>
                </div>

                <span style={{ color: '#8a7f75', fontSize: '0.85rem' }}>{u.email}</span>

                <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, width: 'fit-content' }}>
                  {u.rol}
                </span>

                <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, width: 'fit-content',
                  background: u.activo ? '#f5ede6' : 'rgba(248,113,113,0.1)',
                  color: u.activo ? '#4ade80' : '#f87171',
                  border: `1px solid ${u.activo ? '#d4c5b2' : 'rgba(248,113,113,0.3)'}` }}>
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>

                {u.rol !== 'admin' ? (
                  <button onClick={() => toggleActivo(u.id, u.activo)} style={{
                    background: 'transparent', padding: '6px 14px', borderRadius: '999px',
                    fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600,
                    border: `1px solid ${u.activo ? 'rgba(248,113,113,0.3)' : '#d4c5b2'}`,
                    color: u.activo ? '#f87171' : '#4ade80'
                  }}>
                    {u.activo ? 'Desactivar' : 'Activar'}
                  </button>
                ) : <span />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}