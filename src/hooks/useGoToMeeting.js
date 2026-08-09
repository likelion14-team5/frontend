import { MEETING_PROFILE_STORAGE_KEY } from '../constants/meetingSession';

// 이 함수로 프로필을 sessionStorage에 담고 회의방으로 이동시킨다. 
export function useGoToMeeting() {
  return (url, profile, voiceAnalysisConsent) => {
    sessionStorage.setItem(
      MEETING_PROFILE_STORAGE_KEY,
      JSON.stringify({ profile, voiceAnalysisConsent })
    );
    window.location.href = url;
  };
}
