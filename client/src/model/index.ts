export interface StudySpace {
  _id: string;
  name: string;
  owner: string;
  isPublic: boolean;
  members: string[];
  color: string;
}

export interface Assessment {
  _id: string;
  due: Date;
  title: string;
  desc: string;
  courseId?: string;
  courseCode?: string;
  courseName?: string;
}

export interface Course {
  _id: string;
  code: string;
  name: string;
  staff: string[];
  assessment: Assessment[];
}

export interface File {
  _id: string;
  data: string;
  filename: string;
  mimetype: string;
}
