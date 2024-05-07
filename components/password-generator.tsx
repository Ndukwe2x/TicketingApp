import React, { HtmlHTMLAttributes, ReactNode, RefObject, useEffect, useState } from 'react';
import generator from 'generate-password';

type GeneratorProps = HtmlHTMLAttributes<HTMLButtonElement> & {
    outputRef: RefObject<HTMLInputElement> | Array<RefObject<HTMLInputElement>>;
    options?: {};
}

const PasswordGenerator: React.FC<GeneratorProps> = ({outputRef, options, onClick, ...props}) => {
    options = {
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        ...options
    };
    const [password, setPassword] = useState(
        generator.generate( options )
    );

    useEffect(() => {
        if ( outputRef.current ) {
            outputRef.current.value = password;
            outputRef.current.dispatchEvent(
                new Event('change')
            );
        } else if (outputRef.length) {
            outputRef.map((ref) => {
                ref.current.value = password;
                ref.current.dispatchEvent(
                    new Event('change')
                );
            })
        }
    }, [password]);

    const generateRandomPassword = React.useCallback(() => {
        const newPass = generator.generate( options );
        setPassword(newPass);
    }, []);
    
    return (
        <div>
            <button type='button' onClick={(ev) => { onClick && onClick(ev); generateRandomPassword() }} {...props}>Generate Password</button>
        </div>
    );
}

export default PasswordGenerator;
