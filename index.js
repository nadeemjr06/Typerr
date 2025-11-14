const express= require('express');
const mongoose= require('mongoose')
const cors= require('cors')
const jwt= require('jsonwebtoken')

require('dotenv').config()

const Post= require('./models/Post')
const User= require('./models/User')
const Comment= require('./models/Comment')
const app= express();
const PORT= 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected successfully")
    app.listen(PORT, ()=> {
        console.log(`server running successfully on http://localhost:${PORT}`)
    })
}).catch((e)=> console.log("failed to connect to mongodb", e))

app.use(express.json());
app.use(cors())
app.get('/', (req,res) => {
    res.json({ message: "Main blog page. Head to /posts to see posts."})
})

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: "No token provided"});
    }
    
    const token = authHeader.split(' ')[1];
    
    if(!token) {
        return res.status(401).json({message: "No token provided"});
    }
    
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch(err) {
        return res.status(403).json({message: "Invalid or expired token"});
    }
}

app.get('/posts', async (req,res) => {
    const posts= await Post.find()
    res.json(posts)
})

app.post('/posts', verifyToken, async (req, res) => {
    const {title,content}= req.body
    const newPost= new Post({
        title:title,
        content: content,
        author: req.user._id
    })
    const savePost= await newPost.save()
    res.status(201).json(savePost)
})

// get a single post
app.get('/posts/:id', async (req,res)=>{
    const postId= req.params.id
    const post= await Post.findById(postId)

    if(!post) return res.status(404).json({message: postId})
    res.status(200).json(post)
})

// update
app.put('/posts/:id', verifyToken, async (req,res) => {
    const postId= req.params.id
    const {title,content}= req.body
    const updPost= await Post.findByIdAndUpdate(postId,{title: title, content: content})
    if(!updPost) return res.status(404).json({message: "could not find id"})
    res.status(201).json(updPost)
})


app.delete('/posts/:id', verifyToken, async (req, res) => {
    const deletePost= await Post.findByIdAndDelete(req.params.id)
    if(!deletePost){
        return res.status(404).json({message: "ID not found."})
    }
    res.status(204).send()
});

// I am writing auth code below for clarity:

app.post("/register", async (req,res)=>{
    const {username, password, email} = req.body

    const newUser= new User({
        username: username,
        password: password,
        email: email
    })
    try{
        const saveUser= await newUser.save()
        res.status(201).json({success: true, message: "Registered successfully!"})
    }
    catch(err){
        res.status(404).json({success: false,error: err ,  message: err.message})
    }
    
})

app.post("/login", async (req,res)=>{
    const {email, password}= req.body
    try{
        const user= await User.findOne({email : email})
        if(user){
            const isPasswordCorrect= await user.isPassword(password)

            if (!isPasswordCorrect) {
                return res.status(401).json({ message: "Invalid credentials." });
            }
            const accessToken= user.genAccess()
            const refreshToken= user.genRefresh()
            user.refreshToken=refreshToken
            await user.save()
            
            return res.status(200).json({
                message:"User logged in successfully!",
                accessToken: accessToken,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                }
            })
        }
        else{
            return res.json({message:"User does not exist! register please."})
        }
    }
    catch(err){
        res.status(404).json({success: false,error: err ,  message: err.message})
    }
})

// COMMENTS FUNCTIONALITY

app.get('/posts/:id/comments', async (req, res)=>{
    try{
        const comments= await Comment.find({post: req.params.id})
            .populate('author', 'username')
            .sort({createdAt: -1})
        return res.status(200).json(comments)
    }catch(err){
        return res.status(404).json({message: "Error fetching comments", error: err.message})
    }
})

app.post('/posts/:id/comments', verifyToken, async (req, res)=>{
    try{
        const {content}= req.body
        const newComm= new Comment({
            author: req.user._id,
            content: content,
            post: req.params.id
        })

        const saveComm= await newComm.save()
        res.status(201).json(saveComm)
    }catch(err){
        return res.status(400).json({message: "Error creating comment", error: err.message})
    }
})

// LIKES FUNCTIONALITY

// Like a post (toggle)
app.post('/posts/:id/like', verifyToken, async (req, res)=> {
    try{
        const userId = req.user._id  // Get user ID from token!
        const post = await Post.findById(req.params.id)
        
        if(!post){
            return res.status(404).json({message: "Post not found"})
        }
        
        // Check if user already liked (search the array)
        const userIndex = post.likedBy.findIndex(uid => uid.toString() === userId.toString())
        
        if(userIndex !== -1){
            // User ALREADY liked - REMOVE (unlike)
            post.likedBy.splice(userIndex, 1)  // Remove from array
            post.likes = post.likedBy.length    // Update likes count
            await post.save()
            return res.status(200).json({
                message: "Post unliked!",
                liked: false,
                likes: post.likedBy.length  // Count from array
            })
        } else {
            // User NOT liked yet - ADD (like)
            post.likedBy.push(userId)  // Add to array
            post.likes = post.likedBy.length    // Update likes count
            await post.save()
            return res.status(200).json({
                message: "Post liked!",
                liked: true,
                likes: post.likedBy.length  // Count from array
            })
        }
    }catch(err){
        return res.status(400).json({message: "Error toggling like", error: err.message})
    }
})
