
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
	LEFT: { x: -SPEED, y: 0 },
	RIGHT: { x: SPEED, y: 0 },
	UP: { x: 0, y: SPEED },
	DOWN: { x: 0, y: -SPEED },
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
		vel: {
			x: 0,
			y: 0,
		},
		color: 0xffff00,
	}, {
		pos: {
			x: 0,
			y: 0,
		},
		vel: {
			x: 0,
			y: 0,
		},
		color: 0xff0000,
	}, {
		pos: {
			x: 0,
			y: 0,
		},
		vel: {
			x: 0,
			y: 0,
		},
		color: 0x00ff00,
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
	//player = new Player(playerObj);
	var playerObj= null;
	if (playerID == 0) {
		playerObj = createPlayerObj(playerPos);
	}else {
		playerObj = createPlayerObj(enemies_spawns[0]);
	}
	player = new Player(playerObj);
	scene.add(playerObj);
	// spawn enemies
	/*for (let i = 0; i < MAX_ENEMIES; i++) {
		spawnEnemy();
	}*/

	//render();

	// send map Loaded
	render();
}


function render() {

	if (!playing | paused) {
		requestAnimationFrame(render);
		return;
	}

	player.move(path);


	/*enemies.forEach(enemy => {
		enemy.move(path);
	});*/

	//checkCollision();
	//checkCollisionFood();
	// TODO  send state to server
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

/**
 * Send game state to server from player perspective
 * @param {struct} gameState 
 */
function updateGameState(gameState) {

}

function createPlayerObj(pos) {
	var geometry = new THREE.SphereGeometry(0.4);
	var material = new THREE.MeshBasicMaterial({ color: gameState.players[playerID].color });
	obj = new THREE.Mesh(geometry, material);
	obj.position.x = pos.x;
	obj.position.y = pos.y;
	obj.name = "Player";
	return obj;
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
			}
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



class CoopPlayer {
	constructor(obj) {
		this.object = obj;
		this.direction = DIRECTION.NONE;
	}
	move(path) {
		let { x, y } = MOVEMENT[this.direction];
		//move 
		this.object.position.x += x;
		this.object.position.y += y;


		var posX = this.object.position.x;
		var posY = this.object.position.y;


		// check for edge -> loop
		if (posX > SIZE / 2 | posX < SIZE / 2 * (-1)) {
			this.object.position.x *= -1;
		}
		if (posY > SIZE / 2 | posY < SIZE / 2 * (-1)) {
			this.object.position.y *= -1;
		}
	}

	getCoordinates() {
		var posX = this.object.position.x;
		var posY = this.object.position.y;
		let x = Math.round(posX + SIZE / 2 - 0.5);
		let y = (Math.round(posY - SIZE / 2 - 0.5) * -1) - 1;
		return [x, y];
	}

	getDirection() {
		return this.direction;
	}

	getObject() {
		return this.object;
	}
}




Number.prototype.mod = function (n) {
	"use strict";
	return ((this % n) + n) % n;
};