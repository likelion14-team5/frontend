import { useCallback } from "react";
import { useDaily, useLocalParticipant } from "@daily-co/daily-react";

// 마이크 ON/OFF — 실제 Daily 로컬 트랙 상태를 그대로 사용한다.
export function useMic() {
  const daily = useDaily();
  const localParticipant = useLocalParticipant();
  const micOn = localParticipant ? localParticipant.audio : true;

  const toggleMic = useCallback(() => {
    daily?.setLocalAudio(!micOn);
  }, [daily, micOn]);

  return { micOn, toggleMic };
}