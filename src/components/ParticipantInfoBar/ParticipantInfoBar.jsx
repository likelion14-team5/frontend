import React from 'react';
import styles from './ParticipantInfoBar.module.css';

// props:
//   participant - { name, country, role, englishLevel, communicationStyle, note }
//
// "프로필 상세보기" 버튼은 자리만 만들어둠.
// TODO: 프로필 상세 컴포넌트 onClick에 연결
export default function ParticipantInfoBar({ participant }) {
  if (!participant) return null;

  return (
    <div className={styles.participantInfoBar}>
      <div className={styles.participantInfoText}>
        <div className={styles.participantInfoName}>{participant.name}</div>
        <div className={styles.participantInfoMeta}>
          {participant.country}
          {participant.role && ` · ${participant.role}`}
        </div>
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
        disabled
        title="프로필 상세 기능 준비 중입니다"
        onClick={() => {
          // TODO: 프로필 상세 연결
        }}
      >
        프로필 상세보기
      </button>
    </div>
  );
}