import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import { App } from "./App";
import { Acount as Account } from "./Account";
import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
