const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const uqsso = require('uqsso');
const cookieParser = require('cookie-parser');
const Util = require('./util');

const db = require('./db');
var fs = require('fs');

const apiRouter = require('./routes/api');
const meetingsRouter = require('./routes/meeting-route');

const app = express();
var env = process.env.NODE_ENV || "development";

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'myceliumChess';

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Use the staff dummy user if true, otherwise use the student dummy user
// TODO find a better way of doing this, @kt?
const ENABLE_STAFF_USER = false;

/** Constant for a dummy student user used in development mode */
const DUMMY_STUDENT = {
  email:"s1234567@student.uq.edu.au",
  name:"John Doe",
  lastname:"Doe",
  firstname:"John",
  groups: [
    "uq:DECO3801_7060_63091",
    "uq:MATH2302_7060_61999",
    "uq:MATH3204_7060_65353"
  ],
  type:"Student",
  user:"s1234567"
};

/** Constant for a dummy staff user used in development mode */
const DUMMY_STAFF = {
  email:"jane.day@uq.edu.au",
  name:"Jane Day",
  lastname:"Day",
  firstname:"Jane",
  type:"StaffCasualStaff",
  user:"uqteststaff"
};

/**
 * Middleware for assigning the dummy user to the req.user.
 */
async function dummyAuth(req: any, res: any, next: any) {
  req.user = ENABLE_STAFF_USER ? DUMMY_STAFF : DUMMY_STUDENT;
  next();
}

if (env === "development") {
    app.use(dummyAuth);
} else {
    app.use(cookieParser());
    app.use(uqsso());
}

app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRouter);
app.use('/', meetingsRouter);

app.get('/api/auth', (req: any, res: any) => {
  Util.coursesForUser(req, (err: any, courses: any) => {
    return res.send(JSON.stringify({ ...req.user, courses: courses }));
  });
});

// routes need to be defined BEFORE this block below
var port = 8081;

if (env === "development") {
    app.use(dummyAuth);
    const {createProxyMiddleware} = require("http-proxy-middleware");
    app.use("/*", createProxyMiddleware({target: "http://localhost:3000", ws: true, xfwd: true}));
} else {
    app.set('trust proxy', 'loopback');
    app.use(express.static(path.join(__dirname, "../client/build")));

    app.get("/*", (req: any, res: { sendFile: (arg0: any) => void; }) => {
        res.sendFile(path.join(__dirname + "/../client/build/index.html"));
    });
}


app.listen(port);
