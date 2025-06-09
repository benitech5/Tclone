export const isValidEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
};

export const isValidName = (name: string): boolean => {
    return name.trim().length >= 2;
};``