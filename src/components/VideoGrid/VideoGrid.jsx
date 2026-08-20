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
// 인원 수에 따라 열 개수를 정한다 - 2열 그리드를 고정으로 쓰면 3명일 때 마지막 줄에
// 빈 칸이 하나 남고, 그 빈 칸만큼 아래 BottomBar 위치가 인원마다 들쭉날쭉해 보였음.
// 1명: 적당히 큰 화면 / 2명: 2열 / 3명: 3열 한 줄로 딱 맞춤 / 4명: 2x2.
function columnsFor(count) {
  if (count <= 1) return 1;
  if (count === 3) return 3;
  return 2;
}

function VideoGrid({ onViewProfile }) {
  const participantIds = useParticipantIds();
  const columns = columnsFor(participantIds.length);

  // 1명일 땐 타일이 폭 전체를 다 차지하면 16:9 비율 때문에 세로로 너무 커져서
  // 아래 BottomBar가 화면 밖으로 밀려났었음 -> 폭을 적당히 제한하고 가운데 정렬.
  const gridStyle =
    columns === 1
      ? { gridTemplateColumns: '1fr', maxWidth: 640, margin: '0 auto' }
      : { gridTemplateColumns: `repeat(${columns}, 1fr)` };

  return (
    <div className={styles.grid} style={gridStyle}>
      {participantIds.map((id) => (
        <ConnectedTile key={id} sessionId={id} onViewProfile={onViewProfile} />
      ))}
    </div>
  );
}

export default VideoGrid;