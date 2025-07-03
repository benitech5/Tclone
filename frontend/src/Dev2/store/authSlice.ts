     // src/store/authSlice.ts
    import { createSlice, PayloadAction } from '@reduxjs/toolkit';

    interface User {
        id: number;
        firstName: string;
        phoneNumber: string;
        profilePictureUrl?: string;
    }

    interface AuthState {
        user: User | null;
        isAuthenticated: boolean;
        token: string | null;
    }

    const initialState: AuthState = {
        user: null,
        isAuthenticated: false,
        token: null,
    };

    const authSlice = createSlice({
        name: 'auth',
        initialState,
        reducers: {
            login: (state, action: PayloadAction<{ user: User; token: string }>) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            },
            logout: (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            },
        },
    });

    export const { login, logout } = authSlice.actions;
    export default authSlice.reducer;