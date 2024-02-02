import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import Creatlisting from "./pages/Creatlisting";
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/createlisting" element={<Creatlisting/>} />
        </Route>

        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
