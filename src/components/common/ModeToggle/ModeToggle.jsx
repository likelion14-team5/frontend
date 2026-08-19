import './ModeToggle.css';

// props:
//   label    - 토글 옆 텍스트 (예: "발언 직후 피드백")
//   isOn     - 현재 ON/OFF
//   onToggle() - 클릭 시 호출
export default function ModeToggle({ label, isOn, onToggle }) {
  return (
    <button
      type="button"
      className="mode-toggle"
      onClick={onToggle}
      aria-pressed={isOn}
    >
      <span className="mode-toggle-label">{label}</span>
      <span className={`mode-toggle-pill ${isOn ? 'on' : 'off'}`}>
        {isOn ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}
