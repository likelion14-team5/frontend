import { useState } from 'react';

// 카메라 ON/OFF 토글 상태와 핸들러
export function useCamera() {
  const [cameraOn, setCameraOn] = useState(true);
  const toggleCamera = () => setCameraOn((prev) => !prev);

  return { cameraOn, toggleCamera };
}
