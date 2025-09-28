import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./temp/app";
import { Signup } from "./signup/modal";
import { Temp } from "./temp/temp";
import { Home } from "./home/timeline";
import { Navigate, Outlet, BrowserRouter, Route, Routes } from "react-router-dom";
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

function ProtectedRoute({ isLoggedIn }: { isLoggedIn: boolean }) {
    if (!isLoggedIn) {
        // ログインしてない場合はログインページにリダイレクト
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}

function getLoginInfo() {
    // ページ再読み込みでも前回のログイン状態を復元
    const saved = localStorage.getItem("isLoggedIn");
    return saved === "true";
}

function Root() {
    const [isLoggedIn, setIsLoggedIn] = useState(getLoginInfo);

    function updateIsLoggedIn(isLoggedIn: boolean): void {
        localStorage.setItem("isLoggedIn", String(isLoggedIn));
        setIsLoggedIn(isLoggedIn);
    }

    return (
        <StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<Signup loginHook={updateIsLoggedIn} />} />
                    <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/temp" element={<Temp />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <ThemeToggle onToggle={handleTheme} />
        </StrictMode>
    );
}
createRoot(document.getElementById("root")!).render(<Root />);

export { handleTheme };
