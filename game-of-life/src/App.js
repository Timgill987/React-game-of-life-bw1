import React from 'react';
import './App.css';
import Game from './Game'

function App() {
  return (
    <div className="GameOfLifeApp">
      <div className="text-div">
      <div className='Rules'>
        <h1>Conway's Game of Life</h1>
        <h3>Rules:</h3>
        <p>1. Any live cell (green) with fewer than two live neighbors dies, as if it was too lonely</p>
        <p>2. Any live cell with two or 3 live neighbors lives on to the next generation. Homie wasn't alone in the crule grid world thing</p>
        <p>3. Any live cell with more than three live neighbors die, not enough food for everyone apparently, cells get hungry often.</p>
        <p>4. any dead cell (grey) with exactly 3 live cells surrounding it becomes reborn, Lucky they had a pheonix-down... or something</p>
      </div>
      <Game />
      <div className='HowToPlay'>
        <h3>How to play:</h3>
        <p>-Click the individual cells around the grid to activate them </p>
        <p>-Use the input field to adjust the speed of the game in miliseconds </p>
        <p>-Click the random button to assign live cells all over the grid </p>
        <p>-Click the run button to start the game, and see the cells go crazy </p>
        <p>-Try placing the spaceships and oscillators in different formations to keep the game going as long as possible.</p>
      </div>
      </div>
    </div>
  );
}

export default App;
