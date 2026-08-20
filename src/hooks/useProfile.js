import { useState } from 'react';
import { EMPTY_PROFILE } from '../constants/profileOptions';

const LEGACY_SAVED_PROFILE_KEY = 'attune_saved_profile';

function createInitialProfile(initialProfile) {
  // 과거 버전이 브라우저 전체에 저장한 프로필을 삭제한다.
  // 참가자는 초대 링크로 입장할 때마다 자기 정보를 새로 입력해야 한다.
  try {
    localStorage.removeItem(LEGACY_SAVED_PROFILE_KEY);
  } catch {
    // 저장소 접근이 막힌 환경이어도 빈 프로필로 계속 진행한다.
  }

  return { ...EMPTY_PROFILE, ...initialProfile };
}

export function useProfile(initialProfile = EMPTY_PROFILE) {
  const [savedProfile, setSavedProfile] = useState(() =>
    createInitialProfile(initialProfile),
  );

  const saveProfile = (newProfile) => {
    setSavedProfile(newProfile);
  };

  return { savedProfile, saveProfile };
}
