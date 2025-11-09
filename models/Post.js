const mongoose= require('mongoose')

const Post= new mongoose.Schema({
    author:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Number,
        default: Date.now()
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
}
)

module.exports= mongoose.model('Post', Post)
