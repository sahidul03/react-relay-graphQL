const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: String,
    price: Number,
    details: String,
    discount: Number,
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    updated_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Product', productSchema);
