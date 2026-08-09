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
    if (tab === 'create' && !createdRoomCode) {
      const mockMeetingId = crypto.randomUUID();
      setCreatedRoomCode(`${window.location.origin}/meetings/${mockMeetingId}`);
    }
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
    if (tab === 'create' && !createdRoomCode) {
      const mockMeetingId = crypto.randomUUID();
      setCreatedRoomCode(`${window.location.origin}/meetings/${mockMeetingId}`);
    }
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