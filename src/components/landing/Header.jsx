import { useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import HeaderBar from '../common/HeaderBar/HeaderBar';

// props:
//   onOpenModal(tab) - 모바일 메뉴의 "회의 입장하기" / "+ 새 회의 만들기" 버튼에서 호출
//                       tab은 'join' | 'create'
export default function Header({ onOpenModal }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [uiLanguage, setUiLanguage] = useState('한국어');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileLangMenuOpen, setIsMobileLangMenuOpen] = useState(false);

  const langMenuRef = useRef(null);
  const mobileLangMenuRef = useRef(null);

  useClickOutside(langMenuRef, () => setIsLangMenuOpen(false));
  useClickOutside(mobileLangMenuRef, () => setIsMobileLangMenuOpen(false));

  const mobileMenu = isMobileMenuOpen && (
    <div className="mobile-drawer overlay-fade">
      <div className="mobile-drawer-header">
        <div className="mobile-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="검색 내용을 입력하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mobile-search-input"
          />
        </div>
        <button
          className="drawer-close-icon"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          ✕
        </button>
      </div>

      <div className="mobile-menu-list">
        <div className="mobile-menu-item">도움말</div>
        <div
          className="mobile-menu-item lang-item"
          ref={mobileLangMenuRef}
          onClick={() => setIsMobileLangMenuOpen((prev) => !prev)}
        >
          {uiLanguage === '한국어' ? 'KR' : 'US'} {uiLanguage}

          {isMobileLangMenuOpen && (
            <div
              className="mobile-lang-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`mobile-lang-option ${uiLanguage === '한국어' ? 'selected' : ''}`}
                onClick={() => {
                  setUiLanguage('한국어');
                  setIsMobileLangMenuOpen(false);
                }}
              >
                KR 한국어
              </div>
              <div
                className={`mobile-lang-option ${uiLanguage === 'English' ? 'selected' : ''}`}
                onClick={() => {
                  setUiLanguage('English');
                  setIsMobileLangMenuOpen(false);
                }}
              >
                US English
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mobile-menu-actions">
        <button
          className="mobile-cta-btn primary"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onOpenModal('join');
          }}
        >
          회의 입장하기
        </button>
        <button
          className="mobile-cta-btn secondary"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onOpenModal('create');
          }}
        >
          + 새 회의 만들기
        </button>
      </div>
    </div>
  );

  return (
    <HeaderBar mobileMenu={mobileMenu}>
      <nav className="header-right desktop-only">
        <span className="header-link">도움말</span>
        <div className="lang-selector" ref={langMenuRef}>
          <button
            type="button"
            className="header-start-btn"
            onClick={() => setIsLangMenuOpen((prev) => !prev)}
          >
            {uiLanguage === '한국어' ? 'KR' : 'US'} {uiLanguage}
          </button>

          {isLangMenuOpen && (
            <div className="lang-dropdown">
              <div
                className={`lang-option ${uiLanguage === '한국어' ? 'selected' : ''}`}
                onClick={() => {
                  setUiLanguage('한국어');
                  setIsLangMenuOpen(false);
                }}
              >
                KR 한국어
              </div>
              <div
                className={`lang-option ${uiLanguage === 'English' ? 'selected' : ''}`}
                onClick={() => {
                  setUiLanguage('English');
                  setIsLangMenuOpen(false);
                }}
              >
                US English
              </div>
            </div>
          )}
        </div>
      </nav>

      <button
        className="mobile-hamburger-btn mobile-only"
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        aria-label="메뉴 열기"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>
    </HeaderBar>
  );
}
