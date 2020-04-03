const gameBoard = (() => {
    const board = [
        ["","",""],
        ["","",""],
        ["","",""]
    ];
    const changeBoard = (mark, position) => board[position[0]][position[1]] = mark;
    const clearBoard = () => {
        board.forEach((element, index) => {
            board[index][0] = "";
            board[index][1] = "";
            board[index][2] = "";
        });
    };
    const showBoard = () => {
        return board;
    };
    const checkIfWin = (mark) => {
        let flatboard = board.flat();
        if(flatboard[0] === mark && flatboard[1] === mark && flatboard[2] === mark ){
            return [true, 0, 1, 2];
        } else if (flatboard[3] === mark && flatboard[4] === mark && flatboard[5] === mark ){
            return [true, 3, 4, 5];
        } else if (flatboard[6] === mark && flatboard[7] === mark && flatboard[8] === mark ){
            return [true, 6, 7, 8];
        } else if (flatboard[0] === mark && flatboard[3] === mark && flatboard[6] === mark ){
            return [true, 0, 3, 6];
        } else if (flatboard[1] === mark && flatboard[4] === mark && flatboard[7] === mark ){
            return [true, 1, 4, 7];
        } else if (flatboard[2] === mark && flatboard[5] === mark && flatboard[8] === mark ){
            return [true, 2, 5, 8];
        } else if (flatboard[0] === mark && flatboard[4] === mark && flatboard[8] === mark ){
            return [true, 0, 4, 8];
        } else if (flatboard[2] === mark && flatboard[4] === mark && flatboard[6] === mark ){
            return [true, 2, 4, 6];
        } else {
            return [false];
        }
    };
    return {
        changeBoard,
        clearBoard,
        showBoard,
        checkIfWin,
    };
})();

