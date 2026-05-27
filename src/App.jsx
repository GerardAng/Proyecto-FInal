import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import MisPedidos from './pages/MisPedidos';
import MisProductos from './pages/MisProductos';
import PublicarProducto from './pages/PublicarProducto';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminProductos from './pages/admin/AdminProductos';
import AdminPedidos from './pages/admin/AdminPedidos';

function RutaProtegida({ children, roles }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />

        <Route path="/carrito" element={
          <RutaProtegida roles={['cliente']}>
            <Carrito />
          </RutaProtegida>
        } />
        <Route path="/mis-pedidos" element={
          <RutaProtegida roles={['cliente']}>
            <MisPedidos />
          </RutaProtegida>
        } />
        <Route path="/mis-productos" element={
          <RutaProtegida roles={['vendedor']}>
            <MisProductos />
          </RutaProtegida>
        } />
        <Route path="/publicar" element={
          <RutaProtegida roles={['vendedor']}>
            <PublicarProducto />
          </RutaProtegida>
        } />
        <Route path="/admin/usuarios" element={
          <RutaProtegida roles={['admin']}>
            <AdminUsuarios />
          </RutaProtegida>
        } />
        <Route path="/admin/productos" element={
          <RutaProtegida roles={['admin']}>
            <AdminProductos />
          </RutaProtegida>
        } />
        <Route path="/admin/pedidos" element={
          <RutaProtegida roles={['admin']}>
            <AdminPedidos />
          </RutaProtegida>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}