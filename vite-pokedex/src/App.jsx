import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Pokedex2D from "./components/Pokedex2D";
import Card3D from "./components/Card3D";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-with-3d">
      <Pokedex2D />
    </div>
  )
}

export default App
