import { useContext } from "react";
import "./maze-block.styles.css";
import { MazeContext } from "../../feature/maze/maze.context";
import { MAZE_BLOCK_TYPES as TYPE } from "../../feature/maze/maze.context";

export default function MazeBlock({ rowIdx, colIdx }) {
  const { maze, isSetSourceOpen, isSetDestinationOpen, setSource, setDestination, toggleOpenClose, currentlySolving } = useContext(MazeContext);
  const blockType = maze[rowIdx][colIdx];

  function handleClick(rowIdx, colIdx) {
    const block = maze[rowIdx][colIdx];
    if (currentlySolving || block === TYPE.source || block === TYPE.destination) return;
    if ((isSetSourceOpen || isSetDestinationOpen) && block === TYPE.closed) return;

    if (isSetSourceOpen) setSource(rowIdx, colIdx);
    else if (isSetDestinationOpen) setDestination(rowIdx, colIdx);
    else toggleOpenClose(rowIdx, colIdx);
  }
  const hoverClassNameForSourceAndDestination =
    (isSetSourceOpen || isSetDestinationOpen) && blockType === TYPE.open ? "maze-block-source-destination-open" : "";
  const hoverClassNameForOpenToClosed =
    !(currentlySolving || isSetSourceOpen || isSetDestinationOpen) && blockType === TYPE.open ? "hover-open-to-closed" : "";
  const hoverClassNameForClosedToOpen =
    !(currentlySolving || isSetSourceOpen || isSetDestinationOpen) && blockType === TYPE.closed ? "hover-closed-to-open" : "";

  return (
    <div
      className={`maze-block ${blockType} ${hoverClassNameForSourceAndDestination} ${hoverClassNameForOpenToClosed} ${hoverClassNameForClosedToOpen}`}
      onClick={() => handleClick(rowIdx, colIdx)}
    ></div>
  );
}
