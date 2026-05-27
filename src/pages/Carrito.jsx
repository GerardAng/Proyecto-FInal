import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Carrito() {
  const [items, setItems] = useState([]);
  const [direccion, setDireccion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cargar = () => api.get('/carrito').then(r => setItems(r.data));
  useEffect(() => { cargar(); }, []);

  const eliminar = async (id) => {
    await api.delete(`/carrito/${id}`);
    cargar();
  };

  const total = items.reduce((s, i) => s + Number(i.precio), 0);

  const comprar = async () => {
    if (!direccion) return setError('Ingresa una dirección de envío');
    try {
      await api.post('/pedidos', { direccion_envio: direccion });
      setMensaje('¡Pedido realizado exitosamente!');
      setTimeout(() => navigate('/mis-pedidos'), 1500);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear pedido');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', padding: '48px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <p style={{ color: '#b09880', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '8px' }}>MI CARRITO</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '2.2rem', color: '#2d2d2d', fontWeight: 600, marginBottom: '32px' }}>
          {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
        </h1>

        {mensaje && (
          <div style={{ background: '#f5ede6', border: '1px solid rgba(74,222,128,0.3)', color: '#b09880', padding: '16px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
            ✅ {mensaje}
          </div>
        )}

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', border: '1px dashed #222', borderRadius: '20px' }}>
            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</p>
            <p style={{ color: '#8a7f75', marginBottom: '24px' }}>Tu carrito está vacío</p>
            <Link to="/" style={{ color: '#b09880', fontSize: '0.85rem', textDecoration: 'none' }}>Explorar productos →</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

            {/* Lista de items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map(item => (
                <div key={item.id} style={{ background: '#fff', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '80px', background: '#f5ede6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {item.imagen_url
                      ? <img src={item.imagen_url} alt={item.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '2rem' }}>👕</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#2d2d2d', fontWeight: 600, marginBottom: '4px' }}>{item.titulo}</h3>
                    <p style={{ color: '#8a7f75', fontSize: '0.8rem' }}>Talla {item.talla} · {item.vendedor}</p>
                    <p style={{ color: '#b09880', fontWeight: 700, marginTop: '6px' }}>${Number(item.precio).toLocaleString('es-CO')}</p>
                  </div>
                  <button onClick={() => eliminar(item.id)} style={{
                    background: 'transparent', border: 'none', color: '#444',
                    cursor: 'pointer', fontSize: '1.2rem', padding: '8px'
                  }}
                    onMouseEnter={e => e.target.style.color='#f87171'}
                    onMouseLeave={e => e.target.style.color='#444'}>✕</button>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div style={{ background: '#fff', border: '1px solid #1e1e1e', borderRadius: '20px', padding: '24px', position: 'sticky', top: '100px' }}>
              <h2 style={{ color: '#2d2d2d', fontWeight: 700, marginBottom: '20px', fontSize: '1.1rem' }}>Resumen del pedido</h2>

              <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#666', fontSize: '0.85rem' }}>Subtotal ({items.length} items)</span>
                  <span style={{ color: '#2d2d2d', fontSize: '0.85rem' }}>${total.toLocaleString('es-CO')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666', fontSize: '0.85rem' }}>Envío</span>
                  <span style={{ color: '#b09880', fontSize: '0.85rem' }}>A coordinar</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingTop: '16px', borderTop: '1px solid #1e1e1e' }}>
                <span style={{ color: '#2d2d2d', fontWeight: 700 }}>Total</span>
                <span style={{ color: '#b09880', fontWeight: 700, fontSize: '1.2rem' }}>${total.toLocaleString('es-CO')}</span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#666', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>DIRECCIÓN DE ENVÍO</label>
                <input type="text" placeholder="Ej: Cra 15 #45-20, Bucaramanga"
                  style={{ width: '100%', padding: '12px 14px', background: '#f5ede6', border: '1px solid #2a2a2a', borderRadius: '10px', color: '#2d2d2d', fontSize: '0.85rem', outline: 'none' }}
                  value={direccion} onChange={e => setDireccion(e.target.value)}
                  onFocus={e => e.target.style.borderColor='#4ade80'}
                  onBlur={e => e.target.style.borderColor='#2a2a2a'} />
              </div>

              {error && <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '12px' }}>{error}</p>}

              <button onClick={comprar} style={{
                width: '100%', background: '#2d2d2d',
                color: '#faf8f5', padding: '15px', borderRadius: '10px',
                fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em',
                border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(74,222,128,0.3)'
              }}>CONFIRMAR PEDIDO</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}