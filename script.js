var welcomeSound = new Audio("welcome.mp3");
var winSound = new Audio("win.mp3");

window.addEventListener("load", function(){
    welcomeSound.play();
})
var GRID_SIZE = 3;
var CELL_SIZE = 80 / GRID_SIZE;
var CELL_GAP = 4/GRID_SIZE;
var BORDER_RADIUS = 6/GRID_SIZE;

const gameBoard = document.getElementById("game-board");
const number = document.getElementById("game-size");
const selectAI = document.getElementById("playVSai");

const FIRST_PLAY = "cross"; //cross

var player = "cross";
if(FIRST_PLAY == "circle"){
    var player = "circle";
}

var AI = false;
var playerAI = "circle";
if(FIRST_PLAY == "circle"){
    playerAI = "cross";
}


var gameOver = false;
var xPlay = "";// all the plays of player x
var oPlay = "";// and o
var aPlay = "";// all the plays together so the ai can know where is free and choose a random free spot
var tPlay = "";// this looks like a full game(tie game)
var wins = [];

for (var i = 0; i < GRID_SIZE * GRID_SIZE; i++){
    xPlay += 0;
    oPlay += 0;
    aPlay += 0;
    tPlay += 1;
}


//Generating win patterns
//All the horizontal rows
for(var i = 0; i < GRID_SIZE; i++){
    var temp = "";
    for(x = 0; x < GRID_SIZE * GRID_SIZE; x++){
        if(x < GRID_SIZE + (i * GRID_SIZE) && x > i * GRID_SIZE - 1){
            temp += "1";
        }else{
            temp += "0";
        }
    }
    wins.push(temp);

}

//all the vertical rows
for(var i = 0; i < GRID_SIZE; i++){
    var temp = "";
    var row = 0;
    for(x = 0; x < GRID_SIZE * GRID_SIZE; x++){
        
        if(x == (GRID_SIZE - 1 - i) + GRID_SIZE * row){
            temp += "1";
        }else{
            temp += "0";
        }
        if(x == GRID_SIZE - 1 + (GRID_SIZE * row)){
            row++;
        }
        
    }
    wins.push(temp);

}

//the cross now left to right
var temp = "";
var count = 0;
for(x = 0; x < GRID_SIZE * GRID_SIZE; x++){
    if(x == count){
        count += GRID_SIZE + 1;
        temp += "1";
    }else{
        temp += "0";
    }
}
wins.push(temp);

//cross right to left
var temp = "";
var count = GRID_SIZE - 1;
for(x = 0; x < GRID_SIZE * GRID_SIZE; x++){
    if(x == count && x < (GRID_SIZE * GRID_SIZE) - 1){
        count += GRID_SIZE - 1;
        temp += "1";
    }else{
        temp += "0";
    }
}
wins.push(temp);

gameBoard.style.setProperty("--grid-size" , GRID_SIZE);
gameBoard.style.setProperty("--cell-size" , `${CELL_SIZE}vmin`);
gameBoard.style.setProperty("--cell-gap" , `${CELL_GAP}vmin`);
gameBoard.style.setProperty("--border-radius" , `${BORDER_RADIUS}vmin`);


var x = 0;
var y = 0;
for(var i = 0; i < GRID_SIZE * GRID_SIZE; i++){
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("onclick", `play(${x} , ${y})`);
    cell.id = `${i}`;
    gameBoard.append(cell);
    x++;
    if(x == GRID_SIZE){
        x = 0;
        y++;
    }
}

function play(y , x){

    var tileNum = (x * GRID_SIZE) + y;
    //console.log(aPlay[tileNum]);
    if(aPlay[tileNum] == "1"){
        console.log(`AI wanted to play at X=${x} Y=${y}`)
        playAI();
        return;
    }
    
    if(gameOver == false){
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.classList.add(player);
        tile.style.setProperty("--x", x);
        tile.style.setProperty("--y", y);
        gameBoard.append(tile);

        var replacement = "1";
        var replaced = aPlay.substring(0,tileNum) + replacement + aPlay.substring(tileNum + 1);
        aPlay = replaced;

        if(player == "cross"){
            var replacement = "1";
            var replaced = xPlay.substring(0,tileNum) + replacement + xPlay.substring(tileNum + 1);
            xPlay = replaced;
        }else if(player == "circle"){
            var replacement = "1";
            var replaced = oPlay.substring(0,tileNum) + replacement + oPlay.substring(tileNum + 1);
            oPlay = replaced;
        }

        if(checkWin(player) == 1){
            winGame();
        }else{
            if(aPlay == tPlay){
                endGame("Game tie!!");
            }
        }

        

        player = switchPlayer(player);

        if(playerAI == player && AI == true){
            playAI();
        }

    }
}

// function playAI(){
//     if(gameOver == false){
//         max = GRID_SIZE;
//         var randomX = parseInt(Math.random() * (max - 0) + 0);
//         var randomY = parseInt(Math.random() * (max - 0) + 0);
//         console.log(`Playing at X=${randomX} and Y=${randomY}`)
//         play(randomX, randomY);
//     }
// }

function playAI(){
    if(gameOver == false){
        var playable = [];
        for(var i = 0; i < aPlay.length; i++){
            if(aPlay[i] == "0"){
                playable.push(i);
            }
        }

        var random = parseInt(Math.floor(Math.random() * playable.length));
        randomY = 0;
        playableY = playable[random]
        while(playableY - GRID_SIZE >= 0){
            randomY++;
            playableY = playableY - GRID_SIZE;
            if(randomY > 100){
                break;
            }
        }
        randomX = playable[random]%GRID_SIZE;
        play(randomX, randomY);
    }
}

