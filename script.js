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

    var _score=0;

    function addPoint () {
        _score++;
    }

    function readScore() {
        return _score;
    }

    return {name, marker, addPoint, readScore};

};


//gameplay module
const gameplay = (() => {



    let markerTurn;
    let turnCount = 0;
    let gameStatusDisplay = document.getElementById('gameStatus');
    const resetButton = document.getElementById('reset');
    const playAgainButton = document.getElementById('playAgain');
    const modal = document.getElementById("setupModal");
    const modalButton = document.getElementById('modalButton');
    const p1Check = document.getElementById("p1Check");
    const p2Check = document.getElementById("p2Check");
    const p1XSelect = document.getElementById("p1X");
    const p1OSelect = document.getElementById("p1O");
    const p2XSelect = document.getElementById("p2X");
    const p2OSelect = document.getElementById("p2O");
    const p1NameDisplay = document.getElementById("p1NameDisplay");
    const p1MarkerDisplay = document.getElementById("p1MarkerDisplay");
    const p1ScoreDisplay = document.getElementById("p1ScoreDisplay");
    const p2NameDisplay = document.getElementById("p2NameDisplay");
    const p2MarkerDisplay = document.getElementById("p2MarkerDisplay");
    const p2ScoreDisplay = document.getElementById("p2ScoreDisplay");
    let errorMessage = document.getElementById("formError");



    let gameStatus;
    let p1Name;
    let p2Name;
    let p1;
    let p2;

    //Default settings, p1 is X and p2 is O
    let p1MarkerSelection = "X";
    let p2MarkerSelection = "O";

    
    //request user input for game settings
    setupGame();

    //initilize game for the first time
    resetButton.addEventListener('click', function() {resetGame()});
    playAgainButton.addEventListener('click', function() {playAgain()});
    p1Check.addEventListener('click', function() {toggleSelectSwitches()});
    p2Check.addEventListener('click', function() {toggleSelectSwitches()});
    gameboard.initBoard();


    //Set game settings in a modal popup
    function setupGame() {
        //open modal
        modal.style.display = "block";
        errorMessage.innerText = "";


        //reset checkboxes to match current marker selections
        if (p1MarkerSelection == "X") {
            p1Check.checked = false;
            p2Check.checked = true;
        }
        else {
            p1Check.checked = true;
            p2Check.checked = false;
        }

        //close modal when submit button clicked
        modalButton.addEventListener('click', function() {readForm();});
    }

    //read Username Inputs
    function readForm () {
        let form = document.getElementById("gameForm");


        p1Name = form.elements["p1Name"].value;
        p2Name = form.elements["p2Name"].value;

        if (p1Name == "" || p2Name == "") {
            errorMessage.innerText = "Please fill in all fields!"
        }
        else {
            form.reset();
            //Update display with user inputs
            errorMessage.innerText = "";
            p1NameDisplay.innerText = p1Name;
            p2NameDisplay.innerText = p2Name;
            p1MarkerDisplay.innerText = p1MarkerSelection;
            p2MarkerDisplay.innerText = p2MarkerSelection;
            modal.style.display = "none";
            //assign players
            p1 = player(p1Name,p1MarkerSelection);
            p2 = player(p2Name, p2MarkerSelection);
            initGame();
        }

    }

    //allow users to select which markers, will automatically adjust the other players marker
    function toggleSelectSwitches() {
        if (p1MarkerSelection == "X") {
            p1MarkerSelection = "O";
            p2MarkerSelection = "X";
            p1Check.checked = true;
            p2Check.checked = false;
            p1XSelect.style.color = "#000";
            p1OSelect.style.color = "#2196F3";
            p2XSelect.style.color = "#2196F3";
            p2OSelect.style.color = "#000";
        }
        else {
            p1MarkerSelection = "X";
            p2MarkerSelection = "O";
            p1Check.checked = false;
            p2Check.checked = true;
            p1XSelect.style.color = "#2196F3";
            p1OSelect.style.color = "#000";
            p2XSelect.style.color = "#000";
            p2OSelect.style.color = "#2196F3";

        }

    }


    //start game
    function initGame() {

        //Update screen with user selections
        p1NameDisplay.innerText = p1.name;
        p2NameDisplay.innerText = p2.name;
        p1MarkerDisplay.innerText = p1.marker;
        p2MarkerDisplay.innerText = p2.marker;

        markerTurn = p1.marker; //player 1 starts the game
        gameStatusDisplay.innerText = `${p1.name}'s turn`;

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
            if (p1.marker === "O") {
                gameStatusDisplay.innerText = `${p1.name}'s turn`;
            }
            else {
                gameStatusDisplay.innerText = `${p2.name}'s turn`;
            }
        }
        else {
            markerTurn = "X";
            if (p1.marker === "X") {
                gameStatusDisplay.innerText = `${p1.name}'s turn`;
            }
            else {
                gameStatusDisplay.innerText = `${p2.name}'s turn`;
            }

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
            if (p1.marker === marker) {
                gameStatusDisplay.innerText = `${p1.name} wins!`;
                p1.addPoint();
                p1ScoreDisplay.innerText = p1.readScore();
            }
            else {
                gameStatusDisplay.innerText = `${p2.name} wins!`;
                p2.addPoint();
                p2ScoreDisplay.innerText = p2.readScore();

            }
        }
        else if (result === 'tie') {
            gameStatusDisplay.innerText = `Draw!`;
        }

        turnCount = 0;
        gameStatus = 'inactive';

    }

    //Reset game but keep markers and usernames
    function playAgain() {
        turnCount = 0;
        gameStatus = 'active';
        gameStatusDisplay.innerText = "Let's Play!";
        gameboard.resetBoard();
        initGame();
    }

    //reset Game parameters
    function resetGame() {
        turnCount = 0;
        gameStatus = 'active';
        gameStatusDisplay.innerText = "Let's Play!";
        p1ScoreDisplay.innerText = "";
        p2ScoreDisplay.innerText = "";
        gameboard.resetBoard();
        setupGame();
    }




})();
