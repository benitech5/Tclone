// src/navigation/types.ts

export type AuthStackParamList = {
    Login: undefined;
    Otp: { phoneNumber: string };
    ConfirmationCode: { email: string };
    TwoStepVerification: undefined;
    Home: undefined;
};

export type AppStackParamList = {
    Home: undefined;
    Profile: undefined;
    DrawerMenu: undefined;
    Contacts: undefined;
    ChatList: undefined;
    Chat: { chatId: string; chatName: string };
    StoriesList: undefined;
    MainChatList: undefined;
    // Add other main app screens here if needed
};
