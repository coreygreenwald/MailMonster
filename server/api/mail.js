const router = require('express').Router();

router.get('/', (req, res, next) => {
  try {
    const sgMail = require('@sendgrid/mail');
    const apiKey = process.env.SENDGRID_API_KEY || require('../../config/sendgrid').apiKey;
    sgMail.setApiKey(apiKey);
    const msg = {
      to: 'sdatatester@gmail.com',
      from: 'sdatatester@gmail.com',
      subject: 'This is a test email!',
      text: 'Being sent with nodejs',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg);
    res.send('Test Email Sent');
  } catch(err){
    next(err);
  }
});

module.exports = router;
