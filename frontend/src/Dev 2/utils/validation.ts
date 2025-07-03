// Check if email is in valid format
export const isValidEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
};

// Check if name is not too short
export const isValidName = (name: string): boolean => {
    return name.trim().length >= 2;
};

//  Check if phone number is valid (e.g., 10+ digits, numeric only)
export const isValidPhoneNumber = (phone: string): boolean => {
    return /^\d{10,15}$/.test(phone);
};

//  Check if OTP is valid (e.g., 4 to 6 digits)
export const isValidOTP = (otp: string): boolean => {
    return /^\d{4,6}$/.test(otp);
};
