import React from 'react';
import Board from './Board';

export default class TicTacToe extends React.Component {
    constructor(){
        super();
    }

    render() {
        return (
            <div className="game-board">
                <Board />
            </div>
        )
    }
}