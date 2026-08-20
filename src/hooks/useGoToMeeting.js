import {
  API_ENDPOINTS,
  saveMeetingSession,
} from '../constants/meetingSession';
import { mapFrontendProfileToBackend } from '../constants/profileOptions';

// 백엔드 오류 응답은 { error: { code, message } } 형태라 실제 메시지를 꺼내서 보여준다.
async function extractErrorMessage(response) {
  try {
    const body = await response.json();
    if (body?.error?.message) return body.error.message;
  } catch {
    // JSON이 아닌 응답(예: 502 프록시 에러 페이지)이면 아래 기본 메시지로 대체
  }
  return `요청이 실패했습니다. (상태 코드: ${response.status})`;
}

export function useGoToMeeting() {
  return async (url, profile, voiceAnalysisConsent, meetingTab = 'join', newMeetingTitle = '', maxParticipants = 4) => {
    try {
      let meetingId = url.split('/').pop().split('?')[0];
      const targetUrl = `/meetings/${meetingId}`;

      const backendProfile = mapFrontendProfileToBackend(profile);

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
          throw new Error(await extractErrorMessage(createResponse));
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

        saveMeetingSession(
          meetingId,
          createResult.data.participant_token || createResult.data.token,
          {
            participantId: createResult.data.me?.id || createResult.data.participant_id || createResult.data.participant?.id,
            profile,
            voiceAnalysisConsent,
            meetingRole: 'HOST',
          },
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
        throw new Error(await extractErrorMessage(response));
      }

      const result = await response.json();

      // 3. 참가자 토큰 및 프로필 저장
      saveMeetingSession(
        meetingId,
        result.data.participant_token || result.data.token,
        {
          participantId: result.data.me?.id || result.data.participant_id || result.data.participant?.id,
          profile,
          voiceAnalysisConsent,
          meetingRole: 'MEMBER',
        },
      );

      // 4. 회의실 화면으로 이동 (명확한 상대 경로 /meetings/{id} 사용)
      window.location.href = targetUrl;
    } catch (error) {
      console.error('[API 통신 에러]', error);
      alert(error.message || '회의에 입장하는 중 서버와 통신 오류가 발생했습니다. 다시 시도해 주십시오.');
    }
  };
}
