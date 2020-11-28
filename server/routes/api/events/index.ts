const Util = require('../../../util');
const Event = require('../../../models/event-model');
const Course = require('../../../models/course-model');

const router = require('express').Router();

router.get('/', async (req: any, res: any) => {
  let allEvents: any[] = [];
  await Event.find({ username: req.user.user }, (err: any, events: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    allEvents = allEvents.concat(events);

    /* Find all course assessment for the user's courses */
    Util.coursesForUser(req, (err: any, courseCodes: any) => {
      if (err || !courseCodes) {
        /* Return early with only user-created events */
        return res.status(200).json({ success: true, data: allEvents });
      }
      Course.find({ code: courseCodes}, (err: any, courses: any) => {
        if (err || !courses) {
          return res.status(200).json({ success: true, data: allEvents });
        }
        courses.forEach((course: any) => {
          course.assessment.forEach((assessment: any) => {
            assessment.set('courseId', course._id, { strict: false });
            assessment.set('courseCode', course.code, { strict: false });
            assessment.set('courseName', course.name, { strict: false });
            allEvents.push(assessment);
          });
        });
        return res.status(200).json({ success: true, data: allEvents });
      });
    });
  }).catch((err: any) => console.log(err));
});

router.post('/new', async (req: any, res: any) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide an event',
    })
  }

  const event = new Event(body);

  if (!event) {
    return res.status(400).json({ success: false, error: 'Event could not be created.' });
  }

  event.save().then(() => {
    return res.status(201).json({
      success: true,
      message: 'Event created!',
    })
  }).catch((error: any) => {
    return res.status(400).json({
      error,
      message: 'Event not created.',
    })
  });
});

router.delete('/:eventId', async (req: any, res: any) => {
  Event.findByIdAndDelete(req.params.eventId, (err: any, event: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    return res.status(200).json({ success: 200, data: event });
  });
});

router.put('/:eventId', async (req: any, res: any) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    });
  }

  Event.findById(req.params.eventId, (err: any, event: any) => {
    if (err) {
      return res.status(404).json({
        err,
        message: 'Event not found!',
      })
    }
    event.title = body.title
    event.desc = body.desc
    event.start = body.start
    event.end = body.end
    event
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: event._id,
          message: 'Event updated!',
        })
      })
      .catch((error: any) => {
        return res.status(404).json({
          error,
          message: 'Event not updated!',
        })
      })
  });
});

export = router;

