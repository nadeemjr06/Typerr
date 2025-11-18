import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import BlogCard from '../component/BlogCard';

export default function Library() {
  const [previouslyRead, setPreviouslyRead] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    try {
      setLoading(true);
      
      // Fetch previously read blogs
      const readRes = await api.get('/library/previously-read');
      setPreviouslyRead(readRes.data || []);
      
      // Fetch saved for later blogs
      const savedRes = await api.get('/library/saved-for-later');
      setSavedForLater(savedRes.data || []);
    } catch (err) {
      console.error('Error fetching library:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="content">
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section className="content">
      {/* Previously Read Section */}
      <div style={{ marginBottom: '40px' }}>
        <h4 className="section-title" style={{ marginBottom: '20px' }}>Previously Read</h4>
        <div className="card-list">
          {previouslyRead.length > 0 ? (
            previouslyRead.map(blog => (
              <BlogCard key={blog._id} post={blog} />
            ))
          ) : (
            <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '20px' }}>No previously read blogs</p>
          )}
        </div>
      </div>

      {/* Saved For Later Section */}
      <div>
        <h4 className="section-title" style={{ marginBottom: '20px' }}>Saved For Later</h4>
        <div className="card-list">
          {savedForLater.length > 0 ? (
            savedForLater.map(blog => (
              <BlogCard key={blog._id} post={blog} />
            ))
          ) : (
            <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '20px' }}>No saved blogs</p>
          )}
        </div>
      </div>

      <div className="footer-spacer" />
    </section>
  );
}
