import { Mic, MicOff, PhoneOff, Users, Video, VideoOff } from 'lucide-react';
import styles from './BottomBar.module.css';
import { useMic } from './useMic';
import { useMicLevel } from './useMicLevel';
import { useCamera } from './useCamera';
import { useEndMeeting } from './useEndMeeting';
import { useParticipantsPanel } from './useParticipantsPanel';
import ParticipantsPanel from '../ParticipantsPanel/ParticipantsPanel';

// 회의방 하단 컨트롤 바 (와이어프레임 S-05)
// 마이크/카메라/종료/참가자 동작은 각각 전용 훅에서 담당하고, 이 파일은 그걸 조립해서 화면만 그린다.
export default function BottomBar({ isHost = false }) {
  const { micOn, toggleMic } = useMic();
  const micLevel = useMicLevel();
  // 음량(0~1)을 5칸짜리 막대로 환산 - *3은 보통 목소리 크기에서도 칸이 잘 차오르게 하는 민감도 보정.
  const activeSegments = micOn ? Math.round(Math.min(1, micLevel * 3) * 5) : 0;
  const { cameraOn, toggleCamera } = useCamera();
  const { showEndConfirm, requestEnd, cancelEnd, confirmEnd } = useEndMeeting();
  const { isOpen: isParticipantsOpen, openPanel, closePanel } = useParticipantsPanel();

  return (
    <>
      <div className={styles.controlBar}>
        <div className={styles.micWrap}>
          <button
            type="button"
            className={`${styles.controlBtn} ${micOn ? '' : styles.off}`}
            onClick={toggleMic}
          >
            <span className={styles.buttonContent}>
              {micOn ? <Mic size={18} aria-hidden="true" /> : <MicOff size={18} aria-hidden="true" />}
              마이크
            </span>
          </button>
          {/* 마이크 테스트용 음량 미터 - 말했을 때 칸이 실제로 차오르는지 눈으로 확인할 수 있다. */}
          <div className={styles.micLevelMeter}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`${styles.micLevelBar} ${i < activeSegments ? styles.micLevelBarActive : ''}`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          className={`${styles.controlBtn} ${cameraOn ? '' : styles.off}`}
          onClick={toggleCamera}
        >
          <span className={styles.buttonContent}>
            {cameraOn ? <Video size={18} aria-hidden="true" /> : <VideoOff size={18} aria-hidden="true" />}
            카메라
          </span>
        </button>
        <button type="button" className={styles.controlBtn} onClick={openPanel}>
          <span className={styles.buttonContent}>
            <Users size={18} aria-hidden="true" />
            참가자
          </span>
        </button>
        <button
          type="button"
          className={`${styles.controlBtn} ${styles.endCall}`}
          onClick={requestEnd}
        >
          <span className={styles.buttonContent}>
            <PhoneOff size={18} aria-hidden="true" />
            종료
          </span>
        </button>
      </div>

      {showEndConfirm && (
        <div className={styles.confirmBackdrop}>
          <div className={styles.confirmCard}>
            <p className={styles.confirmText}>회의를 나가시겠습니까?</p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.cancelBtn} onClick={cancelEnd}>
                취소
              </button>
              <button type="button" className={styles.confirmEndBtn} onClick={confirmEnd}>
                나가기
              </button>
            </div>
          </div>
        </div>
      )}

      {isParticipantsOpen && <ParticipantsPanel onClose={closePanel} isHost={isHost} />}
    </>
  );
}
