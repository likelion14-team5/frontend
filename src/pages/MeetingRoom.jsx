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

// react-router-dom 없이 main.jsx가 pathname만 보고 페이지를 고르는 구조라
// (main.jsx: isMeetingRoute ? MeetingRoom : App, 둘 다 prop 없이 렌더링됨)
// meetingId는 여기서 URL 경로를 직접 파싱해서 구한다.
function extractMeetingIdFromPath(pathname) {
  const match = pathname.match(/\/meetings\/([^/]+)/);
  return match ? match[1] : null;
}

// 회의방 화면 - "회의 입장" 이후 이동할 페이지.
// Daily 연결은 여기(page 최상단)에서 한 번만 만들고, DailyProvider로 HeaderBar 아래
// 전체(VideoGrid + BottomBar + RightSidebar)를 감싸서 어디서든 daily-react 훅을 쓸 수 있게 한다.
export default function MeetingRoom() {
  const meetingId = extractMeetingIdFromPath(window.location.pathname);
  const { callObject, joined, error } = useDailyCall(meetingId);
  useLeaveOnUnload(meetingId);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const infoModalRef = useRef(null);
  useClickOutside(infoModalRef, () => setShowInfoModal(false));

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
  }); // mainPage에서 sessionStorage로 넘어온 프로필
  const [showMyProfileModal, setShowMyProfileModal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  // voice_analysis_consent가 false면(입장 시 "음성 분석 동의"를 안 했으면)
  // F-03(발언 직후 피드백)은 처음부터 꺼진 채로 시작하고 켤 수도 없어야 한다(스펙 5.1).
  const voiceAnalysisConsent = meetingProfile?.voiceAnalysisConsent ?? false;
  const [feedbackOn, setFeedbackOn] = useState(voiceAnalysisConsent);
  const [expressionOn, setExpressionOn] = useState(true);
  const [selectedParticipantId, setSelectedParticipantId] = useState(null); // "프로필상세" 클릭한 참가자
  const [feedbackTargetParticipantId, setFeedbackTargetParticipantId] = useState(null);

  // 회의실 입장 시, 회의 컨텍스트(제목, 인원 등)를 백엔드에서 가져온다.
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

  // 탭 제목이 항상 "Attune"으로만 떠서 여러 회의 탭을 구분할 수가 없었음 - 회의 제목을 받아오면
  // 탭 제목도 그걸로 바꾸고, 페이지를 벗어날 때(언마운트) 원래 제목으로 되돌린다.
  useEffect(() => {
    if (!meetingInfo?.title) return undefined;

    const previousTitle = document.title;
    document.title = meetingInfo.title;

    return () => {
      document.title = previousTitle;
    };
  }, [meetingInfo?.title]);

  const toggleInfoModal = () => setShowInfoModal((prev) => !prev);

  // 헤더의 "나" 아바타를 눌러서 여는, 내 프로필만 수정하는 창.
  // 참가자 목록(ParticipantsPanel)과는 무관하게 별도로 만든 것 - 거긴 건드리지 않는다.
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
        throw new Error(body?.error?.message ?? '프로필 수정에 실패했습니다.');
      }

      const updated = { ...meetingProfile, profile: newProfile };
      setMeetingProfile(updated);
      sessionStorage.setItem(MEETING_PROFILE_STORAGE_KEY, JSON.stringify(updated));

      // 다른 참가자 화면의 이름표(국가·직무·영어실력·소통방식·시간대)도 실시간으로
      // 갱신되도록 Daily userData를 다시 보낸다 (useDailyCall.js가 join 시 보내던 것과 동일한 값).
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

  // profile.role은 직무이므로, 회의 권한은 별도 meetingRole 필드로 판별한다.
  const isHost = meetingProfile?.meetingRole === 'HOST';

  return (
    <div className="container">
      <div className="bg-glow-main" />
      <div className="bg-glow-sub" />

      <DailyProvider callObject={callObject}>
        <HeaderBar>
          <div className="header-right-group">
            <div className="header-toggle-group">
              <ModeToggle
                label="발언 직후 피드백"
                isOn={feedbackOn}
                onToggle={() => setFeedbackOn((v) => !v)}
                disabled={!voiceAnalysisConsent}
                disabledReason="입장 시 음성 분석에 동의하지 않아 사용할 수 없습니다."
              />
              <ModeToggle
                label="발언 전 표현 변환"
                isOn={expressionOn}
                onToggle={() => setExpressionOn((v) => !v)}
              />
            </div>

            <nav className="header-right">
              <div ref={infoModalRef} style={{ position: 'relative' }}>
                <span className="header-link" onClick={toggleInfoModal} role="button" tabIndex={0}>
                  회의 정보
                </span>
                {showInfoModal && (
                  <MeetingInfoModal
                    meetingInfo={meetingInfo}
                    onCopyLink={copyInviteLink}
                  />
                )}
              </div>

              <span className="header-link">도움말</span>
              <div
                className="avatar"
                onClick={() => setShowMyProfileModal(true)}
                role="button"
                tabIndex={0}
                title="내 프로필 수정"
                style={{ cursor: 'pointer' }}
              >
                나
              </div>
            </nav>
          </div>
        </HeaderBar>

        <main style={{ display: 'flex', flex: 1 }}>
          <div className="main">
            {/* 공유 링크로 바로 들어왔지만 이 브라우저엔 아직 프로필/토큰이 없는 경우
                (예전엔 그냥 "mainPage에서 들어오세요" 텍스트만 있고 돌아갈 길이 없었음)
                -> 이 회의 코드를 그대로 실어서 랜딩의 "회의 입장" 모달로 보낸다. */}
            {!meetingProfile && (
              <div className="sub-title" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                <p>참가하려면 프로필을 먼저 입력해주세요.</p>
                <a href={`/?join=${meetingId}`} className="submit-button" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  이 회의 참가하기
                </a>
              </div>
            )}
            {error && <p className="sub-title">연결 오류: {error}</p>}
            {!callObject && !error && <p className="sub-title">연결 중...</p>}
            {callObject && !joined && !error && <p className="sub-title">입장하는 중...</p>}

            <VideoGrid onViewProfile={setSelectedParticipantId} />

            <BottomBar isHost={isHost} />
          </div>

          <RightSidebar
            initialInput=""
            feedbackOn={feedbackOn}
            expressionOn={expressionOn}
            participant={{ name: meetingProfile?.profile?.nickname || '참가자' }}
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