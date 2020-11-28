const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const url = require('url');
const chime = new AWS.Chime({ region: 'us-east-1' });

const alternateEndpoint = process.env.ENDPOINT;
if (alternateEndpoint) {
  console.log('Using endpoint: ' + alternateEndpoint);
  chime.createMeeting({ ClientRequestToken: uuid() }, () => {});
  AWS.NodeHttpClient.sslAgent.options.rejectUnauthorized = false;
  chime.endpoint = new AWS.Endpoint(alternateEndpoint);
} else {
  chime.endpoint = new AWS.Endpoint(
    'https://service.chime.aws.amazon.com/console'
  );
}

const meetingCache = {};
const attendeeCache = {};
const getMeetingDetails = async(req, res) => {
  try {
    const query = url.parse(req.url, true).query;
    const title = String(query.title);

    const name = query.name;
    const region = query.region || 'us-east-1';

    if (!meetingCache[title]) {
      meetingCache[title] = await chime.createMeeting({
          ClientRequestToken: uuid(),
          MediaRegion: region
      }).promise()
      attendeeCache[title] = {};
    }

    // Confirm that the meeting in cache is still going
    const meeting = meetingCache[title];
    try {
      console.log(await chime.getMeeting({ MeetingId: meeting.Meeting.MeetingId }).promise());
    } catch (err) {
      if (err.message.includes("not found") || err.message.includes("The meeting has ended")) {
        console.log("Meeting in cache has ended, creating new one");
        meetingCache[title] = await chime.createMeeting({
            ClientRequestToken: uuid(),
            MediaRegion: region
        }).promise()
        attendeeCache[title] = {};
      } else {
        errorHandle(err, res);
      }
    }

    // Join meeting
    const joinInfo = { JoinInfo: {
        Title: title,
        Meeting: meetingCache[title].Meeting,
        Attendee: (
          await chime
            .createAttendee({
              MeetingId: meetingCache[title].Meeting.MeetingId,
              ExternalUserId: uuid()
            })
            .promise()
        ).Attendee
      }
    };
    // Overwrite the attendee ID with the front-end supplied name
    attendeeCache[title][joinInfo.JoinInfo.Attendee.AttendeeId] = name;
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(joinInfo), 'utf8');
    res.end();
    console.log(JSON.stringify(joinInfo, null, 2));
  } catch (err) {
    errorHandle(err, res);
  }
  console.log(`${req.method} ${req.url} END`);
}

const getAttendee = async(req, res) => {
  try {
    const query = url.parse(req.url, true).query;
    const attendeeInfo = {
      AttendeeInfo: {
        AttendeeId: query.attendee,
        Name: attendeeCache[query.title][query.attendee]
      }
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(attendeeInfo), 'utf8');
    res.end();
    console.log(JSON.stringify(attendeeInfo, null, 2));
  } catch (err) {
    errorHandle(err, res);
  }
  console.log(`${req.method} ${req.url} END`);
}

const endMeeting = async(req, res) => {
  try {
    const query = url.parse(req.url, true).query;
    const title = query.title;
    if (!meetingCache[title]) {
      // meeting doesn't exist. Do nothing
      console.log("endMeeting called but meeting doesn't exist");
      res.statusCode = 404
      res.end();
      return;
    }
    await chime
      .deleteMeeting({
        MeetingId: meetingCache[title].Meeting.MeetingId
      })
      .promise();
    res.statusCode = 200;
    res.end();
  } catch (err) {
    errorHandle(err, res);
  }
  console.log(`${req.method} ${req.url} END`);
}

const errorHandle = (err, res) => {
  console.log(`server caught error: ${err}`);
  res.statusCode = 403;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify({ error: err.message }), 'utf8');
  res.end();
}

exports.getMeetingDetails = getMeetingDetails;
exports.getAttendee = getAttendee;
exports.endMeeting = endMeeting;
