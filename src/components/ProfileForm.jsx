import React, { useRef, useState } from 'react';
import { useClickOutside } from '../hooks/UseClickOutside';
import {
  COUNTRY_LIST,
  ENGLISH_PROFICIENCY_OPTIONS,
  COMMUNICATION_STYLE_OPTIONS,
  getCountryName,
} from '../constants/profileOptions';

// props:
//   initialProfile - 폼이 열릴 때 채워둘 값 (보통 App의 savedProfile)
//   onSave(profile) - 검증 통과 후 "저장하고 돌아가기" 클릭 시 호출
//
// 닫기(✕) 버튼은 이 컴포넌트가 아니라 부모인 MeetingModal 껍데기에 있다.
// 이 컴포넌트는 activeModal === 'profile'일 때만 App에서 마운트되므로,
// 열 때마다 initialProfile 기준으로 새로 시작한다. (원본의 "닫으면 draft 버리기"와 동일한 효과)
export default function ProfileForm({ initialProfile, onSave }) {
  const [formData, setFormData] = useState(initialProfile);
  const [countryQuery, setCountryQuery] = useState(getCountryName(initialProfile.country));
  const [errors, setErrors] = useState({});

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isEnglishProficiencyOpen, setIsEnglishProficiencyOpen] = useState(false);
  const [isCommunicationStyleOpen, setIsCommunicationStyleOpen] = useState(false);

  const countryRef = useRef(null);
  const englishProficiencyRef = useRef(null);
  const communicationStyleRef = useRef(null);

  useClickOutside(countryRef, () => setIsCountryOpen(false));
  useClickOutside(englishProficiencyRef, () => setIsEnglishProficiencyOpen(false));
  useClickOutside(communicationStyleRef, () => setIsCommunicationStyleOpen(false));

  // 국가 필드를 제외한 일반 텍스트 입력 공용 핸들러
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const fields = [
      'nickname',
      'country',
      'organization',
      'role',
      'languages',
      'englishProficiency',
      'communicationStyle',
    ];

    const newErrors = {};
    let hasError = false;

    fields.forEach((field) => {
      if (!formData[field] || !formData[field].trim()) {
        newErrors[field] = true;
        hasError = true;
      }
    });

    setErrors(newErrors);
    if (hasError) return;

    onSave(formData);
  };

  // 검색창(countryQuery)에 입력된 문자열로 국가명을 필터링
  const filteredCountries = COUNTRY_LIST.filter((c) =>
    c.name.toLowerCase().includes(countryQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="card-title">회원가입 및 프로필</h2>

      <form
        onSubmit={handleSubmit}
        className="form"
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault();
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
                ENGLISH_PROFICIENCY_OPTIONS.find(
                  (opt) => opt.value === formData.englishProficiency
                )?.label
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
                COMMUNICATION_STYLE_OPTIONS.find(
                  (opt) => opt.value === formData.communicationStyle
                )?.label
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
  );
}