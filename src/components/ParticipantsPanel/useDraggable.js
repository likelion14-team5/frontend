import { useState, useRef, useCallback, useEffect } from 'react';

// 브라우저 기본 드래그(draggable 속성)가 아니라 mousedown/mousemove로 직접 구현한 커스텀 드래그.
// 반환된 handleMouseDown을 드래그 손잡이(헤더 등)의 onMouseDown에 연결해서 쓴다.
export function useDraggable(initialPosition = { x: 0, y: 0 }) {
  const [position, setPosition] = useState(initialPosition);
  const dragState = useRef({ dragging: false, offsetX: 0, offsetY: 0 });

  const handleMouseDown = useCallback((e) => {
    dragState.current.dragging = true;
    dragState.current.offsetX = e.clientX - position.x;
    dragState.current.offsetY = e.clientY - position.y;
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragState.current.dragging) return;
      setPosition({
        x: e.clientX - dragState.current.offsetX,
        y: e.clientY - dragState.current.offsetY,
      });
    };
    const handleMouseUp = () => {
      dragState.current.dragging = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return { position, handleMouseDown };
}
