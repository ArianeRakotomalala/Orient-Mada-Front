import { BrowserRouter } from 'react-router-dom'
import AppRoute from './Routes'
import { UserProvider } from './context/UserContext';
import { DataProvider } from './context/DataContext';
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
