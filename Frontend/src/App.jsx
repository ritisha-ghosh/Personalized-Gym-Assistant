import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>This is the end hold your breath and count to ten.</h1>
      <h1>The winner takes it all and the loser has to fall.</h1>
      <button>Give Up</button>
      <button>Die</button>
    </>
  )
}

export default App;