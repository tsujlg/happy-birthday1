// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  initializeAnimations()
  initializeButtons()
  const music = document.getElementById("bg-music")
  initializeGames()
})

// Animações de entrada
function initializeAnimations() {
  const header = document.querySelector("header")
  const homeContent = document.querySelector(".home-content")

  header.style.opacity = "0"
  homeContent.style.opacity = "0"

  setTimeout(() => {
    header.style.transition = "opacity 1s ease-in"
    header.style.opacity = "1"
  }, 100)

  setTimeout(() => {
    homeContent.style.transition = "opacity 1s ease-in"
    homeContent.style.opacity = "1"
  }, 500)
}

// Poema com efeito de digitação
const poema = `
Em uma noite
Céu escuro,
Coração vazio,
Estrelas distantes.

Me vi sem rumo,
Sentado no gramado,
Vazio,
Solitário.

Olho para o lado…
O que procuro?
O que sinto?
O que quero da vida?

Quero uma luz —
A luz que me guie,
Que me faça viver.

De repente, vejo você:
Seu jeitinho,
Seus olhos,
Seu sorriso.

Onde estou?
Estou sonhando?

Em meio à escuridão,
Enxergo a luz,
A esperança.
Finalmente,
Agora tenho um rumo,
Um propósito.

Eu lutaria por você,
Eu morreria por você,
Faria tudo por você.

Loucura? Pode achar.
Mas faria tudo por você,
Pois você me respeitou,
Me amou,
Não me usou,
Me aceitou
Da forma que sou.

Posso não ser rico,
Nem alto,
Nem forte.
Posso não me encaixar nos padrões.
Mas eu tenho algo
Que muitos nunca vão ter:
A felicidade.

O que está acontecendo?
O que estou falando?
Me sinto tonto,
Perdido…
Perdido em você.

Não tenho palavras.
Acho melhor parar.
Por isso amo você. 💖
`

function initializePoema() {
  let i = 0
  const poemElement = document.getElementById("poema-texto")

  function escreverPoema() {
    if (i < poema.length) {
      const char = poema.charAt(i)
      poemElement.innerHTML += char === "\n" ? "<br>" : char
      i++
      setTimeout(escreverPoema, 50)
    }
  }

  escreverPoema()
}

// Botões principais e Controles (Consolidado)
function initializeButtons() {
  const musicBtn = document.getElementById("music-btn")
  const gamesBtn = document.getElementById("games-btn")
  const surpresaBtn = document.getElementById("surpresa-btn")
  const music = document.getElementById("bg-music")

  // Controle de Volume
  const volumeSlider = document.getElementById("volume-slider")
  const volUp = document.getElementById("vol-up")
  const volDown = document.getElementById("vol-down")

  music.volume = parseFloat(volumeSlider.value)

  volumeSlider.addEventListener("input", () => {
    music.volume = parseFloat(volumeSlider.value)
  })

  volUp.addEventListener("click", () => {
    let newVol = Math.min(1, music.volume + 0.1)
    music.volume = newVol
    volumeSlider.value = newVol.toFixed(2)
  })

  volDown.addEventListener("click", () => {
    let newVol = Math.max(0, music.volume - 0.1)
    music.volume = newVol
    volumeSlider.value = newVol.toFixed(2)
  })

  // Botão de Música
  musicBtn.addEventListener("click", () => {
    const icon = musicBtn.querySelector(".btn-icon")
    if (music.paused) {
      music.play()
      musicBtn.classList.add("playing")
      icon.textContent = "🎵"
    } else {
      music.pause()
      musicBtn.classList.remove("playing")
      icon.textContent = "🔇"
    }
  })

  // Botão de Minijogos
  gamesBtn.addEventListener("click", openGamesModal)

  // Botão de Surpresa
  surpresaBtn.addEventListener("click", () => {
    const msg = document.getElementById("mensagem")
    if (msg.style.display === "none") {
      msg.style.display = "block"
      msg.style.opacity = "0"
      setTimeout(() => {
        msg.style.transition = "opacity 0.5s"
        msg.style.opacity = "1"
      }, 50)
    }
  })
}

// Modal de Minijogos
function openGamesModal() {
  const modal = document.getElementById("games-modal");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.onclick = () => closeModal(modal);

  modal.onclick = (e) => {
    if (e.target === modal) closeModal(modal);
  };

  modal.querySelectorAll(".game-card").forEach((card) => {
    card.onclick = () => {
      const game = card.dataset.game;
      closeModal(modal);
      startGame(game);
    };
  });
}

