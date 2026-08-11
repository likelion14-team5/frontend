import React from "react";
import styles from "./RightSidebar.module.css";

export default function FeedbackPanel({ feedback, onClose }) {
  return (
    <section className={styles.panelBlock}>
      <h2 className={styles.panelTitle}>발언 직후 피드백</h2>

      <div className={styles.fieldLabelStandalone}>방금 감지한 발언</div>
      <div className={styles.quoteBox}>
        <p className={styles.quoteText}>&ldquo;{feedback.detected}&rdquo;</p>
      </div>

      <div className={styles.warningBox}>
        <div className={styles.warningTitle}>이렇게 들릴 수 있어요</div>
        <p className={styles.warningText}>{feedback.warning}</p>
        <p className={styles.altText}>
          <span className={styles.altLabel}>대안</span> {feedback.alternative}
        </p>
      </div>

      <button
        type="button"
        className={styles.secondaryButton}
        onClick={onClose}
      >
        피드백 닫기
      </button>
    </section>
  );
}