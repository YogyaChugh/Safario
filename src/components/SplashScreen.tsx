import React, { useEffect } from 'react';
import logo from '../assets/logo.png';
import './SplashScreen.css';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 4000); // 4 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-container">
      {/* Particle network */}
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      {/* Logo */}
      <img src={logo} alt="App Logo" className="splash-logo" />

      {/* Slogan */}
      <h1 className="splash-slogan">Your Safety, Our Journey</h1>
    </div>
  );
};

export default SplashScreen;
