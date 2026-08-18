import { useState } from 'react';
import { MEETING_PROFILE_STORAGE_KEY } from '../../constants/meetingSession';

// 실제로는 GET /meetings/{id}/participants 폴링으로 대체될 목업 참가자 목록.
// 나(세션에 저장된 프로필) + 목업 참가자 몇 명을 합쳐서 반환한다.
const MOCK_OTHER_PARTICIPANTS = [
  { name: 'Arjun', role: 'Engineer' },
  { name: 'Lucas', role: 'UX' },
];

export function useParticipants(isHost) {
  const [participants] = useState(() => {
    const raw = sessionStorage.getItem(MEETING_PROFILE_STORAGE_KEY);
    const me = raw ? JSON.parse(raw).profile : null;

    return [
      ...(me?.nickname
        ? [{
            name: me.nickname,
            role: me.role || '',
            meetingRole: isHost ? 'HOST' : 'MEMBER',
          }]
        : []),
      ...MOCK_OTHER_PARTICIPANTS,
    ];
  });

  return { participants };
}
