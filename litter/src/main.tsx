import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import "./index.css";
import { App } from "./App";
import { Signup } from "./Signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
