import { useEffect, useRef, useState } from 'react';
import { DailyProvider } from '@daily-co/daily-react';
import './index.css';
import HeaderBar from "../components/common/HeaderBar/HeaderBar";
import ModeToggle from "../components/common/ModeToggle/ModeToggle";
import RightSidebar from '../components/RightSidebar/RightSidebar';
import BottomBar from '../components/BottomBar/BottomBar';
import VideoGrid from '../components/VideoGrid/VideoGrid';
import Profile from '../components/Profile/Profile';
import MeetingInfoModal from '../components/common/HeaderBar/MeetingInfoModal';
import MeetingModal from '../components/landing/MeetingModal';
import ProfileForm from '../components/landing/ProfileForm';
import { useDailyCall } from '../hooks/useDailyCall';
import { useClickOutside } from '../hooks/useClickOutside';
import { useLeaveOnUnload } from '../hooks/useLeaveOnUnload';
import {
  MEETING_PROFILE_STORAGE_KEY,
  API_ENDPOINTS, PARTICIPANT_TOKEN_KEY
} from '../constants/meetingSession';
import { mapFrontendProfileToBackend } from '../constants/profileOptions';
import { useLanguage } from '../hooks/useLanguage.jsx';

// react-router 없이 pathname을 직접 파싱해서 meetingId를 구한다.
function extractMeetingIdFromPath(pathname) {
  const match = pathname.match(/\/meetings\/([^/]+)/);
  return match ? match[1] : null;
}

