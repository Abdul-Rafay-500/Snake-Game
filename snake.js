let container = document.querySelector(".container");
let snakeHead = document.getElementById("head");
let food = document.querySelector(".food");
let urScore = document.getElementById("ur-score");
let startReset = document.getElementById("start-reset");

let snakeBody = [];
let snakeDirection = "right";
let snakeSpeed = 200;
let isGameRunning = false;
let foodPosition = { x: 0, y: 0 };
const boxSize = 20;

startReset.addEventListener("click", function () {
  if (isGameRunning) {
    resetGame();
  } else {
    startGame();
  }
});

function startGame() {
  isGameRunning = true;
  urScore.innerHTML = 0;
  snakeDirection = "right";
  snakeBody = [];
  snakeHead.style.left = "0px";
  snakeHead.style.top = "0px";
  generateRandomFood();

  startReset.innerHTML = "Reset Game";
  moveSnake();
}

function resetGame() {
  isGameRunning = false;
  urScore.innerHTML = 0;
  snakeHead.style.left = "0px";
  snakeHead.style.top = "0px";
  snakeBody.forEach((segment) => segment.remove());
  snakeBody = [];
  startReset.innerHTML = "Start Game";
}

function moveSnake() {
  let interval = setInterval(function () {
    if (!isGameRunning) {
      clearInterval(interval);
      return;
    }

    let headPosition = {
      left: parseInt(snakeHead.style.left),
      top: parseInt(snakeHead.style.top),
    };
    let newX = headPosition.left;
    let newY = headPosition.top;

    if (snakeDirection === "right") newX += boxSize;
    if (snakeDirection === "left") newX -= boxSize;
    if (snakeDirection === "up") newY -= boxSize;
    if (snakeDirection === "down") newY += boxSize;

    if (
      newX < 0 ||
      newX >= container.clientWidth ||
      newY < 0 ||
      newY >= container.clientHeight
    ) {
      gameOver("You hit the wall!");
      return;
    }

    for (let segment of snakeBody) {
      let segmentPosition = {
        left: parseInt(segment.style.left),
        top: parseInt(segment.style.top),
      };
      if (newX === segmentPosition.left && newY === segmentPosition.top) {
        gameOver("You collided with your own body!");
        return;
      }
    }

    snakeHead.style.left = `${newX}px`;
    snakeHead.style.top = `${newY}px`;

    if (snakeBody.length > 0) {
      for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i].style.left = snakeBody[i - 1].style.left;
        snakeBody[i].style.top = snakeBody[i - 1].style.top;
      }
      snakeBody[0].style.left = snakeHead.style.left;
      snakeBody[0].style.top = snakeHead.style.top;
    }

    if (newX === foodPosition.left && newY === foodPosition.top) {
      urScore.innerHTML = parseInt(urScore.innerHTML) + 1;
      generateRandomFood();
      addSnakeSegment();

      if (parseInt(urScore.innerHTML) % 10 === 0) {
        snakeSpeed = Math.max(50, snakeSpeed - 10);
        clearInterval(interval);
        moveSnake();
      }
    }
  }, snakeSpeed);
}

function addSnakeSegment() {
  let newSegment = document.createElement("div");
  newSegment.classList.add("segment");

  if (snakeBody.length > 0) {
    let lastSegment = snakeBody[snakeBody.length - 1];
    newSegment.style.left = lastSegment.style.left;
    newSegment.style.top = lastSegment.style.top;
  } else {
    newSegment.style.left = snakeHead.style.left;
    newSegment.style.top = snakeHead.style.top;
  }

  snakeBody.push(newSegment);
  container.appendChild(newSegment);
}

function generateRandomFood() {
  foodPosition.left = getRandomPosition(container.clientWidth - boxSize);
  foodPosition.top = getRandomPosition(container.clientHeight - boxSize);
  food.style.left = `${foodPosition.left}px`;
  food.style.top = `${foodPosition.top}px`;
}

function getRandomPosition(max) {
  return Math.floor(Math.random() * (max / boxSize)) * boxSize;
}

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowUp" && snakeDirection !== "down") {
    snakeDirection = "up";
  } else if (e.key === "ArrowDown" && snakeDirection !== "up") {
    snakeDirection = "down";
  } else if (e.key === "ArrowLeft" && snakeDirection !== "right") {
    snakeDirection = "left";
  } else if (e.key === "ArrowRight" && snakeDirection !== "left") {
    snakeDirection = "right";
  }
});

function gameOver(message) {
  alert(`Game Over! ${message}`);
  resetGame();
}
