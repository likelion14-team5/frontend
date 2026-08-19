
// "AI Work PreView" 목업 카드. 지금은 전부 하드코딩된 정적 텍스트이며
// 실제 회의 화면(RightSidebar 등)과는 연결되어 있지 않다.
export default function PreviewMockup() {
  return (
    <div className="preview-mockup">
      <div className="mockup-header">
        <div className="mockup-dots">
          <span className="dot-red" />
          <span className="dot-yellow" />
          <span className="dot-green" />
        </div>
        <div className="mockup-title">AI Work PreView</div>
        <div className="live-badge">
          <span className="live-dot" />· LIVE REFINING ACTIVE
        </div>
      </div>

      <div className="mockup-body">
        <div className="mockup-col">
          <div className="col-label">🎙️ 실시간 발언 보정 (Real-time Speech Sync)</div>
          <div className="ai-translation-card">
            <span className="tag">방금 감지한 발언</span>
            <div className="speech-bubble-left">
              <div className="speaker-tag">KR glidong hong (FrontEnd)</div>
              <p>"That schedule is impossible."</p>
            </div>
            <div className="pre-speech-result-box">
              <div className="ai-header">
                <span>🤖 실시간 피드백</span>
              </div>
              <p className="ai-result">
                상대의 계획을 단정적으로 거절하는 표현으로 받아들여질 수 있습니다.
              </p>
              <div className="culture-note">
                💡 <strong>대안:</strong> Could we discuss an alternative schedule?
              </div>
            </div>
          </div>
        </div>

        <div className="mockup-col border-left">
          <div className="col-label">✍️ 최적의 발언 추천 (Pre-Speech Assist)</div>

          {/* F-02 목업: 발언 전에 한국어로 적어두면 영어 표현으로 변환해주는 기능 - 아직 실제 구현은 아님 */}
          <div className="ai-translation-card">
            <div className="ai-header">
              <span className="tag">🤖 발언 전 영어 변환</span>
            </div>

            <div className="pre-speech-input-box">
              <span className="pre-speech-label">내가 할 말 (한국어)</span>
              <p className="pre-speech-input-text">
                "이 부분은 마감 전에 한 번 더 확인해주시면 좋을 것 같아요."
              </p>
            </div>
            <div className="pre-speech-result-box">
              <span className="pre-speech-label result">추천 영어 표현</span>
              <p className="pre-speech-result-text">
                "It would be great if you could take one more look at this before the deadline."
              </p>
              <div className="culture-note">
                💡 <strong>추천 이유:</strong> 요청을 부드러운 제안 형태로 바꿔 상대가 부담 없이
                받아들이도록 조정했습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
