function convert2Dto1D(x, y, sz){
    return (y * sz) + x;
}

class MapGenerator {

    constructor() {}


    generateMap(id, scene) {
        var map;
        
        var walls = [];
        var foods = [];
        var path = [];
        var enemies_spawn_zones = [];
        var player;

        var map_content = [];

        // create ground 
        var geometry = new THREE.PlaneGeometry( SIZE, SIZE );
        var material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material );
        scene.add(plane);
        plane.position.z -= 0.5;

        // send synchronous request
        var request = new XMLHttpRequest();
        //request.overrideMimeType("application/json");
        request.open('GET', '/get/map/'+id+'/', false);  // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
            map_content = JSON.parse(request.responseText);
        }else {
            alert(request.responseText);
        }


        // loop through map content in 2 dimension to prepare to position walls in ground
        let i = 0;
        let offsetX, offsetY, wallWidth, wallHeight, wallPosX, wallPosY;
        for (let y = 0; y < SIZE; y++) {
            path.push([]);
            for (let x = 0; x < SIZE; x++) {
                i = convert2Dto1D(x,y,SIZE);
                
                switch (map_content[i]){ // 
                    case "WALL":
                        offsetX = 1;
                        offsetY = 1;
                        wallWidth = 1;
                        wallHeight = 1;
                        wallPosX = x;
                        wallPosY = y;

                        path[y].push(0); //define path

                        map_content[i] = 'WALL_DONE' ; //prevent from creating 2 walls at the same spot
                        
                        // check for a horizontal line of wall
                        while (map_content[convert2Dto1D(x + offsetX, y,SIZE)] == 'WALL' & (x + offsetX) < SIZE){
                            map_content[convert2Dto1D(x + offsetX, y,SIZE)] = 'WALL_DONE';
                            wallWidth++;
                            offsetX++;
                        }

                        //check for a vertical line of wall only if it was not a horizonatl wall
                        while (wallWidth <= 1 & map_content[convert2Dto1D(x, y + offsetY,SIZE)] == 'WALL' & (y + offsetY) < SIZE){
                            map_content[convert2Dto1D(x, y + offsetY,SIZE)] = 'WALL_DONE';
                            wallHeight++;
                            offsetY++;
                        }

                        //create wall object
                        var geometry = new THREE.BoxGeometry( wallWidth, wallHeight ,0.6);
                        var material = new THREE.MeshBasicMaterial( {color: 0x0000FF} );
                        var wall = new THREE.Mesh( geometry, material );
                        // re-position coreectly
                        wall.position.x = -wallPosX - wallWidth/2 + (SIZE)/2 ;
                        wall.position.y = -wallPosY - wallHeight/2 + (SIZE)/2 ;
                        // add to scene
                        scene.add(wall);
                        walls.push(wall);
                        break;

                    case "FOOD":
                        var geometry = new THREE.SphereGeometry(0.1);
                        var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
                        var food = new THREE.Mesh( geometry, material );
                        food.name = "food" + foods.length;
                        food.position.x = -x + (SIZE - 1)/2;
                        food.position.y = -y + (SIZE - 1)/2;
                        
                        scene.add(food);
                        foods.push(food);

                        path[y].push(1); //define path
                        break;

                    case "S_FOOD":
                        // special foo object spawn
                        var geometry = new THREE.SphereGeometry(0.2);
                        var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
                        var food = new THREE.Mesh( geometry, material );
                        food.name = "s_food" + foods.length;
                        food.position.x = -x + (SIZE - 1)/2;
                        food.position.y = -y + (SIZE - 1)/2;
                        scene.add(food);
                        foods.push(food);
                        path[y].push(1); //define path
                        break;

                    case "":
                        path[y].push(1);
                        break;

                    case "SPAWN_E":
                        var spawnX = (-x + (SIZE - 1)/2);
                        var spawnY = (-y + (SIZE - 1)/2);
                        enemies_spawn_zones.push({"x":spawnX, "y": spawnY});
                        path[y].push(1);
                        break;


                    case "SPAWN_P":
                        // Player spawn zone
                        var geometry = new THREE.SphereGeometry(0.4);
                        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
                        player = new THREE.Mesh( geometry, material );
                        player.position.x = -x + (SIZE - 1)/2; 
                        player.position.y = -y + (SIZE - 1)/2;
                        player.name = "Player";
                        scene.add(player);
                        path[y].push(1); //define path
                        break;

                    case "WALL_DONE":
                        path[y].push(0);
                        break;

                }
            }
        }
        
        return [plane, walls, foods, player, path, enemies_spawn_zones];
    }
}