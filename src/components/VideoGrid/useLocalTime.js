import { useEffect, useState } from "react";

// 참가자 카드에 "현지 시각"을 보여주기 위한 훅 (스펙 4.4).
// timezone(IANA 이름)이 없으면 null을 반환해서 호출부가 그냥 안 보여주면 됨.
export function useLocalTime(timezone) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!timezone) return undefined;
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, [timezone]);

  if (!timezone) return null;

  try {
    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);
  } catch {
    // 유효하지 않은 timezone 문자열이 넘어온 경우 - 표시만 안 하고 넘어간다.
    return null;
  }
}
