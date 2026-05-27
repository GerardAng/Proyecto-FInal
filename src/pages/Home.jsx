import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState({ buscar: '', categoria: '', talla: '', precio_max: '' });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get('/categorias').then(r => setCategorias(r.data));
    cargarProductos();
  }, []);

  const cargarProductos = async (f = filtros) => {
    setCargando(true);
    try {
      const params = {};
      if (f.buscar)     params.buscar     = f.buscar;
      if (f.categoria)  params.categoria  = f.categoria;
      if (f.talla)      params.talla      = f.talla;
      if (f.precio_max) params.precio_max = f.precio_max;
      const { data } = await api.get('/productos', { params });
      setProductos(data);
    } finally { setCargando(false); }
  };

  const handleFiltro = (e) => {
    const nuevo = { ...filtros, [e.target.name]: e.target.value };
    setFiltros(nuevo);
    cargarProductos(nuevo);
  };

  return (
    <div style={{ background: '#faf8f5', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #f0e8df 0%, #e8ddd0 50%, #f5ede6 100%)',
        padding: '90px 24px 80px', textAlign: 'center',
        borderBottom: '1px solid #e0d5c8'
      }}>
        <p style={{ color: '#b09880', fontSize: '0.75rem', letterSpacing: '0.35em', marginBottom: '20px', fontWeight: 500 }}>
          MODA CONSCIENTE · SEGUNDA MANO
        </p>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(3rem, 7vw, 5.5rem)',
          color: '#2d2d2d', lineHeight: 1.1, marginBottom: '16px',
          fontStyle: 'italic', fontWeight: 600
        }}>
          Dale una segunda vida<br/>
          <span style={{ color: '#b09880' }}>a tu ropa</span>
        </h1>
        <p style={{ color: '#8a7f75', fontSize: '1rem', marginBottom: '40px', fontWeight: 300 }}>
          Compra y vende ropa de segunda mano fácil y seguro
        </p>

        <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
          <input type="text" name="buscar"
            placeholder="Buscar ropa, marcas, tallas..."
            style={{
              width: '100%', padding: '16px 52px 16px 24px',
              borderRadius: '999px', background: '#fff',
              border: '1px solid #d4c5b2', color: '#2d2d2d',
              fontSize: '0.95rem', outline: 'none',
              boxShadow: '0 2px 20px rgba(0,0,0,0.06)'
            }}
            value={filtros.buscar} onChange={handleFiltro}
            onFocus={e => e.target.style.borderColor='#b09880'}
            onBlur={e => e.target.style.borderColor='#d4c5b2'}
          />
          <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#b09880', fontSize: '1rem' }}>🔍</span>
        </div>

        {/* Stats decorativos */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '48px' }}>
          {[['🌿', 'Sostenible'], ['♻️', 'Segunda mano'], ['💚', 'Con propósito']].map(([emoji, txt]) => (
            <div key={txt} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{emoji}</p>
              <p style={{ color: '#8a7f75', fontSize: '0.75rem', letterSpacing: '0.15em' }}>{txt.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Categorías */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#2d2d2d', marginBottom: '20px', fontStyle: 'italic' }}>
            Explorar por categoría
          </h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[{ id: '', nombre: 'Todas', icono: '✨' }, ...categorias].map(c => (
              <button key={c.id} onClick={() => {
                const n = {...filtros, categoria: String(c.id)};
                setFiltros(n); cargarProductos(n);
              }} style={{
                padding: '9px 20px', borderRadius: '999px', fontSize: '0.82rem',
                cursor: 'pointer', fontFamily: 'Jost, sans-serif', fontWeight: 500,
                transition: 'all 0.2s',
                background: filtros.categoria === String(c.id) ? '#2d2d2d' : '#fff',
                color: filtros.categoria === String(c.id) ? '#faf8f5' : '#6b5e52',
                border: `1px solid ${filtros.categoria === String(c.id) ? '#2d2d2d' : '#d4c5b2'}`,
              }}>
                {c.icono} {c.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: '#8a7f75', fontSize: '0.8rem', letterSpacing: '0.1em' }}>FILTRAR:</span>
          {[
            { name: 'talla', placeholder: 'Talla', options: ['XS','S','M','L','XL','XXL'] },
          ].map(f => (
            <select key={f.name} name={f.name} onChange={handleFiltro} value={filtros[f.name]}
              style={{ padding: '9px 16px', borderRadius: '999px', background: '#fff', border: '1px solid #d4c5b2', color: '#6b5e52', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}>
              <option value="">Todas las tallas</option>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          <select name="precio_max" onChange={handleFiltro} value={filtros.precio_max}
            style={{ padding: '9px 16px', borderRadius: '999px', background: '#fff', border: '1px solid #d4c5b2', color: '#6b5e52', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}>
            <option value="">Cualquier precio</option>
            <option value="20000">Hasta $20.000</option>
            <option value="50000">Hasta $50.000</option>
            <option value="100000">Hasta $100.000</option>
          </select>
        </div>

        {/* Título sección */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#2d2d2d', fontStyle: 'italic' }}>
            Publicaciones recientes
          </h2>
          {!cargando && <span style={{ color: '#8a7f75', fontSize: '0.82rem' }}>{productos.length} artículos</span>}
        </div>

        {/* Productos */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <p style={{ color: '#b09880', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontStyle: 'italic' }}>Cargando prendas...</p>
          </div>
        ) : productos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', border: '1px dashed #d4c5b2', borderRadius: '20px' }}>
            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>👗</p>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#8a7f75', fontStyle: 'italic' }}>No hay prendas disponibles</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
            {productos.map(p => (
              <Link to={`/producto/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.05)'; }}>
                <div style={{ background: '#fff', border: '1px solid #ede5d8', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <div style={{ height: '240px', background: '#f5ede6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {p.imagen_url
                      ? <img src={p.imagen_url} alt={p.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '5rem' }}>👕</span>}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <p style={{ color: '#b09880', fontSize: '0.68rem', letterSpacing: '0.18em', marginBottom: '6px', fontWeight: 500 }}>
                      {p.categoria_nombre?.toUpperCase()}
                    </p>
                    <h3 style={{ color: '#2d2d2d', fontWeight: 500, marginBottom: '4px', fontSize: '0.95rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{p.titulo}</h3>
                    <p style={{ color: '#8a7f75', fontSize: '0.8rem', marginBottom: '12px' }}>Talla {p.talla} · {p.vendedor_nombre}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ color: '#2d2d2d', fontWeight: 600, fontSize: '1rem' }}>
                        ${Number(p.precio).toLocaleString('es-CO')}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: '#b09880', background: '#f5ede6', padding: '3px 10px', borderRadius: '999px' }}>
                        Disponible
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e0d5c8', padding: '40px 24px', textAlign: 'center', marginTop: '60px' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#2d2d2d', fontStyle: 'italic', marginBottom: '8px' }}>ReWear</p>
        <p style={{ color: '#8a7f75', fontSize: '0.8rem', letterSpacing: '0.1em' }}>MODA SOSTENIBLE · SEGUNDA MANO · COLOMBIA 🌿</p>
      </footer>
    </div>
  );
}