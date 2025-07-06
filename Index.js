const values = [
  "captain.png",
  "hawk.png",
  "hulk.png",
  "ironman.png",
  "rocket.png",
  "spiderman.png",
  "thor.png",
  "widow.png",
];

// Game state variables
let cards = [];
let flippedCards = [];
let lockBoard = false;
let moveCount = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

// Initialize the game when page loads
window.onload = startGame;

function startGame() {
  resetGame();

  const doubled = [...values, ...values];
  const shuffled = doubled.sort(() => 0.5 - Math.random());

  cards = shuffled.map((val, index) => ({
    id: index,
    value: val,
    isFlipped: false,
    isMatched: false,
  }));

  updateGameInfo();
  renderBoard();
}

function resetGame() {
  if (timerInterval) clearInterval(timerInterval);

  flippedCards = [];
  moveCount = 0;
  timer = 0;
  lockBoard = false;
  gameStarted = false;

  document.getElementById("result").classList.add("hidden");

  const overlay = document.querySelector(".overlay");
  if (overlay) overlay.classList.remove("show-overlay");
}

function updateGameInfo() {
  document.getElementById("move-counter").textContent = moveCount;
  document.getElementById("timer").textContent = timer;
}

function renderBoard() {
  const game = document.getElementById("game");
  game.innerHTML = "";

  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";

    if (card.isFlipped || card.isMatched) {
      cardElement.classList.add("flipped");
    }
    if (card.isMatched) {
      cardElement.classList.add("matched");
    }

    if (card.isFlipped || card.isMatched) {
      const img = document.createElement("img");
      img.src = `assets/${card.value}`;
      img.alt = "card image";
      cardElement.appendChild(img);
    }

    cardElement.addEventListener("click", () => flipCard(index));
    game.appendChild(cardElement);
  });
}

function flipCard(index) {
  if (lockBoard) return;
  const card = cards[index];
  if (card.isFlipped || card.isMatched) return;

  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }

  card.isFlipped = true;
  flippedCards.push(card);
  renderBoard();

  if (flippedCards.length === 2) {
    moveCount++;
    document.getElementById("move-counter").textContent = moveCount;
    lockBoard = true;
    setTimeout(checkMatch, 800);
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = timer;
  }, 1000);
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.value === card2.value) {
    card1.isMatched = true;
    card2.isMatched = true;
  } else {
    card1.isFlipped = false;
    card2.isFlipped = false;
  }

  flippedCards = [];
  lockBoard = false;
  renderBoard();

  if (cards.every((card) => card.isMatched)) {
    gameCompleted();
  }
}

function gameCompleted() {
  clearInterval(timerInterval);

  let overlay = document.querySelector(".overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);
  }

  overlay.classList.add("show-overlay");
  document.getElementById("final-time").textContent = timer;
  document.getElementById("final-moves").textContent = moveCount;

  const stars = calculateStars();
  const starsHTML = generateStarsHTML(stars);
  document.getElementById("final-rating").innerHTML = starsHTML;

  document.getElementById("result").classList.remove("hidden");
}

// ⭐ Rating logic
function calculateStars() {
  if (moveCount <= 20) return 5;
  if (moveCount <= 30) return 4;
  if (moveCount <= 40) return 3;
  if (moveCount <= 50) return 2;
  return 1;
}

function generateStarsHTML(count) {
  let starsHTML = "";
  for (let i = 0; i < 5; i++) {
    starsHTML += `<span class="star ${i < count ? "filled" : ""}">★</span>`;
  }
  return starsHTML;
}
