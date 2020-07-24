const express = require('express');
const path = require('path');
const app = express();

//Express Middleware
app.use(express.static(path.join(__dirname, '..', 'public')))

//Serve Up React App
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})

//Startup Server
app.listen(5000);