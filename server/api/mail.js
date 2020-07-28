const router = require('express').Router();
const sgMail = require('@sendgrid/mail');
const apiKey = process.env.SENDGRID_API_KEY;
let mailEnabled = !!apiKey;

router.post('/', async (req, res, next) => {
  try {
    const {html, to, from, subject} = req.body;
    const msg = {
      to,
      from,
      subject,
      text: ' ',
      html,
    };
    const sendMailResponse = await sgMail.send(msg);
    res.send('Email Sent Successfully!');
  } catch (err) {
    if(mailEnabled) res.status(401).send('Unauthorized');
    else res.status(400).send('API Key Disabled')
  }
});

module.exports = router;
