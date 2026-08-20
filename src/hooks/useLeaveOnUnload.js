import { useEffect, useRef } from "react";
import { API_ENDPOINTS, PARTICIPANT_TOKEN_KEY } from "../constants/meetingSession";

// BottomBar의 "종료" 버튼을 눌러야만 POST /leave가 호출됐어서, 사용자가 그냥
// 탭/창을 닫아버리면 백엔드엔 계속 JOINED로 남아 참가자 수가 안 줄어드는 문제가 있었음.
// pagehide(페이지가 사라지기 직전) 시점에 keepalive fetch로 /leave를 최선을 다해 호출한다.
// - keepalive: true가 필요한 이유: 일반 fetch는 페이지가 언로드되면 취소될 수 있는데,
//   keepalive를 주면 브라우저가 페이지가 닫힌 뒤에도 요청을 마저 보내준다.
// - sendBeacon을 안 쓴 이유: sendBeacon은 커스텀 헤더(X-Participant-Token)를 못 보낸다.
//
// ⚠️ pagehide는 "진짜로 탭을 닫을 때"뿐 아니라 F5/새로고침에도 똑같이 발생한다.
// 그래서 처음 버전은 새로고침만 해도 /leave가 불려서 재입장이 막히는 부작용이 있었음
// (백엔드가 참가자를 LEFT로 바꿔버려서, 새로고침 후 재연결 시 거부됨).
// -> F5, Ctrl+R, Cmd+R로 인한 새로고침은 keydown에서 미리 감지해서 이땐 /leave를 건너뛴다.
// 다만 브라우저 자체의 새로고침 버튼 클릭이나 주소창 재입력은 JS로 감지할 방법이 없어서
// 이 두 경우까지는 못 잡는다(브라우저 UI 영역이라 페이지 스크립트가 알 수 없는 부분).
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

      const token = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);
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
