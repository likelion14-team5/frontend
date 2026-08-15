import React from 'react';
import styles from './ParticipantInfoBar.module.css';

// props:
//   participant   - { id, name, country, role, englishLevel, communicationStyle, note }
//   isSelf        - 내 타일인지 여부 (이름 옆에 "(나)" 표시)
//   onViewProfile - (participantId) => void, "프로필 상세보기" 클릭 시 호출
export default function ParticipantInfoBar({ participant, isSelf, onViewProfile }) {
  if (!participant) return null;

  return (
    <div className={styles.participantInfoBar}>
      <div className={styles.participantInfoText}>
        <div className={styles.participantInfoName}>
          {participant.name}
          {isSelf && ' (나)'}
        </div>
        {(participant.country || participant.role) && (
          <div className={styles.participantInfoMeta}>
            {participant.country}
            {participant.country && participant.role && ' · '}
            {participant.role}
          </div>
        )}
        {participant.englishLevel && (
          <div className={styles.participantInfoMeta}>
            {participant.englishLevel}
            {participant.communicationStyle && ` | ${participant.communicationStyle}`}
          </div>
        )}
      </div>

      <button
        type="button"
        className={styles.participantInfoDetailBtn}
        onClick={() => onViewProfile?.(participant.id)}
      >
        프로필 상세보기
      </button>
    </div>
  );
}