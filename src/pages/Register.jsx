import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'cliente' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setExito('¡Cuenta creada! Redirigiendo...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrarse');
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
    <div style={{ minHeight: '100vh', background: '#faf8f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>

        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.2rem' }}>♻️</span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#2d2d2d', fontWeight: 600, fontStyle: 'italic' }}>ReWear</span>
        </Link>

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#2d2d2d', fontWeight: 600, marginBottom: '8px', fontStyle: 'italic' }}>
          Únete a ReWear
        </h1>
        <p style={{ color: '#8a7f75', marginBottom: '32px', fontSize: '0.9rem', fontWeight: 300 }}>
          Compra y vende moda de forma sostenible
        </p>

        {error && <div style={{ background: '#fdecea', border: '1px solid #f5c6c2', color: '#c9645a', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem' }}>{error}</div>}
        {exito && <div style={{ background: '#f0faf0', border: '1px solid #c6e8c6', color: '#5a8a5a', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem' }}>{exito}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>NOMBRE COMPLETO</label>
            <input type="text" required style={inputStyle} value={form.nombre}
              onChange={e => setForm({...form, nombre: e.target.value})}
              onFocus={e => e.target.style.borderColor='#b09880'}
              onBlur={e => e.target.style.borderColor='#d4c5b2'} />
          </div>
          <div>
            <label style={labelStyle}>CORREO ELECTRÓNICO</label>
            <input type="email" required style={inputStyle} value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              onFocus={e => e.target.style.borderColor='#b09880'}
              onBlur={e => e.target.style.borderColor='#d4c5b2'} />
          </div>
          <div>
            <label style={labelStyle}>CONTRASEÑA</label>
            <input type="password" required style={inputStyle} value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              onFocus={e => e.target.style.borderColor='#b09880'}
              onBlur={e => e.target.style.borderColor='#d4c5b2'} />
          </div>

          {/* Selector de rol visual */}
          <div>
            <label style={labelStyle}>QUIERO</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { val: 'cliente', emoji: '🛍️', label: 'Comprar ropa', desc: 'Encontrar prendas únicas' },
                { val: 'vendedor', emoji: '🏷️', label: 'Vender ropa', desc: 'Dar nueva vida a mi ropa' }
              ].map(op => (
                <button type="button" key={op.val}
                  onClick={() => setForm({...form, rol: op.val})}
                  style={{
                    padding: '16px', borderRadius: '12px', cursor: 'pointer',
                    background: form.rol === op.val ? '#f5ede6' : '#fff',
                    border: `2px solid ${form.rol === op.val ? '#b09880' : '#d4c5b2'}`,
                    color: form.rol === op.val ? '#6b5e52' : '#8a7f75',
                    transition: 'all 0.2s', textAlign: 'center',
                    fontFamily: 'Jost, sans-serif'
                  }}>
                  <p style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{op.emoji}</p>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '2px' }}>{op.label}</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{op.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" style={{
            background: '#2d2d2d', color: '#faf8f5',
            padding: '15px', borderRadius: '10px',
            fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.15em',
            border: 'none', cursor: 'pointer', marginTop: '8px',
            fontFamily: 'Jost, sans-serif'
          }}
            onMouseEnter={e => e.target.style.background='#444'}
            onMouseLeave={e => e.target.style.background='#2d2d2d'}>
            CREAR MI CUENTA
          </button>
        </form>

        <p style={{ color: '#8a7f75', textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#b09880', textDecoration: 'none', fontWeight: 600 }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}