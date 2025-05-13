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
        <Form
            className="theme-toggle"
            style={{ fontSize: '2rem', width: 'fit-content' }} // ラベルの文字サイズ指定
        >
            <Form.Check
                type="switch"
                id="dark-mode-switch"
                label={<span style={{ fontSize: '3rem' }}>🌙☀️</span>}
                checked={isDark}
                onChange={handleChange}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5em',
                    fontSize: '5rem'
                }}
            />
        </Form>
    );
};

export default ThemeToggle;
