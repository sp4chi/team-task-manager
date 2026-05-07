import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { setAuthToken } from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setAuthToken(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className='auth-shell'>
      <form onSubmit={handleSubmit} className='auth-card'>
        <div className='auth-header'>
          <h1>Welcome back</h1>
          <p>Sign in to manage your projects and tasks.</p>
        </div>

        {error && <div className='alert'>{error}</div>}

        <label className='label'>Email</label>
        <input
          className='input'
          placeholder='name@company.com'
          type='email'
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className='label'>Password</label>
        <input
          type='password'
          className='input'
          placeholder='••••••••'
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className='btn btn-primary' disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <div className='auth-footer'>
          <span>New here?</span>
          <Link to='/signup'>Create an account</Link>
        </div>
      </form>
    </div>
  );
}
