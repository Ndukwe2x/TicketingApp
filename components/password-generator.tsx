import React, { HtmlHTMLAttributes } from 'react';
import generator from 'generate-password';

type GeneratorProps = HtmlHTMLAttributes<HTMLButtonElement> & {
    handleGeneratedPassword: (password: string) => void;
    options?: {};
}

const PasswordGenerator: React.FC<GeneratorProps> = ({ handleGeneratedPassword, options, onClick, ...props }) => {
    options = {
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        ...options
    };

    const generateRandomPassword = React.useCallback(() => {
        const newPass = generator.generate(options);
        handleGeneratedPassword(newPass);
    }, [options]);

    return (
        <div>
            <button type='button' onClick={(ev) => { onClick && onClick(ev); generateRandomPassword() }} {...props}>Generate Password</button>
        </div>
    );
}

export default PasswordGenerator;
