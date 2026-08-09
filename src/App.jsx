import React, { useState } from 'react';
import './index.css';
import Header from './components/Header';
import Hero from './components/Hero';
import MeetingModal from './components/MeetingModal';
import JoinCreateForm from './components/JoinCreateForm';
import ProfileForm from './components/ProfileForm';
import RightSidebar from './components/RightSidebar/RightSidebar';
import { useMeetingModal } from './hooks/useMeetingModal';
import { useProfile } from './hooks/useProfile';

export default function App() {
  const { savedProfile, saveProfile } = useProfile();
  const {
    activeModal,
    meetingTab,
    meetingCode,
    newMeetingTitle,
    maxParticipants,
    createdRoomCode,
    profileSharingConsent,
    voiceAnalysisConsent,
    handleMeetingCodeChange,
    handleNewMeetingTitleChange,
    handleMaxParticipantsChange,
    handleProfileSharingConsentChange,
    handleVoiceAnalysisConsentChange,
    openModal,
    closeModal,
    handleTabChange,
    openProfileModal,
    closeProfileModal,
  } = useMeetingModal();

  // 우측탭 테스트/연동용 상태
  const [feedbackOn, setFeedbackOn] = useState(true);
  const [expressionOn, setExpressionOn] = useState(true);

  return (
    <div className="container">
      {/* 부드러운 오오라 글로우 필드 */}
      <div className="bg-glow-main" />
      <div className="bg-glow-sub" />

      <Header onOpenModal={openModal} />
      
      <main style={{ display: 'flex', flex: 1 }}>
        <Hero onOpenModal={openModal} />
        
        {/* 우측 사이드바 컴포넌트 추가 */}
        <RightSidebar
          feedbackOn={feedbackOn}
          expressionOn={expressionOn}
          participant={{ name: savedProfile?.name || '참가자' }}
          onCloseFeedback={() => setFeedbackOn(false)}
        />
      </main>

      {/* 모달 팝업 오버레이 */}
      {activeModal !== 'none' && (
        <MeetingModal onClose={activeModal === 'profile' ? closeProfileModal : closeModal}>
          {activeModal === 'profile' ? (
            <ProfileForm
              initialProfile={savedProfile}
              onSave={(newProfile) => {
                saveProfile(newProfile);
                closeProfileModal();
              }}
            />
          ) : activeModal === 'join' ? (
            <JoinCreateForm
              meetingTab={meetingTab}
              onTabChange={handleTabChange}
              meetingCode={meetingCode}
              onMeetingCodeChange={handleMeetingCodeChange}
              newMeetingTitle={newMeetingTitle}
              onTitleChange={handleNewMeetingTitleChange}
              maxParticipants={maxParticipants}
              onMaxParticipantsChange={handleMaxParticipantsChange}
              createdRoomCode={createdRoomCode}
              savedProfile={savedProfile}
              onEditProfile={openProfileModal}
              profileSharingConsent={profileSharingConsent}
              onProfileSharingConsentChange={handleProfileSharingConsentChange}
              voiceAnalysisConsent={voiceAnalysisConsent}
              onVoiceAnalysisConsentChange={handleVoiceAnalysisConsentChange}
            />
          ) : null}
        </MeetingModal>
      )}
    </div>
  );
}