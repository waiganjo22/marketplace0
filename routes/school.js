const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const moment = require('moment');
const { ensureAuth } = require('../middleware/auth');
const Student = require('../models/Student')
//import school module
const School = require('../models/School')
//show add school page
router.get('/add',ensureAuth, async (req, res) => {
    const school = await School.find().lean();
    res.render('./school/add', {
        school
    })
});

//create a school
router.post('/',ensureAuth, async (req, res) => {
    try {
        await School.create(req.body)
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error)
    }
});
//view school per page
router.get('/:_id',ensureAuth, async (req, res) => {
    const schldata = await School.findOne({
        _id: req.params._id
    }).lean();

     // import  students
     const student =  await Student.find().lean();
     let len = [];

     student.forEach(function(stdnt){
        if(stdnt.school == schldata._id){
            len.push(student.contact)
            return len
        }
    })
    res.render('./school/view', {
        schldata,
        student,
        len,
    });
});

//add student page
router.get('/:_id/addstudent' ,ensureAuth, async (req, res) => {
    const school = await School.find().lean();
    const schooloc = await School.findOne({ _id: req.params._id }).lean();
    res.render('./student/add', {
        schooloc,
        school
    })
});

//post a student
router.post('/student' ,ensureAuth, async (req, res) => {
    try {
        //validation goes Here
        await Student.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
    }
});


//post school edit page
router.get('/:_id/edit' ,ensureAuth, async (req, res) => {
    const school = await School.find().lean();
    const edit = await School.findOne({
        _id: req.params._id
    }).lean();
    res.render('./school/edit', {
        school,
        edit
    })
});

//post a school
router.put('/:_id' ,ensureAuth, async (req, res) => {
    let edit = await School.findById(req.params._id).lean()
    let id = edit._id
    if (edit) {
        edit = await School.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
            runValidators: true
        });
    }
    res.redirect('/dashboard')
})

//delete school
router.delete('/delete/:_id' ,ensureAuth, async (req, res) => {
    try {
        await School.deleteOne({ _id: req.params._id })
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
    }
})


//view students per form
router.post('/:_id',ensureAuth, async (req, res) => {
    const schldata = await School.findOne({
        _id: req.params._id
    }).lean();
    // get select value
    let select = req.body.selectform;
    // import  students
    const student =  await Student.find().lean();
    let len = [];

    student.forEach(function(stdnt){
        if(stdnt.school == schldata._id){
            len.push(student.contact)
            return len
        }
    })
    res.render('./school/view', {
        schldata,
        select,
        student,
        len
    });
});
module.exports = router;
