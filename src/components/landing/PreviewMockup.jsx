import { useLanguage } from '../../hooks/useLanguage.jsx';

// "AI Work PreView" 목업 카드. 지금은 전부 하드코딩된 정적 텍스트이며
// 실제 회의 화면(RightSidebar 등)과는 연결되어 있지 않다.
export default function PreviewMockup() {
  const { t } = useLanguage();

  return (
    <div className="preview-mockup">
      <div className="mockup-header">
        <div className="mockup-dots">
          <span className="dot-red" />
          <span className="dot-yellow" />
          <span className="dot-green" />
        </div>
        <div className="mockup-title">{t('previewMockup.windowTitle')}</div>
        <div className="live-badge">
          <span className="live-dot" />{t('previewMockup.liveBadge')}
        </div>
      </div>

      <div className="mockup-body">
        <div className="mockup-col">
          <div className="col-label">{t('previewMockup.col1Label')}</div>
          <div className="ai-translation-card">
            <span className="tag">{t('previewMockup.detectedTag')}</span>
            <div className="speech-bubble-left">
              <div className="speaker-tag">{t('previewMockup.speakerName')}</div>
              <p>{t('previewMockup.detectedQuote')}</p>
            </div>
            <div className="pre-speech-result-box">
              <div className="ai-header">
                <span>{t('previewMockup.feedbackTag')}</span>
              </div>
              <p className="ai-result">
                {t('previewMockup.feedbackText')}
              </p>
              <div className="culture-note">
                💡 <strong>{t('previewMockup.alternativeLabel')}</strong> {t('previewMockup.alternativeText')}
              </div>
            </div>
          </div>
        </div>

        <div className="mockup-col border-left">
          <div className="col-label">{t('previewMockup.col2Label')}</div>

          {/* F-02 목업: 발언 전에 한국어로 적어두면 영어 표현으로 변환해주는 기능 - 아직 실제 구현은 아님 */}
          <div className="ai-translation-card">
            <div className="ai-header">
              <span className="tag">{t('previewMockup.translateTag')}</span>
            </div>

            <div className="pre-speech-input-box">
              <span className="pre-speech-label">{t('previewMockup.inputLabel')}</span>
              <p className="pre-speech-input-text">
                {t('previewMockup.inputText')}
              </p>
            </div>
            <div className="pre-speech-result-box">
              <span className="pre-speech-label result">{t('previewMockup.resultLabel')}</span>
              <p className="pre-speech-result-text">
                {t('previewMockup.resultText')}
              </p>
              <div className="culture-note">
                💡 <strong>{t('previewMockup.reasonLabel')}</strong> {t('previewMockup.reasonText')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
