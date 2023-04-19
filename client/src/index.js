import React from 'react'
import ReactDOM from 'react-dom/client'

import 'normalize.css'
import './index.css'

import App from './App'
import { AppProvider } from './context/appContext'

import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (process.env.NODE_ENV === 'production') disableReactDevTools()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
)
