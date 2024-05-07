function generateRandomString(length: number, variant: string = 'alphanumeric', includeSpecialChar: boolean = false): string {
    const numbers = '0123456789';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const specialCharacters = '!@#$%^&*()-';

    let allCharacters = '';
    switch (variant) {
        case 'numbers':
            allCharacters = numbers;
            break;
        case 'alpha':
            allCharacters = lowerCaseLetters + upperCaseLetters;
            break;
        case 'loweralpha':
            allCharacters = lowerCaseLetters;
            break;
        case 'upperalpha':
            allCharacters = upperCaseLetters;
            break;
        case 'mixed_lower':
            allCharacters = numbers + lowerCaseLetters;
            break;
        case 'mixed_upper':
            allCharacters = numbers + upperCaseLetters;
            break;
        case 'alphanumeric':
            allCharacters = numbers + upperCaseLetters + lowerCaseLetters;
            break;
        default:
            console.error('Invalid variant');
    }

    allCharacters += includeSpecialChar ? specialCharacters : '';

    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        result += allCharacters.charAt(randomIndex);
    }
    return result;
}


export default generateRandomString;
