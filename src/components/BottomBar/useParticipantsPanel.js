import { useState } from 'react';

// 참가자 패널 열림/닫힘 상태
export function useParticipantsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const openPanel = () => setIsOpen(true);
  const closePanel = () => setIsOpen(false);

  return { isOpen, openPanel, closePanel };
}
