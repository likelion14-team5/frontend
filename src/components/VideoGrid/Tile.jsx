import { useEffect, useRef } from "react";
import { useVideoTrack } from "@daily-co/daily-react";
import ParticipantInfoBar from "../ParticipantInfoBar/ParticipantInfoBar";
import { getCountryName, getEnglishProficiencyLabel } from "../../constants/profileOptions";
import styles from "./VideoGrid.module.css";

/**
 * 참가자 한 명의 비디오 타일.
 * Daily 트랙을 <video>에 직접 연결하고, 그 위에 ParticipantInfoBar를 오버레이한다.
 *
 * 요약 프로필 정보(국적·직무·영어 실력)는 Daily userData로 참가자 간 공유한다.
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
          country: getCountryName(participant.userData?.country),
          role: participant.userData?.role || "",
          englishLevel: getEnglishProficiencyLabel(participant.userData?.englishProficiency),
        }}
        isSelf={isLocal}
        onViewProfile={onViewProfile}
      />
    </div>
  );
}

export default Tile;
