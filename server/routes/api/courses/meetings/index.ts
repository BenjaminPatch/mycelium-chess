const Util = require('../../../../util');
const Course = require('../../../../models/course-model');

const router = require('express').Router({ mergeParams: true });

const moment = require('moment');

router.get('/', async (req: any, res: any) => {
  await Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    const sortedMeetings = course.meetings.sort((a: any, b: any) => b.time - a.time);
    return res.status(200).json({ success: true, data: sortedMeetings });
  }).catch((err: any) => console.log(err));
});

router.post('/new', async (req: any, res: any) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide an meeting',
    })
  }

  await Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    /* Add recurring meetings */
    for (let i = 0; i < body.numMeetings; ++i) {
      let meetingTime: Date;

      if (body.repeatFrequency === 'Daily') {
        meetingTime = moment(body.time).add(i, 'days').toDate();
      } else if (body.repeatFrequency === 'Weekly') {
        meetingTime = moment(body.time).add(i, 'weeks').toDate();
      } else if (body.repeatFrequency === 'Fortnightly') {
        meetingTime = moment(body.time).add(i * 2, 'weeks').toDate();
      } else {
        meetingTime = body.time;
      }
      
      course.meetings.push({
        name: body.name,
        time: meetingTime,
        duration: body.duration,
        type: body.type,
        owner: body.owner,
      });
    }

    course.save().then(() => {
      return res.status(201).json({
        success: true,
        message: 'Meeting created!',
      })
    }).catch((error: any) => {
      return res.status(400).json({
        error,
        message: 'Meeting not created.',
      })
    });
  });
});

// get :meetingId
router.delete('/:meetingId', async (req: any, res: any) => {
  Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    let meeting = course.meetings.id(req.params.meetingId);

    if (!meeting) {
      return res.status(404).json({ success: false, error: 'Meeting not found' });
    }

    course.meetings.pull(meeting);

    course
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: meeting._id,
          message: 'Meeting deleted',
        })
      })
      .catch((error: any) => {
        return res.status(400).json({
          error,
          message: 'Meeting not deleted!',
        })
      })
  });
});

router.put('/:meetingId', async (req: any, res: any) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    });
  }

  Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(404).json({
        err,
        message: 'Course not found!',
      })
    }

    let meeting = course.meetings.id(req.params.meetingId);

    meeting.name = body.name;
    meeting.time = body.time;
    meeting.duration = body.duration;

    course
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: meeting._id,
          message: 'Meeting updated!',
        })
      })
      .catch((error: any) => {
        return res.status(404).json({
          error,
          message: 'Meeting not updated!',
        })
      })
  });
});

export = router;



