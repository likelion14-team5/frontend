// 1. 국가 리스트 (API country_code: 2자리 ISO 대문자)
// 예전엔 19개국만 하드코딩되어 있어서 "글로벌 회의" 앱치고 선택 폭이 너무 좁았음.
// 국가명을 일일이 손으로 적으면 오탈자/누락 위험이 커서, ISO 3166-1 alpha-2 코드
// 목록(UN 회원국 + 대만/홍콩/마카오/팔레스타인/바티칸 등 주요 지역)만 관리하고
// 한글 이름은 브라우저 표준 API(Intl.DisplayNames)로 그때그때 정확하게 만들어 쓴다.
// 백엔드는 country_code를 "대문자 2글자"인지만 검증하므로(화이트리스트 없음) 안전하게 확장 가능.
const COUNTRY_CODES = [
  'AD', 'AE', 'AF', 'AG', 'AL', 'AM', 'AO', 'AR', 'AT', 'AU', 'AZ',
  'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BN', 'BO', 'BR', 'BS', 'BT', 'BW', 'BY', 'BZ',
  'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CY', 'CZ',
  'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ',
  'EC', 'EE', 'EG', 'ER', 'ES', 'ET',
  'FI', 'FJ', 'FM', 'FR',
  'GA', 'GB', 'GD', 'GE', 'GH', 'GM', 'GN', 'GQ', 'GR', 'GT', 'GW', 'GY',
  'HK', 'HN', 'HR', 'HT', 'HU',
  'ID', 'IE', 'IL', 'IN', 'IQ', 'IR', 'IS', 'IT',
  'JM', 'JO', 'JP',
  'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KZ',
  'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY',
  'MA', 'MC', 'MD', 'ME', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MR', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ',
  'NA', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NZ',
  'OM',
  'PA', 'PE', 'PG', 'PH', 'PK', 'PL', 'PS', 'PT', 'PW', 'PY',
  'QA',
  'RO', 'RS', 'RU', 'RW',
  'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SI', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SY', 'SZ',
  'TD', 'TG', 'TH', 'TJ', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ',
  'UA', 'UG', 'US', 'UY', 'UZ',
  'VA', 'VC', 'VE', 'VN', 'VU',
  'WS',
  'YE',
  'ZA', 'ZM', 'ZW',
];

let regionNames = null;
try {
  regionNames = new Intl.DisplayNames(['ko'], { type: 'region' });
} catch {
  regionNames = null;
}

export const COUNTRY_LIST = COUNTRY_CODES
  .map((code) => ({
    code,
    name: regionNames ? regionNames.of(code) || code : code,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'ko'));

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
    timezone: data.timezone || '',
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
    // 스펙(§5.1)의 timezone(IANA 이름, 선택 항목) - 폼에서 따로 입력받지 않고
    // "지금 이 사람이 접속한 시간대"를 브라우저에서 그대로 자동 감지해서 보낸다.
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    additional_considerations: formData.additionalConsiderations?.trim() || '없음',
  };
};