const Util = require('../../../../util');
const Course = require('../../../../models/course-model');

const router = require('express').Router({ mergeParams: true });

router.get('/', async (req: any, res: any) => {
  await Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    const sortedAssessment = course.assessment.sort((a: any, b: any) => a.due - b.due);
    return res.status(200).json({ success: true, data: sortedAssessment });
  }).catch((err: any) => console.log(err));
});

router.post('/new', async (req: any, res: any) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide an assessment item',
    })
  }

  await Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    course.assessment.push(body);

    course.save().then(() => {
      return res.status(201).json({
        success: true,
        message: 'Assessment created!',
      })
    }).catch((error: any) => {
      return res.status(400).json({
        error,
        message: 'Assessment not created.',
      })
    });
  });
});

router.get('/:assessmentId', async (req: any, res: any) => {
  await Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!course.assessment) {
      return res.status(400).json({ success: false, error: 'No assessment found with this ID' });
    }
    return res.status(200).json({ success: true, data: course.assessment.id(req.params.assessmentId) });
  }).catch((err: any) => console.log(err));
});

router.delete('/:assessmentId', async (req: any, res: any) => {
  Course.findById(req.params.courseId, (err: any, course: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    let assessment = course.assessment.id(req.params.assessmentId);

    if (!assessment) {
      return res.status(404).json({ success: false, error: 'Assessment item not found' });
    }

    course.assessment.pull(assessment);

    course
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: assessment._id,
          message: 'Assessment item deleted',
        })
      })
      .catch((error: any) => {
        return res.status(400).json({
          error,
          message: 'Assessment item not deleted!',
        })
      })
  });
});

router.put('/:assessmentId', async (req: any, res: any) => {
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

    let assessmentItem = course.assessment.id(req.params.assessmentId);

    assessmentItem.due = body.due;
    assessmentItem.title = body.title;
    assessmentItem.desc = body.desc;

    course
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: assessmentItem._id,
          message: 'Assessment updated!',
        })
      })
      .catch((error: any) => {
        return res.status(404).json({
          error,
          message: 'Assessment not updated!',
        })
      })
  });
});

export = router;
