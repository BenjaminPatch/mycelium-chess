const Util = require('../../../util');
const StudySpace = require('../../../models/studyspace-model');

const router = require('express').Router();

// Returns all study spaces a user is a member of
router.get('/', async (req: any, res: any) => {
  StudySpace.find({ $or: [
    { owner: req.user.user },
    { members: req.user.user }
  ]}, (err: any, studyspaces: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    return res.status(200).json({ success: true, data: studyspaces });
  }).catch((err: any) => console.log(err));
});

router.get('/:id', async (req: any, res: any) => {
  StudySpace.findById(req.params.id, (err: any, studySpace: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!studySpace) {
      return res.status(404).json({ success: false, error: 'Study space not found'});
    }

    return res.status(200).json({ success: true, data: studySpace });
  }).catch((err: any) => console.log(err));
});

router.post('/new', async (req: any, res: any) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a study space',
    })
  }

  body.owner = req.user.user;

  const studySpace = new StudySpace(body);

  if (!studySpace) {
    return res.status(400).json({ success: false, error: 'Study space could not be created.' });
  }

  studySpace.save().then(() => {
    return res.status(201).json({
      success: true,
      message: 'Study space created!',
    })
  }).catch((error: any) => {
    return res.status(400).json({
      error,
      message: 'Study space not created.',
    })
  });
});

router.put('/:id', async (req: any, res: any) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    });
  }

  StudySpace.findById(req.params.id, (err: any, studySpace: any) => {
    if (err) {
      return res.status(404).json({
        err,
        message: 'Study space not found!',
      })
    }
    studySpace.name = body.name;
    studySpace.isPublic = body.isPublic;
    studySpace.members = body.members;
    studySpace.color = body.color;

    studySpace
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: studySpace._id,
          message: 'Study space updated!',
        })
      })
      .catch((error: any) => {
        return res.status(404).json({
          error,
          message: 'Study space not updated!',
        })
      })
  });
});

router.delete('/:id', async (req: any, res: any) => {
  StudySpace.findByIdAndDelete(req.params.id, (err: any, studySpace: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    return res.status(200).json({ success: 200, data: studySpace });
  });
});

router.post('/:id/join', async (req: any, res: any) => {
  StudySpace.findById(req.params.id, (err: any, studySpace: any) => {
    if (err) {
      return res.status(404).json({
        err,
        message: 'Study space not found!',
      })
    }

    /* Can't join non-public study spaces */
    if (!studySpace || !studySpace.isPublic) {
      return res.status(404).json({
        err,
        message: 'Study space not found!',
      })
    }

    if (studySpace.members.includes(req.user.user)) {
      return res.status(400).json({
        success: false,
        message: 'Already a member of this study space',
      });
    }

    studySpace.members.push(req.user.user);
    studySpace
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: studySpace._id,
          message: 'Joined study space!',
        })
      })
      .catch((error: any) => {
        return res.status(404).json({
          error,
          message: 'Could not join study space',
        })
      })
  });
});

router.post('/:id/leave', async (req: any, res: any) => {
  StudySpace.findById(req.params.id, (err: any, studySpace: any) => {
    if (err) {
      return res.status(404).json({
        err,
        message: 'Study space not found!',
      })
    }

    /* Can't leave a study space we are not a member of */
    if (!studySpace || !studySpace.members.includes(req.user.user)) {
      return res.status(404).json({
        err,
        message: 'Study space not found!',
      })
    }

    studySpace.members.pull(req.user.user);
    studySpace
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: studySpace._id,
          message: 'Left study space!',
        })
      })
      .catch((error: any) => {
        return res.status(404).json({
          error,
          message: 'Could not leave study space',
        })
      })
  });
});


export = router;

