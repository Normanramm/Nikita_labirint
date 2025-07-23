// Лабиринт (0 = путь, 1 = стена, 'S' = старт, 'E' = выход)
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
let player = { x: 1, y: 1 }; // Начальная позиция (S)
let steps = 0;
let gameWon = false;

// Инициализация игры
function initGame() {
  maze = mazeTemplate.map(row => [...row]); // Копия
  player = { x: 1, y: 1 };
  steps = 0;
  gameWon = false;
  document.getElementById("steps").textContent = steps;
  document.getElementById("message").textContent = "";
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

// Проверка, можно ли пойти в клетку
function canMove(x, y) {
  if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) return false;
  const cell = maze[y][x];
  return cell === 0 || cell === 'E'; // Путь или выход
}

// Движение игрока
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
      document.getElementById("message").textContent = "🎉 Поздравляю!Ты додик-гей!";
    }

    renderMaze();
  }
}

// Обработка клавиш
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

// Кнопка "Начать заново"
document.getElementById("restart").addEventListener("click", initGame);

// Управление с кнопок на телефоне
document.getElementById("up").addEventListener("click", () => movePlayer(0, -1));
document.getElementById("down").addEventListener("click", () => movePlayer(0, 1));
document.getElementById("left").addEventListener("click", () => movePlayer(-1, 0));
document.getElementById("right").addEventListener("click", () => movePlayer(1, 0));

// Отключаем скролл при нажатии на кнопки
document.querySelectorAll('.ctrl-btn').forEach(btn => {
  btn.addEventListener('touchstart', e => {
    e.preventDefault(); // Предотвращаем скролл
  });
});

// Запуск игры при загрузке
window.onload = initGame;
