import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import BlogCard from '../component/BlogCard';

export default function Library() {
  // Store saved blogs in state
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved blogs when page loads
  useEffect(() => {
    getSavedBlogs();
  }, []);

  // Function to get saved blogs from backend
  const getSavedBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/saved-blogs');
      setSavedBlogs(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading message while fetching
  if (loading) {
    return (
      <section className="content">
        <p>Loading...</p>
      </section>
    );
  }

  // Main page content
  return (
    <section className="content">
      <h4 className="section-title">Saved For Later</h4>
      
      <div className="card-list">
        {savedBlogs.length > 0 ? (
          // Show saved blogs if there are any
          savedBlogs.map(blog => (
            <BlogCard key={blog._id} post={blog} />
          ))
        ) : (
          // Show message if no saved blogs
          <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '20px' }}>
            No saved blogs yet. Click "Save for Later" on any blog to add it here!
          </p>
        )}
      </div>
    </section>
  );
}
