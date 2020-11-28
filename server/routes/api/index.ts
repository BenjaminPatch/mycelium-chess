const router = require('express').Router();

router.use('/courses', require('./courses'));
router.use('/announcements', require('./announcements'));
router.use('/events', require('./events'));
router.use('/meetings', require('./meetings'));
router.use('/studyspaces', require('./studyspaces'));
router.use('/files', require('./files'));

module.exports = router;
