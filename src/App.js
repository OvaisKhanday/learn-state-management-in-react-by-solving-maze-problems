import "./App.css";
import Maze from "./components/maze/maze.component";
import Menu from "./components/menu/menu.component";

function App() {
  return (
    <div className='App'>
      <Menu />
      <Maze />
    </div>
  );
}

export default App;
