import { useEffect, useRef } from "react";
import { API_ENDPOINTS, getParticipantToken } from "../constants/meetingSession";

// 탭/창을 그냥 닫아도 백엔드에 퇴장 처리(/leave)가 되도록 pagehide 시점에 호출한다.
// keepalive: true - 일반 fetch는 언로드 중 취소될 수 있어서 필요함.
// sendBeacon 대신 fetch를 쓴 이유 - sendBeacon은 커스텀 헤더(X-Participant-Token)를 못 보냄.
//
// pagehide는 F5/새로고침에도 똑같이 발생하므로, keydown에서 F5·Ctrl+R·Cmd+R을 미리 감지해
// 그 경우엔 /leave를 건너뛴다. 브라우저 자체 새로고침 버튼 클릭은 페이지 스크립트가
// 감지할 방법이 없어 못 잡는다.
export function useLeaveOnUnload(meetingId) {
  const isReloadingRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isF5 = e.key === "F5";
      const isCtrlOrCmdR = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r";
      if (isF5 || isCtrlOrCmdR) {
        isReloadingRef.current = true;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!meetingId) return undefined;

    const leave = () => {
      if (isReloadingRef.current) return; // F5/Ctrl+R 새로고침이면 나간 걸로 처리하지 않는다.

      const token = getParticipantToken(meetingId);
      if (!token) return;
      try {
        fetch(API_ENDPOINTS.LEAVE_MEETING(meetingId), {
          method: "POST",
          headers: { "X-Participant-Token": token },
          keepalive: true,
        });
      } catch {
        // 창이 닫히는 중이라 실패해도 할 수 있는 게 없다.
      }
    };

    window.addEventListener("pagehide", leave);
    return () => window.removeEventListener("pagehide", leave);
  }, [meetingId]);
}
