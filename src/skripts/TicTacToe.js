window.onload = (event) => {
    //document.getElementById("Hallo").innerText = "Hallo JS!";
};

var turn = 0;
var status = "running";

function place(item) {
    if(document.getElementById(item).innerText == "" && status == "running") {
        if(turn%2==0) {
            document.getElementById(item).innerText = "X";
        }
        else {
            document.getElementById(item).innerText = "O";
        }

        var board = [[document.getElementById("1").innerText, document.getElementById("2").innerText, document.getElementById("3").innerText],
            [document.getElementById("4").innerText, document.getElementById("5").innerText, document.getElementById("6").innerText],
            [document.getElementById("7").innerText, document.getElementById("8").innerText, document.getElementById("9").innerText]];

        var score = calculateWin(board);
        if(score == 10) {
            alert("The winner is X");
            status = "stopped";
        }
        else if (score == -10) {
            alert("The winner is O");
            status = "stopped";
        }
        
        if(status == "running") {
            console.log("Start Minimax " + turn);
            minimax("O", board, 9-turn);
        }

        board = [[document.getElementById("1").innerText, document.getElementById("2").innerText, document.getElementById("3").innerText],
            [document.getElementById("4").innerText, document.getElementById("5").innerText, document.getElementById("6").innerText],
            [document.getElementById("7").innerText, document.getElementById("8").innerText, document.getElementById("9").innerText]];

        score = calculateWin(board);
        if(score == 10) {
            alert("The winner is X");
            status = "stopped";
        }
        else if (score == -10) {
            alert("The winner is O");
            status = "stopped";
        }
        
        turn++;
        
        if(turn >= 9 && status == "running") {
            alert("Tie");
        }
        
    }
}

function reset() {
    turn = 0;
    status = "running";
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

function getBoard() { // need to be tested and implemented
    var board = [[document.getElementById("1").innerText, document.getElementById("2").innerText, document.getElementById("3").innerText],
            [document.getElementById("4").innerText, document.getElementById("5").innerText, document.getElementById("6").innerText],
            [document.getElementById("7").innerText, document.getElementById("8").innerText, document.getElementById("9").innerText]];

    return board;
}

function calculateWin(board) {

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
                moves[count] = i*3+j;
                count++;
            }
        }
    }
    return moves;
}

function makeMove(board, move, player) { // returns a new board array with the played move
    let temp = move%3;
    let i = (move-temp)/3;
    let j = move-i*3;
    let newBoard = [["", "", ""], ["", "", ""], ["", "", ""]];

    for(let x = 0; x < 3; x++) {
        for(let y = 0; y < 3; y++) {
            newBoard[x][y] = board[x][y];
        }
    }

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
    
    if(depth == 9-turn) {
        //alert("move is " + move);
        document.getElementById(move+1).innerText = player;
        turn++;
    }

    return score;    
}
