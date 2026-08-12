//npm run dev 서버 열기
import React from 'react';
import './index.css';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import MeetingModal from '../components/landing/MeetingModal';
import JoinCreateForm from '../components/landing/JoinCreateForm';
import ProfileForm from '../components/landing/ProfileForm';
import { useMeetingModal } from '../hooks/useMeetingModal';
import { useProfile } from '../hooks/useProfile';
import { useGoToMeeting } from '../hooks/useGoToMeeting';

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

  const goToMeeting = useGoToMeeting();

  // JoinCreateForm의 제출 버튼엔 onClick이 없어서(껍데기만) 클릭을 여기서 위임받아 처리한다.
  const handleModalContentClick = (e) => {
    const submitBtn = e.target.closest('.submit-button');
    if (!submitBtn || submitBtn.disabled || activeModal !== 'join') return;

    if (meetingTab === 'join') {
      goToMeeting(meetingCode, savedProfile, voiceAnalysisConsent);
    } else if (meetingTab === 'create') {
      goToMeeting(createdRoomCode, savedProfile, voiceAnalysisConsent);
    }
  };

  return (
    <div className="container">
      {/* 부드러운 오오라 글로우 필드 */}
      <div className="bg-glow-main" />
      <div className="bg-glow-sub" />

      <Header onOpenModal={openModal} />
      <Hero onOpenModal={openModal} />

      {/* 모달 팝업 오버레이 */}
      {activeModal !== 'none' && (
        <MeetingModal onClose={activeModal === 'profile' ? closeProfileModal : closeModal}>
          <div onClick={handleModalContentClick}>
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
          </div>
        </MeetingModal>
      )}
    </div>
  );
}
