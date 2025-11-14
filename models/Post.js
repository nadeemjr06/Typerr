const mongoose= require('mongoose')

const Post= new mongoose.Schema({
    author:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
        // required: true  // Commented out temporarily
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }]
},
{timestamps: true})

module.exports= mongoose.model('Post', Post)
