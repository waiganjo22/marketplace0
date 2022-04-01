var mongoose = require('mongoose');

const sms = new mongoose.Schema({
    sender: {
        type: String,
    },
    school:{
        type: String,
    },
    location:{
        type: String,
    },
   contact: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    msgBody:{
        type: String
    },
    order:{
        type: Number,
        order:-1
    }
});


module.exports = mongoose.model('Sms', sms)