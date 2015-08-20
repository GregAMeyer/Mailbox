'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/google', require('./google'));
router.use('/teams', require('./teams'));
router.use('/users', require('./users'));
router.use('/threads', require('./threads'));

// Make sure this is after all of
// the registered routes!
router.use(function(req, res) {
	res.status(404).end();
});