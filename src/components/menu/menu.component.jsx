import { useContext } from "react";
import { MAZE_BLOCK_TYPES, MazeContext } from "../../feature/maze/maze.context";
import "./menu.styles.css";

export default function Menu() {
  const {
    maze,
    size,
    solved,
    speed,
    isSetSourceOpen,
    isSetDestinationOpen,
    sourceCoordinates,
    currentlySolving,
    shuffleMaze,
    toggleIsSourceOpen,
    toggleIsDestinationOpen,
    solveStart,
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

  const setSourceClassName = isSetSourceOpen ? "set-source-button-active" : "";
  const setDestinationClassName = isSetDestinationOpen ? "set-destination-button-active" : "";

  return (
    <div className='card menu-container'>
      <button className={`typical-button set-source-button ${setSourceClassName}`} onClick={handleSetSource} disabled={solved || currentlySolving}>
        set source
      </button>
      <button
        className={`typical-button set-destination-button ${setDestinationClassName}`}
        onClick={handleSetDestination}
        disabled={solved || currentlySolving}
      >
        set destination
      </button>
      <button className='typical-button shuffle-button' onClick={handleShuffle} disabled={currentlySolving}>
        shuffle
      </button>
      {/* <button onClick={handlePause} disabled={solved || !currentlySolving}>
        pause
      </button> */}
      <div className='speed-selection-container'>
        <button className={`speed-button ${speed === 800 ? "speed-button-selected" : ""}`} disabled={currentlySolving} onClick={() => setSpeed(800)}>
          1x
        </button>
        <button className={`speed-button ${speed === 500 ? "speed-button-selected" : ""}`} disabled={currentlySolving} onClick={() => setSpeed(500)}>
          2x
        </button>
        <button className={`speed-button ${speed === 300 ? "speed-button-selected" : ""}`} disabled={currentlySolving} onClick={() => setSpeed(300)}>
          3x
        </button>
        <button className={`speed-button ${speed === 100 ? "speed-button-selected" : ""}`} disabled={currentlySolving} onClick={() => setSpeed(100)}>
          4x
        </button>
        <button className={`speed-button ${speed === 0 ? "speed-button-selected" : ""}`} disabled={currentlySolving} onClick={() => setSpeed(0)}>
          5x
        </button>
      </div>
      <div className='expanded'></div>
      {/* <input type='range' title='speed' placeholder='speed' min={1} max={5} disabled={solved || currentlySolving} onChange={handleSpeed} /> */}
      <button className='typical-button solve-button' onClick={handleSolve} disabled={solved || currentlySolving}>
        solve
      </button>
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
