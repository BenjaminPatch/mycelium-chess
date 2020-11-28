const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudySpace = new Schema({
  name: { type: String, required: true },
  owner: String,
  isPublic: Boolean,
  members: [String],
  color: { type: String, default: "#51247A" },
}, {
  timestamps: true
});

export = mongoose.model('studyspaces', StudySpace);


