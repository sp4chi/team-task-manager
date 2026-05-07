import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await API.post('/auth/signup', form);
      setSuccess('Signup successful. Please log in.');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setError(err?.response?.data?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-shell'>
      <form onSubmit={handleSubmit} className='auth-card'>
        <div className='auth-header'>
          <h1>Create your account</h1>
          <p>Set up your workspace in minutes.</p>
        </div>

        {error && <div className='alert'>{error}</div>}
        {success && <div className='alert success'>{success}</div>}

        <label className='label'>Full name</label>
        <input
          className='input'
          placeholder='Alex Morgan'
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className='label'>Email</label>
        <input
          className='input'
          type='email'
          placeholder='name@company.com'
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className='label'>Password</label>
        <input
          className='input'
          type='password'
          placeholder='Choose a secure password'
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label className='label'>Role</label>
        <select
          className='select'
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value='admin'>Admin</option>
          <option value='member'>Member</option>
        </select>

        <button className='btn btn-primary' disabled={loading}>
          {loading ? 'Creating...' : 'Sign up'}
        </button>

        <div className='auth-footer'>
          <span>Already have an account?</span>
          <Link to='/'>Log in</Link>
        </div>
      </form>
    </div>
  );
}
