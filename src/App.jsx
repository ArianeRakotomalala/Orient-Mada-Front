import { BrowserRouter } from 'react-router-dom'
import AppRoute from './Routes'
import { FavorisProvider } from './Context/FavoriteContext.jsx'  
import { UserProvider } from './Context/UserContext';

function App() {
  return (
    <UserProvider>
      <FavorisProvider>
        <BrowserRouter>
          <AppRoute />
        </BrowserRouter>
      </FavorisProvider>
    </UserProvider>
  )
}

export default App
