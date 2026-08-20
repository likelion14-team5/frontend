// ISO 3166-1 alpha-2 코드만 관리하고, 한글 이름은 Intl.DisplayNames로 생성한다
// (손으로 국가명을 적으면 오탈자 위험이 있음). 백엔드는 "대문자 2글자" 형식만 검증한다.
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

export const getCountryName = (code) => COUNTRY_LIST.find((c) => c.code === code)?.name || '';

export const ENGLISH_PROFICIENCY_OPTIONS = [
  { value: 'BEGINNER', label: '초급' },
  { value: 'INTERMEDIATE', label: '중급' },
  { value: 'ADVANCED', label: '고급' },
];

export const getEnglishProficiencyLabel = (value) =>
  ENGLISH_PROFICIENCY_OPTIONS.find((opt) => opt.value === value)?.label || value || '';

export const COMMUNICATION_STYLE_OPTIONS = [
  { value: 'DIRECT', label: '직설적' },
  { value: 'INDIRECT', label: '완곡한' },
  { value: 'FACT_FOCUSED', label: '사실 중심' },
  { value: 'EMOTION_EXPRESSIVE', label: '감정 표현적' },
  { value: 'BALANCED', label: '균형적' },
];

export const getCommunicationStyleLabel = (value) =>
  COMMUNICATION_STYLE_OPTIONS.find((opt) => opt.value === value)?.label || value || '';

export const EMPTY_PROFILE = {
  nickname: '',
  country: '',
  organization: '',
  role: '',
  languages: '',
  englishProficiency: '',
  communicationStyle: '',
};

export const mapBackendProfileToFrontend = (data) => {
  if (!data) return EMPTY_PROFILE;

  return {
    nickname: data.display_name || '',
    country: data.country_code || '',
    organization: data.organization || '',
    role: data.job_title || data.meeting_role || '',
    languages: Array.isArray(data.languages) ? data.languages.join(', ') : (data.languages || ''),
    englishProficiency: data.english_proficiency || '',
    communicationStyle: data.communication_style || '',
    timezone: data.timezone || '',
    additionalConsiderations: data.additional_considerations || '',
  };
};

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
    // 폼에서 입력받지 않고 브라우저 시간대를 그대로 자동 감지해서 보냄
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    additional_considerations: formData.additionalConsiderations?.trim() || '없음',
  };
};