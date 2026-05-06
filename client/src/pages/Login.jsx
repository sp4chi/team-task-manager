import { useState } from 'react';
import API, { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post('/auth/login', form);

    localStorage.setItem('token', res.data.token);
    setAuthToken(res.data.token);

    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder='email'
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder='password'
        type='password'
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button>Login</button>
    </form>
  );
}
