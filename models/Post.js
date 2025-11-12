const mongoose= require('mongoose')

const Post= new mongoose.Schema({
    author:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
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
    }
},
{timestamps: true})

module.exports= mongoose.model('Post', Post)
