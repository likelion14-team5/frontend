import {
  MEETING_PROFILE_STORAGE_KEY,
  PARTICIPANT_TOKEN_KEY, // 토큰 저장용 키
  API_ENDPOINTS,
} from '../constants/meetingSession';
import { mapFrontendProfileToBackend } from '../constants/profileOptions';

export function useGoToMeeting() {
  return async (url, profile, voiceAnalysisConsent, meetingTab = 'join', newMeetingTitle = '', maxParticipants = 4) => {
    try {
      let meetingId = url.split('/').pop();
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

        // meeting_id 필드명이 실제로 뭔지 확실치 않아서(이게 이번 undefined 버그의 원인)
        // 여러 후보를 순서대로 시도하고, 다 없으면 조용히 넘어가지 않고 바로 에러를 던진다.
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
        url = `/meetings/${meetingId}`;

        // HOST는 이 응답에서 이미 participant_token을 받는다 (README: "참가자 opaque
        // token 원문 1회 발급"). 그러니 아래 JOIN_MEETING을 또 호출할 필요가 없고,
        // 호출하면 같은 이름으로 두 번째 참가자를 만들려다 충돌만 날 수 있다.
        sessionStorage.setItem(PARTICIPANT_TOKEN_KEY, createResult.data.participant_token);
        sessionStorage.setItem(
          MEETING_PROFILE_STORAGE_KEY,
          JSON.stringify({ profile, voiceAnalysisConsent })
        );

        window.location.href = url;
        return;
      }

      // 2. 공유 링크로 들어온 '참가' 흐름
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

      // 4. 회의실 화면으로 이동
      window.location.href = url;
    } catch (error) {
      console.error('[API 통신 에러]', error);
      alert('회의에 입장하는 중 서버와 통신 오류가 발생했습니다. 다시 시도해 주십시오.');
    }
  };
}