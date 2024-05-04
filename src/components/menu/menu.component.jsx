import { useContext, useEffect } from "react";
import { MAZE_BLOCK_TYPES, MazeContext } from "../../feature/maze/maze.context";
import "./menu.styles.css";
import mazeReducer from "../../feature/maze/maze.reducer";
import { MAZE_ACTION_TYPES } from "../../feature/maze/maze.types";

export default function Menu() {
  const {
    maze,
    size,
    solved,
    speed,
    sourceCoordinates,
    currentlySolving,
    shuffleMaze,
    toggleIsSourceOpen,
    toggleIsDestinationOpen,
    solveStart,
    solvePaused,
    solveEnd,
    setMaze,
    setSpeed,
  } = useContext(MazeContext);

  const handleSetSource = () => {
    toggleIsSourceOpen();
  };
  const handleSetDestination = () => {
    toggleIsDestinationOpen();
  };
  const handleShuffle = () => {
    shuffleMaze();
  };

  const handleSolve = async () => {
    const delay = (delayInms) => {
      return new Promise((resolve) => setTimeout(resolve, delayInms));
    };
    const bfsSubscription = bfsSolver(maze, size, sourceCoordinates.row, sourceCoordinates.col);
    solveStart();
    let response = bfsSubscription.next();
    while (!response.done) {
      await delay(speed);
      const newMaze = response.value.map((row) => [...row]);
      setMaze(newMaze);
      response = bfsSubscription.next();
    }
    solveEnd();
  };

  function handlePause() {
    solvePaused();
  }

  function handleSpeed(event) {
    const MAX_SPEED = 500;
    setSpeed(MAX_SPEED - event.target.value * 100);
  }

  return (
    <div className='menu-container'>
      <button onClick={handleSetSource} disabled={solved || currentlySolving}>
        set source
      </button>
      <button onClick={handleSetDestination} disabled={solved || currentlySolving}>
        set destination
      </button>
      <button onClick={handleShuffle} disabled={currentlySolving}>
        shuffle
      </button>
      <button onClick={handleSolve} disabled={solved || currentlySolving}>
        solve
      </button>
      {/* <button onClick={handlePause} disabled={solved || !currentlySolving}>
        pause
      </button> */}
      <input type='range' title='speed' placeholder='speed' min={1} max={5} disabled={solved || currentlySolving} onChange={handleSpeed} />
    </div>
  );
}
function* bfsSolver(maze, size, sourceRowIdx, sourceColIdx) {
  const queue = [];
  queue.push({ row: sourceRowIdx, col: sourceColIdx });
  while (queue.length > 0) {
    const { row, col } = queue.shift();
    if (maze[row][col] !== MAZE_BLOCK_TYPES.source) {
      maze[row][col] = MAZE_BLOCK_TYPES.visited;
      yield maze;
    }

    if (row - 1 >= 0) {
      if (maze[row - 1][col] === MAZE_BLOCK_TYPES.destination) return;
      if (maze[row - 1][col] === MAZE_BLOCK_TYPES.open) {
        queue.push({ row: row - 1, col });
        maze[row - 1][col] = MAZE_BLOCK_TYPES.inQueue;
        yield maze;
      }
    }

    if (col + 1 < size.cols) {
      if (maze[row][col + 1] === MAZE_BLOCK_TYPES.destination) return;
      if (maze[row][col + 1] === MAZE_BLOCK_TYPES.open) {
        queue.push({ row, col: col + 1 });
        maze[row][col + 1] = MAZE_BLOCK_TYPES.inQueue;
        yield maze;
      }
    }

    if (row + 1 < size.rows) {
      if (maze[row + 1][col] === MAZE_BLOCK_TYPES.destination) return;
      if (maze[row + 1][col] === MAZE_BLOCK_TYPES.open) {
        queue.push({ row: row + 1, col });
        maze[row + 1][col] = MAZE_BLOCK_TYPES.inQueue;
        yield maze;
      }
    }

    if (col - 1 >= 0) {
      if (maze[row][col - 1] === MAZE_BLOCK_TYPES.destination) return;
      if (maze[row][col - 1] === MAZE_BLOCK_TYPES.open) {
        queue.push({ row, col: col - 1 });
        maze[row][col - 1] = MAZE_BLOCK_TYPES.inQueue;
        yield maze;
      }
    }
  }
  return null;
}