function closeModal(modal) {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function closeGame() {
  document.querySelectorAll(".game-container").forEach((game) => {
    game.style.display = "none"
  })
}

function startGame(game) {
  closeGame();
  const gameContainer = document.getElementById(game + "-game");
  if (!gameContainer) return;
  gameContainer.style.display = "block";

  const closeButton = gameContainer.querySelector(".btn-close-game");
  if (closeButton) closeButton.onclick = closeGame;

  if (game === "memory") initMemoryGame();
  else if (game === "quiz") initQuizGame();
  else if (game === "click") initClickGame();
  else if (game === "urso") initUrsoGame();
}

// ==============================
// JOGO DO URSINHO
// ==============================
function initUrsoGame() {
  const container = document.getElementById("game"); 
  const character = document.getElementById("character");
  const obstacle = document.getElementById("obstacle");
  const scoreEl = document.getElementById("score");
  const coinsEl = document.getElementById("coins");
  const gameOverEl = document.getElementById("gameOver");
  const finalScoreEl = document.getElementById("finalScore");
  const winScreen = document.getElementById("winScreen");
  const finalScoreWin = document.getElementById("finalScoreWin");
  const restartBtn = document.getElementById("restart-btn");

  let coins = 0;
  let points = 0;
  let gameActive = true;
  let collisionInterval = null;
  let spawnInterval = null;

  function resetVisuals() {
    gameOverEl.style.display = "none";
    winScreen.style.display = "none";
    coins = 0;
    points = 0;
    scoreEl.textContent = `Pontos: ${points}`;
    coinsEl.textContent = `Moedas: ${coins}`;
    container.querySelectorAll(".coin").forEach(c => c.remove());
    obstacle.style.animation = ""; 
    obstacle.style.left = ""; 
    character.classList.remove("jump");
    character.style.bottom = "";
    gameActive = true;
  }

  resetVisuals();

  function jump() {
    if (!gameActive) return;
    if (character.classList.contains("jump")) return;
    character.classList.add("jump");
    setTimeout(() => character.classList.remove("jump"), 500);
  }

  function spawnCoin() {
    if (!gameActive) return;
    const coin = document.createElement("div");
    coin.className = "coin";
    coin.textContent = "🪙";
    const bottomPx = Math.floor(Math.random() * 90); 
    coin.style.bottom = `${20 + bottomPx}px`;
    coin.style.left = "100%";
    coin.style.animation = "ursoCoinMove 3s linear forwards";
    coin.addEventListener("animationend", () => coin.remove());
    container.appendChild(coin);
  }

  function startSpawningCoins() {
    spawnInterval = setInterval(spawnCoin, 1200); 
    spawnCoin();
  }

  function stopSpawningCoins() {
    if (spawnInterval) {
      clearInterval(spawnInterval);
      spawnInterval = null;
    }
  }

  function isColliding(el1, el2) {
    if (!el1 || !el2) return false;
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();
    return !(
      r1.top > r2.bottom ||
      r1.bottom < r2.top ||
      r1.left > r2.right ||
      r1.right < r2.left
    );
  }

  function startCollisionLoop() {
    collisionInterval = setInterval(() => {
      if (!gameActive) return;

      if (isColliding(character, obstacle)) {
        gameActive = false;
        obstacle.style.animation = "none";
        stopSpawningCoins();
        clearInterval(collisionInterval);
        finalScoreEl.textContent = `Pontos: ${points} | Moedas: ${coins}`;
        gameOverEl.style.display = "block";
      }

      const coinsEls = container.querySelectorAll(".coin");
      coinsEls.forEach(c => {
        if (isColliding(character, c)) {
          coins += 1;
          points += 10;
          coinsEl.textContent = `Moedas: ${coins}`;
          scoreEl.textContent = `Pontos: ${points}`;
          c.remove();

          if (coins >= 3 && gameActive) {
            gameActive = false;
            obstacle.style.animation = "none";
            stopSpawningCoins();
            clearInterval(collisionInterval);
            finalScoreWin.textContent = `Você fez ${points} pontos e coletou ${coins} moedas!`;
            winScreen.style.display = "block";
          }
        }
      });
    }, 60); 
  }

  function restartGame() {
    resetVisuals();
    obstacle.style.animation = "none";
    void obstacle.offsetWidth;
    obstacle.style.animation = "ursoObstacleMove 2s linear infinite";
    startSpawningCoins();
    startCollisionLoop();
  }

  container.onclick = (e) => {
    const target = e.target;
    if (target === restartBtn || target.closest("#gameOver") || target.closest("#winScreen")) return;
    jump();
  };

  container.onmousedown = () => jump();

  function keyHandler(e) {
    if ([" ", "ArrowUp", "w", "W"].includes(e.key)) {
      e.preventDefault();
      jump();
    }
  }
  document.addEventListener("keydown", keyHandler);

  if (restartBtn) {
    restartBtn.onclick = () => {
      restartGame();
    };
  }

  const winBtn = winScreen.querySelector("button");
  if (winBtn) {
    winBtn.onclick = () => closeGame();
  }

  if (collisionInterval) { clearInterval(collisionInterval); collisionInterval = null; }
  if (spawnInterval) { clearInterval(spawnInterval); spawnInterval = null; }

  obstacle.style.animation = "ursoObstacleMove 2s linear infinite";
  startSpawningCoins();
  startCollisionLoop();

  const originalCloseGame = closeGame;
  closeGame = function() {
    stopSpawningCoins();
    if (collisionInterval) { clearInterval(collisionInterval); collisionInterval = null; }
    container.onclick = null;
    container.onmousedown = null;
    document.removeEventListener("keydown", keyHandler);
    originalCloseGame();
    closeGame = originalCloseGame;
  };
}

// ==============================
// Jogo da Memória com JUMPSCARE
// ==============================
let memoryFlipped = []
let memoryMatched = 0

function initMemoryGame() {
  const board = document.querySelector(".memory-board")
  board.innerHTML = ""
  memoryFlipped = []
  memoryMatched = 0

  const pairs = ["💕", "🌹", "🖕", "🎉", "✨", "🎈"]
  const cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5)

  cards.forEach((card, index) => {
    const button = document.createElement("button")
    button.className = "memory-card"
    button.innerHTML = "❓"
    button.addEventListener("click", () => flipMemoryCard(button, card, index))
    board.appendChild(button)
  })

  document.querySelector(".memory-score span").textContent = "0"
}

