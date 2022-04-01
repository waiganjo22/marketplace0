// express
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Subject = require('../models/Subject');

// multer
let multer =  require('multer');
// File model
const File = require('../models/File');
// path
const path = require('path');
// school
const School = require('../models/School');
// ensure auth
const { ensureAuth } = require('../middleware/auth');
//post a subject
router.post('/add', ensureAuth, (req, res) => {
    try {
        Subject.create(req.body)
        res.redirect('/resources/resources')
    } catch (error) {
        console.log(error)
    }
});


// get files
router.get('/:_id', ensureAuth, async (req, res) => {
    // logged in user
    let loggedinuser = req.user.username;
    // school
    const school = await School.find().lean();
    // single subject
    const subject = await Subject.findOne({ _id: req.params._id }).lean();
    // files
    const file = await File.find().lean();

    let files = [];
    // file number
    let filenumber;
    file.forEach(function(file){
           files.push(file._id)
           filenumber = files.length;
           return filenumber;
    })

    try {
        if (req.user.admin) {
            res.render('./library/updatepage.ejs', {
               school,
               subject,
               file,
               filenumber,
            })
        } else {
            res.render('./library/subject.ejs', {
                subject,
                loggedinuser,
                file,
                filenumber,
            })
        }
    } catch (err) {
        console.log(err)
    }
})


//Configuration for Multer
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${file.originalname}`);
    },
  });

   // Multer Filter
const multerFilter = (req, file, cb) => {
    let name = file.mimetype.split("/")[1];
    if (name === "pdf") {
      cb(null, true);
    } else {
        cb(null, true);
    }
  }

//upload
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

// post a file 
router.post('/post-a-file',upload.single("file"), async (req,res)=>{
    try{
        await File.create({
            filename: req.file.originalname,
            subject: req.body.subject,
        })

    }catch(err){
        console.log(err);
    }
  
   res.redirect('/resources/resources')
})
// download file
router.get('/download/:file(*)',async (req,res)=>{
    let file  = req.params.file;
    let filelocation =  path.join('./public/uploads',file);
     res.download(filelocation,file)
     
})
module.exports = router;
