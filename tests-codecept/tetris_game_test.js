Feature('テトリスゲーム - BDD形式のE2Eテスト');

Before(({ I }) => {
  I.amOnPage('/');
});

Scenario('プレイヤーがテトリスゲームのメイン画面を開く', ({ I }) => {
  I.say('ゲームページにアクセスしました');
  
  I.say('ゲームタイトルが表示されていることを確認します');
  I.see('Tetris', 'h1');
  
  I.say('スタートボタンが表示されていることを確認します');
  I.seeElement({css: 'button'}, 'Start Game');
  
  I.say('初期スコア情報が表示されていることを確認します');
  I.see('Score: 0');
  I.see('Lines: 0');
  I.see('Level: 0');
  
  I.say('操作説明が表示されていることを確認します');
  I.see('Controls:');
  I.see('← → Move');
  I.see('↓ Soft Drop');
  I.see('Space Hard Drop');
  I.see('↑ Rotate');
  I.see('P Pause');
});

Scenario('プレイヤーが「スタートゲーム」ボタンをクリックしてゲームを開始する', ({ I }) => {
  I.say('スタートボタンをクリックしてゲームを開始します');
  I.click('Start Game');
  
  I.say('ゲーム開始後、一時停止ボタンが表示されることを確認します');
  I.see('Pause');
  
  I.say('次のピースプレビューが表示されることを確認します');
  I.see('Next:');
  
  I.say('ゲームボードが表示されることを確認します');
  I.seeElement({css: 'div[class*="border"]'});
});

Scenario('プレイヤーがゲームを一時停止して再開する', ({ I }) => {
  Given('ゲームが開始されている', ({ I }) => {
    I.click('Start Game');
    I.see('Pause');
  });
  
  When('プレイヤーがPキーを押す', ({ I }) => {
    I.say('Pキーを押してゲームを一時停止します');
    I.pressKey('p');
  });
  
  Then('ゲームが一時停止状態になる', ({ I }) => {
    I.say('再開ボタンが表示されることを確認します');
    I.see('Resume');
    I.say('一時停止メッセージが表示されることを確認します');
    I.see('Paused');
  });
  
  When('プレイヤーが再開ボタンをクリックする', ({ I }) => {
    I.say('再開ボタンをクリックしてゲームを再開します');
    I.click('Resume');
  });
  
  Then('ゲームが再開される', ({ I }) => {
    I.say('一時停止ボタンが再び表示されることを確認します');
    I.see('Pause');
    I.say('一時停止メッセージが消えることを確認します');
    I.dontSee('Paused');
  });
});

Scenario('プレイヤーがキーボードでテトリスピースを操作する', ({ I }) => {
  Given('ゲームが開始されている', ({ I }) => {
    I.click('Start Game');
  });
  
  When('プレイヤーが各種キーを押す', ({ I }) => {
    I.say('右矢印キーでピースを右に移動します');
    I.pressKey('ArrowRight');
    
    I.say('左矢印キーでピースを左に移動します');
    I.pressKey('ArrowLeft');
    
    I.say('上矢印キーでピースを回転させます');
    I.pressKey('ArrowUp');
    
    I.say('下矢印キーでピースを下に移動します');
    I.pressKey('ArrowDown');
    
    I.say('スペースキーでハードドロップします');
    I.pressKey('Space');
  });
  
  Then('ゲームが正常に継続される', ({ I }) => {
    I.say('ゲームが継続していることを確認します');
    I.see('Pause');
  });
});

Scenario('プレイヤーがゲームボードの構造を確認する', ({ I }) => {
  Given('ゲームが開始されている', ({ I }) => {
    I.click('Start Game');
  });
  
  Then('ゲームボードが正しく表示される', ({ I }) => {
    I.say('ゲームボードの境界が表示されることを確認します');
    I.seeElement({css: 'div[class*="border"]'});
    
    I.say('200個のセル（10×20グリッド）が表示されることを確認します');
    I.seeNumberOfElements({css: 'div[class*="w-8 h-8"]'}, 200);
  });
});

Scenario('プレイヤーが次のピースのプレビューを確認する', ({ I }) => {
  Given('ゲームが開始されている', ({ I }) => {
    I.click('Start Game');
  });
  
  Then('次のピースのプレビューが表示される', ({ I }) => {
    I.say('次のピースプレビューセクションが表示されることを確認します');
    I.see('Next:');
  });
});