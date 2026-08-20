import { useEffect, useRef } from "react";
import { useMic } from "../BottomBar/useMic";
import "../../lib/web-speech-recognition.js";

export default function useSpeechFeedbackBridge({
  joined,
  voiceAnalysisConsent,
  feedbackOn,
  meetingActive,
  analyzeSpeech,
}) {
  const { micOn } = useMic();
  const controllerRef = useRef(null);

  const shouldRun =
    joined && voiceAnalysisConsent && feedbackOn && micOn && meetingActive;

  // 컨트롤러는 마운트 시 1회만 생성
  useEffect(() => {
    if (typeof window === "undefined" || !window.createWebSpeechController) {
      return undefined;
    }

    const controller = window.createWebSpeechController({
      onFinal: (payload) => {
        // payload: { transcript, stt_source, stt_confidence, language }
        analyzeSpeech({
          transcript: payload.transcript,
          sttConfidence: payload.stt_confidence,
          // "발언 직후 피드백"은 본인 발언 분석이라 특정 상대 지정 불필요
          targetParticipantId: null,
        });
      },
      onError: (err) => {
        console.error("음성 인식 오류:", err.message);
      },
      // onInterim, onStateChange는 지금 UI에서 안 쓰면 생략 가능
      // onStateChange: (state) => console.log("[speech-bridge] state:", state),
    });

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [analyzeSpeech]);

  // 조건 변화에 따라 start/stop
  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller || !controller.supported) return;

    if (shouldRun) {
      controller.start("ko-KR");
    } else {
      controller.stop();
    }
  }, [shouldRun]);
}