import { useState, useCallback, useEffect } from 'react';
import styles from "./RightSidebar.module.css";
import ExpressionPanel from "./ExpressionPanel";
import FeedbackPanel from "./FeedbackPanel";
import useSpeechFeedback from "./useSpeechFeedback";
import { useDaily, useParticipantIds } from "@daily-co/daily-react";
import { MEETING_PROFILE_STORAGE_KEY } from "../../constants/meetingSession";

/* ------------------------------------------------------------------ */
/*  RightSidebar — 실제로 export되는 메인 컴포넌트                          */
/* ------------------------------------------------------------------ */

export default function RightSidebar({
  feedbackOn = true,
  expressionOn = true,
  // eslint-disable-next-line no-unused-vars
  _participant = { name: "홍길동" },  
  onCloseFeedback = () => {},
  meetingId,
  feedbackTargetParticipantId,
  onChangeFeedbackTarget,
  initialInput = "",
}) {
  const [width, setWidth] = useState(340);
  const [isResizing, setIsResizing] = useState(false);

  const { feedback } = useSpeechFeedback(meetingId);

  const callObject = useDaily();
  const participantIds = useParticipantIds() || [];

  // 리사이즈 관련 핸들러
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 240 && newWidth <= 600) {
        setWidth(newWidth);
      }
    },
    [isResizing],
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // 내 정식 participantId 세션스토리지에서 안전하게 수신
  let myParticipantId = null;
  try {
    const rawProfile = sessionStorage.getItem(MEETING_PROFILE_STORAGE_KEY);
    if (rawProfile) {
      const parsed = JSON.parse(rawProfile);
      myParticipantId = parsed?.participantId || parsed?.profile?.participantId || parsed?.me?.id || null;
    }
  } catch (e) {
    console.error("세션 스토리지 파싱 오류:", e);
  }

  const participants = participantIds
    .map((id) => {
      if (!callObject) return null;
      const allParticipants = callObject.participants ? callObject.participants() : {};
      const p = allParticipants[id];
      if (!p) return null;

      const userData = p.userData || {};

      // Daily userData 내부를 깊게 탐색하여 participantId 추출
      // 로컬(나 자신)인 경우에는 세션 스토리지에서 파싱한 정식 myParticipantId 사용
      const realParticipantId = p.local
        ? myParticipantId
        : (userData.participantId ||
          userData.participant_id ||
          userData.me?.id ||
          userData.profile?.participantId ||
          null);

      return {
        id: realParticipantId || p.session_id || id,      
        participantId: realParticipantId || null,
        session_id: p.session_id,
        nickname: p.user_name || userData.nickname || userData.profile?.nickname || "참가자",
        local: p.local,
        userData: userData,
      };
    })
    .filter(Boolean);

  const showNothing = !feedbackOn && !expressionOn;

  return (
    <aside className={styles.sidePanel} style={{ width: `${width}px` }}>
      <div className={styles.resizeHandle} onMouseDown={handleMouseDown} />
      {showNothing ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            상단에서 기능을 켜면 여기에 표시됩니다.
          </p>
        </div>
      ) : (
        <>
          {expressionOn && (
            <ExpressionPanel
              meetingId={meetingId}
              initialInput={initialInput}
              participant={
                participants.find((p) => (p.participantId || p.id) === feedbackTargetParticipantId) || null
              }
              participants={participants}
              myParticipantId={myParticipantId}
              onChangeFeedbackTarget={onChangeFeedbackTarget}
            />
          )}
          {feedbackOn && (
            <FeedbackPanel
              feedback={feedback || {
                detected: "That schedule is impossible.",
                warning: "상대의 계획을 단정적으로 거절하는 표현으로 받아들여질 수 있습니다.",
                alternative: "Could we discuss an alternative schedule?",
              }}
              onClose={onCloseFeedback}
            />
          )}
        </>
      )}
    </aside>
  );
}