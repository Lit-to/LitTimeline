// このファイルは最初に呼び出されるファイル

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./temp/app";
import { Signup } from "./signup/modal";
import { Temp } from "./temp/temp";
import { Home } from "./home/timeline";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./main.css";
import { ThemeToggle } from "./component/themeToggle";
document.title = "Tlitter";
function handleTheme(isDark: boolean) {
    // テーマの切り替えを行う
    // isDarkがtrueならダークモード、falseならライトモード
    if (isDark) {
        document.documentElement.setAttribute("theme", "dark");
    } else {
        document.documentElement.setAttribute("theme", "light");
    }
}
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/account" element={<Signup />} />
                <Route path="/temp" element={<Temp />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </BrowserRouter>
        <ThemeToggle onToggle={handleTheme} />
    </StrictMode>
);

export { handleTheme };