import React from 'react'

import {Navbar} from './components'
import Routes from './routes'
import './main.scss'

const App = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <Routes />
    </div>
  )
}

export default App
