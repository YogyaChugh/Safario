// RegisterPage.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import Step3 from "./step3";
import Step4 from "./Step4";
//import { ethers } from "ethers";


interface PersonalInfo {
  fullName: string;
  email: string;
  age: string;
  phone: string;
  nationality: string;
  idNo: string;
  // note: photo is saved to localStorage by Step3, so it's optional here
}

const RegisterPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [langOpen, setLangOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  // const [provider, setProvider] = useState<any>(null);
  // const [signer, setSigner] = useState<any>(null);
  // const [address, setAddress] = useState<any>("");
  const [qrData, setqrData] = useState<string>("");
  const [arrivalDate,setarrivalDate]=useState<any>("")
  

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    email: "",
    age: "",
    phone: "",
    nationality: "",
    idNo: "",
  });
  
  const [touristId, setTouristId] = useState<any>(null); // Example ID
  const [validTill, setValidTill] = useState<string>(""); // Example expiry date

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

  const handlePersonalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setPersonalInfo((prev) => ({ ...prev, phone: digitsOnly }));
    } else {
      setPersonalInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

 
  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalInfo.fullName.trim() || !personalInfo.email.trim()) {
      alert(t("register.form.fillRequired") ?? "Please fill required fields");
      return;
    }
    setCurrentStep(2);
  };


     
  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1));
  const goNext = () => setCurrentStep((s) => Math.min(4, s + 1));

  return (
    <div className={`homepage ${darkMode ? "dark" : "light"}`}>
      {/* Header */}
      <header className="homepage-header">
        <div className="logo">{t("header.logo")}</div>
        <div className="header-options">
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

          <button className="option-btn" onClick={() => setDarkMode(!darkMode)}>
            <span className="icon">{darkMode ? "🌙" : "☀️"}</span>
            {darkMode ? t("header.darkMode") : t("header.lightMode")}
          </button>
        </div>
      </header>

      {/* Intro Section */}
      <section className="register-intro-section">
        <h1 className="register-title">
          <span
            className="back-arrow-box"
            onClick={() => navigate(-1)}
            role="button"
            aria-label={t("register.back") ?? "Back"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate(-1);
            }}
          >
            ←
          </span>{" "}
          {t("register.title")}
        </h1>
        <p className="register-subtitle">{t("register.subtitle")}</p>
      </section>

      {/* Steps Line */}
      <section className="registration-steps-section">
        <div className="steps-line" aria-hidden>
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>1</div>
          <div className="line" />
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>2</div>
          <div className="line" />
          <div className={`step ${currentStep >= 3 ? "active" : ""}`}>3</div>
          <div className="line" />
          <div className={`step ${currentStep >= 4 ? "active" : ""}`}>4</div>
        </div>

        {currentStep === 1 && (
          <form className="step-form" onSubmit={handleSubmitStep1}>
            <div className="form-box">
              <h2 className="form-section-title">
                {t("register.personalInfo.title") || "Personal Information"}
              </h2>

              <div className="form-row form-half-row">
                <div className="form-half">
                  <label>{t("register.form.name") || "Full Name"}</label>
                  <input
                    name="fullName"
                    type="text"
                    placeholder={t("register.form.placeholder.name") || "Enter full name"}
                    value={personalInfo.fullName}
                    onChange={handlePersonalChange}
                    required
                  />
                </div>
                <div className="form-half">
                  <label>{t("register.form.age") || "Age"}</label>
                  <input
                    name="age"
                    type="number"
                    placeholder={t("register.form.placeholder.age") || "Enter age"}
                    value={personalInfo.age}
                    onChange={handlePersonalChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <label>{t("register.form.email") || "Email Address"}</label>
                <input
                  name="email"
                  type="email"
                  placeholder={t("register.form.placeholder.email") || "Enter email address"}
                  value={personalInfo.email}
                  onChange={handlePersonalChange}
                  required
                />
              </div>

              <div className="form-row">
                <label>{t("register.form.phone") || "Phone Number"}</label>
                <input
                  name="phone"
                  type="text"
                  placeholder={t("register.form.placeholder.phone") || "+91 XXXXX XXXXX"}
                  value={personalInfo.phone}
                  onChange={handlePersonalChange}
                  required
                />
              </div>

              <div className="form-row">
  <label>{t("register.form.nationality") || "राष्ट्रीयता"}</label>
  <select
    name="nationality"
    value={personalInfo.nationality}
    onChange={handlePersonalChange}
    required
  >
    <option value="">
      {t("register.form.placeholder.nationality") || "अपनी राष्ट्रीयता चुनें"}
    </option>
    <option value="Indian">{t("register.form.nationalities.Indian") || "भारतीय"}</option>
    <option value="American">{t("register.form.nationalities.American") || "अमेरिकी"}</option>
    <option value="Korean">{t("register.form.nationalities.Korean") || "कोरियाई"}</option>
    <option value="Japanese">{t("register.form.nationalities.Japanese") || "जापानी"}</option>
    <option value="Other">{t("register.form.nationalities.Other") || "अन्य"}</option>
  </select>
</div>

              <div className="form-row">
                <label>{t("register.form.idOrPassport") || "Aadhaar Number (Indians)"}</label>
                <input
                  name="idNo"
                  type="text"
                  placeholder={t("register.form.placeholder.idOrPassport") || "XXXXXXXXXXXX or Passport Number"}
                  value={personalInfo.idNo}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/\s/g, "");
                    setPersonalInfo((prev) => ({ ...prev, idNo: newValue }));
                  }}
                  pattern="^\S*$"
                  title="No spaces allowed"
                  required
                />
              </div>

              <div className="form-actions single-button">
                <button type="submit" className="step-next">
                  {t("register.next", "Next")}
                </button>
              </div>
            </div>
          </form>
        )}

        {currentStep === 2 && (
          <form
            className="step-form"
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentStep(3);
            }}
          >
            <div className="form-box">
              <h2 className="form-section-title">
                {t("register.travelDetails.title") || "Travel Details"}
              </h2>

              <div className="form-row">
                <label>{t("register.form.departureCity") || "Departure City"}</label>
                <input
                  name="departureCity"
                  type="text"
                  placeholder={t("register.form.placeholder.departureCity") || "Enter departure city"}
                  required
                />
              </div>

              <div className="form-row">
                <label>{t("register.form.arrivalCity") || "Arrival City"}</label>
                <input
                  name="arrivalCity"
                  type="text"
                  placeholder={t("register.form.placeholder.arrivalCity") || "Enter arrival city"}
                  required
                />
              </div>

              <div className="form-row form-half-row">
                <div className="form-half">
                  <label>{t("register.form.departureDate") || "Departure Date"}</label>
                  <input name="departureDate" type="date" value={arrivalDate} onChange={(e) => setarrivalDate(e.target.value)} required />
                </div>
                <div className="form-half">
                  <label>{t("register.form.returnDate") || "Return Date"}</label>
                  <input name="returnDate" type="date" value={validTill} onChange={(e) => setValidTill(e.target.value)}/>
                </div>
              </div>

              <div className="form-row">
                <label>{t("register.form.purpose") || "Purpose of Travel"}</label>
                <select name="purpose" required>
                  <option value="">
                    {t("register.form.placeholder.purpose") || "Select purpose"}
                  </option>
                  <option value="tourism">{t("register.form.purposeTourism") || "Tourism"}</option>
                  <option value="business">{t("register.form.purposeBusiness") || "Business"}</option>
                  <option value="education">{t("register.form.purposeEducation") || "Education"}</option>
                  <option value="other">{t("register.form.purposeOther") || "Other"}</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={goPrev} className="back-button">
                  {t("register.prev", "Back")}
                </button>
                <button type="submit" className="step-next">
                  {t("register.next", "Next")}
                </button>
              </div>
            </div>
          </form>
        )}

        {currentStep === 3 && (
          <Step3
            goPrev={goPrev}
            onNext={() => setCurrentStep(4)}
            idNo={personalInfo.idNo}
            arrivalDate={arrivalDate}
            setqrData={setqrData}
            setTouristId={setTouristId} // move to step 4 after Step3
          />
        )}

       {currentStep === 4 && (
  <Step4
    userData={{
      fullName: personalInfo.fullName,
      nationality: personalInfo.nationality,
      photo:
        personalInfo.photo ||
        JSON.parse(localStorage.getItem("digitalId") || "{}").photo ||
        "https://via.placeholder.com/120",
      idNo: personalInfo.idNo,
    }}
    touristId={touristId}
    validTill={validTill}
    darkMode={darkMode}
    qrData={qrData}
    goToDigitalId={() => navigate("/digital-id")}
    goPrev={goPrev}
  />
)}



      </section>
    </div>
  );
};

export default RegisterPage;
