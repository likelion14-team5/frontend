import { useState } from 'react';
import HeaderBar from '../common/HeaderBar/HeaderBar';

// props:
//   onOpenModal(tab)  - 모바일 메뉴의 "회의 입장하기" / "+ 새 회의 만들기" 버튼에서 호출
//                       tab은 'join' | 'create'
//   onOpenProfile()   - "내 정보" 클릭 시 - 회의 입장 없이 프로필만 미리 작성/저장할 수 있게
export default function Header({ onOpenModal, onOpenProfile }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
        <div
          className="mobile-menu-item"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onOpenProfile();
          }}
        >
          내 정보
        </div>
        <div className="mobile-menu-item">도움말</div>
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
        <span className="header-link" onClick={onOpenProfile} role="button" tabIndex={0}>
          내 정보
        </span>
        <span className="header-link">도움말</span>
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
