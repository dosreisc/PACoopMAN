
const gameScreen = document.getElementById('gameScreen');


function init(){
    addEventListener('keydown', keydown);
}

function keydown(e){
    console.log(e.keyCode);

}

init();