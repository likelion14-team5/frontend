import { Mic, MicOff, PhoneOff, Users, Video, VideoOff } from 'lucide-react';
import styles from './BottomBar.module.css';
import { useMic } from './useMic';
import { useCamera } from './useCamera';
import { useEndMeeting } from './useEndMeeting';
import { useParticipantsPanel } from './useParticipantsPanel';
import ParticipantsPanel from '../ParticipantsPanel/ParticipantsPanel';

// 회의방 하단 컨트롤 바 (와이어프레임 S-05)
// 마이크/카메라/종료/참가자 동작은 각각 전용 훅에서 담당하고, 이 파일은 그걸 조립해서 화면만 그린다.
export default function BottomBar({ isHost = false }) {
  const { micOn, toggleMic } = useMic();
  const { cameraOn, toggleCamera } = useCamera();
  const { showEndConfirm, requestEnd, cancelEnd, confirmEnd } = useEndMeeting();
  const { isOpen: isParticipantsOpen, openPanel, closePanel } = useParticipantsPanel();

  return (
    <>
      <div className={styles.controlBar}>
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
