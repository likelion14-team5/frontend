import {
  MEETING_PROFILE_STORAGE_KEY,
  PARTICIPANT_TOKEN_KEY, // 토큰 저장용 키
  API_ENDPOINTS,
} from '../constants/meetingSession';
import { mapFrontendProfileToBackend } from '../constants/profileOptions';

export function useGoToMeeting() {
  return async (url, profile, voiceAnalysisConsent, meetingTab = 'join', newMeetingTitle = '', maxParticipants = 4) => {
    try {
      // 입력받은 url에서 순수 meetingId 추출 및 올바른 회의실 URL 경로 재설정
      let meetingId = url.split('/').pop().split('?')[0];
      const targetUrl = `/meetings/${meetingId}`;

      const backendProfile = mapFrontendProfileToBackend(profile);

      // 1. '새 회의 만들기' -> 방+회의+HOST를 한 번에 생성.
      if (meetingTab === 'create') {
        const createResponse = await fetch(API_ENDPOINTS.CREATE_MEETING, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newMeetingTitle || '새 회의',
            max_participants: Number(maxParticipants) || 4,
            host_profile: backendProfile,
            profile_sharing_consent: true,
            voice_analysis_consent: voiceAnalysisConsent,
          }),
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          throw new Error(`회의 생성 실패 (상태 코드: ${createResponse.status}) - ${errorText}`);
        }

        const createResult = await createResponse.json();

        const createdMeetingId =
          createResult.data.meeting_id ??
          createResult.data.id ??
          createResult.data.share_url?.split('/').pop();

        if (!createdMeetingId) {
          throw new Error(
            '회의 생성 응답에서 meeting id를 찾지 못했습니다. 응답 구조(createResult.data)를 확인해주세요.'
          );
        }

        meetingId = createdMeetingId;

        sessionStorage.setItem(PARTICIPANT_TOKEN_KEY, createResult.data.participant_token);
        sessionStorage.setItem(
          MEETING_PROFILE_STORAGE_KEY,
          JSON.stringify({ profile, voiceAnalysisConsent })
        );

        window.location.href = `/meetings/${meetingId}`;
        return;
      }

      // 2. 공유 링크로 들어온 참가 흐름
      const response = await fetch(API_ENDPOINTS.JOIN_MEETING(meetingId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: backendProfile,
          profile_sharing_consent: true,
          voice_analysis_consent: voiceAnalysisConsent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`회의 입장 실패 (상태 코드: ${response.status}) - ${errorText}`);
      }

      const result = await response.json();

      // 3. 참가자 토큰 및 프로필 저장
      sessionStorage.setItem(PARTICIPANT_TOKEN_KEY, result.data.participant_token);
      sessionStorage.setItem(
        MEETING_PROFILE_STORAGE_KEY,
        JSON.stringify({ profile, voiceAnalysisConsent })
      );

      // 4. 회의실 화면으로 이동 (명확한 상대 경로 /meetings/{id} 사용)
      window.location.href = targetUrl;
    } catch (error) {
      console.error('[API 통신 에러]', error);
      alert('회의에 입장하는 중 서버와 통신 오류가 발생했습니다. 다시 시도해 주십시오.');
    }
  };
}