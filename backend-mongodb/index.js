const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

const app = express();
const PORT = 5000;

let db;

// Connect to MongoDB
MongoClient.connect(process.env.MONGO_URI)
    .then(client => {
        db = client.db(process.env.DB_NAME);
        console.log("Connected to MongoDB successfully");
        
        app.listen(PORT, () => {
            console.log(`Server running successfully on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.log("Failed to connect to MongoDB", err));

app.use(express.json());
app.use(cors());

// Helper function to generate access token
function generateAccessToken(user) {
    return jwt.sign(
        {
            _id: user._id.toString(),
            username: user.username,
            email: user.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
}

// Helper function to generate refresh token
function generateRefreshToken(user) {
    return jwt.sign(
        { _id: user._id.toString() },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '10d' }
    );
}

// Auth middleware
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

// Routes

app.get('/', (req, res) => {
    res.json({ message: "Main blog page. Head to /posts to see posts." });
});

// ==================== USER ROUTES ====================

// Register
app.post("/register", async (req, res) => {
    const { username, password, email } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user
        const result = await db.collection('users').insertOne({
            username,
            email,
            password: hashedPassword,
            refreshToken: null,
            createdAt: new Date()
        });
        
        res.status(201).json({
            success: true,
            message: "Registered successfully!",
            userId: result.insertedId
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await db.collection('users').findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User does not exist! Register please." });
        }
        
        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        
        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        // Update refresh token in database
        await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { refreshToken } }
        );
        
        return res.status(200).json({
            message: "User logged in successfully!",
            accessToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

// ==================== POST ROUTES ====================

// Get all posts
app.get('/blogs', async (req, res) => {
    try {
        const posts = await db.collection('posts')
            .find()
            .sort({ createdAt: -1 })
            .toArray();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching posts", error: err.message });
    }
});

// Get five posts (must be before /posts/:id)
app.get('/blogs/five', async (req, res) => {
    try {
        const posts = await db.collection('posts').find().sort({ createdAt: -1 }).limit(5).toArray();
        res.json(posts);
    } catch (err) {
        res.status(400).json({ message: "Error fetching posts", error: err.message });
    }
});

// Get user's published blogs (must be before /blogs/:id)
app.get('/blogs/my-blogs', verifyToken, async (req, res) => {
    try {
        const blogs = await db.collection('posts')
            .find({ author: new ObjectId(req.user._id) })
            .sort({ createdAt: -1 })
            .toArray();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching blogs", error: err.message });
    }
});

// Get user's drafts (must be before /blogs/:id)
app.get('/blogs/drafts', verifyToken, async (req, res) => {
    try {
        const drafts = await db.collection('posts')
            .find({ author: new ObjectId(req.user._id), status: 'draft' })
            .sort({ updatedAt: -1 })
            .toArray();
        res.json(drafts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching drafts", error: err.message });
    }
});

// Create post
app.post('/blogs', verifyToken, async (req, res) => {
    const { title, content } = req.body;
    
    try {
        const result = await db.collection('posts').insertOne({
            title,
            content,
            author: new ObjectId(req.user._id),
            likes: 0,
            likedBy: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        const newPost = await db.collection('posts').findOne({ _id: result.insertedId });
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: "Error creating post", error: err.message });
    }
});

// Get single post
app.get('/blogs/:id', async (req, res) => {
    try {
        const post = await db.collection('posts').findOne({
            _id: new ObjectId(req.params.id)
        });
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ message: "Error fetching post", error: err.message });
    }
});

// Update post
app.put('/blogs/:id', verifyToken, async (req, res) => {
    const { title, content } = req.body;
    
    try {
        const result = await db.collection('posts').updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    title,
                    content,
                    updatedAt: new Date()
                }
            }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        const updatedPost = await db.collection('posts').findOne({
            _id: new ObjectId(req.params.id)
        });
        
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: "Error updating post", error: err.message });
    }
});

// Delete post
app.delete('/blogs/:id', verifyToken, async (req, res) => {
    try {
        const result = await db.collection('posts').deleteOne({
            _id: new ObjectId(req.params.id)
        });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ message: "Error deleting post", error: err.message });
    }
});


// Get comments for a post
app.get('/blogs/:id/comments', async (req, res) => {
    try {
        const comments = await db.collection('comments')
            .aggregate([
                { $match: { post: new ObjectId(req.params.id) } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'authorInfo'
                    }
                },
                { $unwind: '$authorInfo' },
                {
                    $project: {
                        content: 1,
                        post: 1,
                        createdAt: 1,
                        'author': {
                            _id: '$authorInfo._id',
                            username: '$authorInfo.username'
                        }
                    }
                },
                { $sort: { createdAt: -1 } }
            ])
            .toArray();
        
        res.status(200).json(comments);
    } catch (err) {
        res.status(400).json({ message: "Error fetching comments", error: err.message });
    }
});

// Create comment
app.post('/blogs/:id/comments', verifyToken, async (req, res) => {
    const { content } = req.body;
    
    try {
        const result = await db.collection('comments').insertOne({
            author: new ObjectId(req.user._id),
            content,
            post: new ObjectId(req.params.id),
            createdAt: new Date()
        });
        
        const newComment = await db.collection('comments').findOne({
            _id: result.insertedId
        });
        
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: "Error creating comment", error: err.message });
    }
});


// Toggle like on post
app.post('/blogs/:id/like', verifyToken, async (req, res) => {
    try {
        const userId = new ObjectId(req.user._id);
        const postId = new ObjectId(req.params.id);
        
        const post = await db.collection('posts').findOne({ _id: postId });
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        
        // Check if user already liked
        const userIndex = post.likedBy.findIndex(id => id.toString() === userId.toString());
        
        if (userIndex !== -1) {
            // Unlike - remove user from likedBy array
            await db.collection('posts').updateOne(
                { _id: postId },
                {
                    $pull: { likedBy: userId },
                    $inc: { likes: -1 }
                }
            );
            
            return res.status(200).json({
                message: "Post unliked!",
                liked: false,
                likes: post.likes - 1
            });
        } else {
            // Like - add user to likedBy array
            await db.collection('posts').updateOne(
                { _id: postId },
                {
                    $push: { likedBy: userId },
                    $inc: { likes: 1 }
                }
            );
            
            return res.status(200).json({
                message: "Post liked!",
                liked: true,
                likes: post.likes + 1
            });
        }
    } catch (err) {
        res.status(400).json({ message: "Error toggling like", error: err.message });
    }
});

// ==================== SAVE BLOG ROUTES ====================

// Save or unsave a blog
app.post('/blogs/:id/save', verifyToken, async (req, res) => {
    try {
        const userId = new ObjectId(req.user._id);
        const blogId = new ObjectId(req.params.id);
        
        const user = await db.collection('users').findOne({ _id: userId });
        const savedBlogs = user.savedBlogs || [];
        
        // Check if already saved
        const isSaved = savedBlogs.some(id => id.toString() === blogId.toString());
        
        if (isSaved) {
            // Remove from saved
            await db.collection('users').updateOne(
                { _id: userId },
                { $pull: { savedBlogs: blogId } }
            );
            res.json({ message: "Blog unsaved!", saved: false });
        } else {
            // Add to saved
            await db.collection('users').updateOne(
                { _id: userId },
                { $addToSet: { savedBlogs: blogId } }
            );
            res.json({ message: "Blog saved!", saved: true });
        }
    } catch (err) {
        res.status(400).json({ message: "Error", error: err.message });
    }
});

// Get saved blogs
app.get('/user/saved-blogs', verifyToken, async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.user._id) });
        
        if (!user?.savedBlogs?.length) {
            return res.json([]);
        }
        
        const savedBlogs = await db.collection('posts')
            .aggregate([
                { $match: { _id: { $in: user.savedBlogs } } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'authorInfo'
                    }
                },
                { $unwind: '$authorInfo' },
                {
                    $project: {
                        title: 1,
                        content: 1,
                        likes: 1,
                        createdAt: 1,
                        'author': {
                            _id: '$authorInfo._id',
                            username: '$authorInfo.username'
                        }
                    }
                }
            ])
            .toArray();
        
        res.json(savedBlogs);
    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message });
    }
});

// Check if blog is saved
app.get('/blogs/:id/is-saved', verifyToken, async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.user._id) });
        const isSaved = user?.savedBlogs?.some(id => id.toString() === req.params.id) || false;
        res.json({ saved: isSaved });
    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message });
    }
});

// // ==================== USER PROFILE ROUTES ====================

// // Get user profile
// app.get('/user/profile', verifyToken, async (req, res) => {
//     try {
//         const user = await db.collection('users').findOne(
//             { _id: new ObjectId(req.user._id) },
//             { projection: { password: 0, refreshToken: 0 } } // Exclude sensitive fields
//         );
        
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
        
//         res.json(user);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching profile", error: err.message });
//     }
// });

// // Update user profile
// app.put('/user/profile', verifyToken, async (req, res) => {
//     const { username, email, bio } = req.body;
    
//     try {
//         const updateFields = {};
//         if (username) updateFields.username = username;
//         if (email) updateFields.email = email;
//         if (bio !== undefined) updateFields.bio = bio;
        
//         const result = await db.collection('users').findOneAndUpdate(
//             { _id: new ObjectId(req.user._id) },
//             { $set: updateFields },
//             { returnDocument: 'after', projection: { password: 0, refreshToken: 0 } }
//         );
        
//         if (!result) {
//             return res.status(404).json({ message: "User not found" });
//         }
        
//         res.json(result);
//     } catch (err) {
//         res.status(400).json({ message: "Error updating profile", error: err.message });
//     }
// });

// // Get user statistics
// app.get('/user/stats', verifyToken, async (req, res) => {
//     try {
//         const userId = new ObjectId(req.user._id);
        
//         // Count published blogs
//         const totalBlogs = await db.collection('posts').countDocuments({
//             author: userId,
//             status: { $ne: 'draft' }
//         });
        
//         // Count drafts
//         const totalDrafts = await db.collection('posts').countDocuments({
//             author: userId,
//             status: 'draft'
//         });
        
//         // Count total likes on user's posts
//         const likesResult = await db.collection('posts').aggregate([
//             { $match: { author: userId } },
//             { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
//         ]).toArray();
//         const totalLikes = likesResult[0]?.totalLikes || 0;
        
//         // Count total comments on user's posts
//         const totalComments = await db.collection('comments').countDocuments({
//             post: { $in: await db.collection('posts').distinct('_id', { author: userId }) }
//         });
        
//         res.json({
//             totalBlogs,
//             totalDrafts,
//             totalLikes,
//             totalComments
//         });
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching stats", error: err.message });
//     }
// });
