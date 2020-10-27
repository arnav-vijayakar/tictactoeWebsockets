let express = require('express');
let path = require('path');
let Game = require('./server/Game');
const http = require('http');
const socketio = require('socket.io');

const PORT = process.env.PORT || 3000;
const games = new Map();
const socketIdToGameIdMap = new Map();
const app = express();
const server = http.createServer(app);
const io = socketio(server);
let qp = "randomgarbage";

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/home.html');
});

app.get('/tictactoe', function (req, res) {
    res.sendFile(__dirname + '/public/tictactoe.html');
});

io.on('connection', (socket) => {
    //receive socket id and gameid q param from client. do init game setup here
    socket.on('socketGameIdMsg', (msg) => {
        socketIdToGameIdMap.set(msg.socketId, msg.gameId);
        let currGameID = msg.gameId;
        if(games.has(currGameID)){
            let currGame = games.get(currGameID);
            //second player joins
            if(currGame.noOfPlayers === 1){
                currGame.p2id = msg.socketId;
                currGame.noOfPlayers = 2;
                let playerInitInfo1 = {
                    isNext: true,
                    play: 'X',
                }
                io.to(currGame.p1id).emit('playerInfo', playerInitInfo1);
                let playerInitInfo2 = {
                    isNext: false,
                    play: 'O',
                }
                io.to(currGame.p2id).emit('playerInfo', playerInitInfo2);
            }
            //third or more join
            else{
                console.log("Tictactoe game id: "+ currGameID +" already has 2 players..someone else tried to access the same link");
                return;
            }
        }
        else{
            //create a new game with a single player
            games.set(currGameID, new Game(msg.socketId));
        }
    });

    //add socket to a game room

    //listen to any move
    socket.on('move', (moveInfo) => {
        let currGame = games.get(moveInfo.gameId);
        if(currGame.squares[moveInfo.moveIndex] === null){
            if(currGame.p1id === socket.id){
                currGame.squares[moveInfo.moveIndex] = currGame.p1Play;
                currGame.turns = currGame.turns + 1;
                let outcome = Game.calcWinner(currGame.squares, currGame.p1Play, currGame.turns);
                if(outcome !== null){
                    io.to(currGame.p1id).emit('winner', outcome);
                    io.to(currGame.p2id).emit('winner', outcome);
                }
                io.to(currGame.p2id).emit('yourTurn', moveInfo.moveIndex);
            }
            else if(currGame.p2id === socket.id){
                currGame.squares[moveInfo.moveIndex] = currGame.p2Play;
                currGame.turns = currGame.turns + 1;
                let outcome = Game.calcWinner(currGame.squares, currGame.p2Play, currGame.turns);
                if(outcome !== null){
                    io.to(currGame.p1id).emit('winner', outcome);
                    io.to(currGame.p2id).emit('winner', outcome);
                }
                io.to(currGame.p1id).emit('yourTurn', moveInfo.moveIndex);
            }
            else{
                console.log("Game "+moveInfo.gameId+" is corrupted. Someone other than valid player played");
            }
        }
        else{
            console.log("Game "+moveInfo.gameId+" is corrupted. Server game and client game doesnt match");
        }
    });
});

server.listen(PORT);

console.log('Listening on port '+PORT);