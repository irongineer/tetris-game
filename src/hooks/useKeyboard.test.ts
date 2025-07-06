import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboard } from './useKeyboard';

describe('useKeyboard フック', () => {
  let mockControls: {
    onMoveLeft: ReturnType<typeof vi.fn>;
    onMoveRight: ReturnType<typeof vi.fn>;
    onMoveDown: ReturnType<typeof vi.fn>;
    onRotate: ReturnType<typeof vi.fn>;
    onHardDrop: ReturnType<typeof vi.fn>;
    onPause: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockControls = {
      onMoveLeft: vi.fn(),
      onMoveRight: vi.fn(),
      onMoveDown: vi.fn(),
      onRotate: vi.fn(),
      onHardDrop: vi.fn(),
      onPause: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('左矢印キーでonMoveLeftが呼ばれる', () => {
    renderHook(() => useKeyboard(mockControls));

    const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    window.dispatchEvent(event);

    expect(mockControls.onMoveLeft).toHaveBeenCalledTimes(1);
    expect(mockControls.onMoveRight).not.toHaveBeenCalled();
  });

  it('右矢印キーでonMoveRightが呼ばれる', () => {
    renderHook(() => useKeyboard(mockControls));

    const event = new KeyboardEvent('keydown', { code: 'ArrowRight' });
    window.dispatchEvent(event);

    expect(mockControls.onMoveRight).toHaveBeenCalledTimes(1);
    expect(mockControls.onMoveLeft).not.toHaveBeenCalled();
  });

  it('下矢印キーでonMoveDownが呼ばれる', () => {
    renderHook(() => useKeyboard(mockControls));

    const event = new KeyboardEvent('keydown', { code: 'ArrowDown' });
    window.dispatchEvent(event);

    expect(mockControls.onMoveDown).toHaveBeenCalledTimes(1);
  });

  it('上矢印キーでonRotateが呼ばれる', () => {
    renderHook(() => useKeyboard(mockControls));

    const event = new KeyboardEvent('keydown', { code: 'ArrowUp' });
    window.dispatchEvent(event);

    expect(mockControls.onRotate).toHaveBeenCalledTimes(1);
  });

  it('スペースキーでonHardDropが呼ばれる', () => {
    renderHook(() => useKeyboard(mockControls));

    const event = new KeyboardEvent('keydown', { code: 'Space' });
    window.dispatchEvent(event);

    expect(mockControls.onHardDrop).toHaveBeenCalledTimes(1);
  });

  it('PキーでonPauseが呼ばれる', () => {
    renderHook(() => useKeyboard(mockControls));

    const event = new KeyboardEvent('keydown', { code: 'KeyP' });
    window.dispatchEvent(event);

    expect(mockControls.onPause).toHaveBeenCalledTimes(1);
  });

  it('同じキーを長押ししても一度しか呼ばれない', () => {
    renderHook(() => useKeyboard(mockControls));

    // 連続でkeydownイベントを発生させる（長押しをシミュレート）
    const event1 = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    const event2 = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    const event3 = new KeyboardEvent('keydown', { code: 'ArrowLeft' });

    window.dispatchEvent(event1);
    window.dispatchEvent(event2);
    window.dispatchEvent(event3);

    // 最初の1回のみ呼ばれることを確認
    expect(mockControls.onMoveLeft).toHaveBeenCalledTimes(1);
  });

  it('キーを離してから再度押すと再び呼ばれる', () => {
    renderHook(() => useKeyboard(mockControls));

    // keydown -> keyup -> keydown の順序
    const keydownEvent1 = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    const keyupEvent = new KeyboardEvent('keyup', { code: 'ArrowLeft' });
    const keydownEvent2 = new KeyboardEvent('keydown', { code: 'ArrowLeft' });

    window.dispatchEvent(keydownEvent1);
    window.dispatchEvent(keyupEvent);
    window.dispatchEvent(keydownEvent2);

    // 2回呼ばれることを確認
    expect(mockControls.onMoveLeft).toHaveBeenCalledTimes(2);
  });

  it('複数のキーを同時に押すことができる', () => {
    renderHook(() => useKeyboard(mockControls));

    const leftEvent = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    const downEvent = new KeyboardEvent('keydown', { code: 'ArrowDown' });

    window.dispatchEvent(leftEvent);
    window.dispatchEvent(downEvent);

    expect(mockControls.onMoveLeft).toHaveBeenCalledTimes(1);
    expect(mockControls.onMoveDown).toHaveBeenCalledTimes(1);
  });

  it('対応していないキーは無視される', () => {
    renderHook(() => useKeyboard(mockControls));

    const event = new KeyboardEvent('keydown', { code: 'KeyA' });
    window.dispatchEvent(event);

    // どのコントロールも呼ばれない
    expect(mockControls.onMoveLeft).not.toHaveBeenCalled();
    expect(mockControls.onMoveRight).not.toHaveBeenCalled();
    expect(mockControls.onMoveDown).not.toHaveBeenCalled();
    expect(mockControls.onRotate).not.toHaveBeenCalled();
    expect(mockControls.onHardDrop).not.toHaveBeenCalled();
    expect(mockControls.onPause).not.toHaveBeenCalled();
  });

  it('コンポーネントがアンマウントされるとイベントリスナーが削除される', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useKeyboard(mockControls));

    // イベントリスナーが追加されることを確認
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keyup',
      expect.any(Function)
    );

    unmount();

    // イベントリスナーが削除されることを確認
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keyup',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('controlsが変更されても適切に動作する', () => {
    const initialControls = { ...mockControls };
    const newControls = {
      onMoveLeft: vi.fn(),
      onMoveRight: vi.fn(),
      onMoveDown: vi.fn(),
      onRotate: vi.fn(),
      onHardDrop: vi.fn(),
      onPause: vi.fn(),
    };

    const { rerender } = renderHook(props => useKeyboard(props.controls), {
      initialProps: { controls: initialControls },
    });

    // 初期のcontrolsでキーイベントをテスト
    const event1 = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    window.dispatchEvent(event1);
    expect(initialControls.onMoveLeft).toHaveBeenCalledTimes(1);

    // controlsを変更
    rerender({ controls: newControls });

    // 新しいcontrolsでキーイベントをテスト
    const keyupEvent = new KeyboardEvent('keyup', { code: 'ArrowLeft' });
    window.dispatchEvent(keyupEvent);
    const event2 = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    window.dispatchEvent(event2);

    expect(newControls.onMoveLeft).toHaveBeenCalledTimes(1);
    expect(initialControls.onMoveLeft).toHaveBeenCalledTimes(1); // 変わらず
  });
});
