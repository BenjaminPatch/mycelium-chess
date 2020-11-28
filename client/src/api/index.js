import axios from 'axios';

const api = axios.create({
  baseURL: '/api/',
});

export const insertAnnouncement = (courseId, payload) => api.post(`/courses/${courseId}/announcements/new`, payload);
export const updateAnnouncement = (courseId, announcementId, payload) => api.put(`/courses/${courseId}/announcements/${announcementId}`, payload);
export const deleteAnnouncement = (courseId, announcementId) => api.delete(`/courses/${courseId}/announcements/${announcementId}`);

export const insertAssessment = (courseId, payload) => api.post(`/courses/${courseId}/assessment/new`, payload);
export const updateAssessment = (courseId, assessmentId, payload) => api.put(`/courses/${courseId}/assessment/${assessmentId}`, payload);
export const deleteAssessment = (courseId, assessmentId) => api.delete(`/courses/${courseId}/assessment/${assessmentId}`);

export const insertEvent = (payload) => api.post(`/events/new`, payload);
export const deleteEvent = id => api.delete(`/events/${id}`);
export const updateEvent = (id, payload) => api.put(`/events/${id}`, payload);

export const insertMeeting = (courseId, payload) => api.post(`/courses/${courseId}/meetings/new`, payload);
export const updateMeeting = (courseId, meetingId, payload) => api.put(`/courses/${courseId}/meetings/${meetingId}`, payload);
export const deleteMeeting = (courseId, meetingId) => api.delete(`/courses/${courseId}/meetings/${meetingId}`);

export const insertStudySpace = payload => api.post(`/studyspaces/new`, payload);
export const updateStudySpace = (id, payload) => api.put(`/studyspaces/${id}`, payload);
export const deleteStudySpace = id => api.delete(`/studyspaces/${id}`);
export const joinStudySpace = id => api.post(`/studyspaces/${id}/join`, {});
export const leaveStudySpace = id => api.post(`/studyspaces/${id}/leave`, {});

export const insertFile = payload => api.post(`/files/new`, payload, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const apis = {
  insertAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  insertAssessment,
  updateAssessment,
  deleteAssessment,
  insertEvent,
  deleteEvent,
  updateEvent,
  insertMeeting,
  updateMeeting,
  deleteMeeting,
  insertStudySpace,
  updateStudySpace,
  deleteStudySpace,
  joinStudySpace,
  leaveStudySpace,
  insertFile,
};

export default apis;
