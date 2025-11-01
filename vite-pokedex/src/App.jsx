import { useState } from "react";
import "./App.css";
import Pokedex2D from "./components/Pokedex2D";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-with-3d">
      <Pokedex2D />
    </div>
  );
}

export default App;
