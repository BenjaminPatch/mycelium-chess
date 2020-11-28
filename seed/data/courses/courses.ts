import { Course, Announcement, AnnouncementAuthor } from '../../models';
import { getObjectId } from 'mongo-seeding';
import { LoremIpsum } from 'lorem-ipsum';

// Maximum number of announcements to generate per course
const maxAnnouncementsPerCourse = 10;

// Date of first possible course announcement
const startDate = new Date('2020-08-03');

// Function to generate a random date between the two given dates
const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Returns a random element of the given array
const randomChoice = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Lorem Ipsum configuration
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 4,
    min: 1
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const staffDetails = [
  {
    username: "uqmmil12",
    fullname: "Maxwell Miller",
    email: "maxwell.miller@uq.edu.au",
  },
  {
    username: "uqktho19",
    fullname: "Kristian Thomassen",
    email: "k.thomassen@uq.net.au",
  },
  {
    username: "uqldeaki",
    fullname: "Lochlan Deakin-Sharpe",
    email: "l.deakinsharpe@uq.net.au",
  },
  {
    username: "uqmtruff",
    fullname: "Anna Truffet",
    email: "anna.truffet@uq.net.au",
  },
  {
    username: "uqteststaff",
    fullname: "Jane Day",
    email: "jane.day@uq.edu.au",
  },
];

const courseDetails = [
  {
    _id: getObjectId('course0'),
    code: 'ABCD1234',
    name: 'Dummy Course',
  },
  {
    _id: getObjectId('course1'),
    code: 'DECO3801',
    name: 'Design Computing Studio 3 - Build',
  },
  {
    _id: getObjectId('course2'),
    code: 'CSSE2002',
    name: 'Programming in the Large',
  },
  {
    _id: getObjectId('course3'),
    code: 'COMP3506',
    name: 'Algorithms and Data Structures',
  },
  {
    _id: getObjectId('course4'),
    code: 'ECON3360',
    name: 'Causal Inference for Microeconometrics',
  },
  {
    _id: getObjectId('course5'),
    code: 'ECON3220',
    name: 'Benefit-Cost Analysis for Business',
  },
  {
    _id: getObjectId('course6'),
    code: 'CSSE3080',
    name: 'Special Topics in Computer Systems 3A',
  },
  {
    _id: getObjectId('course7'),
    code: 'MATH3204',
    name: 'Numerical Linear Algebra and Optimisation',
  },
  {
    _id: getObjectId('course8'),
    code: 'MATH2302',
    name: 'Discrete Mathematics II',
  },
  {
    _id: getObjectId('course9'),
    code: 'RBUS3094',
    name: 'Integrated Commerce in Practice',
  },
  {
    _id: getObjectId('course10'),
    code: 'LAWS1100',
    name: 'Business Law',
  },
  {
    _id: getObjectId('course11'),
    code: 'CSSE4630',
    name: 'Principles of Program Analysis',
  },
  {
    _id: getObjectId('course12'),
    code: 'COMP4500',
    name: 'Advanced Algorithms & Data Structures',
  },
  {
    _id: getObjectId('course13'),
    code: 'STAT2203',
    name: 'Probability Models and Data Analysis for Engineering',
  },
  {
    _id: getObjectId('course14'),
    code: 'PHYS3020',
    name: 'Statistical Mechanics',
  },
  {
    _id: getObjectId('course15'),
    code: 'PHYS2082',
    name: 'Space Science & Stellar Astrophysics',
  },
  {
    _id: getObjectId('course16'),
    code: 'COMP3702',
    name: 'Artificial Intelligence',
  },
]

let courses: Course[] = [];

courseDetails.forEach((course: any) => {
  course.staff = staffDetails.map(s => s.username);

  let announcements: Announcement[] = [];

  for (let i = 0; i < Math.random() * maxAnnouncementsPerCourse; i++) {
    let author: AnnouncementAuthor = randomChoice(staffDetails);

    announcements.push({
      _id: getObjectId('course' + course.code + 'announcement' + i),
      time: randomDate(startDate, new Date()),
      title: lorem.generateSentences(1),
      contents: lorem.generateParagraphs(Math.floor(Math.random() * 6) + 1).replace(/\n/g, '\n\n'),
      author: author,
    });
  }

  course.announcements = announcements;
  courses.push(course);
});

export = courses;

