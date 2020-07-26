const router = require('express').Router();
const sgMail = require('@sendgrid/mail');
const apiKey =
  process.env.SENDGRID_API_KEY || require('../../config/sendgrid').apiKey;
sgMail.setApiKey(apiKey);

router.post('/', (req, res, next) => {
  try {
    console.log('Attempting to send test email');
    const { html } = req.body;  
    console.log('HTML received!', html)
    const msg = {
      to: 'sdatatester@gmail.com',
      from: 'sdatatester@gmail.com',
      subject: 'This is a test email!',
      text: 'Being sent with nodejs',
      html,
    };
    sgMail.send(msg);
    res.send('Test Email Sent!');
  } catch(err){
    next(err);
  }
});

module.exports = router;
