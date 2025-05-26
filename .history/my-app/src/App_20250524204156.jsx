import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1 className="font-bebas text-4xl">Hello World</h1>
        <h1 className="font-raleway text-4xl">Hello World</h1>
        <h1 className="font-jaro text-4xl">Hello World</h1>

      </div>
    </>
  )
}

export default App