export default function MeetingRoom() {
  const { t } = useLanguage();
  const meetingId = extractMeetingIdFromPath(window.location.pathname);
  const { callObject, joined, error } = useDailyCall(meetingId);
  useLeaveOnUnload(meetingId);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const infoModalRef = useRef(null);
  useClickOutside(infoModalRef, () => setShowInfoModal(false));

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [meetingInfo, setMeetingInfo] = useState(null);

  const copyInviteLink = async () => {
    if (!meetingId) return;
    const link = `${window.location.origin}/meetings/${meetingId}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = link;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  const [meetingProfile, setMeetingProfile] = useState(() => {
    const raw = sessionStorage.getItem(MEETING_PROFILE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [showMyProfileModal, setShowMyProfileModal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  // 음성 분석 동의를 안 했으면 F-03은 켤 수 없어야 한다.
  const voiceAnalysisConsent = meetingProfile?.voiceAnalysisConsent ?? false;
  const [feedbackOn, setFeedbackOn] = useState(voiceAnalysisConsent);
  const [expressionOn, setExpressionOn] = useState(true);
  const [selectedParticipantId, setSelectedParticipantId] = useState(null); // "프로필상세" 클릭한 참가자
  const [feedbackTargetParticipantId, setFeedbackTargetParticipantId] = useState(null);

  useEffect(() => {
    if (!meetingId) return;

    const fetchMeetingContext = async () => {
      try {
        const token = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);
        const response = await fetch(API_ENDPOINTS.GET_MEETING_CONTEXT(meetingId), {
          headers: { 'X-Participant-Token': token },
        });
        if (response.ok) {
          const result = await response.json();
          setMeetingInfo(result.data.meeting);
        }

      } catch (e) {
        console.error('Failed to fetch meeting context', e);
      }
    };

    fetchMeetingContext();
  }, [meetingId]);

  // 회의 제목을 받아오면 탭 제목도 그걸로 바꾸고, 벗어날 때 원래 제목으로 되돌린다.
  useEffect(() => {
    if (!meetingInfo?.title) return undefined;

    const previousTitle = document.title;
    document.title = meetingInfo.title;

    return () => {
      document.title = previousTitle;
    };
  }, [meetingInfo?.title]);

  const toggleInfoModal = () => setShowInfoModal((prev) => !prev);

  const handleSaveMyProfile = async (newProfile) => {
    setSavingProfile(true);
    try {
      const token = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);
      const response = await fetch(API_ENDPOINTS.UPDATE_MY_PROFILE(meetingId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Participant-Token': token,
        },
        body: JSON.stringify(mapFrontendProfileToBackend(newProfile)),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error?.message ?? t('meetingRoom.profileUpdateFailed'));
      }

      const updated = { ...meetingProfile, profile: newProfile };
      setMeetingProfile(updated);
      sessionStorage.setItem(MEETING_PROFILE_STORAGE_KEY, JSON.stringify(updated));

      // 다른 참가자 화면의 이름표도 실시간으로 갱신되도록 Daily userData를 다시 보낸다.
      callObject?.setUserData({
        role: newProfile.role || '',
        country: newProfile.country || '',
        englishProficiency: newProfile.englishProficiency || '',
        communicationStyle: newProfile.communicationStyle || '',
        meetingRole: updated.meetingRole || 'MEMBER',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      setShowMyProfileModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // profile.role은 직무명이라 회의 권한 판별에는 못 씀 - meetingRole을 따로 본다.
  const isHost = meetingProfile?.meetingRole === 'HOST';

  return (
    <div className="container">
      <div className="bg-glow-main" />
      <div className="bg-glow-sub" />

      <DailyProvider callObject={callObject}>
        <HeaderBar
          mobileMenu={
            isMobileMenuOpen && (
              <div className="mobile-drawer overlay-fade">
                <div className="mobile-drawer-header">
                  <span className="logo">Attune</span>
                </div>

                <div className="mobile-menu-list">
                  <div className="mobile-menu-item">
                    <ModeToggle
                      label={t('meetingRoom.feedbackAfter')}
                      isOn={feedbackOn}
                      onToggle={() => setFeedbackOn((v) => !v)}
                      disabled={!voiceAnalysisConsent}
                      disabledReason={t('meetingRoom.feedbackAfterDisabledReason')}
                    />
                  </div>
                  <div className="mobile-menu-item">
                    <ModeToggle
                      label={t('meetingRoom.expressionBefore')}
                      isOn={expressionOn}
                      onToggle={() => setExpressionOn((v) => !v)}
                    />
                  </div>
                  <div className="mobile-menu-item">{t('header.help')}</div>
                  <div
                    className="mobile-menu-item"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowMyProfileModal(true);
                    }}
                  >
                    {t('meetingRoom.myProfileEdit')}
                  </div>
                </div>
              </div>
            )
          }
        >
          <div className="header-right-group">
          <div className="header-toggle-group desktop-only">
            <ModeToggle
              label={t('meetingRoom.feedbackAfter')}
              isOn={feedbackOn}
              onToggle={() => setFeedbackOn((v) => !v)}
              disabled={!voiceAnalysisConsent}
              disabledReason={t('meetingRoom.feedbackAfterDisabledReason')}
            />
            <ModeToggle
              label={t('meetingRoom.expressionBefore')}
              isOn={expressionOn}
              onToggle={() => setExpressionOn((v) => !v)}
            />
          </div>

          {/* 화면 폭에 상관없이 항상 보이는 회의 정보 - 햄버거 메뉴 안에 숨기지 않는다. */}
          <div className="meeting-info-trigger-wrap" ref={infoModalRef}>
            <span className="header-link" onClick={toggleInfoModal} role="button" tabIndex={0}>
              {t('meetingRoom.meetingInfo')}
            </span>
            {showInfoModal && (
              <MeetingInfoModal
                meetingInfo={meetingInfo}
                onCopyLink={copyInviteLink}
              />
            )}
          </div>

          <nav className="header-right desktop-only">
            <span className="header-link">{t('header.help')}</span>
            <div
              className="avatar"
              onClick={() => setShowMyProfileModal(true)}
              role="button"
              tabIndex={0}
              title={t('meetingRoom.myProfileEdit')}
              style={{ cursor: 'pointer' }}
            >
              나
            </div>
          </nav>

          <button
            className="mobile-hamburger-btn mobile-only"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
          </div>
        </HeaderBar>

        <main className="meeting-main-row">
          <div className="main">
            {/* 공유 링크로 바로 들어와 프로필/토큰이 없으면 회의 코드를 실어서 랜딩으로 보낸다. */}
            {!meetingProfile && (
              <div className="sub-title" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                <p>{t('meetingRoom.joinProfileFirst')}</p>
                <a href={`/?join=${meetingId}`} className="submit-button" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  {t('meetingRoom.joinThisMeeting')}
                </a>
              </div>
            )}
            {error && <p className="sub-title">{t('meetingRoom.connectionError')}{error}</p>}
            {!callObject && !error && <p className="sub-title">{t('meetingRoom.connecting')}</p>}
            {callObject && !joined && !error && <p className="sub-title">{t('meetingRoom.joining')}</p>}

            <VideoGrid onViewProfile={setSelectedParticipantId} />

            <BottomBar isHost={isHost} />
          </div>

          <RightSidebar
            initialInput=""
            feedbackOn={feedbackOn}
            expressionOn={expressionOn}
            participant={{ name: meetingProfile?.profile?.nickname || t('meetingRoom.defaultParticipantName') }}
            onCloseFeedback={() => setFeedbackOn(false)}
            meetingId={meetingId}
            feedbackTargetParticipantId={feedbackTargetParticipantId}
            onChangeFeedbackTarget={setFeedbackTargetParticipantId}
          />
        </main>
      </DailyProvider>

      {selectedParticipantId && (
        <Profile
          meetingId={meetingId}
          participantId={selectedParticipantId}
          onClose={() => setSelectedParticipantId(null)}
        />
      )}

      {showMyProfileModal && (
        <MeetingModal onClose={() => setShowMyProfileModal(false)}>
          <ProfileForm
            initialProfile={meetingProfile?.profile}
            onSave={handleSaveMyProfile}
            saving={savingProfile}
          />
        </MeetingModal>
      )}
    </div>
  );
}