import styles from "./RightSidebar.module.css";
import { Radio } from 'lucide-react';

const RISK_TYPE_LABELS = {
  DIRECT_REJECTION: "직접적 거절",
  PERSONAL_ATTACK: "공격적 표현",
  AMBIGUOUS_INTENT: "모호한 표현",
  IDIOM_OR_JOKE: "관용어/속어",
  PROFILE_CONFLICT: "고려사항 충돌"
};

export default function FeedbackPanel({ feedback, onClose }) {
  const riskLabel = feedback ? (RISK_TYPE_LABELS[feedback.riskType] || feedback.riskType) : null;

  return (
    <section className={styles.panelBlock}>
      <h2 className={styles.panelTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Radio className="w-5 h-5 text-red-500 animate-pulse shrink-0" />
        <span>발언 직후 피드백</span>
      </h2>

      {/* 아직 아무 발언도 감지되지 않았을 때는 대기 중이라는 안내 문구를 보여준다. */}
      <div className={styles.fieldLabelStandalone}>방금 감지한 발언</div>
      <div className={styles.quoteBox}>
        <p className={styles.quoteText}>
          {feedback ? <>&ldquo;{feedback.detected}&rdquo;</> : '아직 감지된 발언이 없습니다.'}
        </p>
        {feedback?.mayBeInaccurate && (
          <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
            ⚠ 음성 인식이 부정확할 수 있어요
          </p>
        )}
      </div>

      <div className={styles.warningBox}>
        <div className={styles.warningTitle} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          이렇게 들릴 수 있어요
          {riskLabel && (
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '999px',
              background: '#fee2e2',
              color: '#b91c1c',
            }}>
              {riskLabel}
            </span>
          )}
        </div>
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