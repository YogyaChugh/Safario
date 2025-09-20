import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Buffer } from 'buffer';
window.Buffer = Buffer;
import process from 'process';
window.process = process;


// i18n setup
import "./i18n";

import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
