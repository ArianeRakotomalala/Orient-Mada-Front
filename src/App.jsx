import { BrowserRouter } from 'react-router-dom'
import AppRoute from './Routes'
import { FavorisProvider } from './Context/FavoriteContext.jsx'  
import { UserProvider } from './Context/UserContext';
import { DataProvider } from './Context/DataContext';

function App() {
  return (
    <DataProvider>
      <UserProvider>
        <FavorisProvider>
          <BrowserRouter>
            <AppRoute />
          </BrowserRouter>
        </FavorisProvider>
      </UserProvider>
    </DataProvider>
  )
}

export default App
