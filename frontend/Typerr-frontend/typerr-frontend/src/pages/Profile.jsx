import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalDrafts: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get user info from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch user profile
      const userRes = await api.get('/user/profile');
      setUser(userRes.data);
      setFormData({
        username: userRes.data.username || '',
        email: userRes.data.email || '',
        bio: userRes.data.bio || ''
      });

      // Fetch user stats
      const statsRes = await api.get('/user/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/user/profile', formData);
      setUser(res.data);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <section className="content">
        <p>Loading profile...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="content">
        <p>User not found.</p>
      </section>
    );
  }

  return (
    <section className="content">
      {/* Profile Header */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: '24px' }}>
          {/* Avatar */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            fontWeight: '700',
            color: '#ffffff',
            flexShrink: 0
          }}>
            {user.username?.[0]?.toUpperCase() || 'U'}
          </div>

          {/* User Info */}
          <div style={{ flex: 1 }}>
            {!editing ? (
              <>
                <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
                  {user.username}
                </h1>
                <p style={{ fontSize: '16px', color: '#6b6b6b', marginBottom: '12px' }}>
                  {user.email}
                </p>
                <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.6', marginBottom: '20px' }}>
                  {user.bio || 'No bio yet. Click edit to add one!'}
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setEditing(true)}
                    style={{
                      padding: '10px 20px',
                      background: '#111111',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '10px 20px',
                      background: 'transparent',
                      color: '#d32f2f',
                      border: '1px solid #d32f2f',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdateProfile}>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Username"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e6e6e6',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'Inter, system-ui'
                  }}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e6e6e6',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'Inter, system-ui'
                  }}
                />
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Bio (optional)"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: '12px',
                    border: '1px solid #e6e6e6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Inter, system-ui',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      background: '#111111',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        username: user.username,
                        email: user.email,
                        bio: user.bio || ''
                      });
                    }}
                    style={{
                      padding: '10px 20px',
                      background: '#e6e6e6',
                      color: '#111111',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <h4 className="section-title" style={{ marginBottom: '20px' }}>Statistics</h4>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#111111', marginBottom: '8px' }}>
            {stats.totalBlogs}
          </div>
          <div style={{ fontSize: '14px', color: '#6b6b6b', fontWeight: '600' }}>
            Published Blogs
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#111111', marginBottom: '8px' }}>
            {stats.totalDrafts}
          </div>
          <div style={{ fontSize: '14px', color: '#6b6b6b', fontWeight: '600' }}>
            Drafts
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#111111', marginBottom: '8px' }}>
            {stats.totalLikes}
          </div>
          <div style={{ fontSize: '14px', color: '#6b6b6b', fontWeight: '600' }}>
            Total Likes
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#111111', marginBottom: '8px' }}>
            {stats.totalComments}
          </div>
          <div style={{ fontSize: '14px', color: '#6b6b6b', fontWeight: '600' }}>
            Total Comments
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <h4 className="section-title" style={{ marginBottom: '20px' }}>Account</h4>
      <div className="card" style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '14px', color: '#6b6b6b', marginBottom: '12px' }}>
          Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
        <button
          onClick={() => navigate('/my-blogs')}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#111111',
            border: '1px solid #e6e6e6',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            marginRight: '12px'
          }}
        >
          View My Blogs
        </button>
        <button
          onClick={() => navigate('/create')}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#111111',
            border: '1px solid #e6e6e6',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          Create New Blog
        </button>
      </div>

      <div className="footer-spacer" />
    </section>
  );
}
