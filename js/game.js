const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

const keys = {};

const player = {
  x: 50,
  y: 0,
  width: 40,
  height: 60,
  speedX: 4,
  speedY: 0,
  jumpStrength: 12,
  gravity: 0.5,
  onGround: false,
};

const levels = [
  {
    platforms: [
      { x: 0, y: 380, width: 800, height: 20 },
      { x: 130, y: 260, width: 60, height: 20 },
      { x: 210, y: 220, width: 60, height: 20 },
      { x: 290, y: 180, width: 60, height: 20 },
      { x: 370, y: 140, width: 60, height: 20 },
      { x: 450, y: 100, width: 60, height: 20 },
    ],
    stars: [
      { x: 150, y: 230, collected: false },
      { x: 230, y: 190, collected: false },
      { x: 310, y: 150, collected: false },
      { x: 390, y: 110, collected: false },
      { x: 470, y: 70, collected: false },
    ],
    enemies: [
      { x: 550, y: 360, width: 30, height: 20, speed: 2, dir: 1, minX: 550, maxX: 700 },
    ],
    checkpoints: [{ x: 750, y: 360, width: 30, height: 20 }],
  },
  {
    platforms: [
      { x: 0, y: 380, width: 800, height: 20 },
      { x: 150, y: 320, width: 80, height: 20 },
      { x: 250, y: 280, width: 80, height: 20 },
      { x: 350, y: 240, width: 80, height: 20 },
      { x: 450, y: 200, width: 80, height: 20 },
      { x: 550, y: 160, width: 80, height: 20 },
    ],
    stars: [
      { x: 180, y: 280, collected: false },
      { x: 280, y: 240, collected: false },
      { x: 380, y: 200, collected: false },
      { x: 480, y: 160, collected: false },
    ],
    enemies: [
      { x: 600, y: 360, width: 30, height: 20, speed: 2, dir: 1, minX: 600, maxX: 750 },
    ],
    checkpoints: [{ x: 750, y: 360, width: 30, height: 20 }],
  },
  {
    platforms: [
      { x: 0, y: 380, width: 800, height: 20 },
      { x: 100, y: 320, width: 60, height: 20 },
      { x: 200, y: 280, width: 60, height: 20 },
      { x: 300, y: 240, width: 60, height: 20 },
      { x: 400, y: 200, width: 60, height: 20 },
      { x: 500, y: 160, width: 60, height: 20 },
    ],
    stars: [
      { x: 130, y: 280, collected: false },
      { x: 230, y: 240, collected: false },
      { x: 330, y: 200, collected: false },
      { x: 430, y: 160, collected: false },
    ],
    enemies: [
      { x: 550, y: 360, width: 30, height: 20, speed: 2, dir: 1, minX: 550, maxX: 700 },
    ],
    checkpoints: [{ x: 750, y: 360, width: 30, height: 20 }],
  },
  {
    platforms: [
      { x: 0, y: 380, width: 800, height: 20 },
      { x: 50, y: 340, width: 70, height: 20 },
      { x: 150, y: 300, width: 70, height: 20 },
      { x: 250, y: 260, width: 70, height: 20 },
      { x: 350, y: 220, width: 70, height: 20 },
      { x: 450, y: 180, width: 70, height: 20 },
      { x: 550, y: 140, width: 70, height: 20 },
    ],
    stars: [
      { x: 90, y: 300, collected: false },
      { x: 190, y: 260, collected: false },
      { x: 290, y: 220, collected: false },
      { x: 390, y: 180, collected: false },
      { x: 490, y: 140, collected: false },
    ],
    enemies: [
      { x: 600, y: 360, width: 30, height: 20, speed: 2, dir: 1, minX: 600, maxX: 750 },
    ],
    checkpoints: [{ x: 750, y: 360, width: 30, height: 20 }],
  },
  {
    platforms: [
      { x: 0, y: 380, width: 800, height: 20 },
      { x: 100, y: 340, width: 50, height: 20 },
      { x: 160, y: 300, width: 50, height: 20 },
      { x: 220, y: 260, width: 50, height: 20 },
      { x: 280, y: 220, width: 50, height: 20 },
      { x: 340, y: 180, width: 50, height: 20 },
      { x: 400, y: 140, width: 50, height: 20 },
    ],
    stars: [
      { x: 120, y: 300, collected: false },
      { x: 180, y: 260, collected: false },
      { x: 240, y: 220, collected: false },
      { x: 300, y: 180, collected: false },
      { x: 360, y: 140, collected: false },
    ],
    enemies: [
      { x: 450, y: 360, width: 30, height: 20, speed: 2, dir: 1, minX: 450, maxX: 600 },
    ],
    checkpoints: [{ x: 700, y: 360, width: 30, height: 20 }],
  },
];

