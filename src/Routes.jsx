import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import Orientation from "./pages/Orientation";
import University from "./pages/University";
import Formation from "./pages/Formation";
import UniversityDetails from "./pages/UniversityDetails";
import Profil from "./pages/Profil";
import Message from "./pages/Message";
import Compare from "./pages/Compare";
import Events from "./pages/Events";
import Notifications from './pages/Notifications';

// Import des composants d'administration
import AdminLayout from "./components/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import Dashboard from "./pages/admin/Dashboard";
import FormationAdmin from "./pages/admin/FormationAdmin";
import TestAdmin from "./pages/admin/TestAdmin";
import SimpleAdmin from "./pages/admin/SimpleAdmin";
import Statistics from "./pages/admin/Statistics";
import UniversityAdmin from "./pages/admin/UniversityAdmin";
import EvenementsAdmin from './pages/admin/EvenementsAdmin';
import User from "./pages/admin/User";
    
function AppRoute() {
    return (
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />    
        
        <Route path="/home" element={<Layout/>}> 
            <Route index element={<Home/>} />
            <Route path="university" element={<University />} />
            <Route path="university/:id" element={<UniversityDetails />} />
            <Route path="orientation" element={<Orientation />} />
            <Route path="formation" element={<Formation />} />
            <Route path="profil" element={<Profil/>}/>
            <Route path="comparer" element={<Compare/>}/>
            <Route path="message" element={<Message/>}/>
            <Route path="event" element={<Events/>}/>
            <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Routes d'administration protégées */}
        <Route path="/admin" element={
            <AdminRoute>
                <AdminLayout />
            </AdminRoute>
        }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="formations" element={<FormationAdmin />} />
            <Route path="universities" element={<UniversityAdmin />} />
            <Route path="test" element={<TestAdmin />} />   
            <Route path="simple" element={<SimpleAdmin />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="evenements" element={<EvenementsAdmin />} />
            <Route path="users" element={<User />} />
            {/* Ajoutez d'autres routes admin ici */}
        </Route>
            
    </Routes>
    )
}
export default AppRoute;
