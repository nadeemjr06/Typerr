import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

export default function Register() {
  // const { register, login } = useContext(AuthContext);
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      await login(email, password); // auto-login after register
      nav('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="card">
      <h2>Sign up</h2>
      {err && <div className="err">{err}</div>}
      <form onSubmit={submit}>
        <label>Name<input value={name} onChange={e => setName(e.target.value)} required /></label>
        <label>Email<input value={email} onChange={e => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
        <button type="submit">Create account</button>
      </form>
    </div>
  );
}
