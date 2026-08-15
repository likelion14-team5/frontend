import React from 'react';
import styles from './ParticipantsPanel.module.css';
import { useDraggable } from './useDraggable';
import { useParticipants } from './useParticipants';

// 참가자 프로필을 보여주는 플로팅 패널.
// 브라우저 기본 드래그가 아니라 useDraggable로 직접 구현한 드래그 + 우상단 닫기(X) 버튼.
// 참가자가 1명이면 카드 1개, 2명이면 2개 - 그리드가 자동으로 맞춰준다.
export default function ParticipantsPanel({ onClose }) {
  const { position, handleMouseDown } = useDraggable({ x: 0, y: 0 });
  const { participants } = useParticipants();

  return (
    <div
      className={styles.panel}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div className={styles.header} onMouseDown={handleMouseDown}>
        <span className={styles.title}>참가자 ({participants.length})</span>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.grid}>
        {participants.map((p, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.avatar}>{p.name?.[0] || '?'}</div>
            <div className={styles.name}>{p.name}</div>
            <div className={styles.role}>{p.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
