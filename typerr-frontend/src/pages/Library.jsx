import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import BlogCard from '../component/BlogCard';

export default function Library() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/me/library')
      .then(res => setSaved(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="center">Loading...</div>;
  if (!saved.length) return <div>Your library is empty.</div>;

  return (
    <div>
      <h2>Your library</h2>
      <div className="grid">{saved.map(b => <BlogCard key={b._id} blog={b} />)}</div>
    </div>
  );
}
