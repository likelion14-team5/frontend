import React, { useState, useCallback, useEffect } from 'react';
import styles from "./RightSidebar.module.css";
import ExpressionPanel from "./ExpressionPanel";
import FeedbackPanel from "./FeedbackPanel";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const MOCK_EXPRESSION_INPUT = "금요일 출시는 절대 불가능해요.";

const MOCK_EXPRESSION_RESULT = {
  text: "Given our testing requirements, could we discuss moving the release to Monday?",
  note: "단정적 거절 대신 제약과 대안을 전달합니다.",
};

const MOCK_FEEDBACK = {
  detected: "That schedule is impossible.",
  warning: "상대의 계획을 단정적으로 거절하는 표현으로 받아들여질 수 있습니다.",
  alternative: "Could we discuss an alternative schedule?",
};

/* ------------------------------------------------------------------ */
/*  RightSidebar — 실제로 export되는 메인 컴포넌트                          */
/* ------------------------------------------------------------------ */

export default function RightSidebar({
  feedbackOn = true,
    expressionOn = true,
    participant = { name: "홍길동" },
    onCloseFeedback = () => {},
}) {
  const [width, setWidth] = useState(340);
  const [isResizing, setIsResizing] = useState(false);

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
              participant={participant}
              initialInput={MOCK_EXPRESSION_INPUT}
              mockResult={MOCK_EXPRESSION_RESULT}
            />
          )}
          {feedbackOn && (
            <FeedbackPanel feedback={MOCK_FEEDBACK} onClose={onCloseFeedback} />
          )}
        </>
      )}
    </aside>
  );
}