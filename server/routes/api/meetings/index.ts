const Util = require('../../../util');
const Course = require('../../../models/course-model');

const router = require('express').Router();

// Returns all meetings for all courses a student is enrolled in
router.get('/', async (req: any, res: any) => {
  Util.coursesForUser(req, (err: any, courseCodes: any) => {
    Course.find({'code': courseCodes}, (err: any, courses: any) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      let meetings: any[] = [];
      courses.forEach((course: any) => {
        course.meetings.forEach((meeting: any) => {
          meeting.set('courseCode', course.code, { strict: false });
          meeting.set('courseName', course.name, { strict: false });
          meeting.set('courseId', course._id, { strict: false });
          meetings.push(meeting);
        });
      });
      // Return most recent meetings first
      meetings.sort((a: any, b: any) => b.time - a.time);
      return res.status(200).json({ success: true, data: meetings });
    }).catch((err: any) => console.log(err));
  });
});

router.get('/:meetingId', async (req: any, res: any) => {
  Util.coursesForUser(req, (err: any, courseCodes: any) => {
    Course.find({'code': courseCodes}, (err: any, courses: any) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      let meetings: any[] = [];
      for (let i = 0; i < courses.length; i++) {
        for (let j = 0; j < courses[i].meetings.length; j++) {
          if (courses[i].meetings[j].id === req.params.meetingId) {
            return res.status(200).json({ success: true, data: courses[i].meetings[j] });
          }
        }
      }
    }).catch((err: any) => console.log(err));
  })
});


export = router;


