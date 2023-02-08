// Función para mostrar el 'modal' del Login

var modal = document.getElementById('id01');

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Número de máximas puntuaciones a mostrar por pantalla (se puede modificar)

const NO_OF_HIGH_SCORES = 5;
const HIGH_SCORES = 'highScores';

// Llamada a la función que mostrará las máximas puntuaciones por pantalla

showHighScores();

// Variables que usaremos (comparamos la secuencia de la máquina con la humana...
// ...y si coinciden se suma +1 tanto al nivel como a la puntuación)

let sequence = [];
let humanSequence = [];
let level = 0;
let score = -1;
let frasecitas = new Array();

frasecitas[0] = "¡Objection!";
frasecitas[1] = "¡Que la Fuerza te acompañe!";
frasecitas[2] = "¡Smokin' Sexy Style!";
frasecitas[3] = "¡Hail to the king, baby!";
frasecitas[4] = "¡Nudosos son los caminos del Milagro!";
frasecitas[5] = "¡The cake is a lie!";

var longitud = frasecitas.length;
var numeroRandom = Math.round(Math.random()* longitud);



function mostrarRandomArray(){
  for (let i= frasecitas.length - 1; i >= 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    const temp = frasecitas[i];
    frasecitas[i] = frasecitas[j];
    frasecitas[j] = temp;
    info.textContent = (frasecitas[numeroRandom]);
  }
}
// Constantes que usaremos junto al CSS para dar estilo y animar distintas partes de la aplicación

const startButton = document.querySelector('.js-start');
const info = document.querySelector('.js-info');
const heading = document.querySelector('.js-heading');
const puntuacion = document.querySelector('.js-puntuacion');
const tileContainer = document.querySelector('.js-container');

// Función que reinicia varios parámetros al terminar la partida (GAME OVER)

function resetGame(text) {
  
  swal("Has perdido, vuelve a intentarlo",{
    buttons: "Terrible",
    // imageUrl: "https://pngimg.com/image/83351",
    // imageHeight:21
  });
  checkHighScore(score);
  sequence = [];
  humanSequence = [];
  level = 0;
  
  score = -1;
  startButton.classList.remove('hidden');
  heading.textContent = 'Slime Says';
  puntuacion.textContent = 'Puntuación: 0';
  info.classList.add('hidden');
  tileContainer.classList.add('unclickable');
}

// Función que permite al jugador hacer click en los botones del juego e iniciar su turno

function humanTurn(level) {
  tileContainer.classList.remove('unclickable');
  info.textContent = `Tu turno: ${level} Tap${level > 1 ? 's' : ''}`;
}

// Función que anima los botones al ser pulsados (tanto por el jugador como por la máquina)
// SetTimeout 300 son los milisegundos que tarda el botón en ser pulsado y volver a su estado original

function activateTile(color) {
  const tile = document.querySelector(`[data-tile='${color}']`);
  const sound = document.querySelector(`[data-sound='${color}']`);

  tile.classList.add('activated');
  sound.play();

  setTimeout(() => {
    tile.classList.remove('activated');
  }, 300);
}

// Turno de la máquina (y el tiempo que tarda para pulsar cada botón)
// Es necesario poner un tiempo prudencial para que los sonidos de las teclas no se pisen entre sí

function playRound(nextSequence) {
  nextSequence.forEach((color, index) => {
    setTimeout(() => {
      activateTile(color);
    }, (index + 1) * 600);
  });
}

// Esta función determina qué tecla pulsará la máquina a continuación

function nextStep() {
  const tiles = ['red', 'green', 'blue', 'yellow'];
  const random = tiles[Math.floor(Math.random() * tiles.length)];

  return random;
}

//Esta funcion lo que hace es iniciar otra ronda de juego
function nextRound() {
  level += 1;
  score += 1;
  //Esto hace que el botón no sea clicable durante la secuencia
  tileContainer.classList.add('unclickable');
  //Este mensaje sale mientras la ronda sigue su curso
  info.textContent = 'Espera a que termine la secuencia...';
  //Este mensaje te indica el nivel en el que te encuentras
  heading.textContent = `Nivel ${level}`;
  //Este mensaje te indica la puntuacion actual
  puntuacion.textContent = `Puntuación: ${score}`;

  //Esto lo que hace es llamar al array secuencia para iniciar la siguiente
  const nextSequence = [...sequence];
  //Aquí es donde se inicia el array de la siguiente secuencia
  nextSequence.push(nextStep());
  //La funcion lo que hace es iniciar la ronda y poner la secuencia correspondiente
  playRound(nextSequence);

  sequence = [...nextSequence];
  //Aquí se pone un delay desde que termina la secuencia hasta que inicia el turno del jugador 
  setTimeout(() => {
    humanTurn(level);
  }, level * 600 + 1000);
}

  //Esta funcion lo que hace es ponerle el sonido a las pulsaciones de los colores
function handleClick(tile) {
  const index = humanSequence.push(tile) - 1;
  const sound = document.querySelector(`[data-sound='${tile}']`);
  sound.play();
  //Esta constante sirve para ver la cantidad de toques que faltan hasta completar el nivel y mostrarlo en pantalla
  const remainingTaps = sequence.length - humanSequence.length;
  //Este condicional sirve para avisar de que la tecla pulsada es incorrecta, por lo tanto resetea el juego 
  if (humanSequence[index] !== sequence[index]) {
    resetGame();
    return;
  }
  //Este condicional sirve para indicar que la combinación de teclas ha sido correcta, por lo tanto continua el juego
  if (humanSequence.length === sequence.length) {
    humanSequence = [];
    mostrarRandomArray();
    setTimeout(() => {
      nextRound();
    }, 1000);
    return;
  }
  //La constante que se ha declarado antes para poner la cantidad restante de toques que quedan
  info.textContent = `Tu turno: ${remainingTaps} Tap${
    remainingTaps > 1 ? 's' : ''
  }`;
}
//Esta función lo que hace es empezar el primer turno del juego
function startGame() {
  //Pone en oculto el boton de inicio de juego
  startButton.classList.add('hidden');
  info.classList.remove('hidden');
  info.textContent = 'Espera a que termine la secuencia...';
  nextRound();
}
//Activa el inicio del juego cuando se pulsa el boton de inicio
startButton.addEventListener('click', startGame);
tileContainer.addEventListener('click', event => {
  const { tile } = event.target.dataset;

  if (tile) handleClick(tile);
});
//Esta funcion lo que hace es mostrar las puntuaciones maximas alcanzadas
function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const highScoreList = document.getElementById('highScores');
//Esto guarda el nombre y la puntuacion maxima
  highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.name} - (${score.score}p.)`)
    .join('');
}
//Esta funcion verifica que sea una puntuacion maxima
function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;
//Estp hace que salte una alerta si la puntuacion es mayor que una puntuacion maxima conseguida anteriormente
  if (score > lowestScore) {
    const name = prompt('¡Has conseguido un nuevo récord! Introduce tu nombre:');
    const newScore = { score, name };
    saveHighScore(newScore, highScores);
    showHighScores();
  }
}
//Esta funcion guarda las puntuaciones maximas 
function saveHighScore(score, highScores) {
  highScores.push(score);
  //Esta funcion ordena las puntuaciones comparando las conseguidas anteriormente con las nuevas
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);
//Esto convierte el int en una string para guardarlo en el localStorage
  localStorage.setItem('highScores', JSON.stringify(highScores));
}