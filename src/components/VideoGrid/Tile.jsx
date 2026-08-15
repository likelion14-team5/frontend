import { useEffect, useRef } from "react";
import { useVideoTrack } from "@daily-co/daily-react";
import ParticipantInfoBar from "../ParticipantInfoBar/ParticipantInfoBar";
import styles from "./VideoGrid.module.css";

/**
 * 참가자 한 명의 비디오 타일.
 * Daily 트랙을 <video>에 직접 연결하고, 그 위에 ParticipantInfoBar를 오버레이한다.
 *
 * ⚠️ 지금은 이름표에 Daily가 주는 user_name만 쓴다.
 *   국가/직무 등 나머지 프로필 필드는 백엔드 참가자 목록(useParticipants.js)과
 *   user_id 기준으로 매칭해서 나중에 합치면 됨 — user_id가 우리 participant UUID와
 *   같은지는 백엔드 확인 필요(인수인계 문서상 media-session 발급 시 "참가자 UUID
 *   포함"이라고는 되어 있어서 가능성 높음).
 */
function Tile({ participant, isLocal, onViewProfile }) {
  const videoRef = useRef(null);
  const videoTrack = useVideoTrack(participant.session_id);

  useEffect(() => {
    if (!videoRef.current) return;
    if (videoTrack.state === "playable" && videoTrack.persistentTrack) {
      videoRef.current.srcObject = new MediaStream([videoTrack.persistentTrack]);
    } else {
      videoRef.current.srcObject = null;
    }
  }, [videoTrack.state, videoTrack.persistentTrack]);

  return (
    <div className={styles.tile}>
      <video ref={videoRef} autoPlay playsInline muted={isLocal} className={styles.video} />
      <ParticipantInfoBar
        participant={{
          id: participant.user_id,
          name: participant.user_name || "참가자",
          role: participant.userData?.role || "",
        }}
        isSelf={isLocal}
        onViewProfile={onViewProfile}
      />
    </div>
  );
}

export default Tile;