import React, { useEffect, useState } from 'react';
import { DailyProvider } from '@daily-co/daily-react';
import './index.css';
import HeaderBar from "../components/common/HeaderBar/HeaderBar";
import ModeToggle from "../components/common/ModeToggle/ModeToggle";
import RightSidebar from '../components/RightSidebar/RightSidebar';
import BottomBar from '../components/BottomBar/BottomBar';
import VideoGrid from '../components/VideoGrid/VideoGrid';
import Profile from '../components/Profile/Profile';
import { useDailyCall } from '../hooks/useDailyCall';
import { MEETING_PROFILE_STORAGE_KEY } from '../constants/meetingSession';

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

  const [linkCopied, setLinkCopied] = useState(false);
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
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const [meetingProfile, setMeetingProfile] = useState(null); // mainPage에서 sessionStorage로 넘어온 프로필
  const [feedbackOn, setFeedbackOn] = useState(true);
  const [expressionOn, setExpressionOn] = useState(true);
  const [selectedParticipantId, setSelectedParticipantId] = useState(null); // "프로필상세" 클릭한 참가자

  useEffect(() => {
    const raw = sessionStorage.getItem(MEETING_PROFILE_STORAGE_KEY);
    if (raw) {
      setMeetingProfile(JSON.parse(raw));
    }
  }, []);

  // participants.role (HOST/MEMBER) — 프로필의 직무와는 다른 필드로 isHost 변수 사용
  const isHost = meetingProfile?.profile?.role === 'HOST';

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
              />
              <ModeToggle
                label="발언 전 표현 변환"
                isOn={expressionOn}
                onToggle={() => setExpressionOn((v) => !v)}
              />
            </div>

            <nav className="header-right">
              <span className="header-link">회의</span>
              <span className="header-link">도움말</span>
              <div className="avatar">나</div>
            </nav>
          </div>
        </HeaderBar>

        <main style={{ display: 'flex', flex: 1 }}>
          <div className="main">
            {!meetingProfile && (
              <p className="sub-title">
                전달받은 프로필이 없습니다. mainPage에서 "회의 입장"으로 들어와주세요.
              </p>
            )}
            {error && <p className="sub-title">연결 오류: {error}</p>}
            {!callObject && !error && <p className="sub-title">연결 중...</p>}
            {callObject && !joined && !error && <p className="sub-title">입장하는 중...</p>}

            {meetingId && (
              <button type="button" className="sub-title" onClick={copyInviteLink} style={{ cursor: 'pointer' }}>
                {linkCopied ? '초대 링크가 복사됐습니다 ✓' : '초대 링크 복사'}
              </button>
            )}

            <VideoGrid onViewProfile={setSelectedParticipantId} />

            <BottomBar isHost={isHost} />
          </div>

          <RightSidebar
            feedbackOn={feedbackOn}
            expressionOn={expressionOn}
            participant={{ name: meetingProfile?.profile?.nickname || '참가자' }}
            onCloseFeedback={() => setFeedbackOn(false)}
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
    </div>
  );
}