let currentLevel = 0;
let platforms = [];
let stars = [];
let enemies = [];
let checkpoints = [];
let score = 0;

function loadLevel(n) {
  const level = levels[n];
  platforms = level.platforms;
  stars = level.stars.map(s => ({ ...s, collected: false }));
  enemies = level.enemies.map(e => ({ ...e }));
  checkpoints = level.checkpoints;
  score = 0;
  player.x = 50;
  player.y = 0;
  player.speedY = 0;
  player.onGround = false;
}

function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function update() {
  // Movimento horizontal
  if (keys["ArrowRight"] || keys["d"]) {
    player.x += player.speedX;
  }
  if (keys["ArrowLeft"] || keys["a"]) {
    player.x -= player.speedX;
  }

  // Pulo (pode pular enquanto se move)
  if ((keys["ArrowUp"] || keys["w"] || keys[" "]) && player.onGround) {
    player.speedY = -player.jumpStrength;
    player.onGround = false;
  }

  // Gravidade
  player.speedY += player.gravity;
  player.y += player.speedY;

  // Limites do canvas
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.speedY = 0;
    player.onGround = true;
  }

  // Colisão com plataformas
  player.onGround = false;
  for (const plat of platforms) {
    if (
      player.x + player.width > plat.x &&
      player.x < plat.x + plat.width &&
      player.y + player.height > plat.y &&
      player.y + player.height < plat.y + plat.height
    ) {
      player.y = plat.y - player.height;
      player.speedY = 0;
      player.onGround = true;
    }
  }

  // Colete estrelas
  for (const star of stars) {
    if (!star.collected && checkCollision(player, { x: star.x, y: star.y, width: 20, height: 20 })) {
      star.collected = true;
      score++;
    }
  }

  // Mova inimigos e verifique colisão (velocidade aumentada para dificultar)
  for (const enemy of enemies) {
    enemy.x += enemy.speed * enemy.dir;
    if (enemy.x < enemy.minX || enemy.x + enemy.width > enemy.maxX) {
      enemy.dir *= -1;
    }
    if (checkCollision(player, enemy)) {
      loadLevel(currentLevel);
      return;
    }
  }

  // Checkpoint - muda de fase
  for (const checkpoint of checkpoints) {
    if (checkCollision(player, checkpoint)) {
      currentLevel++;
      if (currentLevel >= levels.length) {
        alert("Parabéns! Você terminou o jogo!");
        currentLevel = 0;
      }
      loadLevel(currentLevel);
      return;
    }
  }
}

function drawRoundedRect(x, y, width, height, radius, fillStyle, shadow = false) {
  ctx.fillStyle = fillStyle;
  if (shadow) {
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
  } else {
    ctx.shadowColor = "transparent";
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = "transparent";
}

function drawStar(x, y, radius, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(0, radius);
    ctx.translate(0, radius);
    ctx.rotate((Math.PI * 2) / 10);
    ctx.lineTo(0, -radius);
    ctx.translate(0, -radius);
    ctx.rotate(-(Math.PI * 6) / 10);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function draw() {
  // fundo gradiente
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#a2d9ff");
  gradient.addColorStop(1, "#ffffff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // plataformas
  for (const plat of platforms) {
    drawRoundedRect(plat.x, plat.y, plat.width, plat.height, 10, "#8B4513", true);
  }

  // estrelas
  for (const star of stars) {
    if (!star.collected) {
      drawStar(star.x + 10, star.y + 10, 10, "yellow");
    }
  }

  // inimigos
  for (const enemy of enemies) {
    ctx.fillStyle = "#c0392b";
    ctx.strokeStyle = "#7b241c";
    ctx.lineWidth = 2;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }

  // checkpoints
  for (const checkpoint of checkpoints) {
    ctx.fillStyle = "#27ae60";
    ctx.strokeStyle = "#145a32";
    ctx.lineWidth = 2;
    ctx.fillRect(checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);
    ctx.strokeRect(checkpoint.x, checkpoint.y, checkpoint.width, checkpoint.height);
  }

  // jogador
  ctx.fillStyle = "#2980b9";
  ctx.strokeStyle = "#1c5980";
  ctx.lineWidth = 3;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.strokeRect(player.x, player.y, player.width, player.height);

  // placar
  ctx.fillStyle = "#34495e";
  ctx.font = "20px Verdana";
  ctx.fillText(`Fase: ${currentLevel + 1} / ${levels.length}`, 10, 30);
  ctx.fillText(`Estrelas: ${score} / ${stars.length}`, 10, 60);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

loadLevel(currentLevel);
gameLoop();
