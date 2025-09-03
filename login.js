import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setUser  }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // or 'admin'

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
      setUser (res.data.user);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login as {role}</h2>
      <select onChange={e => setRole(e.target.value)} value={role} className="mb-4 p-2 border rounded">
        <option value="member">Member</option>
        <option value="admin">Admin</option>
      </select>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
