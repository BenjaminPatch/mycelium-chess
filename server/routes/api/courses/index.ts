const Util = require('../../../util');
const Course = require('../../../models/course-model');

const router = require('express').Router();

router.get('/', async (req: any, res: any) => {
  Util.coursesForUser(req, (err: any, courseCodes: any) => {
    Course.find({ code: courseCodes}, (err: any, courses: any) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      return res.status(200).json({ success: true, data: courses });
    }).catch((err: any) => console.log(err));
  });
});

router.get('/:courseId', async (req: any, res: any) => {
  // TODO enforce that the user can see this course
  await Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found'});
    }

    return res.status(200).json({ success: true, data: course });
  }).catch((err: any) => console.log(err));
});

router.use('/:courseId/announcements', require('./announcements'));
router.use('/:courseId/assessment', require('./assessment'));
router.use('/:courseId/meetings', require('./meetings'));

export = router;

