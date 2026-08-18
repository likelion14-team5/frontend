import React, { useState } from 'react';
import styles from '../HeaderBar/MeetingInfoModal.module.css';

export default function MeetingInfoModal({ meetingInfo, onCopyLink }) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    onCopyLink();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const { title, current_participants, max_participants, created_at } = meetingInfo || {};

  return (
    <div className={styles.dropdownCard}>
      <h2 className={styles.title}>회의 정보</h2>
      <div className={styles.infoGrid}>
        <div className={styles.infoLabel}>회의 이름</div>
        <div className={styles.infoValue}>{title || '불러오는 중...'}</div>

        <div className={styles.infoLabel}>시작 시간</div>
        <div className={styles.infoValue}>
          {created_at ? new Date(created_at).toLocaleString() : '불러오는 중...'}
        </div>

        <div className={styles.infoLabel}>참여 인원</div>
        <div className={styles.infoValue}>
          {current_participants ?? '...'} / {max_participants ?? '...'}
        </div>
      </div>
      <button type="button" className={styles.copyButton} onClick={handleCopyClick}>
        초대 링크 복사
      </button>
    </div>
  );
}
