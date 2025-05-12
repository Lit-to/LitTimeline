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
        <Form>
            <Form.Check
                type="switch"
                id="dark-mode-switch"
                label={isDark ? '🌙 ダーク' : '☀️ ライト'}
                checked={isDark}
                onChange={handleChange}
            />
        </Form>
    );
};

export default ThemeToggle;
