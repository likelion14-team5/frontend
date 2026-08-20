import styles from "./RightSidebar.module.css";
import { Radio } from 'lucide-react';

export default function FeedbackPanel({ feedback, onClose }) {
  return (
    <section className={styles.panelBlock}>
      <h2 className={styles.panelTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Radio className="w-5 h-5 text-red-500 animate-pulse shrink-0" />
        <span>발언 직후 피드백</span>
      </h2>

      {/* 아직 아무 발언도 감지되지 않았을 때 예전엔 하드코딩된 예시 문장("That schedule is
          impossible.")을 마치 실제로 감지된 것처럼 보여주고 있었음 - 창 구조(두 박스)는 그대로
          두되, 실제 감지된 게 없으면 각 박스 안에 대기 중이라는 안내 문구를 넣는다. */}
      <div className={styles.fieldLabelStandalone}>방금 감지한 발언</div>
      <div className={styles.quoteBox}>
        <p className={styles.quoteText}>
          {feedback ? <>&ldquo;{feedback.detected}&rdquo;</> : '아직 감지된 발언이 없습니다.'}
        </p>
      </div>

      <div className={styles.warningBox}>
        <div className={styles.warningTitle}>이렇게 들릴 수 있어요</div>
        <p className={styles.warningText}>
          {feedback ? feedback.warning : '감지하면 피드백을 작성합니다.'}
        </p>
        {feedback && (
          <p className={styles.altText}>
            <span className={styles.altLabel}>대안</span> {feedback.alternative}
          </p>
        )}
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
