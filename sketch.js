let sprites = {
  player1: {
    attack: {
      img: null,
      width: 680/5,
      height: 58,
      frames: 5
    },
    defend: {
      img: null,
      width: 320/5,
      height: 64,
      frames: 5
    }
  },
  player2: {
    attack: {
      img: null,
      width: 683/8,
      height: 87,
      frames: 8
    },
    defend: {
      img: null,
      width: 795/8,
      height: 87,
      frames: 8
    }
  },
  player3: {
    attack: {
      img: null,
      width: 367/6,
      height: 45,
      frames: 6
    },
    defend: {
      img: null,
      width: 555/7,
      height: 41,
      frames:7
    }
  }
};

let backgroundImg;
let currentPlayer = 1;
let currentAction = 'attack';
let frameCount = 0;

// 加入新的變數來追蹤兩個角色
let player1 = {
  character: 1,
  action: 'attack',
  x: 0,  // 位置會在 draw 中計算
  scale: 2  // 放大倍數
};

let player2 = {
  character: 2,
  action: 'defend',
  x: 0,  // 位置會在 draw 中計算
  scale: 2,  // 放大倍數
  hp: 100  // 添加生命值
};

// 添加重新開始按鈕的變數
let restartButton = {
  x: 0,
  y: 0,
  width: 200,
  height: 50,
  visible: false
};

// 添加新的重新開始按鈕變數
let restartButtonInGame = {
  x: 20,  // 與規則說明對齊
  y: 290, // 在規則說明下方
  width: 120,
  height: 30
};

// 添加遊戲狀態變數
let gameOver = false;

function preload() {
  // 背景圖片載入
  backgroundImg = loadImage('./20241224/7/1.png', 
    () => console.log('背景載入成功'),
    () => console.log('背景載入失敗')
  );

  // Player 1 圖片載入
  sprites.player1.attack.img = loadImage('./20241224/1/000.png',
    () => console.log('Player1 attack 載入成功'),
    () => console.log('Player1 attack 載入失敗')
  );
  sprites.player1.defend.img = loadImage('./20241224/2/0000.png',
    () => console.log('Player1 defend 載入成功'),
    () => console.log('Player1 defend 載入失敗')
  );

  // Player 2 圖片載入
  sprites.player2.attack.img = loadImage('./20241224/3/11111.png',
    () => console.log('Player2 attack 載入成功'),
    () => console.log('Player2 attack 載入失敗')
  );
  sprites.player2.defend.img = loadImage('./20241224/4/111.png',
    () => console.log('Player2 defend 載入成功'),
    () => console.log('Player2 defend 載入失敗')
  );

  // Player 3 圖片載入
  sprites.player3.attack.img = loadImage('./20241224/5/222.png',
    () => console.log('Player3 attack 載入成功'),
    () => console.log('Player3 attack 載入失敗')
  );
  sprites.player3.defend.img = loadImage('./20241224/6/333.png',
    () => console.log('Player3 defend 載入成功'),
    () => console.log('Player3 defend 載入失敗')
  );
}

function setup() {
  // 創建全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  console.log('Canvas created:', windowWidth, windowHeight);
}

// 加入視窗大小改變時的處理函數
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // 繪製全螢幕背景
  if (backgroundImg) {
    image(backgroundImg, 0, 0, windowWidth, windowHeight);
  } else {
    background(220);
  }
  
  // 繪製角色
  player1.x = windowWidth * 0.58;
  player2.x = windowWidth * 0.42;
  drawPlayer(player2);
  drawPlayer(player1);
  
  // 繪製生命條
  drawHealthBar(player1.x, 50, player1.hp, "Player 1");
  drawHealthBar(player2.x, 50, player2.hp, "Player 2");
  
  // 遊戲規則和控制說明
  fill(255);
  textSize(16);
  textAlign(LEFT);
  
  text('【遊戲規則與控制說明】', 20, 30);
  
  // 左邊玩家控制說明
  text('左邊玩家控制：', 20, 60);
  text('A：攻擊（-10血量）', 30, 85);
  text('D：防守（+3血量）', 30, 110);
  text('2：切換成角色二', 30, 135);
  text('3：切換成角色三', 30, 160);
  
  // 右邊玩家控制說明
  text('右邊玩家控制：', 20, 190);
  text('J：攻擊（-10血量）', 30, 215);
  text('L：防守（+3血量）', 30, 240);
  text('固定為角色一', 30, 265);
  
  // 遊戲規則
  text('遊戲規則：', 20, 295);
  text('- 初始血量100', 30, 320);
  text('- 攻擊時扣對方10血', 30, 345);
  text('- 防守時回復3血', 30, 370);
  text('- 血量歸零時遊戲結束', 30, 395);
  
  // 重新開始按鈕位置調整
  restartButtonInGame.y = 415;  // 調整按鈕位置到規則下方
  
  // 繪製規則下方的重新開始按鈕
  fill(0, 200, 0);
  rect(restartButtonInGame.x, restartButtonInGame.y, 
       restartButtonInGame.width, restartButtonInGame.height, 5);
  
  // 按鈕文字
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text('重新開始', 
       restartButtonInGame.x + restartButtonInGame.width/2, 
       restartButtonInGame.y + restartButtonInGame.height/2);
  
  // 檢查遊戲是否結束
  if (gameOver) {
    // 顯示重新開始按鈕
    restartButton.visible = true;
    restartButton.x = windowWidth/2 - restartButton.width/2;
    restartButton.y = windowHeight/2 - restartButton.height/2;
    
    // 繪製半透明黑色背景
    fill(0, 0, 0, 128);
    rect(0, 0, windowWidth, windowHeight);
    
    // 繪製按鈕
    fill(0, 200, 0);
    rect(restartButton.x, restartButton.y, restartButton.width, restartButton.height, 10);
    
    // 按鈕文字
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text('重新開始', restartButton.x + restartButton.width/2, restartButton.y + restartButton.height/2);
    
    // 顯示勝利者
    textSize(32);
    fill(255, 215, 0);
    let winner = player1.hp <= 0 ? "左邊玩家獲勝！" : "右邊玩家獲勝！";
    text(winner, windowWidth/2, windowHeight/2 - 100);
  }
  
  // 浮水印
  textSize(48);
  textStyle(BOLD);
  textAlign(CENTER);
  fill(255, 255, 255, 200);
  text('淡江教科', windowWidth/2, windowHeight - 50);
  
  frameCount++;
}

