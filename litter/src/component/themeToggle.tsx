import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

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
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '2rem',
                width: 'fit-content'
            }}
        >
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
