import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Users from "./pages/Users";
function AppRoute() {
    return (
    <Routes>    
        <Route path="/" element={<Home />} /> 
        <Route path="/utilisateurs" element={<Users />} />
    </Routes>
    )
}
export default AppRoute;