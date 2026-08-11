import { useState } from 'react';

// 마이크 ON/OFF 토글 상태와 핸들러
export function useMic() {
  const [micOn, setMicOn] = useState(true);
  const toggleMic = () => setMicOn((prev) => !prev);

  return { micOn, toggleMic };
}
