import { useEffect, useRef } from 'react';

interface KeyboardControls {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause: () => void;
}

export const useKeyboard = (controls: KeyboardControls) => {
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (keysPressed.current.has(event.code)) return;

      keysPressed.current.add(event.code);

      switch (event.code) {
        case 'ArrowLeft':
          event.preventDefault();
          controls.onMoveLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          controls.onMoveRight();
          break;
        case 'ArrowDown':
          event.preventDefault();
          controls.onMoveDown();
          break;
        case 'ArrowUp':
          event.preventDefault();
          controls.onRotate();
          break;
        case 'Space':
          event.preventDefault();
          controls.onHardDrop();
          break;
        case 'KeyP':
          event.preventDefault();
          controls.onPause();
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [controls]);
};
