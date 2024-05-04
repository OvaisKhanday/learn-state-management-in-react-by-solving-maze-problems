import { createContext, useEffect, useReducer } from "react";
import mazeReducer from "./maze.reducer";
import { MAZE_ACTION_TYPES } from "./maze.types";

export const MAZE_BLOCK_TYPES = {
  open: "maze-block-open",
  closed: "maze-block-closed",
  visited: "maze-block-visited",
  inQueue: "maze-block-in-queue",
  source: "maze-block-source",
  destination: "maze-block-destination",
};

const rows = 30,
  cols = 50;
const initialMaze = Array.from({ length: rows }, () => Array(cols).fill(MAZE_BLOCK_TYPES.open));
initialMaze[0][0] = MAZE_BLOCK_TYPES.source;
initialMaze[rows - 1][cols - 1] = MAZE_BLOCK_TYPES.destination;

const initialState = {
  maze: initialMaze,
  size: {
    rows: rows,
    cols: cols,
  },
  speed: 200, // in milliseconds
  isSetSourceOpen: false,
  isSetDestinationOpen: false,
  sourceCoordinates: {
    row: 0,
    col: 0,
  },
  destinationCoordinates: {
    row: rows - 1,
    col: cols - 1,
  },
  currentlySolving: false, // no interaction when solving
  solved: false, // enable only shuffle after end-game
};

export const MazeContext = createContext(initialState);

export default function MazeProvider({ children }) {
  const [state, dispatch] = useReducer(mazeReducer, initialState);
  useEffect(() => {
    shuffleMaze();
  }, []);

  function shuffleMaze() {
    dispatch({
      type: MAZE_ACTION_TYPES.shuffle,
    });
  }

  function toggleIsSourceOpen() {
    dispatch({
      type: MAZE_ACTION_TYPES.toggleSourceOpen,
    });
  }
  function setSource(rowIdx, colIdx) {
    dispatch({
      type: MAZE_ACTION_TYPES.setSource,
      payload: { rowIdx, colIdx },
    });
  }
  function setDestination(rowIdx, colIdx) {
    dispatch({
      type: MAZE_ACTION_TYPES.setDestination,
      payload: { rowIdx, colIdx },
    });
  }

  function toggleIsDestinationOpen() {
    dispatch({ type: MAZE_ACTION_TYPES.toggleDestinationOpen });
  }

  function toggleOpenClose(rowIdx, colIdx) {
    dispatch({
      type: MAZE_ACTION_TYPES.toggleOpenClose,
      payload: { rowIdx, colIdx },
    });
  }

  function solveStart() {
    dispatch({ type: MAZE_ACTION_TYPES.solveStart });
  }
  function solvePaused() {
    dispatch({ type: MAZE_ACTION_TYPES.solvePaused });
  }
  function putBlockInProcess(rowIdx, colIdx) {
    dispatch({
      type: MAZE_ACTION_TYPES.putBlockInProcess,
      payload: { rowIdx, colIdx },
    });
  }
  function setBlockVisited(rowIdx, colIdx) {
    dispatch({
      type: MAZE_ACTION_TYPES.setBlockVisited,
      payload: { rowIdx, colIdx },
    });
  }
  function setMaze(maze) {
    dispatch({
      type: MAZE_ACTION_TYPES.setMaze,
      payload: { maze },
    });
  }

  function solveEnd() {
    dispatch({ type: MAZE_ACTION_TYPES.solveEnd });
  }
  function setSpeed(speed) {
    dispatch({ type: MAZE_ACTION_TYPES.setSpeed, payload: { speed } });
  }

  const { maze, size, speed, isSetSourceOpen, isSetDestinationOpen, sourceCoordinates, currentlySolving, solved } = state;
  const value = {
    state,
    maze,
    size,
    speed,
    isSetSourceOpen,
    isSetDestinationOpen,
    currentlySolving,
    solved,
    sourceCoordinates,
    shuffleMaze,
    toggleIsSourceOpen,
    toggleIsDestinationOpen,
    setSource,
    setDestination,
    toggleOpenClose,
    solveStart,
    solvePaused,
    putBlockInProcess,
    setBlockVisited,
    setMaze,
    solveEnd,
    setSpeed,
  };

  return <MazeContext.Provider value={value}>{children}</MazeContext.Provider>;
}
