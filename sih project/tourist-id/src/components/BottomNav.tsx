import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaIdCard, FaMapMarkedAlt, FaUserCog } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./BottomNav.css";

const BottomNav: React.FC = () => {
  const { t } = useTranslation();

  const handleSOSClick = () => {
    alert(t("nav.sosAlert")); // message changes with language
  };

  return (
    <div className="bottom-nav">
      <NavLink to="/" className="nav-item">
        <FaHome />
        <span>{t("nav.home")}</span>
      </NavLink>

      <NavLink to="/digital-id" className="nav-item">
        <FaIdCard />
        <span>{t("nav.digitalId")}</span>
      </NavLink>

      {/* Center SOS Button */}
      <button className="sos-button" onClick={handleSOSClick}>
        SOS
      </button>
{/* 
      <NavLink to="/map" className="nav-item">
        <FaMapMarkedAlt />
        <span>{t("nav.map")}</span>
      </NavLink> */}
      <button
        className="map-button"
        onClick={() => window.location.replace("/user.html")}
      >
        <FaMapMarkedAlt />
        <span>{t("nav.map")}</span>
      </button>

      <NavLink to="/profile" className="nav-item">
        <FaUserCog />
        <span>{t("nav.profile")}</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
