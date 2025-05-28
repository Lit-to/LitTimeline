import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import toggleStyle from "./themeToggle.module.css";

type Props = {
    onToggle: (isDark: boolean) => void;
};

const ThemeToggle: React.FC<Props> = ({ onToggle }) => {
    const [isDark, setIsDark] = useState(false);

    const handleChange = () => {
        const next = !isDark;
        setIsDark(next);
        onToggle(next);
    };

    return (
        <div className={toggleStyle.themeToggle}>
            <span>☀️</span>
            <Form.Check
                type="switch"
                id="dark-mode-switch"
                checked={isDark}
                onChange={handleChange}
                style={{ margin: 0 }}
            />
            <span>🌙</span>
        </div>
    );
};

export default ThemeToggle;
