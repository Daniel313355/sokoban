// Representación del mapa del juego
const gameMap = [
    ['#', '#', '#', '#', '#'],
    ['#', '.', '#', ' ', '#'],
    ['#', ' ', '@', ' ', '#'],
    ['#', '$', '#', '.', '#'],
    ['#', '#', '#', '#', '#']
];

// Elementos del juego
const player = '@';
const box = '$';
const target = '.';

// Variables
let playerPosition = { x: 2, y: 2 }; // Posición inicial del jugador
const gameContainer = document.getElementById('game-container');

// Función para dibujar el mapa
function drawGame() {
    gameContainer.innerHTML = '';
    for (let y = 0; y < gameMap.length; y++) {
        for (let x = 0; x < gameMap[y].length; x++) {
            const cell = document.createElement('div');
            const tile = gameMap[y][x];
            
            // Establecer el contenido visual de cada celda
            if (tile === '#') {
                cell.style.backgroundColor = 'black'; // Pared
            } else if (tile === player) {
                cell.style.backgroundColor = 'blue'; // Jugador
            } else if (tile === box) {
                cell.style.backgroundColor = 'brown'; // Caja
            } else if (tile === target) {
                cell.style.backgroundColor = 'green'; // Objetivo
            } else {
                cell.style.backgroundColor = 'white'; // Espacio vacío
            }

            cell.style.width = '50px';
            cell.style.height = '50px';
            cell.style.border = '1px solid #ccc';
            gameContainer.appendChild(cell);
        }
    }
}

// Función para mover al jugador
function move(direction) {
    const newPosition = { ...playerPosition };

    if (direction === 'up') newPosition.y -= 1;
    if (direction === 'down') newPosition.y += 1;
    if (direction === 'left') newPosition.x -= 1;
    if (direction === 'right') newPosition.x += 1;

    if (isMoveValid(newPosition)) {
        gameMap[playerPosition.y][playerPosition.x] = ' ';
        playerPosition = newPosition;
        gameMap[playerPosition.y][playerPosition.x] = player;
        
        // Guardar el nuevo estado del jugador en Firebase
        savePlayerState();
        drawGame();
    }
}

// Comprobar si el movimiento es válido
function isMoveValid(newPosition) {
    const tile = gameMap[newPosition.y][newPosition.x];
    
    if (tile === '#' || tile === '$') {
        return false; // No puede moverse a una pared o a una caja
    }
    
    return true;
}

// Función para guardar el estado del jugador en Firebase
function savePlayerState() {
    const playerData = {
        x: playerPosition.x,
        y: playerPosition.y
    };
    const playerRef = database.ref('playerState');
    playerRef.set(playerData);
}

// Función para cargar el estado del jugador desde Firebase
function loadPlayerState() {
    const playerRef = database.ref('playerState');
    playerRef.once('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            playerPosition = { x: data.x, y: data.y };
            gameMap[playerPosition.y][playerPosition.x] = player;
            drawGame();
        }
    });
}

// Cargar el estado del jugador al iniciar el juego
loadPlayerState();

// Iniciar el juego
drawGame();
