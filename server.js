
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const fs = require("fs");
const url = require("url");

const io = require('socket.io')(server, { cors: { origin: "*" } });

const FRAME_RATE = 5;
const { makeid, loadMapData } = require('./utils');
//const { Console } = require('console');

const MAX_PLAYER_PER_ROOM = 3;
const gamesState = {};
const clientRooms = {};


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/frontend/index.html');
	//res.send('<h1>Hello world</h1>'); 
});

app.get('/solo', (req, res) => {
	res.sendFile(__dirname + '/frontend/solo.html');
})

app.get('/coop', (req, res) => {
	res.sendFile(__dirname + '/frontend/coop.html');
})

app.get('/image/:fileName', (req, res) => {
	var img = fs.readFileSync("./image/" + req.params.fileName);
	res.set('Content-Type', 'image/png');
	res.send(img);
})

/********************************** ROOTING FOR STATIC FILES IN SOLO MODE ********************************** */
app.get('/static/js/:fileName', (req, res) => {
	var filePath = "./static/js/lib/" + req.params.fileName;
	//if (fs.existsSync(filePath)) {
	var js = fs.readFileSync("./static/js/" + req.params.fileName, "utf8");
	res.set('Content-Type', 'text/javascript');
	res.send(js);
	//}else {
	//  res.status(404).send('<h1>404 Ressource not found </h1>');
	//}
})

app.get('/static/js/lib/:fileName', (req, res) => {
	var filePath = "./static/js/lib/" + req.params.fileName;
	//if (fs.existsSync(filePath)) {
	var js = fs.readFileSync(filePath, "utf8");
	res.set('Content-Type', 'text/javascript');
	res.send(js);
	//}else {
	//  res.status(404).send('<h1>404 Ressource not found </h1>');
	//}
})

/** ROOTING for map images */
app.get('/map/:mapID', (req, res) => {
	//var img = fs.readFileSync("./maps/"+req.params.mapID+".png");
	var imgPath = "./maps/" + req.params.mapID + ".png";
	var jsonPath = "./maps/" + req.params.mapID + ".json";
	// check for json map format
	if (fs.existsSync(jsonPath)) {
		let rawdata = fs.readFileSync(jsonPath);
		let json = JSON.parse(rawdata);
		res.set('Content-Type', 'application/json');
		res.status(200);
		res.send(json);
	} else if (fs.existsSync(imgPath)) {
		// read image and create json format from image
		var promise = loadMapData(imgPath);

		promise.then(function (promiseResult) {
			var map = promiseResult;
			var json = JSON.stringify(map);
			fs.writeFileSync(jsonPath, json);
			res.set('Content-Type', 'application/json');
			res.status(200);
			res.send(json);
		});
	} else {
		res.status(404).send('<h1>404 Ressource not found </h1>');
	}
})


server.listen(3000, () => {
	console.log('listening on port 3000..');
})


io.on('connection', client => {

	console.log("CLIENT CONNECTED");

	client.on('keydown', handleKeydown);
	client.on('newGame', handleNewGame);
	client.on('joinGame', handleJoinGame);
	client.on('playerState', handlePlayerState);

	/**
	 * 
	 * @param {string} roomName 
	 * @returns 
	 */
	async function handleJoinGame(roomName) {
		//check number of socket connected to a room
		let sockets = await io.in(roomName).allSockets();
		if (sockets.size === 0) {
			client.emit('unknownCode');
			return;
		} else if (sockets.size >= MAX_PLAYER_PER_ROOM) {
			client.emit('tooManyPlayers');
			return;
		}

		clientRooms[client.id] = roomName;
		client.emit('gameCode', roomName);
		client.join(roomName);
		clientRooms[client.id] = roomName;
		//sockets.size equals number of clients in room before actual client joins
		client.number = sockets.size; // id of player in room
		client.emit('playerID', client.number);
		//client.broadcast.to(roomName).emit('await', sockets.size + 1, roomName);
		io.in(roomName).emit('await', sockets.size + 1, roomName);

		// init game when room is full
		if (client.number == MAX_PLAYER_PER_ROOM - 1) {
			gamesState[roomName] = createGameState();
			io.in(roomName).emit('init');
		}


		startGameInterval(roomName);
	}
	function handleNewGame() {
		let roomName = makeid(5);
		clientRooms[client.id] = roomName;
		client.emit('gameCode', roomName);
		18361
		console.log("new game code " + roomName);
		//state[roomName] = initGame();
		client.emit('playerID', 0);
		client.join(roomName);
		client.number = 1;
		client.emit('await', 1, roomName);
	}

	/**
	 * 
	 * @param {struct} state state of the game from playerID
	 * @param {string} roomName game code of the room
	 * @param {int} playerID player in room
	 */
	function handlePlayerState(state, roomName, playerID) {
		if (!gamesState[roomName]) {
			return;
		}


		gamesState[roomName].players[playerID].pos = state.players[playerID].pos;
		gamesState[roomName].players[playerID].vel = state.players[playerID].vel;

		if (playerID === 0) {
			gamesState[roomName].food = state.food;
		}
		//braodcast to all client in room execpt sender
		//client.broadcast.to(roomName).emit('gameState', json.stringify(gamesState[roomName]));
		//io.in(roomName).emit('gameState', JSON.stringify(gamesState[roomName]));
	}

	function handleKeydown(keyCode) {
		Console.log("function handleKeydown");
		/*const roomName = clientRooms[client.id];
		if (!roomName) {
			return;
		}
		try {
			keyCode = parseInt(keyCode);
		} catch(e) {
			console.error(e);
			return;
		}

		const vel = getUpdatedVelocity(keyCode);

		if (vel) {
			state[roomName].players[client.number - 1].vel = vel;
		}*/
	}
	function emitGameOver(room, winner) {
		io.sockets.in(room)
			.emit('gameOver', JSON.stringify({ winner }));
	}

});

function startGameInterval(roomName) {
	const intervalId = setInterval(() => {
		if (gamesState[roomName]) {
			emitGameState(roomName, gamesState[roomName]);
		}
		/*const winner = gameLoop(state[roomName]);

		if (!winner) {
			emitGameState(roomName, state[roomName])
		} else {
			emitGameOver(roomName, winner);
			state[roomName] = null;
			clearInterval(intervalId);
		}*/

	}, 1000 / FRAME_RATE);
}

function emitGameState(roomName, state) {
	io.in(roomName).emit('gameState', state);
}




/**
 * 
 * @param {} pos1 
 * @param {*} pos2 
 * @param {*} pos3 
 * @returns players
 */
function createGameState() {
	return {
		playerID: 0,
		players: [{
			pos: {
				x: 0,
				y: 0,
			},
			vel: 'NONE',
			color: 0xffff00,
		}, {
			pos: {
				x: 0,
				y: 0,
			},
			vel: 'NONE',
			color: 0xff0000,
		}, {
			pos: {
				x: 0,
				y: 0,
			},
			vel: 'NONE',
			color: 0x7e15bf,
		}],
		food: [],
	};
}


const gameState = {


}