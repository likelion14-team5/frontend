import { useState } from "react";
import styles from "./RightSidebar.module.css";
import { useExpressionTranslate } from "./useExpressionTranslate";

export default function ExpressionPanel({ 
  meetingId,
  initialInput, 
  participant, 
  participants = [], // 참가자 목록 배열 Props (기본값 빈 배열)
  myParticipantId,   // 내 참가자 ID Props
  onChangeFeedbackTarget // 대상 변경 핸들러 Props
}) {
  const [input, setInput] = useState(initialInput);
  const { result, loading, error, generate } = useExpressionTranslate(meetingId);

  const selectedTargetId = participant?.participantId || participant?.id || "";

  const handleTargetChange = (e) => {
    const selectedValue = e.target.value || null;
    if (onChangeFeedbackTarget) {
      onChangeFeedbackTarget(selectedValue);
    }
  };

  const handleGenerate = () => {
    const selectedObj = participants.find(
      (p) => (p.participantId || p.id) === selectedTargetId
    );

    // 백엔드로 전달할 진짜 participantId
    const targetIdToSend = selectedObj?.participantId || selectedTargetId;

    // UUID 형식(36자리)이 아니면 백엔드가 404를 뱉으므로 예외 처리
    if (!targetIdToSend || targetIdToSend.length < 30) {
      alert("참가자 프로필 동기화 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    generate(input, targetIdToSend);
  };

  return (
    <section className={styles.panelBlock}>
      <h2 className={styles.panelTitle}>발언 전 표현 변환</h2>

      <div className={styles.fieldRow}>
        <span className={styles.fieldLabel}>대상</span>

        <select
          className={styles.fieldValue}
          value={selectedTargetId}
          onChange={handleTargetChange}
        >
          <option value="">대상을 선택하세요</option>

          {participants
            .filter((p) => {
              // participantId 혹은 id 중 있는 값을 추출
              const pId = p.participantId || p.id;
              // 나 자신(myParticipantId)과 local 참가자 제외
              return pId && pId !== myParticipantId && !p.local;
            })
            .map((p) => {
              const pId = p.participantId || p.id;
              const name = p.nickname || p.name || p.profile?.nickname || p.profile?.name || "참가자";
              
              return (
                <option key={pId} value={pId}>
                  {name}
                </option>
              );
            })}
        </select>
      </div>

      <textarea
        name="speechInput" id="speech-input"
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
