import React from 'react';
import styles from './ErrorBoundary.module.css';

// 최상단 안전망. 자식 트리 어디서든 렌더링 중 예외가 터지면 흰 화면 대신 이 화면을 보여준다.
// React는 아직 렌더 에러를 훅으로 못 잡아서(에러 바운더리는 클래스 컴포넌트만 가능) class로 작성.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] 처리되지 않은 렌더링 오류', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrap}>
          <div className={styles.card}>
            <p className={styles.title}>문제가 발생했습니다</p>
            <p className={styles.desc}>
              페이지를 표시하는 중 오류가 발생했습니다. 새로고침해도 계속되면 잠시 후 다시 시도해주세요.
            </p>
            <button type="button" className={styles.reloadBtn} onClick={() => window.location.reload()}>
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
