const express = require('express');

const MeetingCtrl = require('../controllers/meeting-ctrl');

const router = express.Router();

router.post('/classes/join*', MeetingCtrl.getMeetingDetails);
router.get('/classes/attendee*', MeetingCtrl.getAttendee);
router.post('/classes/end*', MeetingCtrl.endMeeting);

export = router;
