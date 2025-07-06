Feature('テトリスゲーム - 読みやすいBDD形式のE2Eテスト');

Before(({ I }) => {
  I.amOnPage('/');
});

Scenario('初回訪問者がテトリスゲームの画面を確認する', ({ I, tetrisGamePage }) => {
  tetrisGamePage.seeGameTitle();
  tetrisGamePage.seeInitialUI();
  tetrisGamePage.seeControlsInformation();
});

Scenario('プレイヤーがゲームを開始する', ({ I, tetrisGamePage }) => {
  tetrisGamePage.startGame();
  tetrisGamePage.seeGameStarted();
  tetrisGamePage.seeGameBoard();
  tetrisGamePage.seeNextPiecePreview();
});

Scenario('プレイヤーがゲームを一時停止して再開する', ({ I, tetrisGamePage }) => {
  Given('ゲームが開始されている', () => {
    tetrisGamePage.startGame();
  });
  
  When('プレイヤーがゲームを一時停止する', () => {
    tetrisGamePage.pauseGame();
  });
  
  Then('ゲームが一時停止状態になる', () => {
    tetrisGamePage.seeGamePaused();
  });
  
  When('プレイヤーがゲームを再開する', () => {
    tetrisGamePage.resumeGameByButton();
  });
  
  Then('ゲームが再開される', () => {
    tetrisGamePage.seeGameResumed();
  });
});

Scenario('プレイヤーがテトリスピースを操作する', ({ I, tetrisGamePage }) => {
  Given('ゲームが開始されている', () => {
    tetrisGamePage.startGame();
  });
  
  When('プレイヤーがピースを操作する', () => {
    tetrisGamePage.moveRightByArrowKey();
    tetrisGamePage.moveLeftByArrowKey();
    tetrisGamePage.rotatePiece();
    tetrisGamePage.softDrop();
    tetrisGamePage.hardDrop();
  });
  
  Then('ゲームが正常に継続される', () => {
    tetrisGamePage.seeGameContinuing();
  });
});

Scenario('プレイヤーがゲームボードの詳細を確認する', ({ I, tetrisGamePage }) => {
  Given('ゲームが開始されている', () => {
    tetrisGamePage.startGame();
  });
  
  Then('ゲームボードが正しく構築されている', () => {
    tetrisGamePage.seeGameBoard();
    tetrisGamePage.seeCorrectNumberOfCells();
  });
});