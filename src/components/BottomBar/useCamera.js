import { useCallback } from "react";
import { useDaily, useLocalParticipant } from "@daily-co/daily-react";

// 카메라 ON/OFF — 실제 Daily 로컬 트랙 상태를 그대로 사용한다.
// 아직 연결 전(daily/localParticipant가 없음)에는 켜진 것으로 간주해 버튼이 자연스럽게 보이게 함.
export function useCamera() {
  const daily = useDaily();
  const localParticipant = useLocalParticipant();
  const cameraOn = localParticipant ? localParticipant.video : true;

  const toggleCamera = useCallback(() => {
    daily?.setLocalVideo(!cameraOn);
  }, [daily, cameraOn]);

  return { cameraOn, toggleCamera };
}