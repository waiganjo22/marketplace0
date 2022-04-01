const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//dotenv
const dotenv = require('dotenv');
//moment
const moment = require('moment');
//school model
const School = require('../models/School');
const { ensureAuth } = require('../middleware/auth');
// student model
const student = require('../models/Student');
//sms model
const Sms = require('../models/Sms');
const africastalking = require('africastalking');

//config
dotenv.config({ path: './config/config.env' });
// single sms
router.get('/singlesms', async (req, res) => {
    const school = await School.find().lean();
    //messages carries the history
    const messages = await Sms.find().lean();
    //sender
    let sender = req.user.name;
    res.render('./sms/single', {
        school,
        sender,
        messages,
        moment,

    });
});
// school sms
router.get('/schoolsms', async (req, res) => {
    const school = await School.find().lean();
    //messages carries the history
    const messages = await Sms.find().lean();
    //sender
    let sender = req.user.name
    res.render('./sms/schoolsms', {
        school,
        sender,
        messages,
        moment,
    });
});

//location sms
router.get('/location', async (req, res) => {
    const school = await School.find().lean();
    //messages carries the history
    const messages = await Sms.find().lean();
    //sender
    let sender = req.user.name
    res.render('./sms/location', {
        school,
        sender,
        messages,
        moment,
    })
});


//single sms
router.post('/send/singlesms', ensureAuth, async (req, res) => {

    // Set your app credentials
    const credentials = {


        apiKey: '9fce67f1a8efac71ca8146871acb5c4870c9ab7e4914367e172c8a20192f25e8', // use your sandbox app API key for development in the test environment
        username: 'Mojatu',
        from: 'MojaTu'
    }

    // Initialize the SDK
    const AfricasTalking = require('africastalking')(credentials);

    // Get the SMS service
    const sms = AfricasTalking.SMS;

    function sendMessage() {
        const options = {
            // Set the numbers you want to send to in international format
            to: req.body.contact,
            // Set your message
            message: req.body.msgBody,
            // Set your shortCode or senderId
            from: 'MojaTu',

        }

        // That’s it, hit send and we’ll take care of the rest
        sms.send(options)
            .then(response => {
                // save data to database
                try {
                    Sms.create(req.body);
                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
            }
            )
            .catch(console.log);
    }

    sendMessage();
    res.redirect('/sms/singlesms')
})
//selected  schools
router.post('/school/sms/send', ensureAuth, async (req, res) => {
    req.body = req.body;
    let category = req.body.contact;
    const contacts = await student.find().lean()
    let schlCategory = req.body.school;
    //store contacts temporarily
    let contactArr = [];
    contacts.forEach(
        (contact) => {
            if ((contact.school == schlCategory) && (contact.form == category)) {
                return contactArr.push(contact.contact)
            }
        })

    // Set your app credentials
    const credentials = {

        apiKey: '9fce67f1a8efac71ca8146871acb5c4870c9ab7e4914367e172c8a20192f25e8', // use your sandbox app API key for development in the test environment
        username: 'Mojatu',
        from: 'MojaTu'
    }

    // Initialize the SDK
    const AfricasTalking = require('africastalking')(credentials);

    // Get the SMS service
    const sms = AfricasTalking.SMS;

    function sendMessage() {
        const options = {
            // Set the numbers you want to send to in international format
            to: contactArr,
            // Set your message
            message: req.body.msgBody,
            // Set your shortCode or senderId
            from: 'MojaTu',
        }

        // That’s it, hit send and we’ll take care of the rest
        sms.send(options)
            .then(response => {
                console.log(response)
                // save data to database
                try {
                    Sms.create(req.body)
                } catch (error) {
                    console.log(error);
                }
            }
            )
            .catch(console.log);
    }
    sendMessage();
    //clear memory
    contactArr = [];
    res.redirect('/sms/schoolsms')
})
//location sms

router.post('/location/sms', ensureAuth, async (req, res) => {
    let location = req.body.location;
    let locatConts = [];
    const students = await student.find().lean();
    let contacts = students.forEach((student) => {
        if (student.location == location) {
            return locatConts.push(student.contact)
        }
    })

    // Set your app credentials
    const credentials = {

        apiKey: '9fce67f1a8efac71ca8146871acb5c4870c9ab7e4914367e172c8a20192f25e8', // use your sandbox app API key for development in the test environment
        username: 'Mojatu',
        from: 'MojaTu'
    }

    // Initialize the SDK
    const AfricasTalking = require('africastalking')(credentials);

    // Get the SMS service
    const sms = AfricasTalking.SMS;

    function sendMessage() {
        const options = {
            // Set the numbers you want to send to in international format
            to: locatConts,
            // Set your message
            message: req.body.msgBody,
            // Set your shortCode or senderId
            from: 'MojaTu',
        }

        console.log(locatConts);
        // That’s it, hit send and we’ll take care of the rest
        sms.send(options)
            .then(response => {
                console.log(response)
                // save data to database

                try {
                    Sms.create(req.body)
                } catch (error) {
                    console.log(error);
                }
            }
            )
            .catch(console.log);
    }

    sendMessage();
    //clear memory
    locatConts = [];
    res.redirect('/sms/location')
});
//export module
module.exports = router;
