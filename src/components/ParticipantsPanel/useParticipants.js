import { useState, useEffect } from 'react';
import { MEETING_PROFILE_STORAGE_KEY } from '../../constants/meetingSession';

// 실제로는 GET /meetings/{id}/participants 폴링으로 대체될 목업 참가자 목록.
// 나(세션에 저장된 프로필) + 목업 참가자 몇 명을 합쳐서 반환한다.
const MOCK_OTHER_PARTICIPANTS = [
  { name: 'Arjun', role: 'Engineer' },
  { name: 'Lucas', role: 'UX' },
];

export function useParticipants() {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const raw = sessionStorage.getItem(MEETING_PROFILE_STORAGE_KEY);
    const me = raw ? JSON.parse(raw).profile : null;

    const list = [
      ...(me?.nickname ? [{ name: me.nickname, role: me.role || '' }] : []),
      ...MOCK_OTHER_PARTICIPANTS,
    ];
    setParticipants(list);
  }, []);

  return { participants };
}
