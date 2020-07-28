const router = require('express').Router();

router.use('/mail', require('./mail'));
router.use('/templates', require('./templates'));

module.exports = router;
