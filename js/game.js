const grid = document.querySelector(".grid"); // Seleciona o elemento com a classe "grid"
const scores = document.querySelectorAll(".score"); // Seleciona todos os elementos com a classe "score"

const letters = ["A", "B", "C", "D", "E", "F", "G", "H"]; // Letras para as posições das cartas
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8"]; // Números para as posições das cartas

const characters = [ // Array com os nomes dos personagens
  "estetoscopio",
  "seringa",
  "termometro",
  "ambulancia",
  "mascara-cirurgica",
  "prancheta-de-anotacoes",
  "oximetro",
  "comprimidos",
  "luvas-descartaveis",
  "caduceu",
  "medidor-de-pressao",
  "maca",
];

// Função auxiliar para criar elementos HTML
const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

let firstCard = ""; // Armazena a primeira carta selecionada
let secondCard = ""; // Armazena a segunda carta selecionada

let activeTeam = 1; // Equipe atual (1 a 4)
let teamsScores = [0, 0, 0, 0]; // Pontuação das equipes

const updateScoreDisplay = () => {
  // Atualiza a exibição da pontuação das equipes
  scores.forEach((score, index) => {
    score.textContent = teamsScores[index];
  });
};

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll(".disabled-card");

  if (disabledCards.length === 24) {
    // Final do jogo
    clearInterval(this.loop);
    const maxScore = Math.max(...teamsScores);
    const winningTeams = teamsScores
      .map((score, index) => (score === maxScore ? index + 1 : null))
      .filter(Boolean);
    alert(
      `Parabéns, Equipe(s) ${winningTeams.join(
        ", "
      )}! Vocês venceram com ${maxScore} ponto(s)!`
    );
  }
};

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute("data-character");
  const secondCharacter = secondCard.getAttribute("data-character");

  if (firstCharacter === secondCharacter) {
    // Acertou
    firstCard.firstChild.classList.add("disabled-card");
    secondCard.firstChild.classList.add("disabled-card");

    teamsScores[activeTeam - 1]++; // Incrementa a pontuação da equipe atual

    firstCard = "";
    secondCard = "";

    updateScoreDisplay();
    checkEndGame();
  } else {
    // Errou
    setTimeout(() => {
      firstCard.classList.remove("reveal-card");
      secondCard.classList.remove("reveal-card");

      firstCard = "";
      secondCard = "";

      // Passa para a próxima equipe
      activeTeam = (activeTeam % 4) + 1;

      // Remove a classe "active" de todas as equipes
      document.querySelectorAll(".team").forEach((team) => {
        team.classList.remove("active");
      });

      // Adiciona a classe "active" à equipe atual
      document
        .querySelector(`.team:nth-child(${activeTeam})`)
        .classList.add("active");
    }, 500);
  }
};

const revealCard = ({ target }) => {
  if (target.parentNode.className.includes("reveal-card")) {
    return;
  }

  if (firstCard === "") {
    target.parentNode.classList.add("reveal-card");
    firstCard = target.parentNode;
  } else if (secondCard === "") {
    target.parentNode.classList.add("reveal-card");
    secondCard = target.parentNode;
    checkCards();
  }
};

const createCard = (character, index) => {
  const card = createElement("div", "card"); // Cria um elemento <div> com a classe "card"
  const position = createElement("div", "card-position"); // Cria um elemento <div> com a classe "card-position"
  const front = createElement("div", "face front"); // Cria um elemento <div> com a classe "face front"
  const back = createElement("div", "face back"); // Cria um elemento <div> com a classe "face back"

  front.style.backgroundImage = `url('./images/${character}.png')`; // Define a imagem de fundo da face frontal

  card.appendChild(position); // Adiciona o elemento de posição como filho do elemento da carta
  card.appendChild(front); // Adiciona o elemento da face frontal como filho do elemento da carta
  card.appendChild(back); // Adiciona o elemento da face traseira como filho do elemento da carta

  card.addEventListener("click", revealCard); // Adiciona um ouvinte de evento de clique à carta para revelar a carta
  card.setAttribute("data-character", character); // Define o atributo "data-character" com o nome do personagem
  card.setAttribute(
    "data-position",
    `${letters[Math.floor(index / 8)]}${numbers[index % 8]}`
  ); // Define o atributo "data-position" com a posição da carta

  position.innerHTML = card.getAttribute("data-position"); // Define o conteúdo do elemento de posição como a posição da carta

  return card; // Retorna o elemento da carta criado
};

const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters]; // Duplica o array de personagens
  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5); // Embaralha o array

  shuffledArray.forEach((character, index) => {
    const card = createCard(character, index); // Cria uma carta com o personagem atual e o índice
    grid.appendChild(card); // Adiciona a carta ao elemento da grade
  });
};

window.onload = () => {
  updateScoreDisplay(); // Atualiza a exibição da pontuação
  loadGame(); // Carrega o jogo

  // Adiciona a classe "active" à equipe atual
  document
    .querySelector(`.team:nth-child(${activeTeam})`)
    .classList.add("active");
};
