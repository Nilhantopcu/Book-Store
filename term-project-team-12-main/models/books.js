const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    author: String,
    type: String,
    price: Number,
    image: String,
    description: String
}, { collection: 'books' });

const Book = mongoose.model('books', bookSchema);

module.exports = Book;