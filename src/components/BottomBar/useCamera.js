import { useCallback } from "react";
import { useDaily, useLocalParticipant } from "@daily-co/daily-react";

// 카메라 ON/OFF — 실제 Daily 로컬 트랙 상태를 그대로 사용한다.
// participant.video(불리언)는 daily-js에서 deprecated된 필드라 이 프로젝트가 쓰는 버전에서는
// 값이 갱신되지 않아 카메라를 꺼도 버튼이 계속 ON으로 보이는 문제가 있었음
// -> 대신 문서가 권장하는 tracks.video.state를 본다.
// "off"뿐 아니라 "blocked"(권한 거부/다른 앱이 점유 중)와 "interrupted"도 실제로는
// 화면이 안 나오는 상태라 꺼짐으로 취급한다 - 안 그러면 권한이 막혔을 때 버튼이 계속
// "켜짐"으로 보여서 눌러도 아무 반응이 없는 것처럼 보인다.
// 아직 연결 전(daily/localParticipant가 없음)에는 켜진 것으로 간주해 버튼이 자연스럽게 보이게 함.
const OFF_STATES = ["off", "blocked", "interrupted"];

export function useCamera() {
  const daily = useDaily();
  const localParticipant = useLocalParticipant();
  const cameraOn = localParticipant ? !OFF_STATES.includes(localParticipant.tracks.video.state) : true;

  const toggleCamera = useCallback(() => {
    daily?.setLocalVideo(!cameraOn);
  }, [daily, cameraOn]);

  return { cameraOn, toggleCamera };
}