var mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
   category: {
        type: String,
        enum: ['Boys','Girls','Mixed'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sort:{
        type: Number,
        default: 1
    }
});


module.exports = mongoose.model('School', schoolSchema)