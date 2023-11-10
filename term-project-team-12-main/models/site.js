const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const siteSchema = new Schema({
    id: Number,
    about: String
}, { collection: 'site' });

const Site = mongoose.model('site', siteSchema);

module.exports = Site;