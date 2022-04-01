var mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentname: {
        type: String,
        required: true
    },
    form: {
        type: String,
        default: 'Form1',
        enum: ['Form1', 'Form2', 'Form3', 'Form4'],
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: 'Male',
        enum: ['Male', 'Female'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    school:{
        type: String
    },
    sponsored:{
        type: String,
    },
    location:{
        type: String,
        enum:['Makueni','Laikipia','Other','Naivasha','Nairobi'],
        required: true,
    }
});


module.exports = mongoose.model('Student', studentSchema)