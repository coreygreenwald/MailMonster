const router = require('express').Router();

router.use('/mail', require('./mail'));

module.exports = router;