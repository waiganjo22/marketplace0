const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuth} = require('../middleware/auth');
const { check, validationResult }
    = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const moment = require('moment');
//import user model
const User = require('../models/User');
//import school model
const School = require('../models/School')
//show add user page
router.get('/adduser',ensureAuth, async (req, res) => {
    const school = await School.find().lean();
    res.render('./user/adduser', {
        school
    })
});
//add user
router.post('/add/user',ensureAuth, (req, res) => {
    let name = req.body.name
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;
    let admin = req.body.admin;
    // validate all inputs
    check('name', 'Name is required').notEmpty();
    check('username', 'Username is required').notEmpty();
    check('email', 'Email is required').isEmail();
    check('password', 'Password is required').notEmpty();
    check('password2', 'Passwords do not Match').equals(password);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('/user/adduser')
    } else {
        User.findOne({ username: username }, function (user, err) {
            if (err) { console.log(err) }
            if (user) {
                // req.flash('danger', 'Username Exists');
                res.redirect('/user/adduser')
            } else {
                let user = new User({
                    name,
                    username,
                    email,
                    password,
                    admin,
                })
                //hash password
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err) { console.log(err) }
                        user.password = hash;
                        //save user
                        user.save()
                            .then(user => {
                                // req.flash('success_msg','Acoount Created Successfully')
                                res.redirect('/user/adduser')
                            })
                            .catch(err => console.log(err))
                    })

                })
            }
        })
    }

});

//render users page

router.get('/view/users',ensureAuth, async (req, res) => {
    const school = await School.find().lean();
    const members =  await  User.find().lean();
     let active = req.user.username;
    res.render('./user/view', {
        school,
        members,
        active,
        moment,
    })
})

//login 

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
    })(req, res, next)
});
//delete user

router.delete('/delete/:_id',ensureAuth, async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params._id })
        res.redirect('/user/view/users')
    } catch (err) {
        console.log(err)
    }
})
module.exports = router;