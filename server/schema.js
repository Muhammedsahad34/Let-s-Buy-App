const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name:{
        type:String,

    }
});
const ProductModel = mongoose.model('Products',ProductSchema);
module.exports = ProductModel;