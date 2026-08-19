import { useEffect, useRef, useState } from "react";
import Daily from "@daily-co/daily-js";
import { PARTICIPANT_TOKEN_KEY, API_ENDPOINTS, MEETING_PROFILE_STORAGE_KEY } from "../constants/meetingSession";

/**
 * Daily Call Object 연결 레이어. MeetingRoom(page) 최상단에서 한 번만 호출하고,
 * 반환된 callObject를 <DailyProvider callObject={callObject}>로 감싸서
 * VideoGrid뿐 아니라 BottomBar(카메라/마이크/종료)에서도 daily-react 훅으로
 * 같은 연결을 공유해서 쓴다.
 *
 * 1) POST /meetings/{meetingId}/media-session → room_url, meeting_token
 * 2) Daily.createCallObject()로 iframe 없는 연결 객체 생성
 * 3) join() 호출, 이벤트로 연결 상태 추적
 * 4) 언마운트 시 leave() + destroy()
 */
export function useDailyCall(meetingId) {
  const [callObject, setCallObject] = useState(null);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState(null);
  const callObjectRef = useRef(null);

  useEffect(() => {
    if (!meetingId) return undefined;

    let cancelled = false;

    async function connect() {
      try {
        const token = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);
        const response = await fetch(API_ENDPOINTS.GET_MEDIA_SESSION(meetingId), {
          method: "POST",
          headers: { "X-Participant-Token": token },
        });
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body?.error?.message ?? "미디어 세션 발급에 실패했습니다.");
        }
        if (cancelled) return;

        const { room_url, meeting_token } = body.data;
        const co = Daily.createCallObject();
        callObjectRef.current = co;

        co.on("joined-meeting", () => !cancelled && setJoined(true));
        co.on("left-meeting", () => !cancelled && setJoined(false));
        co.on("error", (e) => !cancelled && setError(e?.errorMsg ?? "연결 오류가 발생했습니다."));

        // 요약 프로필 정보는 백엔드 API 없이, Daily의 userData로 참가자끼리 자동 공유되게 실어 보낸다.
        // (join 시 userData를 넣으면 다른 참가자의 participant.userData로 그대로 전달됨)
        const rawProfile = sessionStorage.getItem(MEETING_PROFILE_STORAGE_KEY);
        const meetingProfile = rawProfile ? JSON.parse(rawProfile) : null;
        const myProfile = meetingProfile?.profile;

        setCallObject(co);
        await co.join({
          url: room_url,
          token: meeting_token,
          userData: {
            role: myProfile?.role || "",
            country: myProfile?.country || "",
            englishProficiency: myProfile?.englishProficiency || "",
            communicationStyle: myProfile?.communicationStyle || "",
            meetingRole: meetingProfile?.meetingRole || "MEMBER",
            // 참가자 카드에 "현지 시각"을 보여주기 위한 시간대(스펙 4.4) - 프로필 저장 시점이 아니라
            // 지금 이 순간 이 브라우저의 시간대를 그대로 보낸다(둘이 어긋날 일이 없음).
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        });
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    connect();

    return () => {
      cancelled = true;
      const co = callObjectRef.current;
      if (co) {
        co.leave()
          .catch(() => {})
          .finally(() => co.destroy());
        callObjectRef.current = null;
      }
    };
  }, [meetingId]);

  return { callObject, joined, error };
}