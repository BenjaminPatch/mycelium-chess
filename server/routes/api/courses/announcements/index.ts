const Util = require('../../../../util');
const Course = require('../../../../models/course-model');

const router = require('express').Router({ mergeParams: true });

router.get('/', async (req: any, res: any) => {
  await Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    const sortedAnnouncements = course.announcements.sort((a: any, b: any) => b.time - a.time);
    return res.status(200).json({ success: true, data: sortedAnnouncements });
  }).catch((err: any) => console.log(err));
});

router.post('/new', async (req: any, res: any) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide an announcement',
    })
  }

  await Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    course.announcements.push(body);

    course.save().then(() => {
      return res.status(201).json({
        success: true,
        message: 'Announcement created!',
      })
    }).catch((error: any) => {
      return res.status(400).json({
        error,
        message: 'Announcement not created.',
      })
    });
  });
});

router.get('/:announcementId', async (req: any, res: any) => {
  await Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!course.announcements) {
      return res.status(400).json({ success: false, error: 'No announcements for course' });
    }
    return res.status(200).json({ success: true, data: course.announcements.id(req.params.announcementId) });
  }).catch((err: any) => console.log(err));
});

router.delete('/:announcementId', async (req: any, res: any) => {
  Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    let announcement = course.announcements.id(req.params.announcementId);

    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    course.announcements.pull(announcement);

    course
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: announcement._id,
          message: 'Announcement deleted',
        })
      })
      .catch((error: any) => {
        return res.status(400).json({
          error,
          message: 'Announcement not deleted!',
        })
      })
  });
});

router.put('/:announcementId', async (req: any, res: any) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    });
  }

  Course.findOne({ _id: req.params.courseId }, (err: any, course: any) => {
    if (err) {
      return res.status(404).json({
        err,
        message: 'Course not found!',
      })
    }

    let announcement = course.announcements.id(req.params.announcementId);

    announcement.title = body.title;
    announcement.contents = body.contents;

    course
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: announcement._id,
          message: 'Announcement updated!',
        })
      })
      .catch((error: any) => {
        return res.status(404).json({
          error,
          message: 'Announcement not updated!',
        })
      })
  });
});

export = router;


