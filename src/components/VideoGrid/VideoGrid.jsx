import { useParticipantIds, useParticipant } from "@daily-co/daily-react";
import Tile from "./Tile";
import styles from "./VideoGrid.module.css";

function ConnectedTile({ sessionId, onViewProfile }) {
  const participant = useParticipant(sessionId);
  if (!participant) return null;
  return (
    <Tile participant={participant} isLocal={participant.local} onViewProfile={onViewProfile} />
  );
}

/**
 * VideoGrid: 참가자별 타일 렌더링만 담당한다.
 * Daily 연결(useDailyCall)은 이제 MeetingRoom이 소유하고, MeetingRoom이
 * <DailyProvider>로 이 컴포넌트를 감싸준다는 전제로 동작한다.
 *
 * props
 * - onViewProfile: (participantId) => void — "프로필상세" 클릭 시 상위로 전달
 */
function VideoGrid({ onViewProfile }) {
  const participantIds = useParticipantIds();

  return (
    <div className={styles.grid}>
      {participantIds.map((id) => (
        <ConnectedTile key={id} sessionId={id} onViewProfile={onViewProfile} />
      ))}
    </div>
  );
}

export default VideoGrid;