import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

export default function Login() {
  // const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav('/');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="card">
      <h2>Log in</h2>
      {err && <div className="err">{err}</div>}
      <form onSubmit={submit}>
        <label>Email<input value={email} onChange={e => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
        <button type="submit">Log in</button>
      </form>
      <p>New? <Link to="/register">Create account</Link></p>
    </div>
  );
}
