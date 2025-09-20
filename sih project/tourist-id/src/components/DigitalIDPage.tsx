import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import "./DigitalIDPage.css";

const DigitalIDPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  const [darkMode, setDarkMode] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [digitalId, setDigitalId] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);

  const languages = [
    { code: "en", label: t("header.english") },
    { code: "hi", label: t("header.hindi") },
  ];

  // Load saved theme, language, and ID
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark");

    const savedLang = localStorage.getItem("language");
    if (savedLang) i18n.changeLanguage(savedLang);

    const savedId = localStorage.getItem("digitalId");
    if (savedId) setDigitalId(JSON.parse(savedId));

    document.body.style.backgroundColor =
      savedTheme === "dark" ? "#000000" : "#ffffff";
  }, [i18n]);

  // Apply theme change
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.style.backgroundColor = darkMode ? "#000000" : "#ffffff";
  }, [darkMode]);

  const handleLangChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    setLangOpen(false);
  };

  const handleVerify = () => {
    setTimeout(() => setIsVerified(true), 1000);
  };

  const handleDownload = () => {
    alert(t("digitalId.downloadBtn") + " (demo only)");
  };

  // Get localized nationality
  const getLocalizedNationality = (nationality: string) => {
    if (!digitalId?.nationality) return "N/A";
    return t(`register.form.nationalities.${nationality}`) || nationality;
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
              {i18n.language === "hi"
                ? t("header.hindi")
                : t("header.english")}
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

      {/* Digital ID Content */}
      <main className="digitalid-page">
        <h1 className="page-heading" style={{ color: darkMode ? "#fff" : "#000" }}>
          {t("digitalId.heading")}
        </h1>

        {!digitalId ? (
          <p className="no-id-msg">{t("digitalId.noId")}</p>
        ) : (
          <div className="id-layout">
            {/* ID Card */}
            <div className="id-card tricolor">
              <div
                className="smart-id-header"
                style={{
                  backgroundColor: "#FF9933",
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "22px",
                  textAlign: "center",
                  padding: "6px 0",
                  marginBottom: "12px",
                  borderRadius: "4px",
                }}
              >
                Smart ID
              </div>

              <div className="id-body" style={{ textAlign: "center" }}>
                {/* Photo */}
                <div className="id-photo">
                  <img
                    src={digitalId.photo || "https://via.placeholder.com/120"}
                    alt="User"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "10px",
                    }}
                  />
                </div>

                {/* Info */}
                <div className="id-info">
                  <p>
                    <strong>{t("register.form.name")}:</strong> {digitalId.fullName || "N/A"}
                  </p>
                  <p>
                    <strong>{t("register.form.nationality")}:</strong>{" "}
                    {getLocalizedNationality(digitalId.nationality)}
                  </p>
                  <p>
                    <strong>{t("register.form.idOrPassport")}:</strong> {digitalId.idNo || "N/A"}
                  </p>
                  <p>
                    <strong>ID:</strong> {digitalId.blockchainId || "N/A"}
                  </p>
                  <p>
                    <strong>{t("step4.validTill")}:</strong> {digitalId.validTill || "N/A"}
                  </p>
                </div>

                {/* QR Code */}
                <div
                  className="id-qr"
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {digitalId.qrCode ? (
                    <img
                      src={digitalId.qrCode}
                      alt="QR Code"
                      style={{
                        width: "160px",
                        height: "160px",
                        borderRadius: "0px",
                        objectFit: "contain",
                        background: "#fff",
                        padding: "6px",
                      }}
                    />
                  ) : (
                    <QRCode
                      value={JSON.stringify(digitalId)}
                      size={160}
                      style={{
                        width: "160px",
                        height: "160px",
                        background: "#fff",
                        padding: "6px",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Verification Box */}
            <div
              className="status-action-box"
              style={{
                color: darkMode ? "#fff" : "#000",
                backgroundColor: darkMode ? "#222" : "#eee",
              }}
            >
              <p className={`status-text ${isVerified ? "verified" : "not-verified"}`}>
                {isVerified ? t("digitalId.verified") : t("digitalId.pending")}
              </p>

              <button
                className="role-btn"
                style={{
                  backgroundColor: darkMode ? "#fff" : "#000",
                  color: darkMode ? "#000" : "#fff",
                }}
                onClick={isVerified ? handleDownload : handleVerify}
              >
                {isVerified ? t("digitalId.downloadBtn") : t("digitalId.verifyBtn")}{" "}
                <span className="arrow">➔</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DigitalIDPage;
