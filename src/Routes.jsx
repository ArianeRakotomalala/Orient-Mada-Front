import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import PostCard from "./components/PostCard";
import Feed from "./components/Feed";
import Essai from "./pages/Orientation";
import Story from "./components/StoryViewer";
import University from "./pages/university";
import Profil from "./pages/Profil";
function AppRoute() {
    return (
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />    
        
        <Route path="/home" element={<Layout/>}> 
            <Route index element={<Home/>} />
            <Route path="university" element={<University />} />
            <Route path="orientation" element={<Essai />} />
            <Route path="profil" element={<Profil/>}/>
        </Route>
            
    </Routes>
    )
}
export default AppRoute;
