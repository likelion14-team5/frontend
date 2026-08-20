import { useCallback, useState } from "react";
import { API_ENDPOINTS, getParticipantToken } from "../../constants/meetingSession";

// F-02 "발언 전 표현 변환" — 백엔드(POST /meetings/{id}/pre-speech)가 OpenAI를 직접 호출하고
// 프론트는 결과만 받는다. 선택된 대상(targetParticipantId)을 백엔드로 함께 전달한다.
export function useExpressionTranslate(meetingId) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(
    async (input, targetParticipantId) => {
      if (!input?.trim() || !meetingId) return;

      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const token = getParticipantToken(meetingId);
        const response = await fetch(API_ENDPOINTS.CREATE_PRE_SPEECH(meetingId), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Participant-Token": token,
          },
          body: JSON.stringify({
            input_ko: input,
            target_participant_id: targetParticipantId || null,
          }),
        });

        const body = await response.json();
        if (!response.ok) {
          throw new Error(body?.error?.message ?? `요청이 실패했습니다. (상태 코드: ${response.status})`);
        }

        setResult({
          text: body.data.recommended_expression_en,
          note: body.data.recommendation_reason_ko,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [meetingId]
  );

  return { result, loading, error, generate };
}
