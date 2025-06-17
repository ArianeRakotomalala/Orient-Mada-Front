import { BrowserRouter } from 'react-router-dom'
import AppRoute from './Routes'
import { UserProvider } from './Context/UserContext';
import { DataProvider } from './Context/DataContext';

function App() {
  return (
    <DataProvider>
      <UserProvider>
        <BrowserRouter>
          <AppRoute />
        </BrowserRouter>
      </UserProvider>
    </DataProvider>
  );
}

export default App;
