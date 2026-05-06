import { useState } from 'react';
import API from '../services/api';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/auth/signup', form);
    alert('Signup successful');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder='name'
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder='email'
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder='password'
        type='password'
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button>Signup</button>
    </form>
  );
}
