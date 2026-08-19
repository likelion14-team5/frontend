import { useState } from "react";
import styles from "./RightSidebar.module.css";
import { useExpressionTranslate } from "./useExpressionTranslate";

export default function ExpressionPanel({ participant, initialInput, meetingId }) {
  const [input, setInput] = useState(initialInput);
  const { result, loading, error, generate } = useExpressionTranslate(meetingId);

  const handleGenerate = () => generate(input);

  return (
    <section className={styles.panelBlock}>
      <h2 className={styles.panelTitle}>발언 전 표현 변환</h2>

      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>대상</span>
        <span className={styles.fieldValue}>{participant?.name || "전체"}</span>
      </div>

      <textarea
        className={styles.textarea}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={2}
        placeholder="하고 싶은 말을 입력하세요"
      />

      <button
        type="button"
        className={styles.primaryButton}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "생성 중..." : "영어 표현 만들기"}
      </button>

      {error && <p className={styles.resultNote}>⚠️ {error}</p>}

      {result && (
        <div className={styles.resultCard}>
          <div className={styles.resultLabel}>추천 표현</div>
          <p className={styles.resultText}>{result.text}</p>
          <p className={styles.resultNote}>{result.note}</p>
        </div>
      )}
    </section>
  );
}
