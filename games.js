/* ===========================
   GAME TABS
   =========================== */
document.querySelectorAll('.gtab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.gtab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('game-' + tab.dataset.game).classList.add('active');
    if (tab.dataset.game === 'memory') initMemory();
    if (tab.dataset.game === 'puzzle') initPuzzle();
  });
});

/* ===========================
   GAME 1: ROCK PAPER SCISSORS
   =========================== */
const rpsEmoji = { rock: '✊', paper: '📄', scissors: '✂️' };
const rpsWins = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
let rpsYou = 0, rpsCpu = 0;

window.playRPS = function(choice) {
  if (rpsYou >= 5 || rpsCpu >= 5) return;
  const cpuChoice = ['rock','paper','scissors'][Math.floor(Math.random()*3)];
  document.getElementById('rps-you-avatar').textContent = rpsEmoji[choice];
  document.getElementById('rps-cpu-avatar').textContent = rpsEmoji[cpuChoice];

  let result;
  if (choice === cpuChoice) {
    result = "It's a draw!";
  } else if (rpsWins[choice] === cpuChoice) {
    result = 'You win this round! 🎉';
    rpsYou++;
  } else {
    result = 'Computer wins this round!';
    rpsCpu++;
  }

  document.getElementById('rps-you-score').textContent = rpsYou;
  document.getElementById('rps-cpu-score').textContent = rpsCpu;

  if (rpsYou >= 5) result = '🏆 You won the match!';
  if (rpsCpu >= 5) result = '💻 Computer won the match!';
  document.getElementById('rps-result').textContent = result;
};

window.resetRPS = function() {
  rpsYou = 0; rpsCpu = 0;
  document.getElementById('rps-you-score').textContent = 0;
  document.getElementById('rps-cpu-score').textContent = 0;
  document.getElementById('rps-you-avatar').textContent = '❓';
  document.getElementById('rps-cpu-avatar').textContent = '❓';
  document.getElementById('rps-result').textContent = 'Choose your move to begin!';
};

/* ===========================
   GAME 2: SLIDE PUZZLE
   =========================== */
let puzzleArr = [1,2,3,4,5,6,7,8,0];
let puzzleMoves = 0;

function initPuzzle() {
  puzzleMoves = 0;
  document.getElementById('puzzle-moves').textContent = 0;
  document.getElementById('puzzle-msg').textContent = '';
  drawPuzzle();
}

function drawPuzzle() {
  const grid = document.getElementById('puzzle-grid');
  grid.innerHTML = '';
  puzzleArr.forEach((n, i) => {
    const tile = document.createElement('button');
    tile.className = 'puzzle-tile' + (n === 0 ? ' empty' : '');
    tile.textContent = n || '';
    if (n !== 0) tile.addEventListener('click', () => moveTile(i));
    grid.appendChild(tile);
  });
}

function moveTile(i) {
  const z = puzzleArr.indexOf(0);
  const r = Math.floor(i/3), c = i%3, rz = Math.floor(z/3), cz = z%3;
  if (Math.abs(r-rz) + Math.abs(c-cz) !== 1) return;
  [puzzleArr[i], puzzleArr[z]] = [puzzleArr[z], puzzleArr[i]];
  puzzleMoves++;
  document.getElementById('puzzle-moves').textContent = puzzleMoves;
  drawPuzzle();
  if (puzzleArr.join(',') === '1,2,3,4,5,6,7,8,0') {
    document.getElementById('puzzle-msg').textContent = `🎉 Solved in ${puzzleMoves} moves!`;
  }
}

window.shufflePuzzle = function() {
  do { puzzleArr.sort(() => Math.random() - 0.5); }
  while (!isSolvable(puzzleArr) || puzzleArr.join(',') === '1,2,3,4,5,6,7,8,0');
  puzzleMoves = 0;
  document.getElementById('puzzle-moves').textContent = 0;
  document.getElementById('puzzle-msg').textContent = '';
  drawPuzzle();
};

function isSolvable(arr) {
  let inv = 0;
  const flat = arr.filter(x => x !== 0);
  for (let i = 0; i < flat.length; i++)
    for (let j = i+1; j < flat.length; j++)
      if (flat[i] > flat[j]) inv++;
  return inv % 2 === 0;
}

initPuzzle();

/* ===========================
   GAME 3: MEMORY MATCH
   =========================== */
const memEmojis = ['⚡','☁️','🤖','🔍','🛠️','📊','🔗','🏆'];
let memCards = [], memFlipped = [], memMatched = 0, memFlipCount = 0, memLocked = false;

function initMemory() {
  memFlipped = []; memMatched = 0; memFlipCount = 0; memLocked = false;
  document.getElementById('mem-flips').textContent = 0;
  document.getElementById('mem-pairs').textContent = 0;
  document.getElementById('mem-msg').textContent = '';
  const deck = [...memEmojis, ...memEmojis].sort(() => Math.random() - 0.5);
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  memCards = [];
  deck.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.dataset.emoji = emoji;
    card.dataset.index = i;
    card.textContent = '❔';
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
    memCards.push(card);
  });
}

