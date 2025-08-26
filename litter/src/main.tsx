// このファイルは最初に呼び出されるファイル

import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./temp/app";
import { Signup } from "./signup/modal";
import { Temp } from "./temp/temp";
import { Home } from "./home/timeline";
import {
    Navigate,
    Outlet,
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
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

function Root() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route
                        path="/login"
                        element={<Signup loginHook={setIsLoggedIn} />}
                    />
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