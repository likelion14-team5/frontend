import { useState, useEffect } from 'react';

export function useMeetingModal() {
  const [activeModal, setActiveModal] = useState('none'); // 'none' | 'join' | 'profile'
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

  // 프로필 창은 "내 정보"(헤더)나 회의 입장 흐름 중("프로필 수정") 어디서 열렸든,
  // X든 저장이든 닫으면 항상 완전히 닫힌다(랜딩으로) - 이전 모달로 돌아가지 않는다.
  const openProfileModal = () => setActiveModal('profile');
  const closeProfileModal = () => setActiveModal('none');

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