import styles from "./RightSidebar.module.css";
import { Radio } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage.jsx';

export default function FeedbackPanel({ feedback, onClose }) {
  const { t } = useLanguage();

  return (
    <section className={styles.panelBlock}>
      <h2 className={styles.panelTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Radio className="w-5 h-5 text-red-500 animate-pulse shrink-0" />
        <span>{t('feedbackPanel.title')}</span>
      </h2>
      <div className={styles.fieldLabelStandalone}>{t('feedbackPanel.detectedLabel')}</div>
      <div className={styles.quoteBox}>
        <p className={styles.quoteText}>
          {feedback ? <>&ldquo;{feedback.detected}&rdquo;</> : t('feedbackPanel.noDetectionYet')}
        </p>
      </div>

      <div className={styles.warningBox}>
        <div className={styles.warningTitle}>{t('feedbackPanel.warningTitle')}</div>
        <p className={styles.warningText}>
          {feedback ? feedback.warning : t('feedbackPanel.waitingText')}
        </p>
        {feedback && (
          <p className={styles.altText}>
            <span className={styles.altLabel}>{t('feedbackPanel.alternativeLabel')}</span> {feedback.alternative}
          </p>
        )}
      </div>

      <button
        type="button"
        className={styles.secondaryButton}
        onClick={onClose}
      >
        {t('feedbackPanel.closeButton')}
      </button>
    </section>
  );
}
