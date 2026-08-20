import { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { useDraggable } from '../ParticipantsPanel/useDraggable';
import { useLocalTime } from '../VideoGrid/useLocalTime';
import { API_ENDPOINTS, PARTICIPANT_TOKEN_KEY } from '../../constants/meetingSession';
import {
  mapBackendProfileToFrontend,
  getCountryName,
  getEnglishProficiencyLabel,
  getCommunicationStyleLabel,
} from '../../constants/profileOptions';
import { useLanguage } from '../../hooks/useLanguage.jsx';

// ISO 국가 코드(예: "KR") -> 국기 이모지. 유니코드 지역표시문자로 변환.
function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '';
  return [...countryCode.toUpperCase()]
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join('');
}

// 비디오 타일의 "프로필 상세보기"를 누르면 뜨는 참가자 프로필 패널.
// 전체 화면을 덮는 모달이 아니라, ParticipantsPanel과 같은 방식(드래그 가능한 플로팅 카드)으로 띄운다.
// GET /meetings/{meetingId}/participants/{participantId}로 실제 프로필을 받아온다.
export default function Profile({ meetingId, participantId, onClose }) {
  const { t } = useLanguage();
  const { position, handleMouseDown } = useDraggable({ x: 0, y: 0 });
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const localTime = useLocalTime(profile?.timezone);

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
          throw new Error(body?.error?.message ?? t('participantProfile.loadFailedError'));
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
    <div
      className={styles.panel}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div className={styles.header} onMouseDown={handleMouseDown}>
        <span className={styles.title}>{t('participantProfile.title')}</span>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.body}>
        {loading && <p className={styles.status}>{t('participantProfile.loading')}</p>}
        {error && <p className={styles.status}>{error}</p>}

        {profile && !loading && !error && (
          <>
            <div className={styles.name}>
              {profile.nickname}
              {role === 'HOST' && <span className={styles.hostBadge}>{t('participantProfile.hostBadge')}</span>}
              <span className={styles.detail}>
                {profile.organization}
                {profile.role && ` · ${profile.role}`}
              </span>
            </div>

            <div className={styles.detail}>
              {getFlagEmoji(profile.country)} {getCountryName(profile.country)}
              {localTime && ` · ${localTime}`}
            </div>

            <div className={styles.sectionHeading}>{t('participantProfile.languageSectionTitle')}</div>
            <div className={styles.detail}>{t('participantProfile.mainLanguageLabel')} {profile.languages}</div>
            <div className={styles.detail}>
              {t('participantProfile.englishLevelLabel')} {profile.englishProficiency ? t(`profileOptions.englishProficiency.${profile.englishProficiency}`) : getEnglishProficiencyLabel(profile.englishProficiency)}
            </div>
            <div className={styles.detail}>
              {t('participantProfile.communicationLabel')} {profile.communicationStyle ? t(`profileOptions.communicationStyle.${profile.communicationStyle}`) : getCommunicationStyleLabel(profile.communicationStyle)}
            </div>
            <div className={styles.note}>
              {t('participantProfile.noteLabel')} {profile.additionalConsiderations || t('participantProfile.noteEmpty')}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
