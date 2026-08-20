import PreviewMockup from './PreviewMockup';
import { useLanguage } from '../../hooks/useLanguage.jsx';

// props:
//   onOpenModal(tab) - "지금 회의 입장하기" / "+ 새 회의 개설하기" 버튼에서 호출
export default function Hero({ onOpenModal }) {
  const { t } = useLanguage();

  return (
    <main className="main">
      <div className="hero-capsule">
        <span>{t('hero.badge')}</span>
      </div>

      <h1 className="main-title">
        {t('hero.titleLine1')}
        <br />
        <span className="gradient-text">{t('hero.titleHighlight')}</span>{t('hero.titleSuffix')}
      </h1>

      <p className="sub-title">
        {t('hero.subtitleLine1')}
        <br />
        {t('hero.subtitleLine2')}
      </p>

      <div className="cta-group">
        <button className="primary-button" onClick={() => onOpenModal('join')}>
          {t('hero.joinMeeting')}
        </button>

        <button className="secondary-button" onClick={() => onOpenModal('create')}>
          {t('hero.createMeeting')}
        </button>
      </div>

      <PreviewMockup />
    </main>
  );
}
