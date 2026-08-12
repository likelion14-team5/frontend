import React, { useEffect } from 'react';

// props:
//   onClose() - 닫기(✕) 버튼 클릭 시 호출
//   children  - 모달 안에 렌더링할 실제 내용 (JoinCreateForm 또는 ProfileForm)
//
// 모달이 열려있는 동안 배경 스크롤을 막는 처리도 여기서 담당한다.
export default function MeetingModal({ onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}