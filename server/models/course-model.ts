const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Announcement = new Schema({
  time: { type: Date, default: Date.now },
  title: { type: String, required: true },
  contents: String,
  author: {
    username: String,
    fullname: String,
    email: String,
  },
});

const classTypes = ['class', 'consult'];

const Meeting = new Schema({
  name: String,
  time: { type: Date, default: Date.now },
  duration: { type: Number, default: 60 },
  type: { type: String, enum: classTypes, default: 'class' },
  owner: String,
});

const Assessment = new Schema({
  due: Date,
  title: { type: String, required: true },
  desc: String,
});

const Course = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  staff: [String],
  announcements: [Announcement],
  meetings: [Meeting],
  assessment: [Assessment],
});

export = mongoose.model('courses', Course);

