const express = require('express');
const morgan = require('morgan');
const { db } = require('../db');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const { apiKey } = require('../config/sendgrid');
const { start } = require('repl');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStore = new SequelizeStore({ db });
const app = express();

passport.serializeUser((user, done) => done(null, user.id));

//Users attached downstream as req.user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
})

//Request Middleware
//Logging Middleware
app.use(morgan('dev'));

//Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'simon data is cool',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Static Middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

//Endpoint Handlers
app.use('/auth', require('./auth'));
app.use('/api', require('./api'));

//Serve Up React App
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
})

//TODO: ERR handling middleware
//Startup Server
async function startApp(){
  await sessionStore.sync();
  await db.sync();
  await app.listen(process.env.PORT || 5000); 
}

startApp();