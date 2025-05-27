import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import PostCard from "./components/PostCard";
import Feed from "./components/Feed";
import Essai from "./pages/Orientation";
import Story from "./components/StoryViewer";
function AppRoute() {
    return (
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />    
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/layout" element={<Layout/>}> 
            <Route path="home" element={<Home />} />
            <Route path="university" element={<Login />} />
            {/* <Route path="explore" element={<Register />} /> */}
            {/* <Route path="formation" element={<Formation />} /> */}
            {/* <Route path="event" element={<Event />} /> */}
            <Route path="orientation" element={<Essai />} />
            <Route path="postcard" element={<Feed/>} />
        </Route>
        <Route path="/story" element={<Story/>} />
            
    </Routes>
    )
}
export default AppRoute;