class Enemy {
    constructor(obj) {
        this.object = obj;
        this.direction = DIRECTION.NONE;
    }

    move(path){
        let { x, y } = MOVEMENT[this.direction];
        //move 
        this.object.position.x += x;
        this.object.position.y += y;

        
        var posX = this.object.position.x;
        var posY = this.object.position.y;

        
        // check for edge -> loop
        if(posX > SIZE /2 | posX < SIZE /2 * (-1)){
            this.object.position.x *= -1;
        }
        if(posY > SIZE /2 | posY < SIZE /2 * (-1)){
            this.object.position.y *= -1;
        }
        
        //autoriser les movement uniquement lorsque la position x et y est très proche de nombre entier
        if((Math.abs(posX) % 1 < 0.05 | Math.abs(posX) % 1 > 0.95)
            & (Math.abs(posY) % 1 < 0.05 | Math.abs(posY) % 1 > 0.95)) { 

            // postion to coordinates
            let [x,y] = this.getCoordinates();

            
            var directions =  this.getPossibleDirections(x,y,path);
            // 10% chance to change direction if 2 directions available
            if (directions.length == 2 & Math.floor(Math.random()*10) == 0){
                this.changeDirection(directions, false);
            }

            // 25% chance to change direction if 3 directions available
            if (directions.length == 3 & Math.floor(Math.random()*3) == 0){
                this.changeDirection(directions, false);
            }

            // 50% chance to change direction if 4 directions available
            if (directions.length == 4 & Math.floor(Math.random()) == 0){
                this.changeDirection(directions,false);
            }
            

            var nextBox;
            // check collision with wall
            switch(this.direction){
                case DIRECTION.DOWN:
                    nextBox = path[(y+1)%SIZE][x];
                    break;
                case DIRECTION.UP:
                    nextBox = path[(y-1)%SIZE][x];
                    break;
                case DIRECTION.LEFT:
                    nextBox = path[y][(x-1)%SIZE];
                    break;
                case DIRECTION.RIGHT:
                    nextBox = path[y][(x+1)%SIZE]
                    break;
                case DIRECTION.NONE:
                    nextBox = 0;
                    break;
            }
            if (nextBox == 0){ 
                // a collision occured with a wall-> change direction (it can be opposite direction)
                this.changeDirection(directions, true);
            }
        }
    }

    getPossibleDirections(x,y, path){
        // look for possible directions from actual position 
        var possibleDirections = []
        if (path[(y+1)%SIZE][x] == 1){
            possibleDirections.push(DIRECTION.DOWN);
        }
        if (path[(y-1)%SIZE][x] == 1){
            possibleDirections.push(DIRECTION.UP);
        }
        if (path[y][(x-1)%SIZE] == 1){
            possibleDirections.push(DIRECTION.LEFT);
        }
        if (path[y][(x+1)% SIZE] == 1){
            possibleDirections.push(DIRECTION.RIGHT);
        }

        return possibleDirections;
    }

    getCoordinates(){
        var posX = this.object.position.x;
        var posY = this.object.position.y;
        let x = Math.round(posX + SIZE/2 - 0.5);
        let y = (Math.round(posY - SIZE/2 - 0.5) * -1) -1;
        return [x,y];
    }

    changeDirection(directions, allowOpposite){
        var newDirection ;
        if (allowOpposite == false){ // the new direction must not be the opposite direction of the actual direction
            do{
                newDirection = directions[ Math.floor(Math.random()*directions.length) ];
            }while( newDirection == OPPOSITE_DIRECTION[this.direction]);
        }else{
            newDirection = directions[ Math.floor(Math.random()*directions.length) ];
        }
        this.direction = newDirection;
    }

    getDirection(){
        return this.direction;
    }

    getObject(){
        return this.object;
    }

}