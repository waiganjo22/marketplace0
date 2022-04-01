const express = require('express');
const  router = express.Router();

//import school module
const School = require('../models/School');
const Student = require('../models/Student');
const {ensureAuth} = require('../middleware/auth');
//view all students
router.get('/view',async (req,res)=>{
    const school = await School.find().lean();
    const students = await Student.find().lean();
    res.render('./student/students',{
        school,
        students
    })


});

//edit student
router.get('/edit/:_id',ensureAuth ,async (req, res) => {
    const school = await School.find().lean();
    const Data = await Student.findOne({
        _id: req.params._id
    }).lean();
    //school
    res.render('./student/edit', {
       Data, 
       school,
        select: function(selected,options){
            return options
            .fn(this)
            .replace(
                new RegExp('value ="' + selected +"'"),
                '$&selected = "selected"'

            )
            .replace(
                new RegExp('>' + selected +'</option'),
                'selected="selected"$&'
            )
        },
    })
});


// post edited student
router.put('/edit/:_id',ensureAuth, async (req, res) => {
    let  stdnt= await Student.findById(req.params._id).lean()
        let id = stdnt._id
      if(stdnt){
        stdnt = await Student.findOneAndUpdate({_id: id}, req.body, {
              new: true,
              runValidators: true
          });
      }
      res.redirect('/student/view')
    
})
router.delete('/delete/:_id',ensureAuth, async (req, res) => {
    try {
        await Student.deleteOne({ _id: req.params._id })
        res.redirect('/student/view')
    } catch (err) {
        console.log(err)
    }
});



module.exports = router;