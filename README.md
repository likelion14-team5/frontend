# Global Meeting Frontend

## 프로젝트 소개

**원활한 글로벌 미팅을 돕는 AI 화상 회의 서비스의 프론트엔드 레포지토리입니다.**

사용자의 국가, 언어 숙련도, 소통 방식을 분석하여 회의 중 최적의 피드백과 번역을 지원합니다.


### 기술 스택

- **Framework/Library:** React (Vite)
- **Styling:** Tailwind CSS, CSS Modules
- **API Communication:** Fetch API
- **Video Conferencing:** Daily.co API

---

## 백엔드 연동 및 환경 설정

원활한 구동을 위해 백엔드 서버(FastAPI)와의 연동이 필수적입니다.

### 1. 사전 실행 조건

- 로컬 환경에 백엔드 서버가 실행 중이어야 합니다. (기본 포트: `8000`)
- 데이터베이스 마이그레이션(`alembic upgrade head`)이 완료되어 `meetings` 등 필수 테이블이 생성된 상태여야 방 생성 및 입장이 가능합니다.


### 2. 환경 변수 설정 (.env)

프로젝트 최상단 디렉토리에 `.env.local` (또는 `.env`) 파일을 생성하고 아래와 같이 백엔드 API Base URL을 설정해야 합니다.

```env
# .env.local
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 3. 개발 환경 (Local Proxy / CORS) 및 API 엔드포인트 규칙

- 프론트엔드 API 엔드포인트는 `API_ENDPOINTS` 상수로 중앙 관리됩니다.
- 로컬 개발 시 CORS 이슈를 방지하기 위해 Vite의 proxy 기능(`vite.config.js`)을 활용하거나, 백엔드 서버의 CORS 허용 목록(Origins)에 `http://localhost:5173`이 등록되어 있어야 합니다.

---

## 설치 및 실행 방법

### 의존성 패키지 설치
```Bash
npm install
# 또는
yarn install
```

### 로컬 개발 서버 실행
```Bash
npm run dev
# 또는
yarn dev
```

### 프로덕션 빌드
```Bash
npm run build
# 또는
yarn build
```

---

## 주요 기능별 API 흐름 및 매핑 구조


### 1. 회의 생성 및 참가 플로우

방 생성과 참가는 분리된 프로세스로 진행됩니다.

1. **방 생성 (`POST /api/v1/meetings`):** 호스트가 회의 제목과 최대 인원을 설정하여 새로운 방을 생성하고 고유 `meeting_id`(UUID)를 발급.
2. **방 참가 (`POST /api/v1/meetings/{meeting_id}/participants`):** 생성된 방 ID와 사용자 프로필 데이터를 전송하여 참가자 등록을 수행.
3. **세션 유지:** 참가 성공 시 응답받은 `participant_token`을 세션 스토리지에 저장하여 이후 회의실 내 권한 인증에 사용.


### 주요 프로필 데이터 매퍼 규격

프론트엔드 UI 상태와 백엔드 DB 스키마 간의 데이터 규격을 일치시키기 위해 `mapFrontendProfileToBackend` 함수를 거쳐 통신합니다.
- **국가 코드 (`country_code`):** 2자리 대문자 ISO 3166-1 alpha-2 규격 사용 (예: `KR`, `US`)
- **언어 숙련도 (`english_proficiency`):** Enum 타입 전송 (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`)
- **소통 방식 (`communication_style`):** Enum 타입 전송 (`DIRECT`, `INDIRECT`, `FACT_FOCUSED`, `EMOTION_EXPRESSIVE`, `BALANCED`)
- **사용 언어 (`languages`):** 문자열이 아닌 배열 형태로 변환하여 전송 (예: `["한국어", "영어"]`)
- **기타:** 빈 문자열 입력으로 인한 422 에러를 방지하기 위해, 입력란이 없는 추가 고려사항(`additional_considerations`) 필드는 기본 문자열을 삽입하여 전송합니다.

---

## 폴더 구조 

```
src/
 ├── components/    # 재사용 가능한 UI 컴포넌트
 ├── constants/     # API 엔드포인트, 프로필 매핑 옵션 등 상수 관리
 ├── hooks/         # 커스텀 훅 (useGoToMeeting 등 API 통신 및 상태 관리 로직)
 ├── pages/         # 라우팅되는 페이지 컴포넌트
 ├── styles/        # 전역 스타일 및 Tailwind 설정
 └── utils/         # 헬퍼 함수 및 데이터 매퍼 로직
```


---


## Troubleshooting

개발 및 API 연동 과정에서 발생할 수 있는 주요 에러와 해결 방법입니다.

### 1. 500 Internal Server Error: `relation "meetings" does not exist`

- **원인:** 백엔드 데이터베이스에 필수 테이블(예: `meetings`)이 생성되지 않은 상태에서 API를 호출했을 때 발생합니다.
- **해결 방법:** 백엔드 프로젝트 디렉토리에서 DB 마이그레이션 명령어를 실행하여 테이블을 초기화해야 합니다.
  ```bash
  alembic upgrade head
  ```


### 2. 404 Not Found: `MEETING_NOT_FOUND`

- **원인:** 백엔드 DB에 생성되지 않은 임시 UUID로 참가 API(`POST /participants`)를 호출할 때 발생합니다.
- **해결 방법:** '새 회의 만들기' 시에는 반드시 방 생성 API(`POST /api/v1/meetings`)를 먼저 호출하여 백엔드로부터 실제 `meeting_id`를 발급받은 후, 발급된 ID를 바탕으로 참가 API를 호출하도록 흐름을 수정해야 합니다.


### 3. 422 Unprocessable Entity

- **원인:** 프론트엔드에서 전송하는 Request Body의 데이터 규격(필드명, 타입 등)이 백엔드의 입력 검증 모델(Pydantic 스키마 등)과 일치하지 않을 때 발생합니다.
- **해결 방법:** 네트워크 탭의 응답 메시지(Validation Error)를 확인하여 누락된 필드나 잘못된 타입(예: `title`, `max_participants`, Enum 규격 등)을 백엔드 스키마와 동일하게 맞춰 전송해야 합니다.
