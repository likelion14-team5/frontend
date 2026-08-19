// 1. 세션 스토리지 키 상수들
export const MEETING_PROFILE_STORAGE_KEY = 'meeting_user_profile';
export const PARTICIPANT_TOKEN_KEY = 'participant_token';

// 2. 백엔드 API 엔드포인트 상수들
// 로컬 개발은 vite.config.js의 /api proxy로 상대경로('/api/v1')만으로도 동작하지만,
// 프론트/백엔드가 다른 도메인으로 배포되면 이 상대경로가 깨짐 -> 배포 시 VITE_API_BASE_URL로
// 실제 백엔드 주소(예: https://api.samepage.com/api/v1)를 넣어 오버라이드할 수 있게 함.
// 값을 안 주면(로컬 개발 등) 기존과 동일하게 '/api/v1'을 그대로 씀.
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
  // F-02(발언 전 표현 변환) - 백엔드가 OpenAI를 직접 호출하고 프론트는 결과만 받는다.
  CREATE_PRE_SPEECH: (meetingId) => `${API_BASE_URL}/meetings/${meetingId}/pre-speech`,
  REGENERATE_PRE_SPEECH: (meetingId, requestId) =>
    `${API_BASE_URL}/meetings/${meetingId}/pre-speech/${requestId}/regenerate`,
};