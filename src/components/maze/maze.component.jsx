import "./maze.styles.css";

import { useContext } from "react";
import { MazeContext } from "../../feature/maze/maze.context";
import MazeRow from "../maze-row/maze-row.component";

export default function Maze() {
  const { maze } = useContext(MazeContext);

  return (
    <div className='maze-container'>
      {maze.map((row, rowIdx) => {
        return <MazeRow key={rowIdx} row={row} rowIdx={rowIdx} />;
      })}
    </div>
  );
}
