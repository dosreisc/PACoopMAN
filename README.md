Cedric Dos Reis

# lab5 - IHM

Read `./src/README.md` for installation guide
  
## Features

* User move the caracter within a path using arrow key.
  
* Enemies spawn.
  
* Caracter eats food on collision.
  
* Caracter dies if he colides with an enemy.
  
* Enemies move randomly in available direction within a path.
  
* Loading map structure from an image file. Read `./src/maps/README.md` for more informations
  
* Zoom in and out using `i` and `o` keys.

* Pause the game using `Esc`. Resume with arrows or `Esc`.

### Flask server with 2 routes

Read `./src/README.md` for installation guide
  
#### Routes

`/get/map/<id>` : get an 1D array of string defining the map strcuture. `<id>` : file name of the map (without extension).
  
`/get/maps/` : get a 2D array of string which contains the list of maps in `./src/maps/` (This route is not used).
  
## Features to be added

* Let the user choose which map he wants to play in. This can actually be done by changing an argument in the code : at line 71 of `./src/static/js/GameManager.js`, change the first argument with one of these values :  `map1`, `map2` or `map3`. You will need to reload the cache to see the new map `CTRL+F5`.

* Score.