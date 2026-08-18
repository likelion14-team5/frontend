import { COMMUNICATION_STYLE_OPTIONS, getCountryName } from '../../constants/profileOptions';

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
  return (
    <div>
      <div className="tab-container">
        <button
          className={`tab-button ${meetingTab === 'join' ? 'active' : ''}`}
          onClick={() => onTabChange('join')}
        >
          회의 입장하기
        </button>
        <button
          className={`tab-button ${meetingTab === 'create' ? 'active' : ''}`}
          onClick={() => onTabChange('create')}
        >
          새 회의 만들기
        </button>
      </div>

      {meetingTab === 'join' && (
        <div>
          <p className="card-subtitle">저장된 프로필로 바로 입장합니다.</p>

          <div className="form-group">
            <label className="label">회의 코드 또는 링크</label>
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
              placeholder="공유받은 회의 링크를 입력해주세요"
              className="input"
            />
          </div>
        </div>
      )}

      {meetingTab === 'create' && (
        <div>
          <p className="card-subtitle">새로운 회의를 개설하고 전용 코드를 생성합니다.</p>

          <div className="form-group">
            <label className="label">회의 주제 / 제목</label>
            <input
              type="text"
              value={newMeetingTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="예: 글로벌 마케팅 주간 회의 (필수)"
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="label">최대 참가 인원</label>
            <div className="participant-count-group">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`count-option ${maxParticipants === n ? 'active' : ''}`}
                  onClick={() => onMaxParticipantsChange(n)}
                >
                  {n}명
                </button>
              ))}
            </div>
          </div>

          {/* 회의는 "회의 생성 및 입장"을 눌러야 실제로 만들어짐 (이 시점에선 공유 링크가 없음)
              이전은 crypto.randomUUID()로 가짜 링크를 보여줬는데 혼돈이 있어 수정
              (TODO: 이후 보완 필요) */}
          <div className="form-group">
            <label className="label">공유 링크 안내</label>
            <div className="code-display-box">
              <span className="code-text">
                회의를 생성하면 회의 화면에서 초대 링크를 복사할 수 있어요.
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="profile-summary-box">
        <div className="summary-label">사용할 프로필</div>
        <div className="summary-name">
          {savedProfile.nickname.trim() ? savedProfile.nickname : '프로필을 입력해주세요'}
          {savedProfile.role.trim() && ` · ${savedProfile.role}`}
        </div>
        <div className="summary-details">
          {savedProfile.country ? getCountryName(savedProfile.country) : '국가 미지정'}
          {savedProfile.languages.trim() && ` · ${savedProfile.languages}`}
        </div>
        <div className="summary-details">
          {savedProfile.communicationStyle
            ? COMMUNICATION_STYLE_OPTIONS.find(
                (o) => o.value === savedProfile.communicationStyle
              )?.label
            : '소통 방식 미지정'}
        </div>

        <button className="edit-profile-button" onClick={onEditProfile}>
          프로필 수정
        </button>
      </div>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={profileSharingConsent}
          onChange={(e) => onProfileSharingConsentChange(e.target.checked)}
          className="checkbox"
        />
        프로필 공개에 동의합니다. (필수)
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={voiceAnalysisConsent}
          onChange={(e) => onVoiceAnalysisConsentChange(e.target.checked)}
          className="checkbox"
        />
        내 음성 분석(발언 피드백)에 동의합니다. (선택)
      </label>

      {meetingTab === 'join' ? (
        <button
          className="submit-button"
          disabled={!profileSharingConsent || !meetingCode.trim()}
        >
          회의 입장
        </button>
      ) : (
        <button
          className="submit-button"
          disabled={!profileSharingConsent || !newMeetingTitle.trim()}
        >
          회의 생성 및 입장
        </button>
      )}
    </div>
  );
}
