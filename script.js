//gameboard module
const gameboard = (() => {

    //3x3 array for game board
    let boardArray = [
        ["","",""], ["","",""], ["","",""]
    ];



    const _squares = new Array(9);


    //public properties
    


    //private methods




    //grab document elements representing game positions and store in array _squares
    function initBoard() {
        for (let i=0; i<9; i++){
            _squares[i] = document.getElementById(i);
        }
    }

    //go through each "square" position in board array, update DOM divs
    //according to whether it is X, O, or blank
    function drawBoard() {
        let id = 0;
        for (let i=0; i<3; i++){
            for (let j=0; j<3; j++){
                if (boardArray[i][j] === 'X') {
                    _squares[id].innerText = "X";
                }
                else if (boardArray[i][j] === 'O') {
                    _squares[id].innerText = "O";
                }
                else {
                    _squares[id].innerText = "";
                }
                id++;
            }
        }
    }

    function resetBoard() {
        for (let i=0; i<3; i++){
            for (let j=0; j<3; j++){
                boardArray[i][j] = "";
            }
        }
        drawBoard();
    }

    return {initBoard, drawBoard, resetBoard, boardArray}; 
    

})();

//player module
const player = (name, marker) => {

    return {name, marker};

};


//gameplay module
const gameplay = (() => {


    //assign player markers
    const p1 = player("Bob","X");
    const p2 = player("Carl", "O")


    let markerTurn = p1.marker; //player 1 starts the game
    let turnCount = 0;
    let gameStatusDisplay = document.getElementById('gameStatus');
    let resetButton = document.getElementById('reset');
    let gameStatus;


    resetButton.addEventListener('click', function() {resetGame()});

    gameboard.initBoard();
    initGame();


    //start game
    function initGame() {
        gameStatus = 'active';
        playerTurn();
    }


    //listen for player clicks on grid positions
    function playerTurn() {
        for (let i=0; i<9; i++){
            document.getElementById(i).addEventListener('click', function() {markSquare(i)});
        }
    }

    //mark a square when clicked
    function markSquare(pos) {
        if (gameStatus === 'active') {
            //convert 1D position number to 2D array index
            let x = Math.trunc(pos / 3);
            let y = pos % 3;

            //if user clicks on a blank square, record their mark, redraw the board, switch turn
            if (gameboard.boardArray[x][y] === "") {
                gameboard.boardArray[x][y] = markerTurn;
                gameboard.drawBoard();

                if (checkWin(x, y) == true) {
                    gameOver("win", markerTurn);
                }
                turnCount++;

                if (turnCount == 9) {
                    gameOver("tie", markerTurn);
                }

                if (gameStatus == 'active')
                    switchTurn();
            }
        }

    }

    //toggle whether it is X or O's turn
    function switchTurn() {

        if (markerTurn === "X") {
            markerTurn = "O";
            gameStatusDisplay.innerText = "O's turn";
        }
        else {
            markerTurn = "X";
            gameStatusDisplay.innerText = "X's turn";
        }
    }

    //Check if there is a winner
    function checkWin(row,col) {
        //only need to check based on last position played

        //check the row
        for (let i=0; i<3; i++){
            //something doesn't match
            if (gameboard.boardArray[row][i]!==markerTurn)
                break;
            else if (i == 2)
                return true;
        }

        //check the col
        for (let i=0; i<3; i++){
            //something doesn't match
            if (gameboard.boardArray[i][col]!==markerTurn)
                break;
            else if (i == 2)
                return true;
        }

        //check the diagonal
        for (let i=0; i<3; i++){
            if (gameboard.boardArray[i][i]!==markerTurn)
                break;
            else if (i == 2)
                return true;
        }

        //check the anti diagonal
        for (let i=0; i<3; i++){
            if (gameboard.boardArray[i][2-i]!==markerTurn)
                break;
            else if (i == 2)
                return true;
        }

        return false;
    }

    //End game procedure
    function gameOver(result, marker) {
        if (result === 'win') {
            gameStatusDisplay.innerText = `${marker} wins!`;
        }
        else if (result === 'tie') {
            gameStatusDisplay.innerText = `Draw!`;
        }

        turnCount = 0;
        gameStatus = 'inactive';

    }

    //reset Game parameters
    function resetGame() {
        turnCount = 0;
        gameStatus = 'active';
        gameStatusDisplay.innerText = "";
        gameboard.resetBoard();
        initGame();
    }


})();
