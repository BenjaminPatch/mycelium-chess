export interface AnnouncementAuthor {
  username: string;
  fullname: string;
  email: string;
}

export interface Announcement {
  _id: string;
  time: Date;
  title: string;
  contents: string;
  author: AnnouncementAuthor;
}

export interface Course {
  _id: string;
  code: string;
  name: string;
  staff: string[];
  announcements: Announcement[];
}

