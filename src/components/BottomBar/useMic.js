import { useCallback } from "react";
import { useDaily, useLocalParticipant } from "@daily-co/daily-react";

// 마이크 ON/OFF — 실제 Daily 로컬 트랙 상태를 그대로 사용한다.
// participant.audio(불리언)는 deprecated라 값이 안 바뀌는 문제가 있어서
// tracks.audio.state를 본다 ('off'가 아니면 켜진 것으로 취급) - useCamera.js와 동일한 이유.
export function useMic() {
  const daily = useDaily();
  const localParticipant = useLocalParticipant();
  const micOn = localParticipant ? localParticipant.tracks.audio.state !== "off" : true;

  const toggleMic = useCallback(() => {
    daily?.setLocalAudio(!micOn);
  }, [daily, micOn]);

  return { micOn, toggleMic };
}