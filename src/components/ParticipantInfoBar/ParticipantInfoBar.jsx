import styles from './ParticipantInfoBar.module.css';

// props:
//   participant   - { id, name, country, role, englishLevel, communicationStyle, localTime }
//   isSelf        - 내 타일인지 여부 (이름 옆에 "(나)" 표시)
//   onViewProfile - (participantId) => void, "프로필 상세보기" 클릭 시 호출
//
// 국가/직무/영어실력/소통방식을 클릭 없이 항상 보이게 한다 - 다국적 회의에서
// "이 사람과 어떻게 소통해야 하는지" 힌트를 매번 프로필을 열어보지 않아도 알 수 있게.
export default function ParticipantInfoBar({ participant, isSelf, onViewProfile }) {
  if (!participant) return null;
  const profileMeta = [
    participant.country,
    participant.role,
    participant.englishLevel && `영어 ${participant.englishLevel}`,
    participant.communicationStyle,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className={styles.participantInfoBar}>
      <div className={styles.participantInfoText}>
        <div className={styles.participantInfoName}>
          {participant.name}
          {isSelf && ' (나)'}
          {/* 다른 시간대에 있는 참가자와 회의할 때 "지금 저 사람은 몇 시지"를 바로 알 수 있게. */}
          {participant.localTime && (
            <span className={styles.participantInfoLocalTime}>🕒 {participant.localTime}</span>
          )}
        </div>
        {profileMeta && <div className={styles.participantInfoMeta}>{profileMeta}</div>}
      </div>
      <button
        type="button"
        className={styles.participantInfoDetailBtn}
        onClick={() => onViewProfile?.(participant.id)}
      >
        프로필 상세
      </button>
    </div>
  );
}
