const mongoose = require('mongoose');
const collection = require('../Collections');
const ProductModel = require('./ProductSchema');
const UserModel = require('./UserSchema');
const CartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref: UserModel,
        required:true
        
    },
    products:[{
        item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:ProductModel
        },
        count:{
            type:Number
        }
    }]
});
const CartModel = mongoose.model(collection.CART_COLLECTION,CartSchema);
module.exports = CartModel;