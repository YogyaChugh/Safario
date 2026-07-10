import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import HomePage from "./components/HomePage";
import BottomNav from "./components/BottomNav";
import RegisterPage from "./components/RegisterPage";
import DigitalIDPage from "./components/DigitalIDPage";
// import RedirectToUser from "./components/RedirectToUser";
const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/digital-id" element={<DigitalIDPage />} />
            {/* <Route path="/map" element={<RedirectToUser />} /> */}
            <Route path="/safety" element={<div>Safety Score Page</div>} />
            <Route path="/profile" element={<div>Profile / Settings Page</div>} />
          </Routes>
          <BottomNav />
        </>
      )}
    </div>
  );
};

export default App;
