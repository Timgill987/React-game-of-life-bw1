import React from "react";
import "./Game.css";

const CELL_SIZE = 15;
let WIDTH = 360;
let HEIGHT = 360;

// rendering the cells on the board

class Cell extends React.Component {
    render() {
        const { x, y } = this.props;
        return (
            <div
                className="Cell"
                style={{
                    left: `${CELL_SIZE * x + 1}px`,
                    top: `${CELL_SIZE * y + 1}px`,
                    width: `${CELL_SIZE - 1}px`,
                    height: `${CELL_SIZE - 1}px`,
                }}
            />
        );
    }
}

// rendering the board, rules, and nessessary functionality for the game
class Game extends React.Component {
    constructor() {
        super();
        this.rows = this.state.height / CELL_SIZE;
        this.cols = this.state.width / CELL_SIZE;

        this.board = this.makeEmptyBoard();
    }

    state = {
        // creating cells
        cells: [],
        isRunning: false,
        interval: 100,
        generation: 0,
        // setting dimension state
        // for big and small grid
        width: WIDTH,
        height: HEIGHT,
    };

    makeEmptyBoard() {
        //creating empty board
        let board = [];
        for (let y = 0; y < this.rows; y++) {
            board[y] = [];
            for (let x = 0; x < this.cols; x++) {
                board[y][x] = false;
            }
        }
        return board;
    }
    // calculate the position of clicks on the board
    getElementOffset() {
        const rect = this.boardRef.getBoundingClientRect();
        const doc = document.documentElement;

        return {
            x: rect.left + window.pageXOffset - doc.clientLeft,
            y: rect.top + window.pageYOffset - doc.clientTop,
        };
    }

    makeCells() {
        let cells = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    cells.push({ x, y });
                }
            }
        }
        return cells;
    }
    // takes the click and fires off the cell bool
    handleClick = (event) => {
        const elemOffset = this.getElementOffset();
        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;
        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
            this.board[y][x] = !this.board[y][x];
        }
        this.setState({ cells: this.makeCells() });
    };
    // runs the game (duh)
    runGame = () => {
        this.setState({ isRunning: true });
        this.runIteration();
    };
    // stops the game (also duh)
    stopGame = () => {
        this.setState({ isRunning: false });
        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    };

    runIteration() {
        let newBoard = this.makeEmptyBoard();

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let neighbors = this.calculateNeighbors(this.board, x, y);
                if (this.board[y][x]) {
                    // if the cell has two to three neighbors, the cell lives on to the next iteration.
                    if (neighbors === 2 || neighbors === 3) {
                        newBoard[y][x] = true;
                    } else {
                        // cell dies if the above condition is not met this cycle
                        // additionally, if a cell has less than two or more than three neighbors, then it dies.
                        newBoard[y][x] = false;
                    }
                } else {
                    // if a dead cell has exactly 3 neighbors, it is reborn in the next iteration.
                    if (!this.board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }

        this.board = newBoard;
        this.setState({
            generation: this.state.generation + 1,
        });
        this.setState({ cells: this.makeCells() });

        this.timeoutHandler = window.setTimeout(() => {
            this.runIteration();
        }, this.state.interval);
    }

    calculateNeighbors(board, x, y) {
        let neighbors = 0;
        // sets each cells awareness to the neighboring cells around itself,
        // each coordinate references one of the 8 neighboring cells around it.
        const dirs = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, 1], // the eight surrounding cells to a given cell
            [1, 1],
            [1, 0],
            [1, -1],
            [0, -1],
        ];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (
                x1 >= 0 &&
                x1 < this.cols &&
                y1 >= 0 &&
                y1 < this.rows &&
                board[y1][x1]
            ) {
                neighbors++;
            }
        }

        return neighbors;
    }
    // handles the input field that adjust the speed of the game
    handleIntervalChange = (event) => {
        this.setState({ interval: event.target.value });
    };
    // clears the grid of live cells to reset the grid
    handleClear = () => {
        this.board = this.makeEmptyBoard();
        this.setState({
            cells: this.makeCells(),
            generation: 0,
        });
    };
    // randomly sets the cells in the grid to alive before the game starts
    handleRandom = () => {
        this.rows = this.state.height / CELL_SIZE;
        this.cols = this.state.width / CELL_SIZE;
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.board[y][x] = Math.random() >= 0.5;
            }
        }
        this.setState({ cells: this.makeCells() });
    };

    updateGrid = () => {
        this.rows = this.state.height;
        this.cols = this.state.width;
        this.board = this.makeEmptyBoard();
        this.setState({ cells: this.makeCells() });
    };

    biggerGrid = () => {
        if (this.state.width < 600) {
            this.setState({
                width: this.state.width + 100,
                height: this.state.height + 100,
            });
            this.updateGrid();
        }
    };

    smallerGrid = () => {
        if (this.state.width > 100) {
            this.setState({
                width: this.state.width - 100,
                height: this.state.height - 100,
            });
            this.updateGrid();
        }
    };
    // normalGrid = () => {
    //     this.setState({
    //         width: 300,
    //         height: 300,
    //     });
    //     this.updateGrid();
    // };

    render() {
        const { cells, isRunning } = this.state;
        return (
            <div>
                <div className="generation">
                    <h1>Current Generation: {this.state.generation} </h1>
                </div>
                <div
                    className="Board"
                    style={{
                        width: this.state.width,
                        height: this.state.height,
                        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
                    }}
                    onClick={this.handleClick}
                    ref={(n) => {
                        this.boardRef = n;
                    }}
                >
                    {/* // iterating through the cells to check rules // */}
                    {cells.map((cell) => (
                        <Cell
                            x={cell.x}
                            y={cell.y}
                            key={`${cell.x},${cell.y}`}
                        />
                    ))}
                </div>

                <div className="controls">
                    {/* rules execute every set milisecond */}
                    Update every{" "}
                    <input
                        value={this.state.interval}
                        onChange={this.handleIntervalChange}
                    />{" "}
                    msec
                    {isRunning ? (
                        <button className="button" onClick={this.stopGame}>
                            Stop
                        </button>
                    ) : (
                        <button className="button" onClick={this.runGame}>
                            Run
                        </button>
                    )}
                    <button className="button" onClick={this.handleRandom}>
                        Random
                    </button>
                    <button className="button" onClick={this.handleClear}>
                        Clear
                    </button>
                    <button className="button" onClick={this.biggerGrid}>
                        Big Grid
                    </button>
                    <button className="button" onClick={this.smallerGrid}>
                        Small Grid
                    </button>
                    {/* <button className="button" onClick={this.normalGrid}>
                        Normal Grid
                    </button> */}
                </div>
            </div>
        );
    }
}

export default Game;
