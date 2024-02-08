const mongoose = require('mongoose');
const collection = require('../Collections')
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number
    }
    
});

const UserModel = mongoose.model(collection.USER_COLLECTION,UserSchema);
module.exports = UserModel;