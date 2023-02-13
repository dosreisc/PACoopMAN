const socket = io("http://127.0.0.1:3000");

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);

const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

function newGame() {
    alert("New Game");
    socket.emit('newGame');
    //init();
}

function joinGame(){
    const code = gameCodeInput.value;
    console.log(code);
    if (code){
        alert("Invalid Game Code");
    }else{
        socket.emit('joinGame');
    }
}

function handleInit(){
    addEventListener('keydown', keydown);
}

function keydown(e){
    console.log(e.keyCode);
    socket.emit('keydown', e.keyCode);
}

function handleGameState(){

}

function handleGameOver(){

}

function handleGameCode(){

}

function handleUnknownCode (){

}

function handleTooManyPlayers(){

}