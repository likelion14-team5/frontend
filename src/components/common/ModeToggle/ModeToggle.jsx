import './ModeToggle.css';

// props:
//   label      - 토글 옆 텍스트 (예: "발언 직후 피드백")
//   isOn       - 현재 ON/OFF
//   onToggle() - 클릭 시 호출
//   disabled   - true면 클릭 막힘 (예: 음성 분석 동의를 안 한 경우)
//   disabledReason - disabled일 때 보여줄 툴팁 문구
export default function ModeToggle({ label, isOn, onToggle, disabled = false, disabledReason }) {
  return (
    <button
      type="button"
      className="mode-toggle"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={isOn}
      title={disabled ? disabledReason : undefined}
    >
      <span className="mode-toggle-label">{label}</span>
      <span className={`mode-toggle-pill ${isOn ? 'on' : 'off'}`}>
        {isOn ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}