var winTiles = [];

function checkWin(player){
    for(var i = 0; i < wins.length; i++){
        var win = 1;
        winTiles = [];
        if(player == "cross"){
            for(var x = 0; x < GRID_SIZE * GRID_SIZE; x++){
                if(wins[i][x] == "1"){
                    if(xPlay[x] == "1"){
                        winTiles.push(x);
                    }else{
                        win = 0;
                        break;
                    }
                }
            }
        }else{
            for(var x = 0; x < GRID_SIZE * GRID_SIZE; x++){
                if(wins[i][x] == "1"){
                    if(oPlay[x] == "1"){
                        winTiles.push(x);
                    }else{
                        win = 0;
                        break;
                    }
                }
            }
        }

        if(win == 1){
            return 1;
            
        }
    }
    return win;
}

function switchPlayer(player){
    if(player == "circle"){
        return "cross";
    }else{
        return "circle";
    }
}

function endGame(text){
    const Cells = document.querySelectorAll(".cell");
    const Tiles = document.querySelectorAll(".tile");
    for(var i = 0; i < Cells.length; i++){
        Cells[i].style.animation = "tie 1s forwards";
        if(Tiles.length > 0 && i < Tiles.length){
            Tiles[i].style.animation = "tie 1s forwards";
        }
        gameOver = true;
    }
    const message = document.createElement("p")
    message.classList.add("message")
    message.innerText = text
    gameBoard.append(message);

    const reset = document.createElement("p")
    reset.classList.add("reset")
    reset.innerText = "reset game"
    gameBoard.append(reset);

    reset.addEventListener("click", ()=>{
        reMake(parseInt(number.value))
    })

}

//endGame();

function winGame(){
    for(var i = 0; i < winTiles.length; i++){
        const winTile = document.getElementById(winTiles[i]);
        winTile.style.animation = "win 1s infinite";
        winTile.style.background = "#ff726f";
        gameOver = true;
    }
    
    winSound.play();

    setTimeout(() => {
        if(player == "circle"){
            endGame(`Cross won the game!!`)
        }else{
            endGame(`Circle won the game!!`)
        }
        
    }, 2000);
}

number.addEventListener("change", ()=>{
    reMake(parseInt(number.value))
});

selectAI.addEventListener("change", ()=>{
    const value = selectAI.value;
    if(value == "True"){
        AI = true;
    }else{
        AI = false;
    }

    if(player == "cross"){
        playerAI = "circle";
    }else{
        playerAI = "cross";
    }

})

function reMake(value){
    gameOver = false;
    GRID_SIZE = value;
    CELL_SIZE = 80 / GRID_SIZE;
    CELL_GAP = 4/GRID_SIZE;
    BORDER_RADIUS = 6/GRID_SIZE;
    console.log(BORDER_RADIUS)

    xPlay = "";
    oPlay = "";
    aPlay = "";
    tPlay = "";

    wins = [];

    for (var i = 0; i < GRID_SIZE * GRID_SIZE; i++){
        xPlay += 0;
        oPlay += 0;
        aPlay += 0;
        tPlay += 1;
    }



    for(var i = 0; i < GRID_SIZE; i++){
        var temp = "";
        for(x = 0; x < GRID_SIZE * GRID_SIZE; x++){
            if(x < GRID_SIZE + (i * GRID_SIZE) && x > i * GRID_SIZE - 1){
                temp += "1";
            }else{
                temp += "0";
            }
        }
        wins.push(temp);

    }

    for(var i = 0; i < GRID_SIZE; i++){
        var temp = "";
        var row = 0;
        for(x = 0; x < GRID_SIZE * GRID_SIZE; x++){
            
            if(x == (GRID_SIZE - 1 - i) + GRID_SIZE * row){
                temp += "1";
            }else{
                temp += "0";
            }
            if(x == GRID_SIZE - 1 + (GRID_SIZE * row)){
                row++;
            }
            
        }
        wins.push(temp);

    }


    var temp = "";
    var count = 0;
    for(x = 0; x < GRID_SIZE * GRID_SIZE; x++){
        if(x == count){
            count += GRID_SIZE + 1;
            temp += "1";
        }else{
            temp += "0";
        }
    }
    wins.push(temp);

    var temp = "";
    var count = GRID_SIZE - 1;
    for(x = 0; x < GRID_SIZE * GRID_SIZE; x++){
        if(x == count && x < (GRID_SIZE * GRID_SIZE) - 1){
            count += GRID_SIZE - 1;
            temp += "1";
        }else{
            temp += "0";
        }
    }
    wins.push(temp);
    
    gameBoard.innerHTML = "";

    gameBoard.style.setProperty("--grid-size" , GRID_SIZE);
    gameBoard.style.setProperty("--cell-size" , `${CELL_SIZE}vmin`);
    gameBoard.style.setProperty("--cell-gap" , `${CELL_GAP}vmin`);
    gameBoard.style.setProperty("--border-radius" , `${BORDER_RADIUS}vmin`);


    x = 0;
    y = 0;
    for(var i = 0; i < GRID_SIZE * GRID_SIZE; i++){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("onclick", `play(${x} , ${y})`);
        cell.id = `${i}`;
        gameBoard.append(cell);
        x++;
        if(x == GRID_SIZE){
            x = 0;
            y++;
        }
    }
    player = "cross";
    if(FIRST_PLAY == "circle"){
        player = "circle";
    }
}