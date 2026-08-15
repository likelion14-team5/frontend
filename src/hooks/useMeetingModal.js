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
    // createdRoomCode는 더 이상 여기서 미리 만들지 않는다.
    // 실제 회의 생성(POST /meetings) 성공 시 백엔드가 내려주는 진짜 share_url을 써야 하므로
    // 이 시점엔 비워둔 채로 두고, 생성 버튼을 눌러야 값이 채워지게 한다.
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

  const openProfileModal = () => setActiveModal('profile');
  const closeProfileModal = () => setActiveModal('join');

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