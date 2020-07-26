const express = require('express');
const morgan = require('morgan');
const { db } = require('../db');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const { apiKey } = require('../config/sendgrid');
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
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
db.sync().then(() => {
  app.listen(5000);
})