function flipMemoryCard(button, card, index) {
  if (memoryFlipped.length < 2 && !button.classList.contains("flipped")) {
    button.classList.add("flipped")
    button.innerHTML = card
    memoryFlipped.push({ button, card, index })

    if (memoryFlipped.length === 2) setTimeout(checkMemoryMatch, 500)
  }
}

function checkMemoryMatch() {
  const [card1, card2] = memoryFlipped

  if (card1.card === card2.card) {
    memoryMatched++
    document.querySelector(".memory-score span").textContent = memoryMatched
    memoryFlipped = []

    if (memoryMatched === 6) {
      setTimeout(() => {
        const videoContainer = document.getElementById("video-vitoria-container");
        const videoSurpresa = document.getElementById("video-vitoria");

        // Esconde o jogo para o susto ocupar tudo
        document.getElementById("memory-game").style.display = "none";
        
        // Faz o vídeo aparecer em tela cheia
        videoContainer.style.display = "flex";

        // Dá o play no jumpscare
        videoSurpresa.play().catch(e => console.log("Erro ao reproduzir:", e));

        // NOVIDADE: Quando o vídeo terminar, ele some e o jogo fecha!
        videoSurpresa.onended = () => {
            videoContainer.style.display = "none"; // Esconde o vídeo
            closeGame(); // Volta para a tela inicial
        };

      }, 300)
    }
  } else {
    card1.button.classList.remove("flipped")
    card2.button.classList.remove("flipped")
    card1.button.innerHTML = "❓"
    card2.button.innerHTML = "❓"
    memoryFlipped = []
  }
}

// ==============================
// Quiz
// ==============================
const quizQuestions = [
  {
    question: "Que dia é hj?",
    options: ["22/03", "Meu aniversário", "hoje", "ontem"],
    correct: 1,
  },

  {
    question: "Qual dia verdadeiro?",
    options: ["29/03", "18/02", "30/02", "Project Diva"],
    correct: 3,
  },

    {
    question: "Qual seu jogo favorito?",
    options: ["Femboy Futa House", "War Thunder", "Project Sekai", "Hitler Simulator"],
    correct: 2,
  },
]

let currentQuestion = 0
let quizScore = 0

function initQuizGame() {
  currentQuestion = 0
  quizScore = 0
  showQuizQuestion()
}

function showQuizQuestion() {
  if (currentQuestion >= quizQuestions.length) {
    alert(`Quiz finalizado! Você acertou ${quizScore}/${quizQuestions.length}! 🎉`)
    closeGame()
    return
  }

  const question = quizQuestions[currentQuestion]
  document.getElementById("quiz-question").innerHTML = question.question

  const optionsContainer = document.querySelector(".quiz-options")
  optionsContainer.innerHTML = ""

  question.options.forEach((option, index) => {
    const button = document.createElement("button")
    button.className = "quiz-option"
    button.innerHTML = option
    button.addEventListener("click", () => answerQuiz(index, question.correct))
    optionsContainer.appendChild(button)
  })
}

function answerQuiz(selected, correct) {
  const options = document.querySelectorAll(".quiz-option")

  options[selected].classList.add(selected === correct ? "correct" : "wrong")
  options[correct].classList.add("correct")

  if (selected === correct) quizScore++

  setTimeout(() => {
    currentQuestion++
    showQuizQuestion()
  }, 1500)
}

// Botão para revelar o poema (caso usado em outro lugar da tela)
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("revelar-poema-btn");
  const poemaBox = document.getElementById("poema-texto");

  if (btn && poemaBox) {
    btn.addEventListener("click", () => {
      btn.style.display = "none";
      poemaBox.style.display = "block"; 
      initializePoema(); 
    });
  }
});

function initializeGames() {
  // nada extra aqui no momento
}