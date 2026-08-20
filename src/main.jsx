import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/mainPage.jsx'
import MeetingRoom from './pages/MeetingRoom.jsx'
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary.jsx'

// react-router 없이 경로만 보고 페이지를 고르는 최소 라우팅 - /meetings/로 시작하면 회의방, 아니면 랜딩 페이지
const isMeetingRoute = window.location.pathname.startsWith('/meetings/');
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      {isMeetingRoute ? <MeetingRoom /> : <App />}
    </ErrorBoundary>
  </StrictMode>,
)
