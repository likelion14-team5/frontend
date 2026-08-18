import { useParticipant, useParticipantIds } from '@daily-co/daily-react';
import { Mic, MicOff, Video, VideoOff, X } from 'lucide-react';
import styles from './ParticipantsPanel.module.css';
import { useDraggable } from './useDraggable';

function ParticipantRow({ sessionId, isHost }) {
  const participant = useParticipant(sessionId);

  if (!participant) return null;

  const micOn = participant.audio === true;
  const cameraOn = participant.video === true;
  const isParticipantHost = participant.userData?.meetingRole === 'HOST'
    || (participant.local && isHost);

  return (
    <div className={styles.participant}>
      <div className={styles.avatar}>{participant.user_name?.[0] || '?'}</div>
      <div className={styles.info}>
        <div className={styles.name}>{participant.user_name || '참가자'}</div>
        <div className={styles.role}>{participant.userData?.role || ''}</div>
        {isParticipantHost && <span className={styles.host}>(호스트)</span>}
      </div>
      <div className={styles.mediaStatus} aria-label="미디어 상태">
        <span className={styles.mediaIcon} title={micOn ? '마이크 켜짐' : '마이크 꺼짐'} aria-label={micOn ? '마이크 켜짐' : '마이크 꺼짐'}>
          {micOn ? <Mic size={18} /> : <MicOff size={18} />}
        </span>
        <span className={styles.mediaIcon} title={cameraOn ? '카메라 켜짐' : '카메라 꺼짐'} aria-label={cameraOn ? '카메라 켜짐' : '카메라 꺼짐'}>
          {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
        </span>
      </div>
    </div>
  );
}

// 참가자 프로필을 보여주는 플로팅 패널.
// 브라우저 기본 드래그가 아니라 useDraggable로 직접 구현한 드래그 + 우상단 닫기(X) 버튼.
export default function ParticipantsPanel({ onClose, isHost }) {
  const { position, handleMouseDown } = useDraggable({ x: 0, y: 0 });
  const participantIds = useParticipantIds();

  return (
    <div
      className={styles.panel}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div className={styles.header} onMouseDown={handleMouseDown}>
        <span className={styles.title}>참가자 ({participantIds.length})</span>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.list}>
        {participantIds.map((sessionId) => (
          <ParticipantRow key={sessionId} sessionId={sessionId} isHost={isHost} />
        ))}
      </div>
    </div>
  );
}
