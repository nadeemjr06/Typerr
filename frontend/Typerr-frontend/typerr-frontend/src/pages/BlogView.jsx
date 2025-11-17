import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function BlogView() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      
      // Fetch blog details
      const blogRes = await api.get(`/blogs/${id}`);
      setBlog(blogRes.data);
      
      // Fetch comments for this blog
      const commentsRes = await api.get(`/blogs/${id}/comments`);
      setComments(commentsRes.data || []);
    } catch (err) {
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await api.post(`/blogs/${id}/comments`, { content: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <section className="content">
        <p>Loading...</p>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="content">
        <p>Blog not found.</p>
      </section>
    );
  }

  return (
    <section className="content">
      {/* Blog Content */}
      <article className="card" style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>{blog.title}</h1>
        <div className="meta-row" style={{ marginBottom: '20px', fontSize: '14px', color: '#6b6b6b' }}>
          By <strong>{blog.author || 'Unknown'}</strong> • {new Date(blog.createdAt).toLocaleDateString()}
        </div>
        <div style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
          {blog.content}
        </div>
      </article>

      {/* Comments Section */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Comments ({comments.length})</h3>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="card" style={{ marginBottom: '20px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={4}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e6e6e6',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'Inter, system-ui',
              resize: 'vertical',
              marginBottom: '12px'
            }}
          />
          <button
            type="submit"
            disabled={submittingComment}
            style={{
              padding: '10px 20px',
              background: '#111111',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: submittingComment ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: submittingComment ? 0.6 : 1
            }}
          >
            {submittingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        {/* Comments List */}
        <div>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="card" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px' }}>{comment.author || 'Anonymous'}</strong>
                  <span style={{ fontSize: '12px', color: '#6b6b6b' }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px', lineHeight: '1.5', color: '#555' }}>
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p style={{ color: '#6b6b6b', textAlign: 'center', padding: '20px' }}>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>

      <div className="footer-spacer" />
    </section>
  );
}
