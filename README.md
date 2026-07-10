# 🚀 Safario (Tourist-ID)

**Safario** is a modern, decentralized Web3-powered digital identity application designed for tourists. It provides a seamless and secure way for travelers to register, verify, and carry their digital identity across borders using blockchain technology.

## 📖 Overview

Safario (internally known as `tourist-id`) simplifies the travel experience by giving users a "Smart ID". This ID contains essential travel and personal details, securely generated and accessible via a QR code. The app is built with a focus on accessibility, offering full internationalization (i18n) and a responsive, mobile-first design.

## ✨ Key Features

- **🌐 Web3 & Blockchain Integration:** Secure identity management backed by Web3 technologies.
- **📱 Smart Digital ID:** Automatically generates a verifiable digital ID card with a QR code for quick scanning.
- **🌍 Multilingual Support:** Built-in internationalization (i18n) with support for English and Hindi (and extensible to more languages).
- **🌗 Theming:** Built-in Dark and Light mode options for better user experience.
- **🗺️ Interactive Maps:** Integration with Leaflet for geospatial features and location tracking.
- **📸 Step-by-Step Registration:** A smooth, multi-step onboarding process capturing personal info, travel details, and ID photos.

## 🛠 Tech Stack

- **Frontend Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Web3 & Crypto:** `ethers.js`, `@web3modal`, `@walletconnect`
- **Mapping:** `leaflet`, `react-leaflet`
- **Internationalization:** `i18next`, `react-i18next`
- **Utilities:** `react-qr-code`, `react-icons`, `react-slick`

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd Safario
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`.

## 📁 Project Structure

```text
Safario/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, icons, etc.
│   ├── components/       # Reusable React components (HomePage, RegisterPage, DigitalIDPage, etc.)
│   ├── context/          # React Contexts for global state management
│   ├── locales/          # i18n translation files
│   ├── App.tsx           # Main application routing and layout
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global CSS and Tailwind directives
├── package.json          # Project metadata and dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.ts        # Vite configuration
```

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles TypeScript and builds the app for production into the `dist` folder.
- `npm run preview`: Bootstraps a local web server to preview the production build.
- `npm run lint`: Runs ESLint to check for code quality and formatting issues.

## 📄 License

This project is proprietary and confidential unless otherwise specified.
