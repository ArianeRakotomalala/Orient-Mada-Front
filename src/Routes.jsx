import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Login from "./pages/login";
function AppRoute() {
    return (
    <Routes>    
        <Route path="/" element={<Home />} /> 
        <Route path="/utilisateurs" element={<Users />} />
        <Route path="/login" element={<Login/>} />
    </Routes>
    )
}
export default AppRoute;