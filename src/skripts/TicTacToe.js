window.onload = (event) => {
    //document.getElementById("Hallo").innerText = "Hallo JS!";
};

var turn = 0;
var status = "running";
var OverallScore = [0, 0];
var gameMode = 0;

function place(item) {
    if(status == "stopped") {
        clear();
        return;
    }

    if(document.getElementById(item).innerText == "" && status == "running") {
        if(turn%2==0) {
            document.getElementById(item).innerText = "X";
        }
        else {
            document.getElementById(item).innerText = "O";
        }

        var board = getBoard();

        var score = calculateWin(board);
        if(score == 10) {
            alert("The winner is X");
            status = "stopped";
        }
        else if (score == -10) {
            alert("The winner is O");
            status = "stopped";
        }
        
        if(gameMode == 0) { // minimax (bot player) only in singleplayer mode
            if(status == "running" && turn < 8) {
                console.log("Start Minimax " + turn);
                minimax("O", board, 9-turn);
            }
    
            board = getBoard();
    
            score = calculateWin(board);
            if(score == 10) {
                OverallScore[0] += 1;
                updateCurrentScore();
                alert("The winner is X");
                status = "stopped";
            }
            else if (score == -10) {
                OverallScore[1] += 1;
                updateCurrentScore();
                alert("The winner is O");
                status = "stopped";
            }
        }
        
        
        turn++;
        
        if(turn >= 9 && status == "running") {
            OverallScore[0] += 0.5;
            OverallScore[1] += 0.5;
            status = "stopped"
            updateCurrentScore();
            alert("Tie");
        }
        
    }
}

function mode(mode) { // switches the mode between singelplayer and multiplayer
    //alert("Test " + mode);
    gameMode = mode; // set the game mode variable
    reset(); // reset the game when the mode is switched
}

function reset() { // resets the entire game
    clear(); // clears the board

    OverallScore = [0, 0]; // reset the Score
    updateCurrentScore(); // displays the new score
}

function clear() { // clears the board and restart a new game
    turn = 0; // reset the turn of the game
    status = "running"; // restart the game

    // clear the board
    document.getElementById("1").innerText = "";
    document.getElementById("2").innerText = "";
    document.getElementById("3").innerText = "";
    document.getElementById("4").innerText = "";
    document.getElementById("5").innerText = "";
    document.getElementById("6").innerText = "";
    document.getElementById("7").innerText = "";
    document.getElementById("8").innerText = "";
    document.getElementById("9").innerText = "";
}

function updateCurrentScore() { // displays the updated score
    document.getElementById("score").innerText = OverallScore[0] + " - " + OverallScore[1];
}

function getBoard() { // returns the current board as a 2 Dim-Array
    var board = [[document.getElementById("1").innerText, document.getElementById("2").innerText, document.getElementById("3").innerText],
            [document.getElementById("4").innerText, document.getElementById("5").innerText, document.getElementById("6").innerText],
            [document.getElementById("7").innerText, document.getElementById("8").innerText, document.getElementById("9").innerText]];

    return board;
}

function calculateWin(board) { // checks if a player won the game ( return: -10, 0, 10 )

    let winner = "";
    let score = 0;

    if(board[0][0] != "" && board[0][0] == board[0][1] && board[0][0] == board[0][2]) { // first horizontal
        winner = board[0][0];
    }
    else if(board[1][0] != "" && board[1][0] == board[1][1] && board[1][0] == board[1][2]) { // second horizontal
        winner = board[1][0];
    }
    else if(board[2][0] != "" && board[2][0] == board[2][1] && board[2][0] == board[2][2]) { // third horizontal
        winner = board[2][0];
    }
    else if(board[0][0] != "" && board[0][0] == board[1][0] && board[0][0] == board[2][0]) { // first vertical
        winner = board[0][0];
    }
    else if(board[0][1] != "" && board[0][1] == board[1][1] && board[0][1] == board[2][1]) { // second vertical
        winner = board[0][1];
    }
    else if(board[0][2] != "" && board[0][2] == board[1][2] && board[0][2] == board[2][2]) { // third vertical
        winner = board[0][2];
    }
    else if(board[0][0] != "" && board[0][0] == board[1][1] && board[0][0] == board[2][2]) { // first diagonal
        winner = board[0][0];
    }
    else if(board[0][2] != "" && board[0][2] == board[1][1] && board[0][2] == board[2][0]) { // second diagonal
        winner = board[0][2];
    }

    if(winner == "X") {
        score = 10;
    }
    else if(winner == "O") {
        score = -10;
    }

    return score;
}

function getAmountOfMoves(board) { // returns the amount of possible moves
    let count = 0;
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if(board[i][j] == "") {
                count++;
            }
        }
    }
    return count;
}

function getMovesArray(board) { // doesn´t work, need to be tested and implemented
    let moves = new Array();
    let count = 0;
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if(board[i][j] == "") {
                moves[count] = i*3+j; // a formula to store 2 integer values ​​in one
                count++;
            }
        }
    }
    return moves;
}

function makeMove(board, move, player) { // returns a new board array with the played move
    // get both integer values ​​back (i, j)
    let temp = move%3;
    let i = (move-temp)/3;
    let j = move-i*3;

    // new board variable
    let newBoard = [["", "", ""], ["", "", ""], ["", "", ""]];

    // fills the new board with the current board
    for(let x = 0; x < 3; x++) {
        for(let y = 0; y < 3; y++) {
            newBoard[x][y] = board[x][y];
        }
    }

    // add the new board move
    newBoard[i][j] = player;
    return newBoard;
}

function minimax(player, board, depth) {
    if(depth != 9-turn) {
        if(depth == 0 || getAmountOfMoves(board) == 0 || calculateWin(board) != 0) {
            return calculateWin(board);
        }
    }
    
    var move = -1;
    var score;

    if(player == "X") {
        let bestscore = -Infinity;
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if(board[i][j] == "") {
                    // make move to the board
                    let newBoard = makeMove(board, i*3+j, "X");
            
                    // recal the function, for the score
                    let newScore = minimax("O", newBoard, depth-1);

                    // save the move and score if it is better than the current score 
                    if(newScore > bestscore) {
                        move = i*3+j;
                        bestscore = newScore;
                        if(newScore == 10 && depth != 9-turn) {
                            return newScore;
                        }
                    }
                }
            }
        }

        score = bestscore;
    }
    else{
        let bestscore = Infinity;
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                if(board[i][j] == "") {
                    // make move to the board
                    let newBoard = makeMove(board, i*3+j, "O")
        
                    // recal the function, for the score
                    let newScore = minimax("X", newBoard, depth-1);

                    // save the move and score if it is better than the current score 
                    if(newScore < bestscore) {
                        move = i*3+j;
                        bestscore = newScore;
                        if(newScore == -10 && depth != 9-turn) {
                            return newScore;
                        }
                    }
                }
            }
        }

        score = bestscore;
    }
    
    if(depth == 9-turn) { // play the best move to the actual board
        //alert("move is " + move);
        document.getElementById(move+1).innerText = player;
        turn++;
    }

    return score;    
}
