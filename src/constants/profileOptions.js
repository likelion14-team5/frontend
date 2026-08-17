// 1. 국가 리스트 (API country_code: 2자리 ISO 대문자)
export const COUNTRY_LIST = [
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
export const getCountryName = (code) => COUNTRY_LIST.find((c) => c.code === code)?.name || '';

// // 2. 영어 숙련도 옵션: english_proficiency enum - select 옵션에 표시할 한글 라벨
export const ENGLISH_PROFICIENCY_OPTIONS = [
  { value: 'BEGINNER', label: '초급' },
  { value: 'INTERMEDIATE', label: '중급' },
  { value: 'ADVANCED', label: '고급' },
];

// 영어 숙련도 코드를 한글 라벨로 변환하는 헬퍼
export const getEnglishProficiencyLabel = (value) => 
  ENGLISH_PROFICIENCY_OPTIONS.find((opt) => opt.value === value)?.label || value || '';


// 3. 소통 방식 옵션: communication_style enum - select 옵션에 표시할 한글 라벨
export const COMMUNICATION_STYLE_OPTIONS = [
  { value: 'DIRECT', label: '직설적' },
  { value: 'INDIRECT', label: '완곡한' },
  { value: 'FACT_FOCUSED', label: '사실 중심' },
  { value: 'EMOTION_EXPRESSIVE', label: '감정 표현적' },
  { value: 'BALANCED', label: '균형적' },
];

// 소통 방식 코드를 한글 라벨로 변환하는 헬퍼
export const getCommunicationStyleLabel = (value) => 
  COMMUNICATION_STYLE_OPTIONS.find((opt) => opt.value === value)?.label || value || '';

// 4. 프로필 폼의 빈 상태 기본값 - 초기값과 "저장 없이 닫기" 시 되돌릴 기본값으로 재사용
export const EMPTY_PROFILE = {
  nickname: '',
  country: '',
  organization: '',
  role: '',
  languages: '',
  englishProficiency: '',
  communicationStyle: '',
  
};


// 5. 백엔드 데이터 <-> 프론트엔드 데이터 매퍼 (Mapper) 함수들
/**
 * 백엔드 API 응답 객체를 프론트엔드 폼/컴포넌트용 객체로 변환
 * (GET /meetings/{id}/participants/{participant_id} 응답 대응)
 */
export const mapBackendProfileToFrontend = (data) => {
  if (!data) return EMPTY_PROFILE;

  return {
    nickname: data.display_name || '',
    country: data.country_code || '',
    organization: data.organization || '',
    role: data.job_title || data.meeting_role || '',
    // languages가 배열일 수도 있고 문자열일 수도 있는 경우 안전하게 처리
    languages: Array.isArray(data.languages) ? data.languages.join(', ') : (data.languages || ''),
    englishProficiency: data.english_proficiency || '',
    communicationStyle: data.communication_style || '',
    additionalConsiderations: data.additional_considerations || '',
  };
};

/**
 * 프론트엔드 폼 데이터를 백엔드 저장/수정용 객체로 변환
 * (PATCH /participants/me/profile 요청 대응)
 */
export const mapFrontendProfileToBackend = (formData) => {
  return {
    display_name: formData.nickname || '미지정',
    country_code: formData.country || '미지정',
    organization: formData.organization || '미지정',
    job_title: formData.role || '미지정',

    // languages를 배열 형태로 변환
    languages: typeof formData.languages === 'string' 
      ? formData.languages.split(',').map((l) => l.trim()).filter(Boolean) 
      : (formData.languages || []),
      
    english_proficiency: formData.englishProficiency || '미지정',
    communication_style: formData.communicationStyle || '미지정',
    additional_considerations: formData.additionalConsiderations?.trim() || '없음',


  };
};