import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
// import { AuthContext } from '../context/AuthContext';

export default function CreateEditBlog() {
  const { id } = useParams();
  const nav = useNavigate();
  // const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/blogs/${id}`).then(res => {
      const b = res.data;
      setTitle(b.title || '');
      setContent(b.content || '');
      setTags((b.tags || []).join(', '));
    }).catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in');
    setSaving(true);
    const body = {
      title,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    try {
      if (id) await api.put(`/blogs/${id}`, body);
      else await api.post('/blogs', body);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2>{id ? 'Edit' : 'Create'} post</h2>
      <form onSubmit={handleSubmit}>
        <label>Title
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>
        <label>Tags (comma separated)
          <input value={tags} onChange={e => setTags(e.target.value)} />
        </label>
        <label>Content (HTML allowed)
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={12} required />
        </label>
        <div style={{display:'flex',gap:8}}>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={() => nav('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
