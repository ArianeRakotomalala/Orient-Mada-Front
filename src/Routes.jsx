import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Layout from "./components/Layout";
import Register from "./pages/Register";
function AppRoute() {
    return (
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />    
        <Route path="/" element={<Home />} /> 
        <Route path="/layout" element={<Layout/>} /> 
    </Routes>
    )
}
export default AppRoute;