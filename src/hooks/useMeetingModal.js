import { useState, useEffect } from 'react';

export function useMeetingModal() {
  const [activeModal, setActiveModal] = useState('none'); // 'none' | 'join' | 'profile'
  // 프로필 창을 닫을 때 돌아갈 곳: 헤더 "내 정보"로 열었으면 'none'(완전히 닫힘),
  // "회의 입장/생성" 흐름 중 "프로필 수정"으로 열었으면 'join'(그 화면으로 복귀).
  const [profileModalOrigin, setProfileModalOrigin] = useState('none');
  const [meetingTab, setMeetingTab] = useState('join'); // 'join' | 'create'
  const [meetingCode, setMeetingCode] = useState('');
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(4);
  const [createdRoomCode, setCreatedRoomCode] = useState('');
  const [profileSharingConsent, setProfileSharingConsent] = useState(false);
  const [voiceAnalysisConsent, setVoiceAnalysisConsent] = useState(false);

  useEffect(() => {
    document.body.style.overflow = activeModal !== 'none' ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  const openModal = (tab = 'join') => {
    setMeetingTab(tab);
    setActiveModal('join');
  };

  const closeModal = () => {
    setActiveModal('none');
    setMeetingTab('join');
    setMeetingCode('');
    setNewMeetingTitle('');
    setCreatedRoomCode('');
    setMaxParticipants(4);
    setProfileSharingConsent(false);
    setVoiceAnalysisConsent(false);
  };

  const handleTabChange = (tab) => {
    setMeetingTab(tab);
    // openModal과 동일하게, 진짜 회의가 생성되기 전까지는 가짜 링크를 만들지 않는다.
  };

  const openProfileModal = () => {
    setProfileModalOrigin(activeModal === 'join' ? 'join' : 'none');
    setActiveModal('profile');
  };
  const closeProfileModal = () => setActiveModal(profileModalOrigin);

  return {
    activeModal,
    meetingTab,
    meetingCode, newMeetingTitle, maxParticipants, createdRoomCode,
    profileSharingConsent, voiceAnalysisConsent,
    handleMeetingCodeChange: setMeetingCode,
    handleNewMeetingTitleChange: setNewMeetingTitle,
    handleMaxParticipantsChange: setMaxParticipants,
    handleProfileSharingConsentChange: setProfileSharingConsent,
    handleVoiceAnalysisConsentChange: setVoiceAnalysisConsent,
    openModal, closeModal, handleTabChange, openProfileModal, closeProfileModal,
  };
}