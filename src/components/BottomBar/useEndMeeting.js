import { useState } from 'react';
import { useDaily } from '@daily-co/daily-react';
import {
  MEETING_PROFILE_STORAGE_KEY,
  PARTICIPANT_TOKEN_KEY,
  API_ENDPOINTS,
} from '../../constants/meetingSession';

// react-router-dom을 안 써서 MeetingRoom.jsx와 동일한 방식으로 URL에서 직접 뽑는다.
function extractMeetingIdFromPath(pathname) {
  const match = pathname.match(/\/meetings\/([^/]+)/);
  return match ? match[1] : null;
}

// 회의 나가기 / 종료 확인 모달 상태 + 실제 처리.
// isHost가 true면 POST /end(전체 종료), false면 POST /leave(일반 퇴장)를 호출한다.
// 둘 다 성공 시 204 No Content라 body는 안 읽는다.
export function useEndMeeting(isHost = false) {
  const meetingId = extractMeetingIdFromPath(window.location.pathname);
  const daily = useDaily();
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [ending, setEnding] = useState(false);

  const requestEnd = () => setShowEndConfirm(true);
  const cancelEnd = () => setShowEndConfirm(false);

  // BottomBar에서 확인 모달 문구를 role별로 다르게 보여주고 싶을 때 쓰라고 같이 반환.
  const confirmMessage = isHost
    ? '회의를 종료하시겠습니까? 모든 참가자가 함께 나가게 됩니다.'
    : '회의에서 나가시겠습니까?';

  const confirmEnd = async () => {
    setEnding(true);

    try {
      const token = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);
      const endpoint = isHost
        ? API_ENDPOINTS.END_MEETING(meetingId)
        : API_ENDPOINTS.LEAVE_MEETING(meetingId);

      await fetch(endpoint, {
        method: 'POST',
        headers: { 'X-Participant-Token': token },
      });
    } catch {
      // API 호출이 실패해도 로컬 정리는 계속 진행한다.
      // 외부 요인 때문에 사용자가 회의를 못 나가면 안 되기 때문.
    }

    try {
      await daily?.leave();
      daily?.destroy();
    } catch {
      // no-op — 어차피 곧 페이지를 벗어난다.
    }

    sessionStorage.removeItem(MEETING_PROFILE_STORAGE_KEY);
    sessionStorage.removeItem(PARTICIPANT_TOKEN_KEY);
    window.location.href = '/';
  };

  return { showEndConfirm, requestEnd, cancelEnd, confirmEnd, confirmMessage, ending };
}