const displayBoard = (() => {
    const clearDisplayBoard = () =>{
        document.getElementById('gameBlock').style.display = "none";
        let boxes = document.querySelectorAll('.box');
        boxes.forEach((box) => {
            box.textContent = "";
            box.style.backgroundColor = "white";
        });
    };
    const createBoard = (player1, player2) => {
        let currentBoard = gameBoard.showBoard();
        let mainContainer = document.querySelector('#main-container');
        currentBoard.forEach((element, index) => {
            element.forEach((array, index2) => {
                let box = document.createElement('div');
                box.id = `box${index}_${index2}`;
                box.className = "box";
                box.cssText = `grid-column: ${index + 1}; grid-row: ${index2 + 1};`;
                mainContainer.appendChild(box);
            });
        });
        let boxEvents = document.querySelectorAll('.box');
        boxEvents.forEach((box, index) => {
            box.addEventListener('click', function(e) {
                if(box.textContent === ""){
                    let currentplayer = game.getCurrentPlayer();
                    box.textContent = currentplayer.getMark();
                    let arrayString = e.target.id.substring(3);
                    let splitArray = arrayString.split('_').map(Number);
                    gameBoard.changeBoard(currentplayer.getMark(), splitArray);
                    if(gameBoard.checkIfWin(currentplayer.getMark())[0]){
                        document.getElementById('gameBlock').style.display = "block";
                        let winArray = gameBoard.checkIfWin(currentplayer.getMark());
                        let boxArray = document.querySelectorAll('.box');
                        winArray.shift();
                        winArray.forEach((winner) => {
                            let count = 0;
                            boxArray.forEach((box) => {
                                if(winner === count){
                                    box.style.backgroundColor = "Orange";
                                }
                                count++;
                            });
                        });
                        document.getElementById('turnDisplay').textContent = `You Won ${game.getCurrentPlayer().getName()} great job!`;

                        gameBoard.clearBoard();
                    } else {
                        game.changeCurrentPlayer(game.getNotCurrentPlayer());
                        document.getElementById('turnDisplay').textContent = `Current Turn: ${game.getCurrentPlayer().getName()} (${game.getCurrentPlayer().getMark()})`;
                    }
                    
                    
                }
            });
        });
        let beginGame = document.getElementById('beginGame');
        beginGame.addEventListener('click', function() {
            if(document.getElementById('name1').value === "" || document.getElementById('mark1').value === "" || document.getElementById('name2').value === "" || document.getElementById('mark2').value === "") {
                document.getElementById('errorMsg').style.display = "block";
            } else {
                document.getElementById('playerOneContainer').style.display = "none";
                document.getElementById('playerTwoContainer').style.display = "none";
                document.getElementById('beginGame').style.display = "none";
                document.getElementById('newGameNewPlayers').style.display = "block";
                document.getElementById('newGameSamePlayers').style.display = "block";
                let player1 = document.getElementById('name1').value;
                let p1mark = document.getElementById('mark1').value;
                let player2 = document.getElementById('name2').value;
                let p2mark = document.getElementById('mark2').value;
                const p1 = Player(player1, p1mark);
                const p2 = Player(player2, p2mark);
                game.thePlayers(p1, p2);
                document.getElementById('playerOneInfo').textContent = `Player 1: ${player1} (${p1mark})`;
                document.getElementById('playerTwoInfo').textContent = `Player 2: ${player2} (${p2mark})`;
                document.getElementById('turnDisplay').textContent = `Current Turn: ${game.getCurrentPlayer().getName()} (${game.getCurrentPlayer().getMark()})`;
                document.getElementById('turnDisplay').style.display = "block";
            }
        });
        let startNewGameSamePlayers = document.getElementById('newGameSamePlayers');
        startNewGameSamePlayers.addEventListener('click', function() {
            displayBoard.clearDisplayBoard();
            gameBoard.clearBoard();
            game.thePlayers(game.getCurrentPlayer(), game.getNotCurrentPlayer());
            document.getElementById('turnDisplay').textContent = `Current Turn: ${game.getCurrentPlayer().getName()} (${game.getCurrentPlayer().getMark()})`;
        });

        let startNewGameNewPlayers = document.getElementById('newGameNewPlayers');
        startNewGameNewPlayers.addEventListener('click', function() {
            displayBoard.clearDisplayBoard();
            gameBoard.clearBoard();
            document.getElementById('playerOneContainer').style.display = "flex";
            document.getElementById('playerTwoContainer').style.display = "flex";
            document.getElementById('beginGame').style.display = "block";
            document.getElementById('name1').value = "";
            document.getElementById('mark1').value = "";
            document.getElementById('name2').value = "";
            document.getElementById('mark2').value = "";
            document.getElementById('newGameNewPlayers').style.display = "none";
            document.getElementById('newGameSamePlayers').style.display = "none";

        });
        
    };
    const adjustBoard = (mark, spotArray) => {
        let boxChanged = document.getElementById(`box${spotArray[0]}_${spotArray[1]}`);
        boxChanged.textContent = `${mark}`;
    };
    return {
        clearDisplayBoard,
        createBoard,
        adjustBoard,
    }
})();
const game = (() => {
    let theCurrentPlayer = null;
    let notCurrentPlayer = null;
    const thePlayers = (player1, player2) => {
        if(Math.floor(Math.random() * Math.floor(2)) < .5){
            theCurrentPlayer = player1;
            notCurrentPlayer = player2;
        } else if (Math.floor(Math.random() * Math.floor(2)) > .5){
            theCurrentPlayer = player2;
            notCurrentPlayer = player1;
        }

    };
    const getNotCurrentPlayer = () => {
        return notCurrentPlayer;
    };
    const getCurrentPlayer = () => {
        return theCurrentPlayer;
    };
    const changeCurrentPlayer = (newCurrentPlayer) => {
        notCurrentPlayer = theCurrentPlayer;
        theCurrentPlayer = newCurrentPlayer;
    };
    return {
        thePlayers,
        getNotCurrentPlayer,
        getCurrentPlayer,
        changeCurrentPlayer,
    };

})();

const Player = (name, mark) => {
    const getName = () => name;
    const getMark = () => mark;
    return {
        getName,
        getMark,
    }
};

displayBoard.createBoard();