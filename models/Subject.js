var mongoose = require('mongoose');
const Subject = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Subject', Subject);