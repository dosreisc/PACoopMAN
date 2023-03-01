
const DIRECTION = {
	UP: 'UP',
	DOWN: 'DOWN',
	RIGHT: 'RIGHT',
	LEFT: 'LEFT',
	NONE: 'NONE'
};

const OPPOSITE_DIRECTION = {
	UP: DIRECTION.DOWN,
	DOWN: DIRECTION.UP,
	RIGHT: DIRECTION.LEFT,
	LEFT: DIRECTION.RIGHT,
	NONE: DIRECTION.NONE
};

const SPEED = 0.05;
const MOVEMENT = {
	LEFT: { x: -1, y: 0 },
	RIGHT: { x: 1, y: 0 },
	UP: { x: 0, y: 1 },
	DOWN: { x: 0, y: -1 },
	NONE: { x: 0, y: 0 }
};

const KEYS = {
	ArrowLeft: DIRECTION.LEFT,
	ArrowRight: DIRECTION.RIGHT,
	ArrowUp: DIRECTION.UP,
	ArrowDown: DIRECTION.DOWN,
	Space: DIRECTION.NONE
};


var playerID = null;
const gameState = {
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

}

var scene;
var camera;
var renderer;
var player;
var enemies = [];
var foods = [];
var walls = [];
var plane;
var mapGenerator
var score = 0;
var enemies_spawns = []
const MAX_ENEMIES = 5;
var playing;
var paused;

const SIZE = 21;

function main() {
	mapGenerator = new MapGenerator();

	// init scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x3f3f3f);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 12;
	camera.position.x = 0;
	scene.add(camera);

	playing = true;
	paused = false;

	//create objects
	// load map from image 
	[plane, walls, foods, playerPos, path, enemies_spawns] = mapGenerator.generateMap("map1", scene);
	
	for (let i = 0; i < gameState.players.length; i++) {
		if (playerID == 0 &&  i == playerID) { // player is PAC MAN
			player = new Player(playerPos, gameState.players[i].color);
		}else if ( playerID != 0 && playerID == i ){ // Player is not pac man
			player = new Player(enemies_spawns[0], gameState.players[i].color);
		}else if (playerID != 0 && i == 0){ // pac man is coop player
			var coopPlayer = new CoopPlayer(playerPos, gameState.players[i].color)
			enemies.push(coopPlayer);
			scene.add(coopPlayer.getObject());
		}else {	
			var coopPlayer = new CoopPlayer(enemies_spawns[0], gameState.players[i].color)
			enemies.push(coopPlayer);
			scene.add(coopPlayer.getObject());
		}
		
	}

	scene.add(player.getObject());

	render();
}


function render() {

	if (!playing | paused) {
		requestAnimationFrame(render);
		return;
	}

	player.move(path, SPEED);
	enemies.forEach(enemy => {
		enemy.move(path, SPEED);
	});
	
	gameState.players[playerID].pos = player.getPosition();
	gameState.players[playerID].vel = player.getVel();

	// send state to server
	emitState(gameState, playerID);

	//checkCollision();
	if (playerID === 0){
		//emitState(gameState, playerID);
		checkCollisionFood();
	}
	
	
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

/**
 * Send game state to server from player perspective
 * @param {struct} state 
 */
function updateGameState(state) {
	//console.log(JSON.stringify(state));
	for (let i = 0, enemyCount = 0; i < state.players.length; i++ ) {
		if(i != playerID){
			enemies[enemyCount].setDirection(state.players[i].vel);
			let localEnemyPos = enemies[enemyCount].getPosition();
			let networkEnemyPos = state.players[i].pos;
			let deltaX = Math.abs(localEnemyPos.x - networkEnemyPos.x);
			let deltaY = Math.abs(localEnemyPos.y - networkEnemyPos.y);
			if (deltaX > 0.5  || deltaY > 0.5){
				enemies[enemyCount].setPosition(networkEnemyPos);
			}
			enemyCount++;
		}
		
	}
	// todo remove food

}

/*function spawnEnemy(){
	var geometry = new THREE.SphereGeometry(0.4);
	var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
	var enemy = new THREE.Mesh( geometry, material );
	var i = Math.floor(Math.random() * enemies_spawns.length);
	let {x,y} = enemies_spawns[i];
	enemy.position.x = x;
	enemy.position.y = y;
	scene.add(enemy);
	enemies.push(new Enemy(enemy));
}*/

function checkCollision() {
	let [playerX, playerY] = player.getCoordinates();
	enemies.forEach(enemy => {
		let [enemyX, enemyY] = enemy.getCoordinates();

		//console.log(playerX + ' ' + playerY + ' ' + enemyX + ' ' + enemyY);
		if (enemyX == playerX & enemyY == playerY) {
			playing = false;
			alert("GameOver! Press F5 to reload the game.");
		}
	});
}



window.addEventListener("keydown", function (event) {

	//change player direction
	if (KEYS[event.code]) {
		player.setDirection(KEYS[event.code]);
		paused = false;
		// TODO send gamestate
	}

	// zoom in
	if (event.code == "KeyI") {
		camera.position.z -= 0.5;
	}
	// zoom out
	if (event.code == "KeyO") {
		camera.position.z += 0.5;
	}

	/*if (event.code == "Escape"){
		paused = !paused;
		console.log("pause");
	}*/
});


// check player collision with food/special food and enemies
function checkCollisionFood() {
/**
 * problem with special s_food
 * If the s_food size is bigger than 0.1 it is automaticaly in collision with the player
 * might need to completely redo the checkCollisionFood function
 * 
 * also when going over the edge, the food on the same line/collumn as the player is in collision even tough it is not
 */
	var playerObj = player.getObject();
	var originPoint = playerObj.position.clone();
	/*var originPointFastForward = originPoint;
	let {x,y} = MOVEMENT[player.getDirection()];
	originPointFastForward.x += x;
	originPointFastForward.y += y; */
	for (var vertexIndex = 0; vertexIndex < playerObj.geometry.vertices.length; vertexIndex++) {
		var localVertex = playerObj.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4(playerObj.matrix);
		var directionVector = globalVertex.sub(playerObj.position);

		var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
		collisionResults = ray.intersectObjects(foods);
		if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {

			// remove food from list of foods and from scene
			var index = -1;
			for (let i = 0; i < foods.length; i++) {
				if (collisionResults[0].object.name === foods[i].name) {
					index = i;
				}
			}
			if (index >= 0) {
				foods.splice(index, 1);
				gameState.food[index] = 0;
			}
			console.log("food removed "+collisionResults[0].object.name)
			scene.remove(collisionResults[0].object);
			console.log("lenght " + foods.length);
			score++;
		}
	}
	if (foods.length == 0) {
		playing = false;
		alert("You win! Press F5 to reload the game.");
	}
}




Number.prototype.mod = function (n) {
	"use strict";
	return ((this % n) + n) % n;
};