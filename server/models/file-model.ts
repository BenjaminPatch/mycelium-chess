const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const File = new Schema({
  data: { type: Buffer, required: true },
  filename: { type: String, required: true },
  mimetype: { type: String, required: true },
  createdAt: { type: Date, expires: 60*60*6, default: Date.now }, // auto-delete after 6 hours
});

export = mongoose.model('files', File);


