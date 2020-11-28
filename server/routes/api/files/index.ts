const Util = require('../../../util');
const File = require('../../../models/file-model');

const fs = require('fs');
const multer = require('multer');

const router = require('express').Router();

const upload = multer({ dest: 'tmp/' });

router.get('/:id', async (req: any, res: any) => {
  File.findById(req.params.id, (err: any, file: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!file) {
      return res.status(404).json({ success: false, error: 'File not found'});
    }

    return res.status(200).json({ success: true, data: file });
  }).catch((err: any) => console.log(err));
});

router.get('/:id/download', async (req: any, res: any) => {
  File.findById(req.params.id, (err: any, file: any) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!file) {
      return res.status(404).json({ success: false, error: 'File not found'});
    }

    res.set('Content-Type', file.mimetype);
    res.set('Content-Disposition', `attachment; filename=${file.filename}`);

    return res.status(200).send(file.data);
  }).catch((err: any) => console.log(err));
});

router.post('/new', upload.single('file'), async (req: any, res: any) => {
  const body = req.body;
  body.data = fs.readFileSync(req.file.path); // load file from disk

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a file',
    })
  }

  const file = new File(body);

  if (!file) {
    return res.status(400).json({ success: false, error: 'File could not be created.' });
  }

  file.save().then(() => {
    return res.status(201).json({
      success: true,
      id: file._id,
      message: 'File created!',
    })
  }).catch((error: any) => {
    return res.status(400).json({
      error,
      message: 'File not created.',
    })
  });
});

export = router;


