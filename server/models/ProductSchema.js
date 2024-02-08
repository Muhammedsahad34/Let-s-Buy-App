const mongoose = require('mongoose');
const collection = require('../Collections');
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity:{
        type:Number,
        required:true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        required: true
    }

});
const ProductModel = mongoose.model(collection.PRODUCT_COLLECTION,ProductSchema);
module.exports = ProductModel;