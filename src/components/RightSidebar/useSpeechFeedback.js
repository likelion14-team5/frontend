import { useCallback, useState } from 'react';
import {
  API_ENDPOINTS,
  PARTICIPANT_TOKEN_KEY,
} from '../../constants/meetingSession';

export default function useSpeechFeedback(meetingId) {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSpeech = useCallback(
    async ({
      transcript,
      targetParticipantId,
      sttConfidence = null,
      recentContext = null,
    }) => {
      if (!meetingId || !transcript?.trim()) {
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const token = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);

        const response = await fetch(
          API_ENDPOINTS.ANALYZE_SPEECH_FEEDBACK(meetingId),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Participant-Token': token,
            },
            body: JSON.stringify({
              transcript: transcript.trim(),
              stt_confidence: sttConfidence,
              stt_source: 'WEB_SPEECH',
              recent_context: recentContext,
              target_participant_id: targetParticipantId || null,
            }),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error?.message || '발언 피드백 분석에 실패했습니다.',
          );
        }

        const data = result.data;

        if (!data.risk_detected || !data.feedback) {
          setFeedback(null);
          return null;
        }

        setFeedback(data.feedback);
        return data.feedback;
      } catch (e) {
        console.error('Speech feedback analyze failed:', e);
        setError(e.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [meetingId],
  );

  const clearFeedback = useCallback(() => {
    setFeedback(null);
    setError(null);
  }, []);

  return {
    feedback,
    loading,
    error,
    analyzeSpeech,
    clearFeedback,
  };
}