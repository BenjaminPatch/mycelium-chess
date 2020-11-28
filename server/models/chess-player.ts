const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChessPlayer = new Schema({
  name: { type: String, required: true },
  gamesPlayed: Number,
  rating: Number,
}, {
  timestamps: true
});

export = mongoose.model("chessplayers", ChessPlayer);


