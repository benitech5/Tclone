// src/navigation/types.ts

export type AuthStackParamList = {
    Login: undefined;
    Otp: { phoneNumber: string };
    Home: undefined;
};

export type AppStackParamList = {
    Home: undefined;
    Profile: undefined; // Add other main app screens here if needed
};
