const socket = io("http://127.0.0.1:3000");

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('await', handleWaiting);
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
    socket.emit('newGame');
    //init();
}

function joinGame(){
    const code = gameCodeInput.value;
    console.log("code is " +code);
    if (!code){
        alert("Invalid Game Code");
    }else{
        socket.emit('joinGame', code);
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

function handleGameCode(gameCode){
    console.log("TODO game code " + gameCode);
}

function handleWaiting(){
    console.log("waiting");
}

function handleUnknownCode (){
    console.log("todo unknow code");
}

function handleTooManyPlayers(){
    console.log("todo too Many Players");
}