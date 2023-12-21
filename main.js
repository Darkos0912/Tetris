import './style.css'

// 1. Inicializar el canvas
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const scorePoints = document.querySelector("span");
const section = document.querySelector("section");

const BLOCK_SIZE = 20;

const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;



// Crear la variable que contendrá los puntajes del juego.
let score = 0;
context.scale(BLOCK_SIZE, BLOCK_SIZE) // (x , y)

// 3. Board

const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT);

function createBoard(width, height){
    return Array(height).fill().map(()=>Array(width).fill(0))
}
// 4. Piece Player

const piece = {
    position: {
        x: 5,
        y: 5
    },
    shape: [
        [1, 1],
        [1, 1]
    ]
}

// 6. Random Pieces

const pieces = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ]

]

// 2. Game loop

/*function update(){
    draw();

    window.requestAnimationFrame(update)
}*/
let dropCounter = 0;
let lastTime = 0;

function update(time = 0){
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime

    if(dropCounter > 1000){
        piece.position.y++
        dropCounter = 0;
    }

    if(checkCollision()){
        piece.position.y--;
        solidifyPiece();
        removeRows();
    }
    draw();
    window.requestAnimationFrame(update);
}

function draw(){
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height); 

    board.forEach((row,y) => {
        row.forEach((value,x)=>{
            if(value == 1){
                context.fillStyle = "yellow";
                context.fillRect(x, y, 1, 1);
            }
        })
    })

    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value){
                context.fillStyle = "red";
                context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
            }
        })
    })

    scorePoints.innerText = score;

}

// 5. Move the piece

document.addEventListener("keydown", event => {
    if(event.key == "ArrowLeft"){
        piece.position.x--
        if(checkCollision()){
            piece.position.x++
        }
    }
    if(event.key == "ArrowRight"){
        piece.position.x++
        if(checkCollision()){
            piece.position.x--
        }
    }
    if(event.key == "ArrowDown"){
        piece.position.y++
        if(checkCollision()){
            piece.position.y--
            solidifyPiece();
            removeRows();
        }
    }
    if(event.key == "ArrowUp"){
        const rotated = [];
        for(let i=0; i<piece.shape[0].length; i++){
            const row = [];

            for(let j=piece.shape.length - 1; j>=0; j--){
                row.push(piece.shape[j][i]);
            }
            rotated.push(row);
        }
        const previousShape = piece.shape;
        piece.shape = rotated
        if(checkCollision()){
            piece.shape = previousShape;
        }
    }
})

// Función para detectar una colisión y hacer que la pieza evite salirse del campo del juego.
function checkCollision(){
    return piece.shape.find((row, y) => {
        return row.find((value, x) => {
            return (
                value !== 0 &&
                board[y + piece.position.y]?.
                [x + piece.position.x] !== 0
            )
        })
    })
}

// Función para que la pieza se solidifique y se acentúe en la posición final apenas toque el "suelo".
function solidifyPiece(){
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value == 1){
                board[y + piece.position.y][x + piece.position.x] = 1;
            }
        })
    })

    // Resetea la posición de la figura a caer.
    piece.position.x = 0;
    piece.position.y = 0;
    // Obtener una figura al azar, entre las que creamos en Random Pieces
    piece.shape = pieces[Math.floor(Math.random() * pieces.length)]

    // 7. Game Over
    if(checkCollision()){
        window.alert("Perdiste, Perdiste, no hay nadie peor que vos...");
        board.forEach((row) => row.fill(0))
    }
}

// Función para eliminar las lineas apenas se logre completar una linea entera por las piezas ubicadas.
function removeRows(){
    const rowsToRemove = [];

    board.forEach((row, y) => {
        if(row.every(value => value == 1)){
            rowsToRemove.push(y)
        }
    })

    rowsToRemove.forEach(y => {
        board.splice(y, 1);
        const newRow = Array(BOARD_WIDTH).fill(0);
        board.unshift(newRow);

        score += 50;
    })
}

section.addEventListener("click",()=>{

    section.remove();
    update();
    // Crear la variable que contendrá la música del juego.
    const audio = new Audio("./tetris.mp3");
    audio.volume = 0.5;
    audio.play();   
})

