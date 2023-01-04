
const express = require('express');
//const GameManager = require('./static/js/GameManager');
//const Enemy = require('./static/js/Enemy');
//const Player = require('./static/js/Player');
//const MapGenerator = require('./static/js/MapGenerator');
const app = express();
const http = require('http');
const server = http.createServer(app);
const fs = require("fs");
const url = require("url");
const io = require('socket.io')();
const mime = require("mime");
//const { FRAME_RATE } = require('./constants');
const { makeid } = require('./utils');

//const state = {};
//const clientRooms = {};


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    //res.send('<h1>Hello world</h1>'); 
});

app.get('/solo', (req, res) => {
    res.sendFile(__dirname + '/solo/index.html');
})

/********************************** ROOTING FOR STATIC FILES IN SOLO MODE ********************************** */
app.get('/static/js/:fileName', (req, res) => {
    var js = fs.readFileSync("./static/js/"+ req.params.fileName, "utf8");
    res.set('Content-Type', 'text/javascript');
    res.send(js);
})
app.get('/static/js/lib/:fileName', (req, res) => {
    var js = fs.readFileSync("./static/js/lib/"+ req.params.fileName, "utf8");
    res.set('Content-Type', 'text/javascript');
    res.send(js);
})
/*
app.get('/static/js/Enemy.js', (req, res) => {
    var js = fs.readFileSync("./static/js/Enemy.js", "utf8");
    res.write(js);
})

app.get('/static/js/MapGenerator.js', (req, res) => {
    var js = fs.readFileSync("./static/js/MapGenerator.js", "utf8");
    res.write(js);
})

app.get('/static/js/GameManager.js', (req, res) => {
    var js = fs.readFileSync("./static/js/GameManager.js", "utf8");
    res.write(js);
})

app.get('/static/js/lib/jquery-3.4.1.slim.min.js', (req, res) => {
    var js = fs.readFileSync("./static/js/lib/jquery-3.4.1.slim.min.js", "utf8");
    res.write(js);
})

app.get('/static/js/lib/three.js', (req, res) => {
    var js = fs.readFileSync("./static/js/lib/three.js", "utf8");
    res.write(js);
})*/

server.listen(3000, () => {

    //rooter for javascript staticfile for client side
    //var pathname = url.parse(request.url).pathname;
    //console.log("Resquest for " + pathname + "received");


    console.log('listening on port 3000..');
})
/*io.listen(process.env.PORT || 3000,() => {
    console.log('listening on port '+ process.env.PORT.toString() +' or 3000');
});*/

/*io.on('connection', client => {

    //client.on('keydown', handleKeydown);
    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);

    function handleJoinGame(roomName) {
        const room = io.sockets.adapter.rooms[roomName];
    
        let allUsers;
        if (room) {
          allUsers = room.sockets;
        }
    
        let numClients = 0;
        if (allUsers) {
          numClients = Object.keys(allUsers).length;
        }
    
        if (numClients === 0) {
          client.emit('unknownCode');
          return;
        } else if (numClients > 1) {
          client.emit('tooManyPlayers');
          return;
        }
    
        clientRooms[client.id] = roomName;
    
        client.join(roomName);
        client.number = 2;
        client.emit('init', 2);
        
        startGameInterval(roomName);
    }
    function handleNewGame() {
        let roomName = makeid(5);
        clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName);

        state[roomName] = initGame();

        client.join(roomName);
        client.number = 1;
        client.emit('init', 1);
    }

    function handleKeydown(keyCode) {
        const roomName = clientRooms[client.id];
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
        }
    }
});

function startGameInterval(roomName) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomName]);
        
        if (!winner) {
        emitGameState(roomName, state[roomName])
        } else {
        emitGameOver(roomName, winner);
        state[roomName] = null;
        clearInterval(intervalId);
        }
    }, 1000 / FRAME_RATE);
}

function emitGameOver(room, winner) {
    io.sockets.in(room)
      .emit('gameOver', JSON.stringify({ winner }));
}

*/


