export const MEETING_PROFILE_STORAGE_KEY = 'meeting_user_profile';
export const PARTICIPANT_TOKEN_KEY = 'participant_token';

// 프론트/백엔드가 다른 도메인으로 배포되면 상대경로('/api/v1')가 깨지므로
// VITE_API_BASE_URL로 실제 백엔드 주소를 오버라이드할 수 있게 한다.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

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

  TOGGLE_VOICE_ANALYSIS: (meetingId) =>
    `${API_BASE_URL}/meetings/${meetingId}/participants/me/voice-analysis`,

  CREATE_PRE_SPEECH: (meetingId) => `${API_BASE_URL}/meetings/${meetingId}/pre-speech`,
  GET_PRE_SPEECH: (meetingId, requestId) =>
    `${API_BASE_URL}/meetings/${meetingId}/pre-speech/${requestId}`,
  REGENERATE_PRE_SPEECH: (meetingId, requestId) =>
    `${API_BASE_URL}/meetings/${meetingId}/pre-speech/${requestId}/regenerate`,

  ANALYZE_SPEECH_FEEDBACK: (meetingId) =>
    `${API_BASE_URL}/meetings/${meetingId}/speech-feedback/analyze`,
  GET_SPEECH_FEEDBACK_LIST: (meetingId) =>
    `${API_BASE_URL}/meetings/${meetingId}/speech-feedback`,
  DISMISS_SPEECH_FEEDBACK: (meetingId, feedbackId) =>
    `${API_BASE_URL}/meetings/${meetingId}/speech-feedback/${feedbackId}`,
};