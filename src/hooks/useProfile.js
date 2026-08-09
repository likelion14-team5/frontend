import { useState } from 'react';
import { EMPTY_PROFILE } from '../constants/profileOptions';

export function useProfile(initialProfile = EMPTY_PROFILE) {
  const [savedProfile, setSavedProfile] = useState(initialProfile);

  const saveProfile = (newProfile) => setSavedProfile(newProfile);

  return { savedProfile, saveProfile };
}