import React, { useState, useRef, useEffect } from 'react';
import './index.css';

// API의 country_code는 2자리 ISO 대문자 코드(예: KR)만 허용하므로, 국가명과 코드를 함께 들고 있는다
// 프로필 폼의 빈 상태 - 초기값과 "저장 없이 닫기" 시 되돌릴 기본값으로 재사용
const EMPTY_PROFILE = {
  nickname: '',
  country: '',
  organization: '',
  role: '',
  languages: '',
  englishProficiency: '',
  communicationStyle: '',
};

const COUNTRY_LIST = [
  { code: 'KR', name: '대한민국' },
  { code: 'US', name: '미국' },
  { code: 'JP', name: '일본' },
  { code: 'CN', name: '중국' },
  { code: 'GB', name: '영국' },
  { code: 'DE', name: '독일' },
  { code: 'FR', name: '프랑스' },
  { code: 'CA', name: '캐나다' },
  { code: 'AU', name: '호주' },
  { code: 'VN', name: '베트남' },
  { code: 'SG', name: '싱가포르' },
  { code: 'ID', name: '인도네시아' },
  { code: 'TH', name: '태국' },
  { code: 'PH', name: '필리핀' },
  { code: 'IN', name: '인도' },
  { code: 'ES', name: '스페인' },
  { code: 'IT', name: '이탈리아' },
  { code: 'NL', name: '네덜란드' },
  { code: 'CH', name: '스위스' },
];

// formData.country(코드)로부터 화면에 보여줄 국가명을 역으로 찾는 헬퍼
const getCountryName = (code) => COUNTRY_LIST.find((c) => c.code === code)?.name || '';

// API: english_proficiency enum - select 옵션에 표시할 한글 라벨
const ENGLISH_PROFICIENCY_OPTIONS = [
  { value: 'BEGINNER', label: '초급' },
  { value: 'INTERMEDIATE', label: '중급' },
  { value: 'ADVANCED', label: '고급' },
];

// API: communication_style enum - select 옵션에 표시할 한글 라벨
const COMMUNICATION_STYLE_OPTIONS = [
  { value: 'DIRECT', label: '직설적' },
  { value: 'INDIRECT', label: '완곡한' },
  { value: 'FACT_FOCUSED', label: '사실 중심' },
  { value: 'EMOTION_EXPRESSIVE', label: '감정 표현적' },
  { value: 'BALANCED', label: '균형적' },
];

