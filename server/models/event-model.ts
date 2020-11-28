const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Event = new Schema({
  start: Date,
  end: Date,
  title: { type: String, required: true },
  desc: String,
  username: String,
});

export = mongoose.model('events', Event);

