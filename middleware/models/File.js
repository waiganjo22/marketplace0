const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
 

const File = new mongoose.Schema({
    filename:{
        type: String
    },
    subject:{
      type: String
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('File',File);