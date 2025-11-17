import React, { useEffect, useState } from 'react';
import BlogCard from "../component/BlogCard";
import api from '../api/axios';

export default function Home(){
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs/five');
      setPosts(res.data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="content" aria-labelledby="for-you">
        <div className="topbar" style={{ justifyContent: 'flex-start', paddingLeft: 0 }}>
          <h4 id="for-you" className="section-title">For you</h4>
        </div>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="content" aria-labelledby="for-you">
      <div className="topbar" style={{ justifyContent: 'flex-start', paddingLeft: 0 }}>
        <h4 id="for-you" className="section-title">For you</h4>
      </div>

      <div className="card-list" role="list">
        {posts.length > 0 ? (
          posts.map(p => (
            <BlogCard key={p._id} post={p} />
          ))
        ) : (
          <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '20px' }}>No blogs available</p>
        )}
      </div>

      <div className="footer-spacer" />
    </section>
  );
}
