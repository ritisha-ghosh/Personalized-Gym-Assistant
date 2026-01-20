import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Workout from './pages/Workout'
import Neutrations from './pages/Neutrations'
import Settings from './pages/Settings'
import Progression from './pages/Progression'
import ChatBot from './pages/ChatBot'

function App() {
  

  return (
    <>
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/workouts' element={<Workout/>}/>
      <Route path='/nutrition' element={<Neutrations/>}/>
      <Route path='/settings' element={<Settings/>}/>
      <Route path='/progress' element={<Progression/>}/>
      <Route path='/chat' element={<ChatBot/>}/>
    </Routes>
      
    </>
  )
}

export default App
