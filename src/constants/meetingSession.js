// 1. 세션 스토리지 키 상수들
export const MEETING_PROFILE_STORAGE_KEY = 'meeting_user_profile';
export const PARTICIPANT_TOKEN_KEY = 'participant_token';

// 2. 백엔드 API 엔드포인트 상수들
export const API_BASE_URL = '/api/v1';

export const API_ENDPOINTS = {
  CREATE_MEETING: `${API_BASE_URL}/meetings`,
  GET_PUBLIC_MEETING: (meetingId) => `${API_BASE_URL}/meetings/${meetingId}/public`,
  JOIN_MEETING: (meetingId) => `${API_BASE_URL}/meetings/${meetingId}/participants`,
  GET_MEETING_CONTEXT: (meetingId) => `${API_BASE_URL}/meetings/${meetingId}`,
  GET_MEDIA_SESSION: (meetingId) => `${API_BASE_URL}/meetings/${meetingId}/media-session`,
  GET_PARTICIPANTS: (meetingId) => `${API_BASE_URL}/meetings/${meetingId}/participants`,
  GET_PARTICIPANT_DETAIL: (meetingId, participantId) =>
    `${API_BASE_URL}/meetings/${meetingId}/participants/${participantId}`,
  UPDATE_MY_PROFILE: (meetingId) => `${API_BASE_URL}/meetings/${meetingId}/participants/me/profile`,
  LEAVE_MEETING: (meetingId) => `${API_BASE_URL}/meetings/${meetingId}/leave`,
  END_MEETING: (meetingId) => `${API_BASE_URL}/meetings/${meetingId}/end`,
};