function flipCard(card) {
  if (memLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.textContent = card.dataset.emoji;
  card.classList.add('flipped');
  memFlipped.push(card);

  if (memFlipped.length === 2) {
    memFlipCount++;
    document.getElementById('mem-flips').textContent = memFlipCount;
    memLocked = true;
    const [a, b] = memFlipped;
    if (a.dataset.emoji === b.dataset.emoji) {
      a.classList.add('matched');
      b.classList.add('matched');
      memMatched++;
      document.getElementById('mem-pairs').textContent = memMatched;
      memFlipped = [];
      memLocked = false;
      if (memMatched === 8) {
        document.getElementById('mem-msg').textContent = `🎉 All matched in ${memFlipCount} flips!`;
      }
    } else {
      setTimeout(() => {
        a.textContent = '❔'; b.textContent = '❔';
        a.classList.remove('flipped'); b.classList.remove('flipped');
        memFlipped = [];
        memLocked = false;
      }, 900);
    }
  }
}

/* ===========================
   GAME 4: SNAKE
   =========================== */
const canvas = document.getElementById('snake-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const GRID = 20;
const COLS = canvas ? canvas.width / GRID : 0;
const ROWS = canvas ? canvas.height / GRID : 0;

let snakeBody, snakeDir, snakeFood, snakeScore, snakeTimer, snakeRunning;

function drawSnakeFrame() {
  if (!ctx) return;
  ctx.fillStyle = '#0d1530';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.fillRect(c*GRID + GRID/2 - 1, r*GRID + GRID/2 - 1, 2, 2);
    }
  }

  if (!snakeBody) return;

  ctx.fillStyle = '#ff5f7e';
  ctx.shadowColor = '#ff5f7e';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.roundRect(snakeFood.x*GRID+2, snakeFood.y*GRID+2, GRID-4, GRID-4, 6);
  ctx.fill();
  ctx.shadowBlur = 0;

  snakeBody.forEach((seg, i) => {
    const ratio = 1 - i / snakeBody.length;
    ctx.fillStyle = `rgba(0, ${Math.floor(180 + 75*ratio)}, ${Math.floor(100 + 76*ratio)}, 1)`;
    ctx.shadowColor = i === 0 ? '#00e5b0' : 'transparent';
    ctx.shadowBlur = i === 0 ? 12 : 0;
    ctx.beginPath();
    ctx.roundRect(seg.x*GRID+1, seg.y*GRID+1, GRID-2, GRID-2, i===0 ? 6 : 4);
    ctx.fill();
  });
  ctx.shadowBlur = 0;

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '500 13px Inter, sans-serif';
  ctx.fillText('Score: ' + snakeScore, 12, 24);
}

window.startSnake = function() {
  if (!canvas) return;
  clearInterval(snakeTimer);
  snakeBody = [{x:10, y:10}, {x:9, y:10}, {x:8, y:10}];
  snakeDir = {x:1, y:0};
  snakeScore = 0;
  snakeRunning = true;
  document.getElementById('snake-score').textContent = 0;
  spawnFood();
  snakeTimer = setInterval(snakeTick, 120);
  drawSnakeFrame();
};

function spawnFood() {
  do {
    snakeFood = {x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS)};
  } while (snakeBody.some(s => s.x === snakeFood.x && s.y === snakeFood.y));
}

function snakeTick() {
  const head = {x: snakeBody[0].x + snakeDir.x, y: snakeBody[0].y + snakeDir.y};
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
      snakeBody.some(s => s.x === head.x && s.y === head.y)) {
    clearInterval(snakeTimer);
    snakeRunning = false;
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f4ff';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 16);
    ctx.font = '16px Inter, sans-serif';
    ctx.fillStyle = '#8895b3';
    ctx.fillText('Score: ' + snakeScore, canvas.width/2, canvas.height/2 + 16);
    ctx.textAlign = 'left';
    return;
  }
  snakeBody.unshift(head);
  if (head.x === snakeFood.x && head.y === snakeFood.y) {
    snakeScore++;
    document.getElementById('snake-score').textContent = snakeScore;
    spawnFood();
  } else {
    snakeBody.pop();
  }
  drawSnakeFrame();
}

document.addEventListener('keydown', e => {
  if (!snakeRunning) return;
  const dirs = {
    ArrowUp:    {x:0,y:-1}, w: {x:0,y:-1},
    ArrowDown:  {x:0,y:1},  s: {x:0,y:1},
    ArrowLeft:  {x:-1,y:0}, a: {x:-1,y:0},
    ArrowRight: {x:1,y:0},  d: {x:1,y:0},
  };
  const newDir = dirs[e.key];
  if (newDir && !(newDir.x === -snakeDir.x && newDir.y === -snakeDir.y)) {
    snakeDir = newDir;
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
  }
});

drawSnakeFrame();
