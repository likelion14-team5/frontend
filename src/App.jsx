import React, { useState, useRef, useEffect } from 'react';

// 검색 및 선택이 가능한 국가 목록 데이터
const COUNTRY_LIST = [
  '대한민국',
  '미국',
  '일본',
  '중국',
  '영국',
  '독일',
  '프랑스',
  '캐나다',
  '호주',
  '베트남',
  '싱가포르',
  '인도네시아',
  '태국',
  '필리핀',
  '인도',
  '스페인',
  '이탈리아',
  '네덜란드',
  '스위스',
  '직접 입력'
];

export default function App() {
  // 모달 팝업 상태: 'none' (닫힘) | 'join' (회의 모달) | 'profile' (프로필 작성/수정 모달)
  const [activeModal, setActiveModal] = useState('none');

  // 회의 모달 내 탭 상태: 'join' (회의 참여) | 'create' (새 회의 만들기)
  const [meetingTab, setMeetingTab] = useState('join');

  // 회의 코드 및 새 회의 생성 데이터
  const [meetingCode, setMeetingCode] = useState('');
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState('');

  // 사용자 프로필 데이터 (기본 빈 값)
  const [formData, setFormData] = useState({
    nickname: '',
    country: '',
    organization: '',
    role: '',
    language: '',
    communicationStyle: '',
  });

  // 유효성 검사 에러 상태
  const [errors, setErrors] = useState({});

  // 국가 드롭다운 오픈 및 검색 목록 관리 상태
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countryRef = useRef(null);
  const countryInputRef = useRef(null);

  // 약관 동의 체크박스 상태 (기본값: false)
  const [agreed, setAgreed] = useState(false);

  // 드롭다운 바깥 영역 클릭 시 국가 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 프로필 모달 열기 함수 (에러 상태 초기화 포함)
  const openProfileModal = () => {
    setErrors({});
    setActiveModal('profile');
  };

  // 모달 닫기 / 이전 모달 이동 처리 함수
  const handleCloseModal = () => {
    if (activeModal === 'profile') {
      setErrors({});
      setActiveModal('join'); // 프로필 모달에서 ✕ 클릭 시 이전 회의 모달로 복귀
    } else {
      setActiveModal('none');
    }
  };

  // 새 회의 만들기 탭으로 이동할 때 랜덤 회의 코드 생성
  const handleTabChange = (tab) => {
    setMeetingTab(tab);
    if (tab === 'create' && !createdRoomCode) {
      const randomCode = 'samepage-' + Math.floor(1000 + Math.random() * 9000);
      setCreatedRoomCode(randomCode);
    }
  };

  // 폼 입력 값 처리 (타핑 시 해당 필드의 에러 표시 해제)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }

    // 국가 입력창 타핑 시 드롭다운 자동 열기
    if (name === 'country') {
      setIsCountryOpen(true);
    }
  };

  // 국가 항목 선택 시 처리
  const handleSelectCountry = (country) => {
    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: false }));
    }

    if (country === '직접 입력') {
      setFormData((prev) => ({ ...prev, country: '' }));
      setIsCountryOpen(false);
      setTimeout(() => {
        if (countryInputRef.current) {
          countryInputRef.current.focus();
        }
      }, 50);
    } else {
      setFormData((prev) => ({ ...prev, country }));
      setIsCountryOpen(false);
    }
  };

  // 프로필 저장 및 검증 함수
  const handleSaveProfile = (e) => {
    e.preventDefault();

    const newErrors = {};
    let hasError = false;

    const fields = [
      'nickname',
      'country',
      'organization',
      'role',
      'language',
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

    setErrors({});
    setActiveModal('join');
  };

  // 필터링된 국가 목록
  const filteredCountries = COUNTRY_LIST.filter((c) =>
    c.toLowerCase().includes((formData.country || '').toLowerCase())
  );

  return (
    <div className="container">
      {/* CSS 내장 스타일 주입 */}
      <style>{cssStyles}</style>

      {/* 헤더 네비게이션 */}
      <header className="header">
        <div className="logo">SamePage</div>
        <div className="header-right">
          <span className="header-link">회의</span>
          <span className="header-link">도움말</span>
          <div className="avatar">나</div>
        </div>
      </header>

      {/* 메인 랜딩 영역 */}
      <main className="main">
        <h1 className="main-title">
          첫 글로벌 회의를<br />
          더 편안하게 시작하세요
        </h1>
        <p className="sub-title">
          프로필은 회의마다 다시 입력하지 않습니다.<br />
          가입 시 설정한 정보가 참여자에게 필요한 만큼만 공개됩니다.
        </p>

        <button
          className="primary-button"
          onClick={() => {
            setActiveModal('join');
            setMeetingTab('join');
          }}
        >
          회의 시작하기 →
        </button>
      </main>

      {/* 모달 팝업 오버레이 (바깥 클릭 시 안 닫힘) */}
      {activeModal !== 'none' && (
        <div className="modal-backdrop">
          <div className="modal-card">
            {/* 우측 상단 ✕ 닫기/뒤로가기 버튼 */}
            <button
              className="modal-close-btn"
              onClick={handleCloseModal}
            >
              ✕
            </button>

            {/* 1. 회의 관련 모달 (참여하기 / 새 회의 만들기) */}
            {activeModal === 'join' && (
              <div>
                {/* 회의 참여 / 새 회의 만들기 탭버튼 */}
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

                {/* 1-A. 회의 참여하기 탭 */}
                {meetingTab === 'join' && (
                  <div>
                    <p className="card-subtitle">저장된 프로필로 바로 입장합니다.</p>

                    <div className="form-group">
                      <label className="label">회의 코드 또는 링크</label>
                      <input
                        type="text"
                        value={meetingCode}
                        onChange={(e) => setMeetingCode(e.target.value)}
                        placeholder="회의 코드 또는 링크를 입력해주세요"
                        className="input"
                      />
                    </div>
                  </div>
                )}

                {/* 1-B. 새 회의 만들기 탭 */}
                {meetingTab === 'create' && (
                  <div>
                    <p className="card-subtitle">새로운 회의를 개설하고 전용 코드를 생성합니다.</p>

                    <div className="form-group">
                      <label className="label">회의 주제 / 제목 (선택)</label>
                      <input
                        type="text"
                        value={newMeetingTitle}
                        onChange={(e) => setNewMeetingTitle(e.target.value)}
                        placeholder="예: 글로벌 마케팅 주간 회의"
                        className="input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="label">자동 생성된 회의 코드</label>
                      <div className="code-display-box">
                        <span className="code-text">{createdRoomCode}</span>
                        <button
                          className="copy-code-btn"
                          onClick={() => alert('회의 코드가 복사되었습니다!')}
                        >
                          코드 복사
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 사용할 프로필 요약 박스 (공통) */}
                <div className="profile-summary-box">
                  <div className="summary-label">사용할 프로필</div>
                  <div className="summary-name">
                    {formData.nickname || '유다경'} · {formData.role || 'Project Manager'}
                  </div>
                  <div className="summary-details">
                    {formData.country || '대한민국'} · {formData.language || '한국어 / 영어 중급'}
                  </div>
                  <div className="summary-details">
                    {formData.communicationStyle || '균형적인 표현 선호'}
                  </div>

                  <button
                    className="edit-profile-button"
                    onClick={openProfileModal}
                  >
                    프로필 수정
                  </button>
                </div>

                {/* 동의 체크박스 */}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="checkbox"
                  />
                  프로필 공개 및 내 음성 분석에 동의합니다.
                </label>

                {/* 입장 및 생성 버튼 */}
                {meetingTab === 'join' ? (
                  <button 
                    className="submit-button"
                    disabled={!agreed || !meetingCode.trim()}
                  >
                    회의 입장
                  </button>
                ) : (
                  <button 
                    className="submit-button"
                    disabled={!agreed}
                  >
                    회의 생성 및 입장
                  </button>
                )}
              </div>
            )}

            {/* 2. 회원가입 및 프로필 작성/수정 모달 */}
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
                  {/* 이름 또는 닉네임 */}
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

                  {/* 검색 가능한 국가 선택 드롭다운 영역 */}
                  <div className="field-group" ref={countryRef}>
                    <div className="label-wrapper">
                      <label className="label">국가</label>
                      {errors.country && <span className="error-text">입력해주세요</span>}
                    </div>
                    <div className="dropdown-wrapper">
                      <input
                        ref={countryInputRef}
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        onFocus={() => setIsCountryOpen(true)}
                        className={`input ${errors.country ? 'input-error' : ''}`}
                        placeholder="국가 검색 또는 선택 (직접 입력 가능)"
                        autoComplete="off"
                      />
                      <span className="dropdown-arrow">▼</span>

                      {isCountryOpen && (
                        <div className="country-dropdown-list">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((c) => (
                              <div
                                key={c}
                                className={`country-option ${formData.country === c ? 'selected' : ''}`}
                                onClick={() => handleSelectCountry(c)}
                              >
                                {c}
                              </div>
                            ))
                          ) : (
                            <div className="country-no-result">
                              검색 결과가 없습니다. (직접 입력 가능)
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 소속 조직 */}
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

                  {/* 직무 · 역할 */}
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

                  {/* 주 사용 언어 */}
                  <div className="field-group">
                    <div className="label-wrapper">
                      <label className="label">주 사용 언어 / 영어 숙련도</label>
                      {errors.language && <span className="error-text">입력해주세요</span>}
                    </div>
                    <input
                      type="text"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className={`input ${errors.language ? 'input-error' : ''}`}
                      placeholder="주 사용 언어 입력"
                    />
                  </div>

                  {/* 선호 소통 방식 */}
                  <div className="field-group">
                    <div className="label-wrapper">
                      <label className="label">선호 소통 방식</label>
                      {errors.communicationStyle && <span className="error-text">입력해주세요</span>}
                    </div>
                    <input
                      type="text"
                      name="communicationStyle"
                      value={formData.communicationStyle}
                      onChange={handleChange}
                      className={`input ${errors.communicationStyle ? 'input-error' : ''}`}
                      placeholder="선호 소통 방식 입력"
                    />
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

const cssStyles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.container {
  width: 100vw;
  min-height: 100vh;
  background-color: #ffffff;
  color: #111827;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header {
  width: 100%;
  height: 64px;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-link {
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}

.main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.main-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.25;
  color: #111827;
  margin-bottom: 24px;
}

.sub-title {
  font-size: 16px;
  line-height: 1.6;
  color: #6b7280;
  margin-bottom: 40px;
}

.primary-button {
  padding: 16px 36px;
  background-color: #1f2937;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.primary-button:hover {
  background-color: #111827;
  transform: translateY(-2px);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-card {
  width: 100%;
  max-width: 480px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 28px 32px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  max-height: 88vh;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.modal-card::-webkit-scrollbar {
  display: none;
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}

.modal-close-btn:hover {
  color: #111827;
}

/* 탭 스타일 */
.tab-container {
  display: flex;
  gap: 12px;
  border-bottom: 2px solid #f3f4f6;
  margin-bottom: 12px;
  margin-top: 4px;
}

.tab-button {
  background: none;
  border: none;
  padding: 8px 4px;
  font-size: 18px;
  font-weight: 800;
  color: #9ca3af;
  cursor: pointer;
  position: relative;
  transition: color 0.15s ease;
}

.tab-button.active {
  color: #111827;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #111827;
}

/* 코드 생성 표시 박스 */
.code-display-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 12px;
}

.code-text {
  font-family: monospace;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.copy-code-btn {
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.card-title {
  font-size: 22px;
  font-weight: 800;
  color: #111827;
  margin-top: 0;
  margin-bottom: 6px;
}

.card-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
  margin-top: 0;
}

.form-group {
  margin-bottom: 16px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

.label-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 4px;
  display: block;
}

.error-text {
  font-size: 11px;
  font-weight: 700;
  color: #ef4444;
}

.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 13px;
  color: #1f2937;
  outline: none;
  transition: border-color 0.15s ease;
}

.input:focus {
  border-color: #1f2937;
}

.input.input-error {
  border-color: #ef4444 !important;
  background-color: #fef2f2;
}

.dropdown-wrapper {
  position: relative;
  width: 100%;
}

.dropdown-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #9ca3af;
  pointer-events: none;
}

.country-dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 160px;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  margin-top: 4px;
  z-index: 50;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.country-option {
  padding: 8px 12px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.country-option:hover {
  background-color: #f3f4f6;
  font-weight: 700;
}

.country-option.selected {
  background-color: #f3f4f6;
  font-weight: 800;
  color: #111827;
}

.country-no-result {
  padding: 10px 12px;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
}

.profile-summary-box {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 18px;
}

.summary-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 4px;
}

.summary-name {
  font-size: 15px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 4px;
}

.summary-details {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 2px;
}

.edit-profile-button {
  margin-top: 10px;
  padding: 7px 14px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  margin-bottom: 20px;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.submit-button {
  width: 100%;
  padding: 13px;
  background-color: #1f2937;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:disabled {
  background-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}
`;