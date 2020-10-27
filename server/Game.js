class Game {
    constructor(p1id) {
        this.squares = Array(9).fill(null);
        this.p1id = p1id;  //socketid of player1
        this.p2id = null;
        this.p1Next = true; //who goes next
        this.p2Next = false;
        this.p1Play = "X"; //what they will play
        this.p2Play = "O";
        this.winner = null; //p1/p1/draw/null
        this.noOfPlayers = 1;
        this.turns = 0;
    }

    static calcWinner (board, play, turns) {
        let topRow    = board[0] + board[1] + board[2];
        let middleRow = board[3] + board[4] + board[5];
        let bottomRow = board[6] + board[7] + board[8];
        let leftCol   = board[0] + board[3] + board[6];
        let middleCol = board[1] + board[4] + board[7];
        let rightCol  = board[2] + board[5] + board[8];
        let leftDiag  = board[0] + board[4] + board[8];
        let rightDiag = board[2] + board[4] + board[6];
      
        // Check for any winning combinations
        let str = play === 'X' ? 'XXX' : 'OOO';
        if (topRow === str) {
          return play;  
        } else if (middleRow === str) {
          return play;      
        } else if (leftCol === str) {
          return play;    
        } else if (middleCol === str) {
          return play;    
        } else if (rightCol === str) {
          return play;   
        } else if (leftDiag === str) {
          return play;    
        } else if (rightDiag === str) {
          return play;   
        } else if (bottomRow === str) {
          return play;
        } else if (turns === 9) {
          return 'draw';
        } else {
          return null;
        }
      }
}

module.exports = Game;