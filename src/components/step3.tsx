import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ethers } from "ethers";



interface Step3Props {
  goPrev: () => void;
  onNext: () => void;
  idNo: string;
  arrivalDate: string;
  setqrData: (data: string) => void;
  setTouristId: (id: string) => void;
}

interface CreateTouristResult {
  id: bigint;    // or number if it's not a bigint
  tourist_data: string;
}
const abi: ethers.InterfaceAbi = [
  "function createTourist(string rawData) public returns (uint256)",
  "function deleteTourist(uint256 id) public",
  "function hotelverified(string rawdata, uint256 id) public view returns (bool)",
  "function adminverified(uint256 id) public",
  "function nextId() view returns (uint256)",
  "function tourists(uint256) view returns (uint256 id, bytes32 dataHash, bool verificationState)",
  "event TouristCreated(uint256 id, bytes32 dataHash, bool verificationState)",
  "event TouristDeleted(uint256 id)"
];

const contractAddress: string = "0xd2eb6d7f782bcea06750ccbdf3ba16f4b32a6bc7";


const Step3: React.FC<Step3Props> = ({ goPrev, onNext , idNo,arrivalDate,setqrData,setTouristId }) => {
  const { t } = useTranslation();
  const [photo, setPhoto] = useState<string | null>(null); // base64
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [rawData, setRawData] = useState<any>("");const [address, setAddress] = useState<any>("");
  const [qr, setQr] = useState<string>("");

  
const createTourist=async(): Promise<CreateTouristResult>=> {
    if (!signer) {
      //alert("Connect wallet first!");
      throw new Error("Connect wallet first!");
    }

    try {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tourist_data = idNo + arrivalDate; // create local rawData
      setRawData(tourist_data); // update state

      
      const tx=await contract.createTourist(tourist_data);
      tx.wait();
      const tempid = await contract.nextId();
      let id=tempid-1n
      return { id, tourist_data }; // return both
    } catch (err) {
      console.error("Transaction failed:", err);
      throw err;
    }
  }
  
   async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not installed!");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const prov = new ethers.BrowserProvider(window.ethereum);
      const sig = await prov.getSigner();
      const addr = await sig.getAddress();

      setProvider(prov);
      setSigner(sig);
      setAddress(addr);
    } catch (err) {
      console.error("Connection failed:", err);
    }
  }
  

  // const connectWallet = async () => {
  //   try {
  //     if (!window.ethereum) {
  //       alert(t("step3.metamaskAlert"));
  //       return;
  //     }

  //     const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  //     if (accounts.length > 0) setWalletAddress(accounts[0]);

  //     window.ethereum.on("accountsChanged", (newAccounts: string[]) => {
  //       setWalletAddress(newAccounts[0] || null);
  //     });

  //     window.ethereum.on("chainChanged", () => window.location.reload());
  //   } catch (err) {
  //     console.error("Error connecting wallet:", err);
  //     alert(t("step3.walletError"));
  //   }
  // };

  const shortenAddress = (address: string) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhoto(base64);

        // Save immediately to localStorage
        const existingId = localStorage.getItem("digitalId");
        let digitalId = existingId ? JSON.parse(existingId) : {};
        digitalId.photo = base64;
        localStorage.setItem("digitalId", JSON.stringify(digitalId));
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleNext = () => {
  //   const existingId = localStorage.getItem("digitalId");
  //   let digitalId = existingId ? JSON.parse(existingId) : {};
  //   digitalId.walletAddress = walletAddress;
  //   if (photo) digitalId.photo = photo;

  //   localStorage.setItem("digitalId", JSON.stringify(digitalId));
  //   onNext();
  // };
const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    // const { id, tourist_data } = await createTourist();
    // setTouristId(id.toString());

    // // build qr string directly from local vars (not stale state)
    // const qrString = id.toString() + '-'+tourist_data;
    // setqrData(qrString);
    // handleNext();
    try {
      // Try to create tourist on blockchain
      const { id, tourist_data } = await createTourist();
      setTouristId(id.toString());
      
      const qrString = id.toString() + '-' + tourist_data;
      setqrData(qrString);
      
    } catch (error) {
      // If blockchain transaction fails, generate a mock/local ID instead
      console.warn("Blockchain transaction failed, using local ID:", error);
     
      
      // Generate a mock tourist ID for local use
      const mockId = 5

      const tourist_data = idNo + arrivalDate;
      
      setTouristId(mockId.toString());
      const qrString = mockId.toString() + '-' + tourist_data;
      setqrData(qrString);
    } finally {
      // Always proceed to step4 regardless of transaction success/failure
      onNext();
    }
  };
  return (
    <form
      className="step-form"
      onSubmit= {handleSubmit}
    >
      <div className="form-box">
        <h2 className="form-section-title">{t("step3.heading")}</h2>

        {/* Photo Upload */}
        <div className="form-row">
          <label>{t("step3.photoUpload")}</label>
          <input type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
          {photo && (
            <img
              src={photo}
              alt="Uploaded"
              style={{
                marginTop: "10px",
                width: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          )}
        </div>

        {/* Wallet Connection */}
        <div className="form-row">
          <label>{t("step3.connectWallet")}</label>
          <button type="button" className="step-next" onClick={connectWallet}>
            {walletAddress
              ? t("step3.connected", { address: shortenAddress(walletAddress) })
              : t("step3.connectWallet")}
          </button>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="back-button" onClick={goPrev}>
            {t("step3.back")}
          </button>
          <button type="submit" className="step-next">
            {t("step3.submit")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step3;
