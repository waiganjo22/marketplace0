const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const School = require('../models/School');
const { ensureAuth } = require('../middleware/auth');
// subject
const Subject = require('../models/Subject');
// file
const File = require('../models/File');
const User = require('../models/User');
// get resource files
router.get('/resources', ensureAuth, async (req, res) => {
// file
  let file = await File.find().lean();
  let files = [];
  // file number
  let filenumber;
  file.forEach(function(file){
         files.push(file._id)
         filenumber = files.length;
         return filenumber;
  });
  const subject = await Subject.find().lean();
  const school = await School.find().lean();
  let user = User.findOne(req.params._id).lean();
  let post = req.user.name;
  let subject_total = [];
  let total;
  subject.forEach(function(data){
    subject_total.push(data.subject);
    total = subject_total.length;
    return total;
});
  res.render('./resources/add', {
    school,
    user,
    post,
    subject,
    total,
    filenumber
  })
});
module.exports = router;
