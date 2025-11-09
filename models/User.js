const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()

const commonObj= {
    type:String,
    required: true
}

const User= new mongoose.Schema({
    username: {
        ...commonObj,
    },
    email:{
        ...commonObj,
        unique: true
    },
    password:{
        ...commonObj
    }, 
    refreshToken:{
        type: String,
        default: null
    }
})

User.pre("save", async function (next){
    if(!this.isModified("password")) return next()

    this.password= await bcrypt.hash(this.password, 10)
    next()
})


User.methods.isPassword= async function (password) {
    return await bcrypt.compare(password, this.password)
}

User.methods.genAccess= function () {
    console.log(this._id)
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    },
    `${process.env.ACCESS_TOKEN_SECRET}`,
    {expiresIn: /*`${process.env.ACCESS_TOKEN_EXPIRY}`*/ "1d"}
)
}

User.methods.genRefresh= function () {
    console.log(this._id)
    return jwt.sign({
        _id: this._id
    },
    `${process.env.REFRESH_TOKEN_SECRET}`,
    {expiresIn: /*`${process.env.REFRESH_TOKEN_EXPIRY}`*/ "10d"}
)
}
module.exports= mongoose.model('User', User)
