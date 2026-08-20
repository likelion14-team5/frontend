import { useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import {
  COUNTRY_LIST,
  ENGLISH_PROFICIENCY_OPTIONS,
  COMMUNICATION_STYLE_OPTIONS,
  getCountryName,
} from '../../constants/profileOptions';

export default function ProfileForm({ initialProfile, onSave, saving = false }) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleCountryQueryChange = (e) => {
    setCountryQuery(e.target.value);
    setIsCountryOpen(true);
    if (errors.country) {
      setErrors((prev) => ({ ...prev, country: false }));
    }
  };

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

    // 필수 입력 항목 목록 (additionalConsiderations는 선택 항목이라 제외)
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

  const filteredCountries = COUNTRY_LIST.filter((c) =>
    c.name.toLowerCase().includes(countryQuery.toLowerCase())
  );

  return (
    <div>
      <h2 className="card-title">프로필 작성</h2>

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

        {/* 국가 선택 (z-index 30 적용) */}
        <div className="field-group relative z-30" ref={countryRef}>
          <div className="label-wrapper">
            <label className="label">국가</label>
            {errors.country && <span className="error-text">입력해주세요</span>}
          </div>
          <div className="dropdown-wrapper relative">
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
              <div className="country-dropdown-list absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => (
                    <div
                      key={c.code}
                      className={`country-option p-2.5 hover:bg-gray-100 cursor-pointer text-sm ${formData.country === c.code ? 'selected bg-purple-50 text-purple-700 font-semibold' : ''}`}
                      onClick={() => handleSelectCountry(c)}
                    >
                      {c.name}
                    </div>
                  ))
                ) : (
                  <div className="country-no-result p-3 text-xs text-gray-500 text-center">
                    목록에 있는 국가만 선택할 수 있어요
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

        {/* 영어 숙련도 (z-index 20 적용) */}
        <div className="field-group relative z-20" ref={englishProficiencyRef}>
          <div className="label-wrapper">
            <label className="label">영어 숙련도</label>
            {errors.englishProficiency && <span className="error-text">입력해주세요</span>}
          </div>
          <div className="dropdown-wrapper relative">
            <div
              className={`input select-display cursor-pointer ${errors.englishProficiency ? 'input-error' : ''}`}
              onClick={() => setIsEnglishProficiencyOpen((prev) => !prev)}
            >
              {formData.englishProficiency ? (
                ENGLISH_PROFICIENCY_OPTIONS.find(
                  (opt) => opt.value === formData.englishProficiency
                )?.label
              ) : (
                <span className="select-placeholder text-gray-400">선택해주세요</span>
              )}
            </div>
            <span className="dropdown-arrow">▼</span>

            {isEnglishProficiencyOpen && (
              <div className="country-dropdown-list absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {ENGLISH_PROFICIENCY_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    className={`country-option p-2.5 hover:bg-gray-100 cursor-pointer text-sm ${formData.englishProficiency === opt.value ? 'selected bg-purple-50 text-purple-700 font-semibold' : ''}`}
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

        {/* 선호 소통 방식 (z-index 10 적용 및 팝업 최상단 노출) */}
        <div className="field-group relative z-10" ref={communicationStyleRef}>
          <div className="label-wrapper">
            <label className="label">선호 소통 방식</label>
            {errors.communicationStyle && <span className="error-text">입력해주세요</span>}
          </div>
          <div className="dropdown-wrapper relative">
            <div
              className={`input select-display cursor-pointer ${errors.communicationStyle ? 'input-error' : ''}`}
              onClick={() => setIsCommunicationStyleOpen((prev) => !prev)}
            >
              {formData.communicationStyle ? (
                COMMUNICATION_STYLE_OPTIONS.find(
                  (opt) => opt.value === formData.communicationStyle
                )?.label
              ) : (
                <span className="select-placeholder text-gray-400">선택해주세요</span>
              )}
            </div>
            <span className="dropdown-arrow">▼</span>

            {isCommunicationStyleOpen && (
              <div className="country-dropdown-list absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-52 overflow-y-auto">
                {COMMUNICATION_STYLE_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    className={`country-option p-2.5 hover:bg-gray-100 cursor-pointer text-sm ${formData.communicationStyle === opt.value ? 'selected bg-purple-50 text-purple-700 font-semibold' : ''}`}
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

        {/*  상세 정보 / 특이사항 (선택 입력) */}
        <div className="field-group">
          <div className="label-wrapper">
            <label className="label">상세 정보 / 특이사항 (선택)</label>
          </div>
          <textarea
            name="additionalConsiderations"
            value={formData.additionalConsiderations || ''}
            onChange={handleChange}
            placeholder="예: 천천히 말씀해 주시면 이해하기 쉽습니다, 특정 용어 설명 필요 등"
            rows={3}
            className="input resize-none h-auto p-2.5 text-sm"
          />
        </div>

        <button type="submit" className="submit-button mt-4" disabled={saving}>
          {saving ? '저장 중...' : '저장하고 돌아가기'}
        </button>
      </form>
    </div>
  );
}
