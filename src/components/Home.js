import React from 'react';
const { v4: uuidv4 } = require('uuid');

export default class Home extends React.Component {
    render() {
        let gid = uuidv4();
        return (
        <div className="home-container">
            <h2>Play TicTacToe online with your friends!</h2>
            <form action="/tictactoe">
                <input type="hidden" id="gameid" name="gameid" value={gid} />
                <input className="playButton" type="submit" value="Start a new Tic TacToe Game!" />
            </form>
        </div>
        )
    }
}