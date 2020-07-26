const router = require('express').Router();
const sgMail = require('@sendgrid/mail');
const apiKey =
  process.env.SENDGRID_API_KEY || require('../../config/sendgrid').apiKey;
sgMail.setApiKey(apiKey);

router.post('/', (req, res, next) => {
  try {
    const { html, to, from, subject } = req.body;  
    const msg = {
      to,
      from,
      subject,
      text: ' ',
      html,
    };
    sgMail.send(msg);
    res.send('Test Email Sent!');
  } catch(err){
    next(err);
  }
});

module.exports = router;
