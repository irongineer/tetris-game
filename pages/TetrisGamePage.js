const { I } = inject();

module.exports = {
  // locators
  elements: {
    gameTitle: 'h1',
    startButton: { css: 'button', text: 'Start Game' },
    pauseButton: { css: 'button', text: 'Pause' },
    resumeButton: { css: 'button', text: 'Resume' },
    scoreDisplay: 'h2',
    gameBoard: { css: 'div[class*="border"]' },
    gameCell: { css: 'div[class*="w-8 h-8"]' },
    nextPieceSection: { text: 'Next:' },
    pausedMessage: { text: 'Paused' },
    controlsSection: { text: 'Controls:' },
  },

  // actions
  startGame() {
    I.say('ゲームを開始します');
    I.click(this.elements.startButton);
    I.waitForText('Pause', 5);
  },

  pauseGame() {
    I.say('ゲームを一時停止します');
    I.pressKey('p');
    I.waitForText('Resume', 5);
  },

  resumeGameByButton() {
    I.say('ボタンでゲームを再開します');
    I.click(this.elements.resumeButton);
    I.waitForText('Pause', 5);
  },

  moveRightByArrowKey() {
    I.say('ピースを右に移動します');
    I.pressKey('ArrowRight');
  },

  moveLeftByArrowKey() {
    I.say('ピースを左に移動します');
    I.pressKey('ArrowLeft');
  },

  rotatePiece() {
    I.say('ピースを回転させます');
    I.pressKey('ArrowUp');
  },

  softDrop() {
    I.say('ピースをソフトドロップします');
    I.pressKey('ArrowDown');
  },

  hardDrop() {
    I.say('ピースをハードドロップします');
    I.pressKey('Space');
  },

  // verifications
  seeGameTitle() {
    I.say('ゲームタイトルを確認します');
    I.see('Tetris', this.elements.gameTitle);
  },

  seeInitialUI() {
    I.say('初期画面のUI要素を確認します');
    I.seeElement(this.elements.startButton);
    I.see('Score: 0');
    I.see('Lines: 0');
    I.see('Level: 0');
  },

  seeControlsInformation() {
    I.say('操作説明を確認します');
    I.see('Controls:');
    I.see('← → Move');
    I.see('↓ Soft Drop');
    I.see('Space Hard Drop');
    I.see('↑ Rotate');
    I.see('P Pause');
  },

  seeGameStarted() {
    I.say('ゲーム開始状態を確認します');
    I.seeElement(this.elements.pauseButton);
    I.seeElement(this.elements.nextPieceSection);
  },

  seeGamePaused() {
    I.say('ゲーム一時停止状態を確認します');
    I.seeElement(this.elements.resumeButton);
    I.seeElement(this.elements.pausedMessage);
  },

  seeGameResumed() {
    I.say('ゲーム再開状態を確認します');
    I.seeElement(this.elements.pauseButton);
    I.dontSee('Paused');
  },

  seeGameBoard() {
    I.say('ゲームボードを確認します');
    I.seeElement(this.elements.gameBoard);
  },

  seeCorrectNumberOfCells() {
    I.say('正しい数のセル（200個）を確認します');
    I.seeNumberOfElements(this.elements.gameCell, 200);
  },

  seeNextPiecePreview() {
    I.say('次のピースプレビューを確認します');
    I.seeElement(this.elements.nextPieceSection);
  },

  seeGameContinuing() {
    I.say('ゲームが継続していることを確認します');
    I.seeElement(this.elements.pauseButton);
  },
};
