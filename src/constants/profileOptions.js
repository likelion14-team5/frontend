// API의 country_code는 2자리 ISO 대문자 코드(예: KR)만 허용하므로, 국가명과 코드를 함께 들고 있는다
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

// API: english_proficiency enum - select 옵션에 표시할 한글 라벨
export const ENGLISH_PROFICIENCY_OPTIONS = [
  { value: 'BEGINNER', label: '초급' },
  { value: 'INTERMEDIATE', label: '중급' },
  { value: 'ADVANCED', label: '고급' },
];

// API: communication_style enum - select 옵션에 표시할 한글 라벨
export const COMMUNICATION_STYLE_OPTIONS = [
  { value: 'DIRECT', label: '직설적' },
  { value: 'INDIRECT', label: '완곡한' },
  { value: 'FACT_FOCUSED', label: '사실 중심' },
  { value: 'EMOTION_EXPRESSIVE', label: '감정 표현적' },
  { value: 'BALANCED', label: '균형적' },
];

// 프로필 폼의 빈 상태 - 초기값과 "저장 없이 닫기" 시 되돌릴 기본값으로 재사용
export const EMPTY_PROFILE = {
  nickname: '',
  country: '',
  organization: '',
  role: '',
  languages: '',
  englishProficiency: '',
  communicationStyle: '',
};