const bandeiras = [
  { nome: "Brasil", imagem: "https://flagcdn.com/w320/br.png" },
  { nome: "Argentina", imagem: "https://flagcdn.com/w320/ar.png" },
  { nome: "Portugal", imagem: "https://flagcdn.com/w320/pt.png" },
  { nome: "França", imagem: "https://flagcdn.com/w320/fr.png" },
  { nome: "Japão", imagem: "https://flagcdn.com/w320/jp.png" },
  { nome: "Canadá", imagem: "https://flagcdn.com/w320/ca.png" },
  { nome: "Itália", imagem: "https://flagcdn.com/w320/it.png" },
  { nome: "Alemanha", imagem: "https://flagcdn.com/w320/de.png" },
  { nome: "Espanha", imagem: "https://flagcdn.com/w320/es.png" },
  { nome: "México", imagem: "https://flagcdn.com/w320/mx.png" },
  { nome: "Nigéria", imagem: "https://flagcdn.com/w320/ng.png" },
  { nome: "Coreia do Sul", imagem: "https://flagcdn.com/w320/kr.png" }
];

const curiosidades = [
  { nome: "Brasil", texto: "O Brasil é o maior país da América do Sul e o quinto maior do mundo." },
  { nome: "Argentina", texto: "A Argentina é famosa pelo tango, uma dança que se originou em Buenos Aires." },
  { nome: "Portugal", texto: "Portugal é conhecido por suas belas praias e vinhos, especialmente o vinho do Porto." },
  { nome: "França", texto: "A França é famosa pela Torre Eiffel e pela sua rica história cultural." },
  { nome: "Japão", texto: "O Japão é conhecido por sua tecnologia avançada e cultura milenar." },
  { nome: "Canadá", texto: "O Canadá é o segundo maior país do mundo e é conhecido por suas paisagens naturais." },
  { nome: "Itália", texto: "A Itália é famosa por sua culinária, arte e história, incluindo o Coliseu." },
  { nome: "Alemanha", texto: "A Alemanha é conhecida por sua engenharia e pela Oktoberfest, a maior festa da cerveja do mundo." },
  { nome: "Espanha", texto: "A Espanha é famosa por suas festas vibrantes e pela arquitetura de Gaudí." },
  { nome: "México", texto: "O México é conhecido por sua rica cultura, incluindo a culinária e as tradições indígenas." },
  { nome: "Nigéria", texto: "A Nigéria é o país mais populoso da África e tem uma rica diversidade cultural." },
  { nome: "Coreia do Sul", texto: "A Coreia do Sul é famosa por sua cultura pop, incluindo K-Pop e dramas." }
];

let nivel = 1;
let pontuacao = 0;
let sequencia = [];
let acertosAtual = 0;
let jogoAtivo = false;

let ordemAtualIndex = 0;

const game = document.getElementById("game");
const startButton = document.getElementById("start-button");
const levelInfo = document.getElementById("level");
const timerBar = document.getElementById("timer-bar");
const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const successSound = document.getElementById("success-sound");
const failSound = document.getElementById("fail-sound");

const introContainer = document.getElementById("intro-container");
const speechBubble = document.getElementById("speech-bubble");

startButton.onclick = reiniciarJogo;

function iniciarNivel() {
  jogoAtivo = true;
  acertosAtual = 0;
  ordemAtualIndex = 0; // reset para nível 9+
  startButton.classList.add("hidden");
  resultScreen.classList.add("hidden");
  timerBar.style.animation = "none";
  void timerBar.offsetWidth;
  timerBar.style.animation = "timerAnimation 5s linear forwards";

  levelInfo.textContent = nivel;

  if (nivel === 9) {
    introContainer.style.display = "block";
    speechBubble.innerHTML = "Parabéns! Você chegou no nível 9!<br>Agora você deve selecionar as bandeiras por ordem crescente.";
    setTimeout(() => {
      introContainer.style.display = "none";
      prepararSequenciaNivel9(); // crescente
    }, 10000);
  } else if (nivel === 20) {
    introContainer.style.display = "block";
    speechBubble.innerHTML = "Parabéns! Que orgulho!<br>Agora selecione as bandeiras em ordem decrescente.";
    setTimeout(() => {
      introContainer.style.display = "none";
      prepararSequenciaNivel20(); // decrescente
    }, 10000);
  } else if (nivel > 9 && nivel < 20) {
    prepararSequenciaNivel9(); // crescente
  } else if (nivel > 20) {
    prepararSequenciaNivel20(); // decrescente
  } else {
    sequencia = embaralhar([...bandeiras]).slice(0, nivel + 2);
    mostrarSequencia(sequencia);
    setTimeout(() => {
      mostrarOpcoes();
    }, 5000);
  }
}

function prepararSequenciaNivel9() {
  sequencia = embaralhar([...bandeiras]).slice(0, nivel + 2);
  sequencia.sort((a, b) => a.nome.localeCompare(b.nome));

  mostrarSequencia(sequencia);
  setTimeout(() => {
    mostrarOpcoesNivel9();
  }, 5000);
}

