import MazeBlock from "../maze-block/maze-block.component";
import "./maze-row.styles.css";

export default function MazeRow({ row, rowIdx }) {
  return (
    <div className='maze-row'>
      {row.map((_, colIdx) => (
        <MazeBlock key={colIdx} rowIdx={rowIdx} colIdx={colIdx} />
      ))}
    </div>
  );
}
