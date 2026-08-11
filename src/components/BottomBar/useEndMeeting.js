import { useState } from 'react';
import { MEETING_PROFILE_STORAGE_KEY } from '../../constants/meetingSession';

// 종료 확인 모달 상태 + 실제 종료(메인 화면 이동) 처리
export function useEndMeeting() {
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const requestEnd = () => setShowEndConfirm(true);
  const cancelEnd = () => setShowEndConfirm(false);

  const confirmEnd = () => {
    // 실제 연동 시엔 POST /meetings/{id}/end 호출 후 이동하면 된다
    sessionStorage.removeItem(MEETING_PROFILE_STORAGE_KEY);
    window.location.href = '/';
  };

  return { showEndConfirm, requestEnd, cancelEnd, confirmEnd };
}
