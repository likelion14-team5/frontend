import './HeaderBar.css';

// props:
//   children     - header-inner 안, 로고 오른쪽에 들어갈 내용
//                  (로그인 화면: 언어선택+햄버거버튼 / 회의 화면: 토글+회의링크+아바타)
//   mobileMenu   - header-inner 아래에 별도로 렌더링할 내용 (로그인 화면의 모바일 드로어 등)
//                  회의 화면처럼 필요없는 페이지는 그냥 생략하면 됨
//

export default function HeaderBar({ children, mobileMenu }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-group">
          <div className="logo-icon">L</div>
          <span className="logo">SamePage</span>
        </div>

        {children}
      </div>

      {mobileMenu}
    </header>
  );
}
