const Course = require('../models/course-model');

/*
 * Returns an array of course codes that represent the courses for a user making
 * the given request.
 * If the user is a student, get their enrolled courses.
 * If the user is a staff member, return all the courses that they are a staff
 * member in.
 */
const coursesForUser = (req: any, callback: any) => {
  if (req.user.type === 'Student') {
    const groups = req.user.groups;
    let courseCodes: string[] = [];
    const regex = /([A-Z]){4}([0-9]){4}/g;
    groups.forEach((groupId: string) => {
      const matches = groupId.match(regex);
      if (matches === null) {
        return;
      }
      courseCodes.push(matches[0]);
    });
    courseCodes.push('ABCD1234'); // TODO remove in production
    callback(null, courseCodes);
  } else {
    // If staff user, find all courses in the DB that have this user's username
    // as a staff member
    Course.find({'staff': req.user.user}, (err: any, courses: any) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, courses.map((c: any) => c.code));
      }
    }).catch((err: any) => console.log(err));
  }
};

export = { coursesForUser };