// 新增繪製角色的函數
function drawPlayer(player) {
  let playerSprite = sprites['player' + player.character][player.action];
  
  if (playerSprite && playerSprite.img) {
    let currentFrame = floor(frameCount / 6) % playerSprite.frames;
    let sx = currentFrame * playerSprite.width;
    
    // 計算放大後的尺寸
    let scaledWidth = playerSprite.width * player.scale;
    let scaledHeight = playerSprite.height * player.scale;
    
    image(playerSprite.img, 
          player.x - scaledWidth/2,  // 以角色中心點為基準
          windowHeight/2 - scaledHeight/2,
          scaledWidth,
          scaledHeight,
          sx, 0,
          playerSprite.width,
          playerSprite.height
    );
  }
}

// 修改按鍵控制，只允許切換左邊的角色（2和3）
function keyPressed() {
  // 如果遊戲結束，則不處理任何按鍵操作
  if (gameOver) return;
  
  console.log('按下按鍵:', key);
  
  // 右邊玩家（固定角色一）的攻擊和防守
  if (key === 'j' || key === 'J') {
    player1.action = 'attack';
    player2.hp = max(0, player2.hp - 10);
    console.log('左邊玩家生命值:', player2.hp);
    // 檢查是否遊戲結束
    if (player2.hp <= 0) gameOver = true;
  } else if (key === 'l' || key === 'L') {
    player1.action = 'defend';
    player1.hp = min(100, player1.hp + 3);
    console.log('右邊玩家恢復生命值:', player1.hp);
  }
  
  // 左邊玩家的攻擊和防守
  if (key === 'a' || key === 'A') {
    player2.action = 'attack';
    player1.hp = max(0, player1.hp - 10);
    console.log('右邊玩家生命值:', player1.hp);
    // 檢查是否遊戲結束
    if (player1.hp <= 0) gameOver = true;
  } else if (key === 'd' || key === 'D') {
    player2.action = 'defend';
    player2.hp = min(100, player2.hp + 3);
    console.log('左邊玩家恢復生命值:', player2.hp);
  }
  
  // 左邊玩家角色切換
  if (key === '2') player2.character = 2;
  if (key === '3') player2.character = 3;
  
  console.log('右邊角色一:', player1.action);
  console.log('左邊角色' + player2.character + ':', player2.action);
}

// 添加按鍵放開事件
function keyReleased() {
  // 當按鍵放開時，回到預設動作
  if (key === 'j' || key === 'J' || key === 'l' || key === 'L') {
    player1.action = 'defend';
  }
  if (key === 'a' || key === 'A' || key === 'd' || key === 'D') {
    player2.action = 'defend';
  }
  return false; // 防止瀏覽器預設行為
}

// 修改繪製生命條的函數
function drawHealthBar(x, y, hp, playerName) {
  const barWidth = 200;
  const barHeight = 20;
  
  // 繪製生命條背景
  fill(100);
  rect(x - barWidth/2, y, barWidth, barHeight);
  
  // 繪製當前生命值
  fill(hp > 30 ? color(0, 255, 0) : color(255, 0, 0));  // 生命值低於30%時變紅
  rect(x - barWidth/2, y, barWidth * (hp/100), barHeight);
  
  // 繪製生命值文字
  fill(255);
  textAlign(CENTER);
  textSize(16);
  text(hp + "%", x, y + barHeight - 4);
}

// 確保滑鼠點擊事件正確運作
function mouseClicked() {
  // 檢查遊戲結束時的重新開始按鈕
  if (gameOver && restartButton.visible) {
    if (mouseX > restartButton.x && 
        mouseX < restartButton.x + restartButton.width &&
        mouseY > restartButton.y && 
        mouseY < restartButton.y + restartButton.height) {
      resetGame();
    }
  }
  
  // 檢查規則下方的重新開始按鈕
  if (mouseX > restartButtonInGame.x && 
      mouseX < restartButtonInGame.x + restartButtonInGame.width &&
      mouseY > restartButtonInGame.y && 
      mouseY < restartButtonInGame.y + restartButtonInGame.height) {
    resetGame();
  }
}

// 修改重置遊戲函數
function resetGame() {
  // 重置玩家生命值
  player1.hp = 100;
  player2.hp = 100;
  
  // 重置動作
  player1.action = 'attack';
  player2.action = 'defend';
  
  // 隱藏重新開始按鈕
  restartButton.visible = false;
  
  // 重置遊戲狀態
  gameOver = false;
}

