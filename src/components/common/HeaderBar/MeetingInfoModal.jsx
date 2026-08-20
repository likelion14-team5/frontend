import { useState } from 'react';
import styles from '../HeaderBar/MeetingInfoModal.module.css';
import { useLanguage } from '../../../hooks/useLanguage.jsx';

export default function MeetingInfoModal({ meetingInfo, onCopyLink }) {
  const { t } = useLanguage();
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
      <h2 className={styles.title}>{t('meetingInfoModal.title')}</h2>
      <div className={styles.infoGrid}>
        <div className={styles.infoLabel}>{t('meetingInfoModal.nameLabel')}</div>
        <div className={styles.infoValue}>{title || t('meetingInfoModal.loading')}</div>

        <div className={styles.infoLabel}>{t('meetingInfoModal.startTimeLabel')}</div>
        <div className={styles.infoValue}>
          {created_at ? new Date(created_at).toLocaleString() : t('meetingInfoModal.loading')}
        </div>

        <div className={styles.infoLabel}>{t('meetingInfoModal.participantsLabel')}</div>
        <div className={styles.infoValue}>
          {current_participants ?? '...'} / {max_participants ?? '...'}
        </div>
      </div>
      <button type="button" className={styles.copyButton} onClick={handleCopyClick}>
        {copied ? t('meetingInfoModal.copiedButton') : t('meetingInfoModal.copyButton')}
      </button>
    </div>
  );
}
