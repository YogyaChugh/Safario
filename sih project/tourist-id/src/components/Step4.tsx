import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import "./Step4.css";

interface Step4Props {
  userData: {
    fullName: string;
    nationality: string;
    photo?: string;
    idNo: string;
  };
  qrData:string
  touristId: string;
  validTill: string;
  darkMode?: boolean;
  goToDigitalId: () => void;
  goPrev: () => void;
}

const Step4: React.FC<Step4Props> = ({
  userData,
  touristId,
  validTill,
  darkMode = false,
  goToDigitalId,
  goPrev,
  qrData,
}) => {
  const { t } = useTranslation();
  const [qrCodeData, setQrCodeData] = useState<string>("");

  useEffect(() => {
    const data = {
      name: userData.fullName,
      idNo: userData.idNo,
      id: touristId,
      nationality: userData.nationality,
      validTill: validTill,
    };
    setQrCodeData(JSON.stringify(data));
  }, [userData, touristId, validTill]);

  const handleGoToDigitalId = () => {
    const digitalId = {
      ...userData,
      touristId,
      validTill,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        qrCodeData
      )}`,
    };
    localStorage.setItem("digitalId", JSON.stringify(digitalId));
    goToDigitalId();
  };

  const photo =
    userData.photo ||
    JSON.parse(localStorage.getItem("digitalId") || "{}").photo ||
    "https://via.placeholder.com/120";

  return (
    <div
      className={`step4-container ${darkMode ? "dark" : "light"}`}
      style={{ minHeight: "120vh", paddingBottom: "40px" }}
    >
      {/* Heading Bar */}
      <div
        className="smart-id-heading"
        style={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          backgroundColor: "#FF9933",
          color: "#000",
          padding: "12px 0",
          marginBottom: "20px",
          borderRadius: "4px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {t("step4.heading")}
      </div>

      {/* ID Card */}
      <div
        className="id-card"
        style={{
          backgroundColor: darkMode ? "#222222" : "#f9f9f9",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "350px",
          margin: "0 auto 20px auto",
          textAlign: "center",
        }}
      >
        <img
          src={photo}
          alt="User"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        />
        <h3>{userData.fullName}</h3>
        <p>
          <strong>{t("step4.nationality")}:</strong> {userData.nationality}
        </p>
        <p>
          <strong>{t("step4.idNo")}:</strong> {userData.idNo}
        </p>
        <p>
          <strong>{t("step4.blockchainId")}:</strong> {touristId}
        </p>
        <p>
          <strong>{t("step4.validTill")}:</strong> {validTill}
        </p>

        <div
          className="qr-code"
          style={{
            padding: "10px",
            backgroundColor: "#fff",
            display: "inline-block",
            marginTop: "10px",
            borderRadius: "8px",
          }}
        >
          <QRCode value={qrData} size={150}/>
        </div>
      </div>

      {/* Success Message */}
      <div className="success-message" style={{ marginBottom: "20px", textAlign: "center" }}>
        {t("step4.successMessage")}
      </div>

      {/* Buttons: one left, one right */}
      <div
        className="button-group"
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "350px",
          margin: "0 auto",
          gap: "10px",
        }}
      >
        <button
          className="back-button"
          onClick={goPrev}
          style={{
            flex: 1,
            padding: "8px 12px",
            backgroundColor: darkMode ? "#fff" : "#000",
            color: darkMode ? "#000" : "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {t("step4.back")}
        </button>
        <button
          className="next-button"
          onClick={handleGoToDigitalId}
          style={{
            flex: 1,
            padding: "8px 12px",
            backgroundColor: darkMode ? "#fff" : "#000",
            color: darkMode ? "#000" : "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {t("step4.goToDigitalId")}
        </button>
      </div>
    </div>
  );
};

export default Step4;
