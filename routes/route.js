const express = require('express');
const router = express.Router();
const School = require('../models/School');
const mongoose = require('mongoose');
const { ensureAuth } = require('../middleware/auth');
const User = require('../models/User');
// file
const File =  require('../models/File');
// subject
const Subject = require('../models/Subject');
//render dashboard
router.get('/dashboard',ensureAuth, async (req, res) => {
    // user
    const user =  await User.find().lean();
    // subjects
    const subject = await Subject.find().lean();
    // school
    const school = await School.find().lean();
    // logged in user
    let loggedinuser = req.user.username;

    
    // files
    const file = await File.find().lean();

    let files = [];
    // file number
    let filenumber;
    file.forEach(function(file){
           files.push(file._id)
           filenumber = files.length;
           return filenumber;
    });
    
    let subject_total = [];
    let total;
    subject.forEach(function(data){
            subject_total.push(data.subject);
            total = subject_total.length;
            return total;
    })
    if (req.user.admin) {
        res.render('./index', {
            school,
        });
    } else {
          res.render('./library/mainlib',{
              loggedinuser,
              subject,
              total,
              filenumber,
          })
    }
});

//render login
router.get('/', (req, res) => {
    res.render('./user/login');
});
//logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/')
});
module.exports = router;
