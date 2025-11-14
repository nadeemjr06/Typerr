// import React from 'react';
// import { Link } from 'react-router-dom';

// export default function BlogCard({ blog }) {
//   return (
//     <article className="card">
//       <h3><Link to={`/blog/${blog._id}`}>{blog.title}</Link></h3>
//       <p className="meta">by {blog.author?.name || 'Unknown'} • {new Date(blog.createdAt).toLocaleDateString()}</p>
//       <p>{blog.excerpt || (blog.content ? blog.content.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 180) + '...' : '')}</p>
//     </article>
//   );
// }

// src/components/BlogCard.jsx
import React from 'react';

export default function BlogCard({ post }){
  return (
    <div className="card" role="article">
      <div className="card-left">
        <h3 className="card-title">{post.title}</h3>
        <div className="meta-row">By <strong>{post.author}</strong></div>
        <div className="excerpt">{post.excerpt}</div>
      </div>

      <div className="card-right">
        <div className="stat"><span className="dot">♡</span><span>{post.likes}</span></div>
        <div className="stat"><span className="dot">💬</span><span>{post.comments}</span></div>
      </div>
    </div>
  );
}
