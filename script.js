// Лабиринт
const mazeTemplate = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 'S', 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 'E', 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let maze = [];
let player = { x: 1, y: 1 };
let steps = 0;
let gameWon = false;

// Звук победы
const winSound = document.getElementById("win-sound");

// Инициализация игры
function initGame() {
  maze = mazeTemplate.map(row => [...row]);
  player = { x: 1, y: 1 };
  steps = 0;
  gameWon = false;
  document.getElementById("steps").textContent = steps;
  renderMaze();
}

// Отрисовка лабиринта
function renderMaze() {
  const mazeElement = document.getElementById("maze");
  mazeElement.innerHTML = "";

  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (x === player.x && y === player.y) {
        cell.classList.add("player");
        cell.textContent = "P";
      } else {
        const value = maze[y][x];
        if (value === 1) {
          cell.classList.add("wall");
          cell.textContent = "#";
        } else if (value === 0) {
          cell.classList.add("path");
        } else if (value === 'S') {
          cell.classList.add("start");
          cell.textContent = "S";
        } else if (value === 'E') {
          cell.classList.add("exit");
          cell.textContent = "E";
        }
      }

      mazeElement.appendChild(cell);
    }
  }
}

// Проверка движения
function canMove(x, y) {
  if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) return false;
  const cell = maze[y][x];
  return cell === 0 || cell === 'E';
}

// Движение
function movePlayer(dx, dy) {
  if (gameWon) return;

  const newX = player.x + dx;
  const newY = player.y + dy;

  if (canMove(newX, newY)) {
    player.x = newX;
    player.y = newY;
    steps++;
    document.getElementById("steps").textContent = steps;

    if (maze[newY][newX] === 'E') {
      gameWon = true;
      document.getElementById("final-steps").textContent = steps;
      document.getElementById("victory-screen").classList.add("visible");
      winSound.currentTime = 0; // Перезапуск звука
      winSound.play().catch(e => console.log("Звук заблокирован:", e));
    }

    renderMaze();
  }
}

// Управление с клавиатуры
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      e.preventDefault();
      movePlayer(0, -1);
      break;
    case "ArrowDown":
      e.preventDefault();
      movePlayer(0, 1);
      break;
    case "ArrowLeft":
      e.preventDefault();
      movePlayer(-1, 0);
      break;
    case "ArrowRight":
      e.preventDefault();
      movePlayer(1, 0);
      break;
  }
});

// Мобильное управление
function setupMobileControls() {
  const upBtn = document.getElementById("up");
  const downBtn = document.getElementById("down");
  const leftBtn = document.getElementById("left");
  const rightBtn = document.getElementById("right");

  const handleUp = () => movePlayer(0, -1);
  const handleDown = () => movePlayer(0, 1);
  const handleLeft = () => movePlayer(-1, 0);
  const handleRight = () => movePlayer(1, 0);

  upBtn.addEventListener("touchstart", (e) => { e.preventDefault(); handleUp(); }, { passive: false });
  downBtn.addEventListener("touchstart", (e) => { e.preventDefault(); handleDown(); }, { passive: false });
  leftBtn.addEventListener("touchstart", (e) => { e.preventDefault(); handleLeft(); }, { passive: false });
  rightBtn.addEventListener("touchstart", (e) => { e.preventDefault(); handleRight(); }, { passive: false });

  upBtn.addEventListener("click", handleUp);
  downBtn.addEventListener("click", handleDown);
  leftBtn.addEventListener("click", handleLeft);
  rightBtn.addEventListener("click", handleRight);
}

// Перетаскивание панели
function makeDraggable(element) {
  let pos = { x: 0, y: 0, startX: 0, startY: 0 };

  element.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    pos.startX = touch.clientX;
    pos.startY = touch.clientY;
    pos.x = element.offsetLeft;
    pos.y = element.offsetTop;
    element.style.opacity = "0.8";
  }, { passive: false });

  element.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    let dx = touch.clientX - pos.startX;
    let dy = touch.clientY - pos.startY;

    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;

    let newX = pos.x + dx;
    let newY = pos.y + dy;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    element.style.left = newX + "px";
    element.style.top = newY + "px";
    element.style.bottom = "auto";
    element.style.right = "auto";
  }, { passive: false });

  element.addEventListener("touchend", () => {
    element.style.opacity = "1";
    element.style.left = element.offsetLeft + "px";
    element.style.top = element.offsetTop + "px";
    element.style.bottom = "auto";
    element.style.right = "auto";
  });
}

// Тема день/ночь
function setupThemeToggle() {
  const body = document.body;
  const themeBtn = document.getElementById("theme-toggle");

  // Проверяем сохранённую тему
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    themeBtn.textContent = "☀️ День";
  }

  themeBtn.addEventListener("click", () => {
    if (body.classList.contains("dark-theme")) {
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
      themeBtn.textContent = "🌙 голубая луна";
      localStorage.setItem("theme", "light");
    } else {
      body.classList.remove("light-theme");
      body.classList.add("dark-theme");
      themeBtn.textContent = "☀️ потный день";
      localStorage.setItem("theme", "dark");
    }
  });
}

// Кнопки
document.getElementById("restart").addEventListener("click", () => {
  initGame();
});

document.getElementById("play-again").addEventListener("click", () => {
  document.getElementById("victory-screen").classList.remove("visible");
  initGame();
});

// Запуск
window.onload = function () {
  initGame();
  setupMobileControls();
  makeDraggable(document.querySelector(".mobile-controls"));
  setupThemeToggle();
};
