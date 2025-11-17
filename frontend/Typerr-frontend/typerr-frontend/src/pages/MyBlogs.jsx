import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function MyBlogs() {
  const navigate = useNavigate();
  const [myBlogs, setMyBlogs] = useState([]);
  const [myDrafts, setMyDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs and drafts when page loads
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's published blogs
      const blogsRes = await api.get('/blogs/my-blogs');
      setMyBlogs(blogsRes.data || []);
      
      // Fetch user's drafts
      const draftsRes = await api.get('/blogs/drafts');
      setMyDrafts(draftsRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Go to create new draft
  const goToCreateDraft = () => {
    navigate('/create');
  };

  // Go to edit draft
  const goToEditDraft = (draftId) => {
    navigate(`/create?id=${draftId}`);
  };

  // Styling constants
  const draftCardStyle = {
    background: '#e8e8e8',
    borderRadius: '8px',
    padding: '20px',
    cursor: 'pointer',
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
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
      {/* My Blogs Section */}
      <h4 className="section-title">My Blogs</h4>
      
      <div className="card-list">
        {myBlogs.length > 0 ? (
          myBlogs.map(blog => (
            <div key={blog._id} className="card">
              <div className="card-left">
                <h3 className="card-title">{blog.title}</h3>
                <div className="meta-row">By <strong>{blog.author || 'You'}</strong></div>
                <div className="excerpt">{blog.content}</div>
              </div>
              <div className="card-right">
                <div className="stat"><span className="dot">♡</span><span>{blog.likes || 0}</span></div>
                <div className="stat"><span className="dot">💬</span><span>{blog.comments || 0}</span></div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '20px' }}>No blogs yet</p>
        )}
      </div>

      {/* My Drafts Section */}
      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 className="section-title" style={{ margin: 0 }}>My Drafts</h4>
          <button
            onClick={goToCreateDraft}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#111111',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            + Create Drafts
          </button>
        </div>

        {/* Draft Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {myDrafts.length > 0 ? (
            myDrafts.map(draft => (
              <div
                key={draft._id}
                onClick={() => goToEditDraft(draft._id)}
                style={draftCardStyle}
                onMouseEnter={(e) => e.currentTarget.style.background = '#d9d9d9'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#e8e8e8'}
              >
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{draft.title || 'Insert title'}</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.4' }}>
                    {draft.content || 'Insert your thoughts here.'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '20px', gridColumn: '1 / -1' }}>No drafts yet</p>
          )}
        </div>
      </div>

      <div className="footer-spacer" />
    </section>
  );
}
