import React from 'react';
import PreviewMockup from './PreviewMockup';

// props:
//   onOpenModal(tab) - "지금 회의 입장하기" / "+ 새 회의 개설하기" 버튼에서 호출
export default function Hero({ onOpenModal }) {
  return (
    <main className="main">
      <div className="hero-capsule">
        <span>전 세계 글로벌 팀을 위한 실시간 서포트 AI</span>
      </div>

      <h1 className="main-title">
        언어와 문화의 경계를 허무는
        <br />
        <span className="gradient-text">글로벌 AI 회의</span>의 새로운 기준
      </h1>

      <p className="sub-title">
        실시간 음성 정제, 문화적 커뮤니케이션 매너 가이드, 사전 프로필 싱크로
        <br />
        전 세계 팀원들과 마치 한 공간에 있는 것처럼 자연스럽고 오해 없이 소통하세요.
      </p>

      <div className="cta-group">
        <button className="primary-button" onClick={() => onOpenModal('join')}>
          회의 입장하기
        </button>

        <button className="secondary-button" onClick={() => onOpenModal('create')}>
          새 회의 만들기
        </button>
      </div>

      <PreviewMockup />
    </main>
  );
}