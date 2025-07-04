import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { trpc } from './utils/trpc'

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  
  const hello = trpc.hello.useQuery({ name })

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + tRPC</h1>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        
        <div style={{ marginTop: '20px' }}>
          <h2>tRPC Demo</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: '10px', padding: '5px' }}
          />
          {hello.data && <p>{hello.data.message}</p>}
        </div>
        
      </div>
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App