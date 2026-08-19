import { useState } from "react";
import { useLocalSessionId, useAudioLevelObserver } from "@daily-co/daily-react";

// 마이크 테스트용 - 내 목소리 음량을 0~1 사이 값으로 실시간 관찰.
// 마이크 버튼 옆에 이 값으로 막대(레벨미터)를 그려서, 말했을 때 실제로 움직이는지 눈으로 확인(=테스트)할 수 있게 한다.
export function useMicLevel() {
  const localSessionId = useLocalSessionId();
  const [level, setLevel] = useState(0);

  useAudioLevelObserver(localSessionId, (volume) => setLevel(volume));

  return level;
}
