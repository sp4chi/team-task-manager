import { Navigate } from 'react-router-dom';
import Layout from './Layout';

export default function ProtectedLayout({ children }) {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to='/' />;

  return <Layout>{children}</Layout>;
}
