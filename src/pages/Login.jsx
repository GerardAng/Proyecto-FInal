import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.usuario);
      if (data.usuario.rol === 'admin') navigate('/admin/usuarios');
      else if (data.usuario.rol === 'vendedor') navigate('/mis-productos');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px',
    background: '#fff', border: '1px solid #d4c5b2',
    borderRadius: '10px', color: '#2d2d2d',
    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'Jost, sans-serif'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', display: 'flex' }}>

      {/* Panel izquierdo decorativo */}
      <div style={{
        flex: 1, background: 'linear-gradient(135deg, #f0e8df, #e8ddd0, #f5ede6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', padding: '60px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '15%', left: '8%', fontSize: '7rem', opacity: 0.12, transform: 'rotate(-15deg)' }}>👗</div>
        <div style={{ position: 'absolute', bottom: '15%', right: '8%', fontSize: '5rem', opacity: 0.12, transform: 'rotate(10deg)' }}>👜</div>
        <div style={{ position: 'absolute', top: '50%', left: '20%', fontSize: '4rem', opacity: 0.08 }}>🌿</div>

        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', color: '#2d2d2d', textAlign: 'center', lineHeight: 1.2, fontStyle: 'italic', marginBottom: '16px' }}>
          Moda que<br/><span style={{ color: '#b09880' }}>cuida</span> el planeta
        </h2>
        <p style={{ color: '#8a7f75', textAlign: 'center', fontSize: '0.9rem', fontWeight: 300 }}>
          Únete a nuestra comunidad de moda sostenible
        </p>
      </div>

      {/* Panel derecho */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#faf8f5' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '48px', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.2rem' }}>♻️</span>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#2d2d2d', fontWeight: 600, fontStyle: 'italic' }}>ReWear</span>
          </Link>

          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#2d2d2d', fontWeight: 600, marginBottom: '8px', fontStyle: 'italic' }}>
            Bienvenida de vuelta
          </h1>
          <p style={{ color: '#8a7f75', marginBottom: '32px', fontSize: '0.9rem', fontWeight: 300 }}>
            Ingresa a tu cuenta para continuar
          </p>

          {error && (
            <div style={{ background: '#fdecea', border: '1px solid #f5c6c2', color: '#c9645a', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ color: '#8a7f75', fontSize: '0.72rem', letterSpacing: '0.12em', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                CORREO ELECTRÓNICO
              </label>
              <input type="email" required style={inputStyle}
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                onFocus={e => e.target.style.borderColor='#b09880'}
                onBlur={e => e.target.style.borderColor='#d4c5b2'} />
            </div>
            <div>
              <label style={{ color: '#8a7f75', fontSize: '0.72rem', letterSpacing: '0.12em', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                CONTRASEÑA
              </label>
              <input type="password" required style={inputStyle}
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                onFocus={e => e.target.style.borderColor='#b09880'}
                onBlur={e => e.target.style.borderColor='#d4c5b2'} />
            </div>
            <button type="submit" style={{
              background: '#2d2d2d', color: '#faf8f5',
              padding: '15px', borderRadius: '10px',
              fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em',
              border: 'none', cursor: 'pointer', marginTop: '8px',
              fontFamily: 'Jost, sans-serif', transition: 'background 0.2s'
            }}
              onMouseEnter={e => e.target.style.background='#444'}
              onMouseLeave={e => e.target.style.background='#2d2d2d'}>
              INICIAR SESIÓN
            </button>
          </form>

          <p style={{ color: '#8a7f75', textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/register" style={{ color: '#b09880', textDecoration: 'none', fontWeight: 600 }}>
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}