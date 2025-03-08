// このファイルは最初に呼び出されるファイル

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from "./homepage/app";
import { Signup } from "./signup/modal";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./main.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> 
        <Route path="/account" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
