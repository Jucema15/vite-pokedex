import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Pokedex2D from "./components/Pokedex2D";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Pokedex2D />
    </>
  )
}

export default App
