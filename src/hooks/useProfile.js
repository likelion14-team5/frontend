import { useState } from 'react';
import { EMPTY_PROFILE } from '../constants/profileOptions';

// 예전엔 React state에만 저장해서 새로고침하면 프로필이 매번 날아갔음(다시 다 입력해야 함).
// "미리 작성해두고 저장" 요청에 맞게 localStorage에 저장해서 재방문/새로고침에도 남아있게 한다.
const SAVED_PROFILE_KEY = 'attune_saved_profile';

function loadSavedProfile() {
  try {
    const raw = localStorage.getItem(SAVED_PROFILE_KEY);
    return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } : EMPTY_PROFILE;
  } catch {
    return EMPTY_PROFILE;
  }
}

export function useProfile(initialProfile = loadSavedProfile()) {
  const [savedProfile, setSavedProfile] = useState(initialProfile);

  const saveProfile = (newProfile) => {
    setSavedProfile(newProfile);
    try {
      localStorage.setItem(SAVED_PROFILE_KEY, JSON.stringify(newProfile));
    } catch {
      // localStorage를 못 쓰는 환경(프라이빗 모드 등)이면 이번 세션 동안만 기억한다.
    }
  };

  return { savedProfile, saveProfile };
}
