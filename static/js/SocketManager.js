const socket = io("http://127.0.0.1:3000");

socket.on('init', handleInit);
socket.on('startGame', handleStartGame);
socket.on('playerID', handlePlayerID);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('await', handleWaiting);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('error', handleMessage);

const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const formularDiv = document.getElementById('formularDiv');
const loadingDiv = document.getElementById('loadingDiv');
const gameCodeText = document.getElementById('gameCodeText');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

let GAME_CODE = null;

socket.on("connect_error", (err) => {
	createMessage(1, err.message);
	//console.log(`connect_error due to ${err.message}`);
});

function newGame() {
	socket.emit('newGame');
}

function joinGame() {
	const code = gameCodeInput.value;
	console.log("code is " + code);
	if (!code) {
		alert("Invalid Game Code");
	} else {
		socket.emit('joinGame', code);
	}
}

function handleInit() {
	loadingDiv.style.setProperty('display', 'none', 'important');
	createMessage(0, "Initialising game !!!");
	main(); // GameManager.main()
	//addEventListener('keydown', keydown);
}

function handleStartGame() {
	render(); // CoopGameManager.render();
}

function keydown(e) {
	console.log(e.keyCode);
	socket.emit('keydown', e.keyCode);
}

function handleGameState(state) {
	updateGameState(state); // CoopGameManager.updateGameState()
}

function emitState(gameState, id){
	socket.emit('playerState', gameState,  GAME_CODE, id);
}

function handleGameOver() {

}

function handleGameCode(gameCode) {
	console.log("TODO game code " + gameCode);
	GAME_CODE = gameCode;
}
/**
 * 
 * @param {int} numPlayers number of player in room
 * @param {string} roomname game code / room name for the server
 * @param {int} id player id in current game
 */
function handleWaiting(numPlayers, roomname) {
	console.log("waiting " + numPlayers + " " + roomname);
	formularDiv.style.setProperty('display', 'none', 'important');
	loadingDiv.style.setProperty('display', 'block');
	gameCodeText.innerHTML = "Your game code is " + roomname + "<br>Waiting for more players... " + numPlayers + "/3";
}

function handlePlayerID(id) {
	console.log("Player id " + id);
	playerID = id;
}

function handleUnknownCode() {
	createMessage(1, "The code provided is unknown. Check it and try again..");
}

function handleTooManyPlayers() {
	createMessage(1, "Too many players in this room");
}
/**
 * 
 * @param {bool} error 
 * @param {string} message 
 */
function handleMessage(error, message) {
	createMessage(error, message);
}


function emitMapLoaded() {

}

/**
 * 
 * @param {bool} error 
 * @param {string} message 
 */
function createMessage(error, message) {
	const msg = document.createElement("div");
	msg.classList.add("alert-box");
	if (error) {
		msg.classList.add("failure");
	} else {
		msg.classList.add("success");
	}
	msg.innerHTML = message;
	document.body.appendChild(msg);
	setTimeout(function () {
		msg.remove();
	}, 6000);
}

