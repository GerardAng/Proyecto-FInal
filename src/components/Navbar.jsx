import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  const linkStyle = {
    color: '#8a7f75', fontSize: '0.78rem', letterSpacing: '0.12em',
    textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s'
  };

  return (
    <nav style={{ background: '#faf8f5', borderBottom: '1px solid #e8e0d5', position: 'sticky', top: 0, zIndex: 50 }}>
      {/* Barra superior */}
      <div style={{
        background: '#d4c5b2', padding: '7px', textAlign: 'center',
        fontSize: '0.72rem', color: '#6b5e52', letterSpacing: '0.2em', fontWeight: 500
      }}>
        🌿 MODA SOSTENIBLE · SEGUNDA MANO · ENVÍOS A TODA COLOMBIA
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

          {/* Links izquierda */}
          <div style={{ display: 'flex', gap: '28px', flex: 1 }}>
            <Link to="/" style={linkStyle}
              onMouseEnter={e => e.target.style.color='#2d2d2d'}
              onMouseLeave={e => e.target.style.color='#8a7f75'}>CATÁLOGO</Link>

            {usuario?.rol === 'cliente' && <>
              <Link to="/carrito" style={linkStyle}
                onMouseEnter={e => e.target.style.color='#2d2d2d'}
                onMouseLeave={e => e.target.style.color='#8a7f75'}>CARRITO</Link>
              <Link to="/mis-pedidos" style={linkStyle}
                onMouseEnter={e => e.target.style.color='#2d2d2d'}
                onMouseLeave={e => e.target.style.color='#8a7f75'}>MIS PEDIDOS</Link>
            </>}
            {usuario?.rol === 'vendedor' && <>
              <Link to="/mis-productos" style={linkStyle}
                onMouseEnter={e => e.target.style.color='#2d2d2d'}
                onMouseLeave={e => e.target.style.color='#8a7f75'}>MIS PRODUCTOS</Link>
            </>}
            {usuario?.rol === 'admin' && <>
              <Link to="/admin/usuarios" style={linkStyle}
                onMouseEnter={e => e.target.style.color='#2d2d2d'}
                onMouseLeave={e => e.target.style.color='#8a7f75'}>USUARIOS</Link>
              <Link to="/admin/productos" style={linkStyle}
                onMouseEnter={e => e.target.style.color='#2d2d2d'}
                onMouseLeave={e => e.target.style.color='#8a7f75'}>PRODUCTOS</Link>
              <Link to="/admin/pedidos" style={linkStyle}
                onMouseEnter={e => e.target.style.color='#2d2d2d'}
                onMouseLeave={e => e.target.style.color='#8a7f75'}>PEDIDOS</Link>
            </>}
          </div>

          {/* Logo centro */}
          <Link to="/" style={{ textDecoration: 'none', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.3rem' }}>♻️</span>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2rem', color: '#2d2d2d', fontWeight: 600,
              letterSpacing: '0.08em', fontStyle: 'italic'
            }}>ReWear</span>
          </Link>

          {/* Acciones derecha */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
            {!usuario && <>
              <Link to="/login" style={linkStyle}
                onMouseEnter={e => e.target.style.color='#2d2d2d'}
                onMouseLeave={e => e.target.style.color='#8a7f75'}>INICIAR SESIÓN</Link>
              <Link to="/register" style={{
                background: '#2d2d2d', color: '#faf8f5',
                padding: '10px 22px', borderRadius: '999px',
                fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em',
                textDecoration: 'none'
              }}>REGISTRARSE</Link>
            </>}
            {usuario?.rol === 'vendedor' && (
              <Link to="/publicar" style={{
                background: '#c9b99a', color: '#2d2d2d',
                padding: '10px 22px', borderRadius: '999px',
                fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em',
                textDecoration: 'none'
              }}>+ PUBLICAR</Link>
            )}
            {usuario && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#e8ddd0', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#6b5e52', fontWeight: 600, fontSize: '0.9rem',
                  fontFamily: 'Cormorant Garamond, serif'
                }}>
                  {usuario.nombre.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: '#8a7f75', fontSize: '0.82rem' }}>{usuario.nombre.split(' ')[0]}</span>
                <button onClick={handleLogout} style={{
                  background: 'transparent', border: '1px solid #d4c5b2',
                  color: '#8a7f75', padding: '7px 16px', borderRadius: '999px',
                  fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.08em'
                }}
                  onMouseEnter={e => { e.target.style.borderColor='#c9645a'; e.target.style.color='#c9645a'; }}
                  onMouseLeave={e => { e.target.style.borderColor='#d4c5b2'; e.target.style.color='#8a7f75'; }}>
                  SALIR
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}