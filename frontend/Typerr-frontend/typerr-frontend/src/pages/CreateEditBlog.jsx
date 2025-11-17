import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function CreateEditBlog() {
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('id');
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!draftId);

  useEffect(() => {
    if (!draftId) return;
    api.get(`/blogs/${draftId}`).then(res => {
      const b = res.data;
      setTitle(b.title || '');
      setContent(b.content || '');
      setTags((b.tags || []).join(', '));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      title,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    try {
      if (draftId) await api.put(`/blogs/${draftId}`, body);
      else await api.post('/blogs', body);
      nav('/my-blogs');
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
      setSaving(false);
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
      <div className="topbar" style={{ justifyContent: 'flex-start', paddingLeft: 0 }}>
        <h4 className="section-title">Draft</h4>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e6e6e6',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Inter, system-ui'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Share your thoughts</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Share your thoughts"
              rows={12}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e6e6e6',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Inter, system-ui',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Tags"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e6e6e6',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Inter, system-ui'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '10px 20px',
                background: '#111111',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: saving ? 0.6 : 1
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => nav('/my-blogs')}
              style={{
                padding: '10px 20px',
                background: '#f2f2f2',
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
      </div>

      <div className="footer-spacer" />
    </section>
  );
}