export default function App() {
  const [activeModal, setActiveModal] = useState('none'); // 현재 열린 모달 종류(none/join/profile)
  const [meetingTab, setMeetingTab] = useState('join'); // join 모달 안의 탭(참여하기/만들기)
  const [meetingCode, setMeetingCode] = useState(''); // 참여 탭에서 사용자가 입력하는 회의 코드/링크
  const [newMeetingTitle, setNewMeetingTitle] = useState(''); // API: MeetingCreateRequest.title (필수)
  const [createdRoomCode, setCreatedRoomCode] = useState(''); // API: MeetingCreateData.share_url에 해당하는 값(지금은 목업)
  const [maxParticipants, setMaxParticipants] = useState(4); // API: MeetingCreateRequest.max_participants (2~4, 기본 4)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [savedProfile, setSavedProfile] = useState(EMPTY_PROFILE); // "저장하고 돌아가기"를 눌러야만 갱신되는 실제 저장된 프로필
  const [formData, setFormData] = useState(EMPTY_PROFILE); // 프로필 폼에서 편집 중인 임시 값(저장 전까지는 draft일 뿐)

  const [countryQuery, setCountryQuery] = useState(''); // 국가 검색창에 실제로 입력/표시되는 문자열(국가명 검색용, 제출값인 코드와는 별개)
  const [errors, setErrors] = useState({});
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countryRef = useRef(null);
  const countryInputRef = useRef(null);
  const [isEnglishProficiencyOpen, setIsEnglishProficiencyOpen] = useState(false); // 영어 숙련도 커스텀 드롭다운 열림 여부
  const [isCommunicationStyleOpen, setIsCommunicationStyleOpen] = useState(false); // 소통 방식 커스텀 드롭다운 열림 여부
  const englishProficiencyRef = useRef(null);
  const communicationStyleRef = useRef(null);
  const [profileSharingConsent, setProfileSharingConsent] = useState(false); // API: profile_sharing_consent - 반드시 true여야 입장 가능한 필수 동의
  const [voiceAnalysisConsent, setVoiceAnalysisConsent] = useState(false); // API: voice_analysis_consent - F-03 음성 분석 사용 여부(선택 동의)

  const [uiLanguage, setUiLanguage] = useState('한국어');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileLangMenuOpen, setIsMobileLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);
  const mobileLangMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
      if (mobileLangMenuRef.current && !mobileLangMenuRef.current.contains(event.target)) {
        setIsMobileLangMenuOpen(false);
      }
      if (englishProficiencyRef.current && !englishProficiencyRef.current.contains(event.target)) {
        setIsEnglishProficiencyOpen(false);
      }
      if (communicationStyleRef.current && !communicationStyleRef.current.contains(event.target)) {
        setIsCommunicationStyleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeModal !== 'none') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  const openProfileModal = () => {
    // 편집을 마지막 저장 상태에서부터 다시 시작하도록 draft를 savedProfile로 동기화
    setFormData(savedProfile);
    setCountryQuery(getCountryName(savedProfile.country));
    setErrors({});
    setActiveModal('profile');
    setIsMobileMenuOpen(false);
  };

  const handleCloseModal = () => {
    if (activeModal === 'profile') {
      // 저장하지 않고 닫으면 편집 중이던 draft는 버리고 마지막 저장된 프로필로 되돌린다
      setFormData(savedProfile);
      setCountryQuery(getCountryName(savedProfile.country));
      setErrors({});
      setActiveModal('join');
    } else {
      // 모달을 완전히 닫을 때는 회의 참여/생성 관련 입력만 초기화한다 (저장된 프로필은 재사용을 위해 유지)
      setActiveModal('none');
      setMeetingTab('join');
      setMeetingCode('');
      setNewMeetingTitle('');
      setCreatedRoomCode('');
      setMaxParticipants(4);
      setProfileSharingConsent(false);
      setVoiceAnalysisConsent(false);
    }
  };

  const handleTabChange = (tab) => {
    setMeetingTab(tab);
    if (tab === 'create' && !createdRoomCode) {
      // 실제 연동 시에는 POST /meetings 응답의 share_url을 그대로 써야 함 - 지금은 meeting_path 형식(/meetings/{uuid})만 흉내낸 목업
      const mockMeetingId = crypto.randomUUID();
      setCreatedRoomCode(`${window.location.origin}/meetings/${mockMeetingId}`);
    }
  };

  // 국가 필드를 제외한 일반 텍스트/셀렉트 입력 공용 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  // 국가 검색창 입력 핸들러 - 화면 표시용 countryQuery만 바꾸고, 실제 제출값(코드)은 목록에서 선택해야 채워짐
  const handleCountryQueryChange = (e) => {
    setCountryQuery(e.target.value);
    setIsCountryOpen(true);
    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: false }));
    }
  };

  // 드롭다운에서 국가를 선택하면 코드(API 제출값)와 이름(화면 표시용)을 함께 반영
  const handleSelectCountry = (country) => {
    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: false }));
    }
    setFormData((prev) => ({ ...prev, country: country.code }));
    setCountryQuery(country.name);
    setIsCountryOpen(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const newErrors = {};
    let hasError = false;

    const fields = [
      'nickname',
      'country',
      'organization',
      'role',
      'languages',
      'englishProficiency',
      'communicationStyle',
    ];

    fields.forEach((field) => {
      if (!formData[field] || !formData[field].trim()) {
        newErrors[field] = true;
        hasError = true;
      }
    });

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    setSavedProfile(formData); // "저장하고 돌아가기"를 눌러야만 draft가 실제 저장 상태로 반영됨
    setErrors({});
    setActiveModal('join');
  };

  // 검색창(countryQuery)에 입력된 문자열로 국가명을 필터링
  const filteredCountries = COUNTRY_LIST.filter((c) =>
    c.name.toLowerCase().includes(countryQuery.toLowerCase())
  );

  return (
    <div className="container">
      {/* 부드러운 오오라 글로우 필드 */}
      <div className="bg-glow-main" />
      <div className="bg-glow-sub" />

      {/* 헤더 네비게이션 */}
      <header className="header">
        <div className="header-inner">
          <div className="logo-group">
            <div className="logo-icon">L</div>
            <span className="logo">(서비스 이름)</span>
            <span className="badge"> (쓰는 ai 모델이름)</span>
          </div>

          <nav className="header-right desktop-only">
            <span className="header-link">도움말</span>
            <div className="lang-selector" ref={langMenuRef}>
              <button
                type="button"
                className="header-start-btn"
                onClick={() => setIsLangMenuOpen((prev) => !prev)}
              >
                {uiLanguage === '한국어' ? 'KR' : 'US'} {uiLanguage}
              </button>

              {isLangMenuOpen && (
                <div className="lang-dropdown">
                  <div
                    className={`lang-option ${uiLanguage === '한국어' ? 'selected' : ''}`}
                    onClick={() => {
                      setUiLanguage('한국어');
                      setIsLangMenuOpen(false);
                    }}
                  >
                    KR 한국어
                  </div>
                  <div
                    className={`lang-option ${uiLanguage === 'English' ? 'selected' : ''}`}
                    onClick={() => {
                      setUiLanguage('English');
                      setIsLangMenuOpen(false);
                    }}
                  >
                    US English
                  </div>
                </div>
              )}
            </div>
          </nav>

          <button
            className="mobile-hamburger-btn mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-drawer overlay-fade">
            <div className="mobile-drawer-header">
              <div className="mobile-search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="검색 내용을 입력하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mobile-search-input"
                />
              </div>
              <button
                className="drawer-close-icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="mobile-menu-list">
              <div className="mobile-menu-item">도움말</div>
              <div
                className="mobile-menu-item lang-item"
                ref={mobileLangMenuRef}
                onClick={() => setIsMobileLangMenuOpen((prev) => !prev)}
              >
                {uiLanguage === '한국어' ? 'KR' : 'US'} {uiLanguage}

                {isMobileLangMenuOpen && (
                  <div className="mobile-lang-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div
                      className={`mobile-lang-option ${uiLanguage === '한국어' ? 'selected' : ''}`}
                      onClick={() => {
                        setUiLanguage('한국어');
                        setIsMobileLangMenuOpen(false);
                      }}
                    >
                      KR 한국어
                    </div>
                    <div
                      className={`mobile-lang-option ${uiLanguage === 'English' ? 'selected' : ''}`}
                      onClick={() => {
                        setUiLanguage('English');
                        setIsMobileLangMenuOpen(false);
                      }}
                    >
                      US English
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mobile-menu-actions">
              <button
                className="mobile-cta-btn primary"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setActiveModal('join');
                  setMeetingTab('join');
                }}
              >
                회의 시작하기
              </button>
              <button
                className="mobile-cta-btn secondary"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setActiveModal('join');
                  setMeetingTab('create');
                }}
              >
                + 새 회의 개설하기
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 메인 히어로 영역 */}
      <main className="main">
        <div className="hero-capsule">
          <span>전 세계 글로벌 팀을 위한 실시간 서포트 AI</span>
        </div>

        <h1 className="main-title">
          언어와 문화의 경계를 허무는<br />
          <span className="gradient-text">글로벌 AI 회의</span>의 새로운 기준
        </h1>

        <p className="sub-title">
          실시간 음성 정제, 문화적 커뮤니케이션 매너 가이드, 사전 프로필 싱크로<br />
          전 세계 팀원들과 마치 한 공간에 있는 것처럼 자연스럽고 오해 없이 소통하세요.
        </p>

        <div className="cta-group">
          <button
            className="primary-button"
            onClick={() => {
              setActiveModal('join');
              setMeetingTab('join');
            }}
          >
            지금 회의 입장하기
          </button>

          <button
            className="secondary-button"
            onClick={() => {
              setActiveModal('join');
              setMeetingTab('create');
            }}
          >
            + 새 회의 개설하기 +
          </button>
        </div>

        {/* 와이드 AI 모니터링 목업 카드 */}
        <div className="preview-mockup">
          <div className="mockup-header">
            <div className="mockup-dots">
              <span className="dot-red" />
              <span className="dot-yellow" />
              <span className="dot-green" />
            </div>
            <div className="mockup-title">AI Work PreView</div>
            <div className="live-badge">
              <span className="live-dot" />· LIVE REFINING ACTIVE
            </div>
          </div>

          <div className="mockup-body">
            <div className="mockup-col">
              <div className="col-label">🎙️ 실시간 발언 보정 (Real-time Speech Sync)</div>
              <div className="ai-translation-card">
                <span className="tag">방금 감지한 발언</span>
                <div className="speech-bubble-left">
                  <div className="speaker-tag">KR glidong hong (FrontEnd)</div>
                  <p>"That schedule is impossible."</p>
                </div>
                <div className="pre-speech-result-box">
                  <div className="ai-header">
                    <span>🤖 실시간 피드백</span>
                  </div>
                  <p className="ai-result">
                    상대의 계획을 단정적으로 거절하는 표현으로 받아들여질 수 있습니다.
                  </p>
                  <div className="culture-note">
                    💡 <strong>대안:</strong> Could we discuss an alternative schedule?
                  </div>
                </div>
              </div>
            </div>

            <div className="mockup-col border-left">
              <div className="col-label">✍️ 최적의 발언 추천 (Pre-Speech Assist)</div>

              {/* F-02 목업: 발언 전에 한국어로 적어두면 영어 표현으로 변환해주는 기능 - 아직 실제 구현은 아님 */}
              <div className="ai-translation-card">
                <div className="ai-header">
                  <span className="tag">🤖 발언 전 영어 변환</span>
                </div>

                <div className="pre-speech-input-box">
                  <span className="pre-speech-label">내가 할 말 (한국어)</span>
                  <p className="pre-speech-input-text">"이 부분은 마감 전에 한 번 더 확인해주시면 좋을 것 같아요."</p>
                </div>
                <div className="pre-speech-result-box">
                  <span className="pre-speech-label result">추천 영어 표현</span>
                  <p className="pre-speech-result-text">"It would be great if you could take one more look at this before the deadline."</p>
                  <div className="culture-note">
                    💡 <strong>추천 이유:</strong> 요청을 부드러운 제안 형태로 바꿔 상대가 부담 없이 받아들이도록 조정했습니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* 모달 팝업 오버레이 */}
      {activeModal !== 'none' && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <button
              className="modal-close-btn"
              onClick={handleCloseModal}
            >
              ✕
            </button>

            {activeModal === 'join' && (
              <div>
                <div className="tab-container">
                  <button
                    className={`tab-button ${meetingTab === 'join' ? 'active' : ''}`}
                    onClick={() => handleTabChange('join')}
                  >
                    회의에 참여하기
                  </button>
                  <button
                    className={`tab-button ${meetingTab === 'create' ? 'active' : ''}`}
                    onClick={() => handleTabChange('create')}
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
                        onChange={(e) => setMeetingCode(e.target.value)}
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
                        onChange={(e) => setNewMeetingTitle(e.target.value)}
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
                            onClick={() => setMaxParticipants(n)}
                          >
                            {n}명
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="label">생성된 공유 링크 (회의 코드)</label>
                      <div className="code-display-box">
                        <span className="code-text">{createdRoomCode}</span>
                        <button
                          className="copy-code-btn"
                          onClick={() => alert('공유 링크가 복사되었습니다!')}
                        >
                          링크 복사
                        </button>
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
                      ? COMMUNICATION_STYLE_OPTIONS.find((o) => o.value === savedProfile.communicationStyle)?.label
                      : '소통 방식 미지정'}
                  </div>

                  <button
                    className="edit-profile-button"
                    onClick={openProfileModal}
                  >
                    프로필 수정
                  </button>
                </div>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={profileSharingConsent}
                    onChange={(e) => setProfileSharingConsent(e.target.checked)}
                    className="checkbox"
                  />
                  프로필 공개에 동의합니다. (필수)
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={voiceAnalysisConsent}
                    onChange={(e) => setVoiceAnalysisConsent(e.target.checked)}
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
            )}

            {activeModal === 'profile' && (
              <div>
                <h2 className="card-title">회원가입 및 프로필</h2>

                <form
                  onSubmit={handleSaveProfile}
                  className="form"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="field-group">
                    <div className="label-wrapper">
                      <label className="label">이름 또는 닉네임</label>
                      {errors.nickname && <span className="error-text">입력해주세요</span>}
                    </div>
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      className={`input ${errors.nickname ? 'input-error' : ''}`}
                      placeholder="이름 또는 닉네임 입력"
                    />
                  </div>

                  <div className="field-group" ref={countryRef}>
                    <div className="label-wrapper">
                      <label className="label">국가</label>
                      {errors.country && <span className="error-text">입력해주세요</span>}
                    </div>
                    <div className="dropdown-wrapper">
                      <input
                        ref={countryInputRef}
                        type="text"
                        name="countryQuery"
                        value={countryQuery}
                        onChange={handleCountryQueryChange}
                        onFocus={() => setIsCountryOpen(true)}
                        className={`input ${errors.country ? 'input-error' : ''}`}
                        placeholder="국가 검색 (예: 대한민국, 미국)"
                        autoComplete="off"
                      />
                      <span className="dropdown-arrow">▼</span>

                      {isCountryOpen && (
                        <div className="country-dropdown-list">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((c) => (
                              <div
                                key={c.code}
                                className={`country-option ${formData.country === c.code ? 'selected' : ''}`}
                                onClick={() => handleSelectCountry(c)}
                              >
                                {c.name}
                              </div>
                            ))
                          ) : (
                            <div className="country-no-result">
                              목록에 있는 국가만 선택할 수 있어요 (API가 2자리 국가 코드만 허용)
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="field-group">
                    <div className="label-wrapper">
                      <label className="label">소속 조직</label>
                      {errors.organization && <span className="error-text">입력해주세요</span>}
                    </div>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className={`input ${errors.organization ? 'input-error' : ''}`}
                      placeholder="소속 조직 입력"
                    />
                  </div>

                  <div className="field-group">
                    <div className="label-wrapper">
                      <label className="label">직무 · 역할</label>
                      {errors.role && <span className="error-text">입력해주세요</span>}
                    </div>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`input ${errors.role ? 'input-error' : ''}`}
                      placeholder="직무 및 역할 입력"
                    />
                  </div>

                  <div className="field-group">
                    <div className="label-wrapper">
                      <label className="label">사용 가능 언어 (쉼표로 구분)</label>
                      {errors.languages && <span className="error-text">입력해주세요</span>}
                    </div>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      className={`input ${errors.languages ? 'input-error' : ''}`}
                      placeholder="예: 한국어, 영어"
                    />
                  </div>

                  <div className="field-group" ref={englishProficiencyRef}>
                    <div className="label-wrapper">
                      <label className="label">영어 숙련도</label>
                      {errors.englishProficiency && <span className="error-text">입력해주세요</span>}
                    </div>
                    <div className="dropdown-wrapper">
                      <div
                        className={`input select-display ${errors.englishProficiency ? 'input-error' : ''}`}
                        onClick={() => setIsEnglishProficiencyOpen((prev) => !prev)}
                      >
                        {formData.englishProficiency ? (
                          ENGLISH_PROFICIENCY_OPTIONS.find((opt) => opt.value === formData.englishProficiency)?.label
                        ) : (
                          <span className="select-placeholder">선택해주세요</span>
                        )}
                      </div>
                      <span className="dropdown-arrow">▼</span>

                      {isEnglishProficiencyOpen && (
                        <div className="country-dropdown-list">
                          {ENGLISH_PROFICIENCY_OPTIONS.map((opt) => (
                            <div
                              key={opt.value}
                              className={`country-option ${formData.englishProficiency === opt.value ? 'selected' : ''}`}
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, englishProficiency: opt.value }));
                                if (errors.englishProficiency) {
                                  setErrors((prev) => ({ ...prev, englishProficiency: false }));
                                }
                                setIsEnglishProficiencyOpen(false);
                              }}
                            >
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="field-group" ref={communicationStyleRef}>
                    <div className="label-wrapper">
                      <label className="label">선호 소통 방식</label>
                      {errors.communicationStyle && <span className="error-text">입력해주세요</span>}
                    </div>
                    <div className="dropdown-wrapper">
                      <div
                        className={`input select-display ${errors.communicationStyle ? 'input-error' : ''}`}
                        onClick={() => setIsCommunicationStyleOpen((prev) => !prev)}
                      >
                        {formData.communicationStyle ? (
                          COMMUNICATION_STYLE_OPTIONS.find((opt) => opt.value === formData.communicationStyle)?.label
                        ) : (
                          <span className="select-placeholder">선택해주세요</span>
                        )}
                      </div>
                      <span className="dropdown-arrow">▼</span>

                      {isCommunicationStyleOpen && (
                        <div className="country-dropdown-list">
                          {COMMUNICATION_STYLE_OPTIONS.map((opt) => (
                            <div
                              key={opt.value}
                              className={`country-option ${formData.communicationStyle === opt.value ? 'selected' : ''}`}
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, communicationStyle: opt.value }));
                                if (errors.communicationStyle) {
                                  setErrors((prev) => ({ ...prev, communicationStyle: false }));
                                }
                                setIsCommunicationStyleOpen(false);
                              }}
                            >
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="submit-button">
                    저장하고 돌아가기
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}