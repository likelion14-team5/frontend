import { useParticipant, useParticipantIds } from '@daily-co/daily-react';
import { Mic, MicOff, Video, VideoOff, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import styles from './ParticipantsPanel.module.css';
import { useDraggable } from './useDraggable';

// 실제로 회의에 들어와 있는 참가자 한 명. 더미 데이터 없이 Daily 참가자 그대로 사용한다.
// 이름/마이크/카메라 상태는 Daily 트랙에서, 직무는 useDailyCall.js가 join 시 실어 보낸 userData.role에서 가져온다.
function ParticipantRow({ sessionId, isHost }) {
  const participant = useParticipant(sessionId);

  if (!participant) return null;

  // participant.audio/.video(불리언)는 daily-js에서 deprecated된 필드라 값이 갱신 안 됨
  // -> tracks.audio.state / tracks.video.state를 본다 (useMic.js/useCamera.js와 동일한 이유).
  const micOn = participant.tracks.audio.state !== 'off';
  const cameraOn = participant.tracks.video.state !== 'off';
  const isParticipantHost = participant.userData?.meetingRole === 'HOST'
    || (participant.local && isHost);
  const role = participant.userData?.role || '';

  return (
    <div className={styles.participant}>
      <div className={styles.avatar}>{participant.user_name?.[0] || '?'}</div>
      <div className={styles.info}>
        <div>
          <div className={styles.name}>
            {participant.user_name || '참가자'}
            {participant.local && ' (나)'}
          </div>
          {role && <div className={styles.role}>{role}</div>}
        </div>
        {isParticipantHost && <span className={styles.host}>(호스트)</span>}
      </div>
      <div className={styles.mediaStatus} aria-label="미디어 상태">
        <span className={styles.mediaIcon} title={micOn ? '마이크 켜짐' : '마이크 꺼짐'} aria-label={micOn ? '마이크 켜짐' : '마이크 꺼짐'}>
          {micOn ? <Mic size={21} /> : <MicOff size={21} />}
        </span>
        <span className={styles.mediaIcon} title={cameraOn ? '카메라 켜짐' : '카메라 꺼짐'} aria-label={cameraOn ? '카메라 켜짐' : '카메라 꺼짐'}>
          {cameraOn ? <Video size={21} /> : <VideoOff size={21} />}
        </span>
      </div>
    </div>
  );
}

// 참가자 목록을 보여주는 플로팅 패널.
// 더미 참가자 없이, 실제로 이 회의에 접속해 있는 Daily 참가자만 보여준다.
// 브라우저 기본 드래그가 아니라 useDraggable로 직접 구현한 드래그 + 우상단 닫기(X) 버튼.
export default function ParticipantsPanel({ onClose, isHost }) {
  const { position, handleMouseDown } = useDraggable({ x: 0, y: 0 });
  const participantIds = useParticipantIds();

  return createPortal(
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
    </div>,
    document.body,
  );
}
