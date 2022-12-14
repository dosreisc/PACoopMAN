
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')();
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


server.listen(3000, () => {
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


