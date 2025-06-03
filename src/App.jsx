import { BrowserRouter } from 'react-router-dom'
import AppRoute from './Routes'
import { FavorisProvider } from './Context/FavoriteContext.jsx'  

function App() {
  return (
    <FavorisProvider>
      <BrowserRouter>
        <AppRoute />
      </BrowserRouter>
    </FavorisProvider>
  )
}

export default App
