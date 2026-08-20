import { useState } from 'react';
import HeaderBar from '../common/HeaderBar/HeaderBar';
import { useLanguage } from '../../hooks/useLanguage.jsx';

// props:
//   onOpenModal(tab)  - 모바일 메뉴의 "회의 입장하기" / "+ 새 회의 만들기" 버튼에서 호출
//                       tab은 'join' | 'create'
//   onOpenProfile()   - "내 정보" 클릭 시 - 회의 입장 없이 프로필만 미리 작성/저장할 수 있게
export default function Header({ onOpenModal, onOpenProfile }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const mobileMenu = isMobileMenuOpen && (
    <div className="mobile-drawer overlay-fade">
      <div className="mobile-drawer-header">
        <span className="logo">Attune</span>
      </div>

      <div className="mobile-menu-list">
        <div
          className="mobile-menu-item"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onOpenProfile();
          }}
        >
          {t('header.myInfo')}
        </div>
        <div className="mobile-menu-item">{t('header.help')}</div>
      </div>

      <div className="mobile-menu-actions">
        <button
          className="mobile-cta-btn primary"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onOpenModal('join');
          }}
        >
          {t('header.joinMeeting')}
        </button>
        <button
          className="mobile-cta-btn secondary"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onOpenModal('create');
          }}
        >
          {t('header.createMeeting')}
        </button>
      </div>
    </div>
  );

  return (
    <HeaderBar mobileMenu={mobileMenu}>
      <nav className="header-right desktop-only">
        <span className="header-link" onClick={onOpenProfile} role="button" tabIndex={0}>
          {t('header.myInfo')}
        </span>
        <span className="header-link">{t('header.help')}</span>
        <button
          className="lang-toggle-btn"
          onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
        >
          {language === 'ko' ? 'KR' : 'EN'}
        </button>
      </nav>

      <div className="mobile-header-actions">
        <button
          className="lang-toggle-btn"
          onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
        >
          {language === 'ko' ? 'KR' : 'EN'}
        </button>

        <button
          className="mobile-hamburger-btn"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="메뉴 열기"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </HeaderBar>
  );
}
