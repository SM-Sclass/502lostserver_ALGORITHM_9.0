const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.createToken = (userId,user)=>{
     return jwt.sign({
        userId,
        name:user.name,
        email:user.email,
     },process.env.JWT_SECRET,"1d")
};