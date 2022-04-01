var mongoose = require('mongoose');

const Item = new mongoose.Schema({
   itemName: {
        type: String,
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Item', Item);