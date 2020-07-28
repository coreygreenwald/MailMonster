const router = require('express').Router();
const sgMail = require('@sendgrid/mail');
const apiKey =
  process.env.SENDGRID_API_KEY;
sgMail.setApiKey(apiKey);

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
    res.status(401).send('Unauthorized');
  }
});

module.exports = router;
