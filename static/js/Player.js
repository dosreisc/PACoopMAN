class Player {
	constructor(obj) {
		this.object = obj;
		this.direction = DIRECTION.NONE;
		this.newDirection = DIRECTION.NONE;

	}

	createObject(object) {
		var geometry = new THREE.SphereGeometry(0.4);
		var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
		player = new THREE.Mesh(geometry, material);
		player.position.x = -x + (SIZE - 1) / 2;
		player.position.y = -y + (SIZE - 1) / 2;
		player.name = "Player";
	}

	move(path) {
		let { x, y } = MOVEMENT[this.direction];
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



		// TODO
		//autoriser les movement uniquement lorsque la position x et y est très proche de nombre entier
		if ((Math.abs(posX) % 1 < 0.05 | Math.abs(posX) % 1 > 0.95)
			& (Math.abs(posY) % 1 < 0.05 | Math.abs(posY) % 1 > 0.95)) {


			// postion to coordinates
			let [x, y] = this.getCoordinates();

			// check if direction can be changed according to path
			if (this.newDirection != this.direction) {
				var nextBox = -1;
				// check if a path is available (not a wall) in the new direction
				switch (this.newDirection) {
					case DIRECTION.DOWN:
						nextBox = path[(y + 1).mod(SIZE)][x];
						break;
					case DIRECTION.UP:
						nextBox = path[(y - 1).mod(SIZE)][x];
						break;
					case DIRECTION.LEFT:
						nextBox = path[y][(x - 1).mod(SIZE)];
						break;
					case DIRECTION.RIGHT:
						nextBox = path[y][(x + 1).mod(SIZE)];
						break;
					case DIRECTION.NONE:
						this.direction = this.newDirection;
						break;
				}

				if (nextBox == 1) {
					//change direction
					this.direction = this.newDirection;
				}
			}

			var nextBox;
			// check collision with wall
			switch (this.direction) {
				case DIRECTION.DOWN:
					nextBox = path[(y + 1).mod(SIZE)][x];
					break;
				case DIRECTION.UP:
					nextBox = path[(y - 1).mod(SIZE)][x];
					break;
				case DIRECTION.LEFT:
					nextBox = path[y][(x - 1).mod(SIZE)];
					break;
				case DIRECTION.RIGHT:
					nextBox = path[y][(x + 1).mod(SIZE)]
					break;
			}
			if (nextBox == 0) {
				//change direction
				this.direction = DIRECTION.NONE;
			}
		}
	}

	setDirection(dir) {
		// postion to coordinates
		this.newDirection = dir;
		//this.direction = dir;
	}

	getObject() {
		return this.object;
	}

	getDirection() {
		return this.direction;
	}

	// position to coordinate in map array
	getCoordinates() {
		var posX = this.object.position.x;
		var posY = this.object.position.y;
		let x = Math.round(posX + SIZE / 2 - 0.5);
		let y = (Math.round(posY - SIZE / 2 - 0.5) * -1) - 1;
		return [x, y];
	}

}