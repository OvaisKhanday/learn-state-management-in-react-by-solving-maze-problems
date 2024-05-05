import { MAZE_BLOCK_TYPES } from "./maze.context";
import { MAZE_ACTION_TYPES } from "./maze.types";

export default function mazeReducer(state, action) {
  //   console.log("%c state:", "color: green", state);
  //   console.log("%c action:", "color: green", action);
  switch (action.type) {
    case MAZE_ACTION_TYPES.shuffle: {
      const { shuffledMaze, sourceCoordinates, destinationCoordinates } = shuffleMaze(state.size.rows, state.size.cols);
      return {
        ...state,
        maze: shuffledMaze,
        sourceCoordinates,
        destinationCoordinates,
        solved: false,
      };
    }
    case MAZE_ACTION_TYPES.toggleSourceOpen:
      return {
        ...state,
        isSetSourceOpen: !state.isSetSourceOpen,
        isSetDestinationOpen: false,
      };
    case MAZE_ACTION_TYPES.toggleDestinationOpen:
      return {
        ...state,
        isSetDestinationOpen: !state.isSetDestinationOpen,
        isSetSourceOpen: false,
      };

    case MAZE_ACTION_TYPES.setSource: {
      const newMaze = state.maze.map((row) => [...row]);
      newMaze[state.sourceCoordinates.row][state.sourceCoordinates.col] = MAZE_BLOCK_TYPES.open;
      const { rowIdx, colIdx } = action.payload;
      newMaze[rowIdx][colIdx] = MAZE_BLOCK_TYPES.source;
      return {
        ...state,
        maze: newMaze,
        sourceCoordinates: {
          row: rowIdx,
          col: colIdx,
        },
      };
    }
    case MAZE_ACTION_TYPES.setDestination: {
      const newMaze = state.maze.map((row) => [...row]);
      newMaze[state.destinationCoordinates.row][state.destinationCoordinates.col] = MAZE_BLOCK_TYPES.open;
      const { rowIdx, colIdx } = action.payload;
      newMaze[rowIdx][colIdx] = MAZE_BLOCK_TYPES.destination;
      return {
        ...state,
        maze: newMaze,
        destinationCoordinates: {
          row: rowIdx,
          col: colIdx,
        },
      };
    }
    case MAZE_ACTION_TYPES.toggleOpenClose: {
      const newMaze = state.maze.map((row) => [...row]);
      const { rowIdx, colIdx } = action.payload;
      newMaze[rowIdx][colIdx] = state.maze[rowIdx][colIdx] === MAZE_BLOCK_TYPES.open ? MAZE_BLOCK_TYPES.closed : MAZE_BLOCK_TYPES.open;
      return {
        ...state,
        maze: newMaze,
      };
    }
    case MAZE_ACTION_TYPES.solveStart:
      return {
        ...state,
        currentlySolving: true,
        isSetDestinationOpen: false,
        isSetSourceOpen: false,
      };
    case MAZE_ACTION_TYPES.putBlockInProcess: {
      const newMaze = state.maze.map((row) => [...row]);
      const { rowIdx, colIdx } = action.payload;
      newMaze[rowIdx][colIdx] = MAZE_BLOCK_TYPES.inQueue;
      return {
        ...state,
        maze: newMaze,
      };
    }
    case MAZE_ACTION_TYPES.setBlockVisited: {
      const newMaze = state.maze.map((row) => [...row]);
      const { rowIdx, colIdx } = action.payload;
      newMaze[rowIdx][colIdx] = MAZE_BLOCK_TYPES.visited;
      return {
        ...state,
        maze: newMaze,
      };
    }
    case MAZE_ACTION_TYPES.solvePaused:
      return { ...state, currentlySolving: false };

    case MAZE_ACTION_TYPES.setMaze:
      return {
        ...state,
        maze: action.payload.maze,
      };
    case MAZE_ACTION_TYPES.solveEnd:
      return {
        ...state,
        currentlySolving: false,
        solved: true,
      };

    case MAZE_ACTION_TYPES.setSpeed:
      return {
        ...state,
        speed: action.payload.speed,
      };
    default:
      return state;
  }
}

// util functions
function shuffleMaze(rows, cols) {
  const shuffledMaze = generateRandomMaze(rows, cols);

  const [sourceRowIdx, sourceColIdx] = findFreeBlock();
  shuffledMaze[sourceRowIdx][sourceColIdx] = MAZE_BLOCK_TYPES.source;

  const [destinationRowIdx, destinationColIdx] = findFreeBlock();
  shuffledMaze[destinationRowIdx][destinationColIdx] = MAZE_BLOCK_TYPES.destination;

  const sourceCoordinates = { row: sourceRowIdx, col: sourceColIdx };
  const destinationCoordinates = { row: destinationRowIdx, col: destinationColIdx };
  return { shuffledMaze, sourceCoordinates, destinationCoordinates };
  function findFreeBlock() {
    let i = Math.floor(Math.random() * rows),
      j = Math.floor(Math.random() * cols);
    while (shuffledMaze[i][j] !== MAZE_BLOCK_TYPES.open) {
      i = Math.floor(Math.random() * rows);
      j = Math.floor(Math.random() * cols);
    }
    return [i, j];
  }
  function generateRandomMaze(rows, cols) {
    const newMaze = Array.from({ length: rows }, () => Array(cols).fill(MAZE_BLOCK_TYPES.open));
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        //TODO: levels - easy medium hard
        if (Math.random() > 0.75) newMaze[i][j] = MAZE_BLOCK_TYPES.closed;
      }
    }
    return newMaze;
  }
}
