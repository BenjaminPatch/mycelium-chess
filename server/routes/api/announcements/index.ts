const Util = require('../../../util');
const Course = require('../../../models/course-model');

const router = require('express').Router();

// Returns all announcements for all courses a student is enrolled in
router.get('/', async (req: any, res: any) => {
  Util.coursesForUser(req, (err: any, courseCodes: any) => {
    Course.find({'code': courseCodes}, (err: any, courses: any) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      let announcements: any[] = [];
      courses.forEach((course: any) => {
        course.announcements.forEach((announcement: any) => {
          announcement.set('courseCode', course.code, { strict: false });
          announcement.set('courseName', course.name, { strict: false });
          announcement.set('courseId', course._id, { strict: false });
          announcements.push(announcement);
        });
      });
      // Return most recent announcements first
      announcements.sort((a: any, b: any) => b.time - a.time);
      return res.status(200).json({ success: true, data: announcements });
    }).catch((err: any) => console.log(err));
  });
});

export = router;

