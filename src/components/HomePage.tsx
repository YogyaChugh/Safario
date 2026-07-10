import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./HomePage.css";
import ph1 from "../assets/ph1.jpg";
import { useNavigate } from "react-router-dom";
// Import background image
import image from "../assets/northeast.jpg";
import ph2 from "../assets/ph2.jpg";
import ai from "../assets/ai.jpg";
import tour from "../assets/tour.jpg";


const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const languages = [
    { code: "en", label: t("header.english") },
    { code: "hi", label: t("header.hindi") },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark");

    const savedLang = localStorage.getItem("language");
    if (savedLang) i18n.changeLanguage(savedLang);

    document.body.style.backgroundColor =
      savedTheme === "dark" ? "#000000" : "#ffffff";
  }, [i18n]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.style.backgroundColor = darkMode ? "#000000" : "#ffffff";
  }, [darkMode]);

  const handleLangChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    setLangOpen(false);
  };

  return (
    <div className={`homepage ${darkMode ? "dark" : "light"}`}>
      {/* Header */}
      <header className="homepage-header">
        <div className="logo">{t("header.logo")}</div>
        <div className="header-options">
          {/* Language Dropdown */}
          <div
            className="option-btn lang-box"
            onClick={() => setLangOpen(!langOpen)}
          >
            <span className="icon">🌐</span>
            <span className="label">
              {i18n.language === "hi" ? t("header.hindi") : t("header.english")}
            </span>
            <span className="arrow">▾</span>

            {langOpen && (
              <div className="lang-dropdown">
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    className={`lang-option ${
                      lang.code === i18n.language ? "selected" : ""
                    }`}
                    onClick={() => handleLangChange(lang.code)}
                  >
                    {lang.label}
                    {lang.code === i18n.language && <span className="check">✔</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dark/Light Mode Toggle */}
          <button className="option-btn" onClick={() => setDarkMode(!darkMode)}>
            <span className="icon">{darkMode ? "🌙" : "☀️"}</span>
            {darkMode ? t("header.darkMode") : t("header.lightMode")}
          </button>
        </div>
      </header>

      {/* Feature Box Section with background image */}
      <section
        className="feature-box"
        style={{ backgroundImage: `url(${image})` }}
      >
      </section>
      {/* Section below image1.jpg */}
<section className="app-intro-section">
  <h1 className="app-title">{t("intro.title")}</h1>
  <p className="app-subtitle">{t("intro.subtitle")}</p>
</section>


{/* Role Selection Section */}
<section className="role-selection-section">
  <div className="big-box">
    {/* Subtitle */}
    <h3 className="role-subtitle">
      {t("roles.subtitle")}
    </h3>

    {/* Two columns inside the big box */}
    <div className="role-columns">

      {/* Tourist Box */}
      <div className="role-column">
        <h3>{t("roles.tourist.title")}</h3>
        <p>{t("roles.tourist.description")}</p>
        <ul className="role-info">
          <li> {t("roles.tourist.features.id")}</li>
          <li> {t("roles.tourist.features.score")}</li>
          <li> {t("roles.tourist.features.geo")}</li>
          <li> {t("roles.tourist.features.panic")}</li>
        </ul>
        <button
  className="role-btn"
  onClick={() => navigate("/register")}
>
  {t("roles.tourist.button")} <span className="arrow">arrow_forward</span>
</button>

      </div>

      {/* Authority Box */}
      <div className="role-column">
        <h3>{t("roles.authority.title")}</h3>
        <p>{t("roles.authority.description")}</p>
        <ul className="role-info">
          <li> {t("roles.authority.features.dashboard")}</li>
          <li> {t("roles.authority.features.incident")}</li>
          <li> {t("roles.authority.features.tracking")}</li>
          <li> {t("roles.authority.features.response")}</li>
        </ul>
        <button
          className="role-btn"
          onClick={() => (window.location.href = `${window.location.origin}/admin.html`)}
        >
          {t("roles.authority.button")} <span className="arrow">arrow_forward</span>
        </button>

      </div>
      {/* Key Features Section */}
{/* Key Features Section */}
<section className="key-features-section">
  <h2 className="features-title">{t("features.title")}</h2>

  <div className="features-row">
    {/* Left column - Digital ID info */}
    <div className="feature-card">
      <h3>{t("features.digitalID.title")}</h3>
      <ul>
        <li>{t("features.digitalID.point1")}</li>
        <li>{t("features.digitalID.point2")}</li>
        <li>{t("features.digitalID.point3")}</li>
        <li>{t("features.digitalID.point4")}</li>
        <li>{t("features.digitalID.point5")}</li>
      </ul>
    </div>

    {/* Right column - Image */}
    <div className="feature-image-box">
      <img src={ph1} alt="Digital ID" />
    </div>
  </div>
</section>
{/* Second Feature Section */}
<section className="key-features-section">
  <div className="features-row">
    {/* Left column - Image */}
    <div className="feature-image-box">
      <img src={ph2} alt="Tourist Mobile App" />
    </div>

    {/* Right column - Mobile App Features info */}
    <div className="feature-card">
      <h3>{t("features.mobileApp.title")}</h3>
      <ul>
        <li>{t("features.mobileApp.point1")}</li>
        <li>{t("features.mobileApp.point2")}</li>
        <li>{t("features.mobileApp.point3")}</li>
        <li>{t("features.mobileApp.point4")}</li>
      </ul>
    </div>
  </div>
</section>
{/* Feature 3: AI Anomaly Detection */}
<section className="key-features-section">
  <div className="features-row">
    {/* Text on left, image on right */}
    <div className="feature-card">
      <h3>{t("features.aiAnomaly.title")}</h3>
      <ul>
        <li>{t("features.aiAnomaly.point1")}</li>
        <li>{t("features.aiAnomaly.point2")}</li>
        <li>{t("features.aiAnomaly.point3")}</li>
      </ul>
    </div>
    <div className="feature-image-box">
      <img
        src={ai}
        alt="AI Anomaly Detection"
      />
    </div>
  </div>
</section>
{/* Tourism/Police Authority Feature Box */}
<section className="key-features-section">

  <div className="features-row">
    {/* Image on the left */}
    <div className="feature-image-box">
      <img src={tour} alt="Tourism department" />
    </div>

    {/* Text Card on the right */}
    <div className="feature-card">
      <h3>{t("features.authority.heading")}</h3>
      <ul>
        <li>{t("features.authority.point1")}</li>
        <li>{t("features.authority.point2")}</li>
        <li>{t("features.authority.point3")}</li>
        <li>{t("features.authority.point4")}</li>
      </ul>
    </div>
  </div>
</section>



    </div>
  </div>
</section>
    </div>
  );
};

export default HomePage;
