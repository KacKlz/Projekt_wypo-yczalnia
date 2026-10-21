// Validate email format
export const validateEmail = (email) => {
    if (!email || !email.includes('@')) {
        return "Email address must contain '@'.";
    }
    return null;
};

// Validate password match
export const validatePasswordMatch = (password, repeatPassword) => {
    if (password !== repeatPassword) {
        return 'Passwords do not match!';
    }
    return null;
};

// Validate password security requirements (uppercase letter and special character)
export const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

    if (!hasUppercase) {
        return 'Password must contain at least one uppercase letter!';
    }

    if (!hasSpecialChar) {
        return 'Password must contain at least one special character (e.g. !, @, #)!';
    }

    return null;
};
