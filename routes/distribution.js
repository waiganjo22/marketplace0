const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');
const { ensureAuth } = require('../middleware/auth');
const Student = require('../models/Student')
//import school module
const School = require('../models/School')
//render distribution page
router.get('/new',ensureAuth,async (req,res)=>{
    const school = await School.find().lean();
    res.render('./distribution/add',{
        school,
    })
});
  
module.exports = router;