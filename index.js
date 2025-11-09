const express= require('express');
const mongoose= require('mongoose')
const cors= require('cors')

require('dotenv').config()

const Post= require('./models/Post')
const User= require('./models/User')
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

app.get('/posts', async (req,res) => {
    const posts= await Post.find()
    res.json(posts)
})

app.post('/posts',async (req, res) => {
    const {title,content}= req.body
    const newPost= new Post({
        title:title,
        content: content
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
app.put('/posts/:id', async (req,res) => {
    const postId= req.params.id
    const {title,content}= req.body
    const updPost= await Post.findByIdAndUpdate(postId,{title: title, content: content})
    if(!updPost) return res.status(404).json({message: "could not find id"})
    res.status(201).json(updPost)
})


app.delete('/posts/:id', async (req, res) => {
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
            const isPasswordCorrect= user.isPassword(password)

            if (!isPasswordCorrect) {
                return res.status(401).json({ message: "Invalid credentials." });
            }
            const accessToken= user.genAccess()
            const refreshToken= user.genRefresh()
            user.refreshToken=refreshToken
            const saveUser= await user.save()
            console.log(user.refreshToken)
            return res.status(200).json({message:"user logged in successfully!"})
        }
        else{
            return res.json({message:"User does not exist! register please."})
        }
    }
    catch(err){
        res.status(404).json({success: false,error: err ,  message: err.message})
    }
})
