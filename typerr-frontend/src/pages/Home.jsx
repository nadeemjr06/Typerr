// import React, { useEffect, useState } from 'react';
// import api from '../api/axios';
// import BlogCard from '../component/BlogCard';

// export default function Home() {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let mounted = true;
//     api.get('/blogs')
//       .then(res => { if (mounted) setBlogs(res.data); })
//       .catch(err => console.error(err))
//       .finally(() => mounted && setLoading(false));
//     return () => { mounted = false; };
//   }, []);

//   if (loading) return <div className="center">Loading...</div>;
//   if (!blogs.length) return <div>No posts yet. Create one!</div>;

//   return (
//     <div>
//       <h1>Latest</h1>
//       <div className="grid">
//         {blogs.map(b => <BlogCard key={b._id} blog={b} />)}
//       </div>
//     </div>
//   );
// }

// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import BlogCard from "../component/BlogCard";

export default function Home(){
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    // demo static data matching screenshot style
    setPosts([
      { id: 'p1', title: 'The art of CSS', author: 'Nadeem', excerpt: 'Cascading Style Sheets is a style sheet language used for specifying the presentation and styling of a document ...', likes: 88, comments: 47 },
      { id: 'p2', title: 'Navigating the AI world', author: 'Manav Dewangan', excerpt: 'Exploring the world of AI means learning how new technologies are changing the way we work and live...', likes: 211, comments: 123 },
      { id: 'p3', title: 'Legacy technology now', author: 'Nikhil', excerpt: 'Legacy technology means old computer systems or software that many companies still use...', likes: 74, comments: 33 },
      { id: 'p4', title: 'Wireframes for noobs', author: 'Bill Gates', excerpt: 'A wireframe is like your website\'s skeleton — all bones, no muscles, no makeup. It shows where everything goes...', likes: 42069, comments: 6767 },
    ]);
  }, []);

  return (
    <section className="content" aria-labelledby="for-you">
      <div className="topbar" style={{justifyContent:'flex-start', paddingLeft:0}}>
        <h4 id="for-you" className="section-title">For you</h4>
      </div>

      <div className="card-list" role="list">
        {posts.map(p => (
          <BlogCard key={p.id} post={p} />
        ))}
      </div>

      <div className="footer-spacer" />
    </section>
  );
}
