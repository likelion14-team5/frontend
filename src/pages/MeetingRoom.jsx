import React, { useEffect, useState } from 'react';
import './index.css';
import HeaderBar from "../components/common/HeaderBar/HeaderBar";
import ModeToggle from "../components/common/ModeToggle/ModeToggle";
import RightSidebar from '../components/RightSidebar/RightSidebar';
import { MEETING_PROFILE_STORAGE_KEY } from '../constants/meetingSession';
import RightSidebar from '../components/RightSidebar/RightSidebar';
import { MEETING_PROFILE_STORAGE_KEY } from '../constants/meetingSession';

// 회의방 화면 - "회의 입장" 이후 이동할 페이지.
// 상단 HeaderBar(토글 2개) + 우측 RightSidebar(발언 전 표현 변환 + 발언 직후 피드백)
// 아직 Jitsi 연동/참가자 목록/실제 AI 연동은 없음.
export default function MeetingRoom() {
  const [meetingProfile, setMeetingProfile] = useState(null); // mainPage에서 sessionStorage로 넘어온 프로필
  const [feedbackOn, setFeedbackOn] = useState(true);
  const [expressionOn, setExpressionOn] = useState(true);

  useEffect(() => {
    // 백엔드 연동 시 이 부분을 GET /meetings/{id} 호출로 교체하면 된다
    const raw = sessionStorage.getItem(MEETING_PROFILE_STORAGE_KEY);
    if (raw) {
      setMeetingProfile(JSON.parse(raw));
    }
  }, []);

  return (
    <div className="container">
      <div className="bg-glow-main" />
      <div className="bg-glow-sub" />

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
          <h1 className="main-title">회의방 (준비 중)</h1>
          <p className="sub-title">
            여기에 Jitsi 화상회의, 참가자 목록 기능이 들어갈 예정입니다.
          </p>

          {!meetingProfile && (
            <p className="sub-title">
              전달받은 프로필이 없습니다. mainPage에서 "회의 입장"으로 들어와주세요.
            </p>
          )}
        </div>

        <RightSidebar
          feedbackOn={feedbackOn}
          expressionOn={expressionOn}
          participant={{ name: meetingProfile?.profile?.nickname || '참가자' }}
          onCloseFeedback={() => setFeedbackOn(false)}
        />
      </main>
    </div>
  );
}
