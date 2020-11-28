const mongoose = require('mongoose');

let dbUri: string;

// Use the MongoDB Docker container locally
let env = process.env.NODE_ENV || "development";
if (env === "development") {
  dbUri = 'mongodb://mongodb_container:27017/devo3801';
} else {
  dbUri = 'mongodb://localhost:27017/devo3801';
}

mongoose.connect(dbUri, (err: any) => {
  if (err) {
    console.log(err.message);
    console.log(err);
  } else {
    console.log('Connected to MongoDB');
  }
});

const db = mongoose.connection;

export = db;

