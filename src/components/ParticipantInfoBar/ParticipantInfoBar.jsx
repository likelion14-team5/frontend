import styles from './ParticipantInfoBar.module.css';

// props:
//   participant   - { id, name, country, role, englishLevel }
//   isSelf        - 내 타일인지 여부 (이름 옆에 "(나)" 표시)
//   onViewProfile - (participantId) => void, "프로필 상세보기" 클릭 시 호출
export default function ParticipantInfoBar({ participant, isSelf, onViewProfile }) {
  if (!participant) return null;
  const profileMeta = [
    participant.country,
    participant.role,
    participant.englishLevel && `영어 ${participant.englishLevel}`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className={styles.participantInfoBar}>
      <div className={styles.participantInfoText}>
        <div className={styles.participantInfoName}>
          {participant.name}
          {isSelf && ' (나)'}
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
