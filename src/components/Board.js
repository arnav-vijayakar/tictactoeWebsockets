import React from 'react';
import Square from './Square';
import io from 'socket.io-client';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.host = document.location.hostname + ":" + document.location.port;
    this.socket = null;
    this.getGameIdQParam = this.getGameIdQParam.bind(this);
    this.gameID = this.getGameIdQParam(window.location.search);
    this.initConnect = this.initConnect.bind(this);
    this.receiveInitInfo = this.receiveInitInfo.bind(this);
    this.receiveNextTurnInfo = this.receiveNextTurnInfo.bind(this);
    this.sharableLink = "Share this link with your friend: " + document.location;
    this.status = "Waiting for other player to join..."
    this.move = this.move.bind(this);
    this.state = {
      squares: Array(9).fill(null),
      isNext: false,
      play: null,
      winner: null
    };
  }

  componentDidMount() {
    this.socket = io(this.host);
    this.initConnect();
    this.receiveInitInfo();
    this.receiveNextTurnInfo();
  }


  //get gameId query param from browser's URL
  getGameIdQParam(p) {
    let splitParams = p.replace("?", '').split('=');
    if (splitParams.length >= 2 && splitParams[0] === "gameid") {
      return splitParams[1];
    }
    return null;
  }

  move(i) {
    this.socket.emit('move', {
      "moveIndex": i,
      "gameId": this.gameID
    });
  }

  initConnect() {
    this.socket.on('connect', () => {
      let socketGameIdMsg = {
        "socketId": this.socket.id,
        "gameId": this.gameID
      };
      this.socket.emit('socketGameIdMsg', socketGameIdMsg);
    });
  }

  receiveInitInfo() {
    this.socket.on('playerInfo', (a) => {
      this.sharableLink = null;
      this.setState({
        isNext: a.isNext,
        play: a.play
      });
    });
  }

  receiveNextTurnInfo() {
    this.socket.on('yourTurn', (i) => {
      const squares = this.state.squares.slice();
      squares[i] = this.state.play === 'X' ? 'O' : 'X';
      this.setState({
        squares: squares,
        isNext: !this.state.isNext
      });
    });

    this.socket.on('winner', (outcome) => {
      this.setState({
        winner: outcome
      });
    });
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    if (this.state.winner !== null || squares[i] || !this.state.isNext) {
      return;
    }
    this.move(i);
    squares[i] = this.state.play;
    this.setState({
      squares: squares,
      isNext: !this.state.isNext
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const winner = this.state.winner;
    if (winner) {
      this.status = winner === 'draw' ? "It is Draw" : 'Winner: ' + winner;
    } else {
      this.status = this.state.play === null ? "Waiting for other player to join..." : ('Next player: ' + (this.state.isNext ? this.state.play : (this.state.play === 'X' ? 'O' : 'X')));
    }

    let yourPlay = this.sharableLink ? this.sharableLink : (this.state.play ? "You are : " + this.state.play : "");

    return (
      <div className="outer-container">
        <div className="left-container">
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
        <div className="right-container">
          <div className="status">{this.status}</div>
          <div className="share">{yourPlay}</div>
        </div>
      </div>
    );
  }
}

export default Board;
