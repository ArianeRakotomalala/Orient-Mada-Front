import { BrowserRouter } from 'react-router-dom'
import AppRoute from './Routes'
import { UserProvider } from './Context/UserContext';
import { DataProvider } from './Context/DataContext';
import { ListUserProvider } from './context/ListUserContext';

function App() {
  return (
    <DataProvider>
      <UserProvider>
        <ListUserProvider>
          <BrowserRouter>
            <AppRoute />
          </BrowserRouter>
        </ListUserProvider>
      </UserProvider>
    </DataProvider>
  );
}

export default App;
