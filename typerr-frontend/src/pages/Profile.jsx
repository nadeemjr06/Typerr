import React, { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  // const { user } = useContext(AuthContext);
  if (!user) return <div>Please log in</div>;
  return (
    <div className="card">
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user.name || '—'}</p>
      <p><strong>ID:</strong> {user.id || '—'}</p>
      <p>More profile UI (edit about, stats, created posts) can go here.</p>
    </div>
  );
}
