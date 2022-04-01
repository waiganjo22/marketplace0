const express = require('express');
var path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
var methodOverride = require('method-override')

const passport = require('passport');
const MongoStore = require('connect-mongo');
//init app
const app = express();
dotenv.config({ path: './config/config.env' });

// database
var connectDB = require('./config/database');
connectDB();
//passport config
require('./config/passport')(passport);


//port 
var port = process.env.PORT || 3000;
//logging

 app.use(morgan('dev'));


// //set templating engine
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`))                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
// //static public folder
app.use('/style', express.static(path.join(__dirname, 'public/css')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/javascript', express.static(path.join(__dirname, 'public/js')));

//bodt-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//express sessions
app.use(
  session({
    secret: 'asanteproject',
    resave: false,
    saveUninitialized: true,
   store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 1 * 24 * 60 * 60 // = 14 days. Default
    })
  })
);

//method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))
app.use(methodOverride("_method"))

// //passport middleware
app.use(passport.initialize());
app.use(passport.session());

//routes
let sms = require('./routes/sms');
let user = require('./routes/user');
let route = require('./routes/route');
let school = require('./routes/school');
let subject = require('./routes/subject');
let student = require('./routes/student')
let resources = require('./routes/resources')
let distributions = require('./routes/distribution')

app.use('/', route);
app.use('/sms', sms);
app.use('/user', user);
app.use('/school', school);
app.use('/subject',subject);
app.use('/student', student);
app.use('/resources',resources);
app.use('/distributions',distributions); 

//create a server
app.listen(port, console.log(`app running in on port: ${port}`));
