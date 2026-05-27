import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProductoDetalle() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { api.get(`/productos/${id}`).then(r => setProducto(r.data)); }, [id]);

  const agregarCarrito = async () => {
    if (!usuario) return navigate('/login');
    try {
      await api.post('/carrito', { id_producto: id });
      setMensaje('¡Agregado al carrito!');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error');
    }
  };

  if (!producto) return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#8a7f75' }}>Cargando...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', padding: '48px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link to="/" style={{ color: '#8a7f75', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '32px' }}
          onMouseEnter={e => e.currentTarget.style.color='#fff'}
          onMouseLeave={e => e.currentTarget.style.color='#555'}>
          ← Volver al catálogo
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* Imagen */}
          <div style={{ background: '#fff', border: '1px solid #1e1e1e', borderRadius: '20px', overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {producto.imagen_url
              ? <img src={producto.imagen_url} alt={producto.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '8rem' }}>👕</span>}
          </div>

          {/* Info */}
          <div>
            <p style={{ color: '#b09880', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '8px' }}>{producto.categoria_nombre?.toUpperCase()}</p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#2d2d2d', fontWeight: 700, marginBottom: '8px' }}>{producto.titulo}</h1>
            <p style={{ color: '#b09880', fontSize: '1.8rem', fontWeight: 700, marginBottom: '24px' }}>${Number(producto.precio).toLocaleString('es-CO')}</p>

            <div style={{ background: '#fff', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8a7f75', fontSize: '0.85rem' }}>Talla</span>
                <span style={{ color: '#2d2d2d', fontWeight: 600 }}>{producto.talla}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1a1a1a', paddingTop: '10px' }}>
                <span style={{ color: '#8a7f75', fontSize: '0.85rem' }}>Vendedor</span>
                <span style={{ color: '#2d2d2d', fontWeight: 600 }}>{producto.vendedor_nombre}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1a1a1a', paddingTop: '10px' }}>
                <span style={{ color: '#8a7f75', fontSize: '0.85rem' }}>Estado</span>
                <span style={{ color: producto.estado_producto === 'disponible' ? '#4ade80' : '#f87171', fontWeight: 600 }}>{producto.estado_producto}</span>
              </div>
            </div>

            {producto.descripcion && (
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>{producto.descripcion}</p>
            )}

            {mensaje && <div style={{ background: '#f5ede6', border: '1px solid rgba(74,222,128,0.3)', color: '#b09880', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>{mensaje}</div>}
            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}

            {usuario?.rol === 'cliente' && producto.estado_producto === 'disponible' && (
              <button onClick={agregarCarrito} style={{
                width: '100%', background: '#2d2d2d',
                color: '#000', padding: '16px', borderRadius: '12px',
                fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em',
                border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(74,222,128,0.3)'
              }}>🛒 AGREGAR AL CARRITO</button>
            )}
            {!usuario && (
              <Link to="/login" style={{
                display: 'block', textAlign: 'center', width: '100%',
                background: '#2d2d2d',
                color: '#000', padding: '16px', borderRadius: '12px',
                fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em',
                textDecoration: 'none', boxShadow: '0 4px 20px rgba(74,222,128,0.3)'
              }}>INICIAR SESIÓN PARA COMPRAR</Link>
            )}
            {producto.estado_producto !== 'disponible' && (
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '12px', color: '#f87171', fontWeight: 600 }}>
                Este producto ya fue vendido
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}