import { getCountryName } from '../../constants/profileOptions';
import { useLanguage } from '../../hooks/useLanguage.jsx';

// props:
//   meetingTab, onTabChange(tab)                         - 'join' | 'create' 탭 전환
//   meetingCode, onMeetingCodeChange(value)               - 참여 탭 입력값
//   newMeetingTitle, onTitleChange(value)                 - 생성 탭 입력값
//   maxParticipants, onMaxParticipantsChange(n)           - 생성 탭 인원수
//   savedProfile                                          - 저장된 프로필 (요약 표시용)
//   onEditProfile()                                       - "프로필 수정" 클릭 시 (App이 activeModal='profile'로 전환)
//   profileSharingConsent, onProfileSharingConsentChange
//   voiceAnalysisConsent, onVoiceAnalysisConsentChange
export default function JoinCreateForm({
  meetingTab,
  onTabChange,
  meetingCode,
  onMeetingCodeChange,
  newMeetingTitle,
  onTitleChange,
  maxParticipants,
  onMaxParticipantsChange,
  savedProfile,
  onEditProfile,
  profileSharingConsent,
  onProfileSharingConsentChange,
  voiceAnalysisConsent,
  onVoiceAnalysisConsentChange,
}) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="tab-container">
        <button
          className={`tab-button ${meetingTab === 'join' ? 'active' : ''}`}
          onClick={() => onTabChange('join')}
        >
          {t('joinCreateForm.tabJoin')}
        </button>
        <button
          className={`tab-button ${meetingTab === 'create' ? 'active' : ''}`}
          onClick={() => onTabChange('create')}
        >
          {t('joinCreateForm.tabCreate')}
        </button>
      </div>

      {meetingTab === 'join' && (
        <div>
          <p className="card-subtitle">{t('joinCreateForm.joinSubtitle')}</p>

          <div className="form-group">
            <label className="label">{t('joinCreateForm.meetingCodeLabel')}</label>
            <input
              type="text"
              value={meetingCode}
              onChange={(e) => {
                const rawValue = e.target.value.trim();

                // 전체 URL이 들어온 경우 (예: http://localhost:5173/meetings/dfe928b7-...)
                if (rawValue.includes('/meetings/')) {
                  const extractedCode = rawValue.split('/meetings/').pop().split('?')[0];
                  onMeetingCodeChange(extractedCode);
                } else {
                  onMeetingCodeChange(rawValue);
                }
              }}
              placeholder={t('joinCreateForm.meetingCodePlaceholder')}
              className="input"
            />
          </div>
        </div>
      )}

      {meetingTab === 'create' && (
        <div>
          <p className="card-subtitle">{t('joinCreateForm.createSubtitle')}</p>

          <div className="form-group">
            <label className="label">{t('joinCreateForm.meetingTitleLabel')}</label>
            <input
              type="text"
              value={newMeetingTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={t('joinCreateForm.meetingTitlePlaceholder')}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">{t('joinCreateForm.maxParticipantsLabel')}</label>
            <div className="participant-count-group">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`count-option ${maxParticipants === n ? 'active' : ''}`}
                  onClick={() => onMaxParticipantsChange(n)}
                >
                  {n}{t('joinCreateForm.participantUnit')}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="label">{t('joinCreateForm.inviteLinkLabel')}</label>
            <div className="code-display-box">
              <span className="code-text">
                {t('joinCreateForm.inviteLinkNotice')}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="profile-summary-box">
        <div className="summary-label">{t('joinCreateForm.profileSummaryLabel')}</div>
        <div className="summary-name">
          {savedProfile.nickname.trim() ? savedProfile.nickname : t('joinCreateForm.profileNotSet')}
          {savedProfile.role.trim() && ` · ${savedProfile.role}`}
        </div>
        <div className="summary-details">
          {savedProfile.country ? getCountryName(savedProfile.country) : t('joinCreateForm.countryNotSet')}
          {savedProfile.languages.trim() && ` · ${savedProfile.languages}`}
        </div>
        <div className="summary-details">
          {savedProfile.communicationStyle
            ? t(`profileOptions.communicationStyle.${savedProfile.communicationStyle}`)
            : t('joinCreateForm.communicationStyleNotSet')}
        </div>

        <button className="edit-profile-button" onClick={onEditProfile}>
          {t('joinCreateForm.editProfileButton')}
        </button>
      </div>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={profileSharingConsent}
          onChange={(e) => onProfileSharingConsentChange(e.target.checked)}
          className="checkbox"
        />
        {t('joinCreateForm.consentProfileSharing')}
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={voiceAnalysisConsent}
          onChange={(e) => onVoiceAnalysisConsentChange(e.target.checked)}
          className="checkbox"
        />

        <div>
          <div>{t('joinCreateForm.consentVoiceAnalysis')}</div>
          <span className="checkbox-description">
            {t('joinCreateForm.consentVoiceAnalysisDescription')}
          </span>
        </div>
      </label>

      {meetingTab === 'join' ? (
        <button
          className="submit-button"
          disabled={!profileSharingConsent || !meetingCode.trim()}
        >
          {t('joinCreateForm.submitJoin')}
        </button>
      ) : (
        <button
          className="submit-button"
          disabled={!profileSharingConsent || !newMeetingTitle.trim()}
        >
          {t('joinCreateForm.submitCreate')}
        </button>
      )}
    </div>
  );
}
