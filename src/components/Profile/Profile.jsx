import React, { useEffect, useState } from 'react';
import './Profile.css';
import { API_ENDPOINTS, PARTICIPANT_TOKEN_KEY } from '../../constants/meetingSession';
import {
  mapBackendProfileToFrontend,
  getCountryName,
  getEnglishProficiencyLabel,
  getCommunicationStyleLabel,
} from '../../constants/profileOptions';

// 비디오 타일의 "프로필 상세보기"를 누르면 뜨는 참가자 프로필 팝업.
// GET /meetings/{meetingId}/participants/{participantId}로 실제 프로필을 받아온다.
export default function Profile({ meetingId, participantId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!meetingId || !participantId) return;

    let cancelled = false;

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);
        const response = await fetch(
          API_ENDPOINTS.GET_PARTICIPANT_DETAIL(meetingId, participantId),
          { headers: { 'X-Participant-Token': token } }
        );
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body?.error?.message ?? '프로필을 불러오지 못했습니다.');
        }
        if (cancelled) return;
        setProfile(mapBackendProfileToFrontend(body.data.profile));
        setRole(body.data.role);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [meetingId, participantId]);

  return (
    <div className="profile-backdrop" onClick={onClose}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="profile-close-btn" onClick={onClose}>
          ✕
        </button>

        {loading && <p className="profile-status">불러오는 중...</p>}
        {error && <p className="profile-status">{error}</p>}

        {profile && !loading && !error && (
          <>
            <div className="profile-name">
              {profile.nickname || '이름 미지정'}
              {role === 'HOST' && <span className="profile-host-badge">호스트</span>}
            </div>
            <div className="profile-detail">
              {profile.organization || '소속 미지정'}
              {profile.role && ` · ${profile.role}`}
            </div>
            <div className="profile-detail">
              {getCountryName(profile.country) || '국가 미지정'}
              {profile.languages && ` · ${profile.languages}`}
            </div>
            <div className="profile-detail">
              {getEnglishProficiencyLabel(profile.englishProficiency) || '영어 숙련도 미지정'}
              {' · '}
              {getCommunicationStyleLabel(profile.communicationStyle) || '소통 방식 미지정'}
            </div>
            {profile.additionalConsiderations && (
              <div className="profile-note">💡 {profile.additionalConsiderations}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
