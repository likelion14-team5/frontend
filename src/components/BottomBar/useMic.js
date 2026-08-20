import { useCallback } from "react";
import { useDaily, useLocalParticipant } from "@daily-co/daily-react";

// 마이크 ON/OFF — 실제 Daily 로컬 트랙 상태를 그대로 사용한다.
// participant.audio(불리언)는 deprecated라 값이 안 바뀌는 문제가 있어서
// tracks.audio.state를 본다 - useCamera.js와 동일한 이유로 "off" 외에
// "blocked"(권한 거부)/"interrupted"도 꺼짐으로 취급한다.
const OFF_STATES = ["off", "blocked", "interrupted"];

export function useMic() {
  const daily = useDaily();
  const localParticipant = useLocalParticipant();
  const micOn = localParticipant ? !OFF_STATES.includes(localParticipant.tracks.audio.state) : true;

  const toggleMic = useCallback(() => {
    daily?.setLocalAudio(!micOn);
  }, [daily, micOn]);

  return { micOn, toggleMic };
}