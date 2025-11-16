import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function BlogView() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blogs/${id}`)
      .then(res => setBlog(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="center">Loading...</div>;
  if (!blog) return <div>Post not found.</div>;

  return (
    <article className="card">
      <h1>{blog.title}</h1>
      <p className="meta">by {blog.author?.name}</p>
      <div className="content" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>
  );
}