function mostrarSequencia(lista) {
  game.innerHTML = "";
  lista.forEach((pais) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="${pais.imagem}" /><p>${pais.nome}</p>`;
    game.appendChild(div);
  });
}

function mostrarOpcoes() {
  game.innerHTML = "";
  let extrasCount = 6;
  if (nivel >= 8) {
    extrasCount = Math.min(12, bandeiras.length - sequencia.length);
  }

  const opcoes = embaralhar([
    ...sequencia,
    ...embaralhar(bandeiras.filter(p => !sequencia.includes(p))).slice(0, extrasCount)
  ]);

  opcoes.forEach((pais) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="${pais.imagem}" /><p>${pais.nome}</p>`;
    div.onclick = () => verificarResposta(pais, div);
    game.appendChild(div);
  });
}

function mostrarOpcoesNivel9() {
  game.innerHTML = "";
  const opcoes = embaralhar([
    ...sequencia,
    ...embaralhar(bandeiras.filter(p => !sequencia.includes(p))).slice(0, 6)
  ]);

  opcoes.forEach((pais) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="${pais.imagem}" /><p>${pais.nome}</p>`;
    div.onclick = () => verificarRespostaNivel9(pais, div);
    game.appendChild(div);
  });
}

function verificarResposta(paisEscolhido, cardElement) {
  if (!jogoAtivo) return;

  const estaCorreto = sequencia.find(p => p.nome === paisEscolhido.nome);
  if (estaCorreto) {
    pontuacao++;
    acertosAtual++;
    successSound.play();
    cardElement.style.background = "#b5f7d4";
    cardElement.onclick = null;

    if (acertosAtual === sequencia.length) {
      mostrarCuriosidade(paisEscolhido); // Mostrar curiosidade
    }
  } else {
    fimDeJogo();
  }
}

function verificarRespostaNivel9(paisEscolhido, cardElement) {
  if (!jogoAtivo) return;

  const paisEsperado = sequencia[ordemAtualIndex];

  if (paisEscolhido.nome === paisEsperado.nome) {
    pontuacao++;
    acertosAtual++;
    ordemAtualIndex++;
    successSound.play();
    cardElement.style.background = "#b5f7d4";
    cardElement.onclick = null;

    if (acertosAtual === sequencia.length) {
      mostrarCuriosidade(paisEsperado); // Mostrar curiosidade
    }
  } else {
    fimDeJogo();
  }
}

function verificarRespostaNivel20(paisEscolhido, cardElement) {
  if (!jogoAtivo) return;

  const paisEsperado = sequencia[ordemAtualIndex];

  if (paisEscolhido.nome === paisEsperado.nome) {
    pontuacao++;
    acertosAtual++;
    ordemAtualIndex++;
    successSound.play();
    cardElement.style.background = "#b5f7d4";
    cardElement.onclick = null;

    if (acertosAtual === sequencia.length) {
      mostrarCuriosidade(paisEsperado); // Mostrar curiosidade
    }
  } else {
    fimDeJogo();
  }
}

function mostrarCuriosidade(pais) {
  const curiosidade = curiosidades.find(c => c.nome === pais.nome);
  if (curiosidade) {
    introContainer.style.display = "block";
    speechBubble.innerHTML = `<img src="${pais.imagem}" /><p>${curiosidade.texto}</p>`;
    
    setTimeout(() => {
      introContainer.style.display = "none";
      nivel++;
      iniciarNivel();
    }, 10000); // Exibe por 10 segundos
  }
}

function fimDeJogo() {
  jogoAtivo = false;
  failSound.play();
  game.innerHTML = "";

  resultScreen.classList.remove("hidden");
  finalScore.textContent = pontuacao;

  startButton.textContent = "Jogar Novamente";
  startButton.classList.remove("hidden");
}

function reiniciarJogo() {
  nivel = 1;
  pontuacao = 0;
  successSound.play();
  iniciarNivel();
}

function embaralhar(arr) {
  let array = arr.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

setTimeout(() => {
  const intro = document.getElementById("intro-container");
  if (intro) {
    intro.style.display = "none";
  }
}, 10000);

function prepararSequenciaNivel20() {
  sequencia = embaralhar([...bandeiras]).slice(0, nivel + 2);
  sequencia.sort((a, b) => b.nome.localeCompare(a.nome)); // decrescente

  mostrarSequencia(sequencia);
  setTimeout(() => {
    mostrarOpcoesNivel20(); // opções para selecionar na ordem decrescente
  }, 5000);
}

function mostrarOpcoesNivel20() {
  game.innerHTML = "";
  const opcoes = embaralhar([
    ...sequencia,
    ...embaralhar(bandeiras.filter(p => !sequencia.includes(p))).slice(0, 6)
  ]);

  opcoes.forEach((pais) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<img src="${pais.imagem}" /><p>${pais.nome}</p>`;
    div.onclick = () => verificarRespostaNivel20(pais, div);
    game.appendChild(div);
  });
}
