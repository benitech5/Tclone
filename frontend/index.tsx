
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
        user: null | { name: string; email: string };
        isAuthenticated: boolean;
}

const initialState: AuthState = {
        user: null,
        isAuthenticated: false,
};

const authSlice = createSlice({
        name: 'auth',
        initialState,
        reducers: {
                login: (state, action: PayloadAction<{ name: string; email: string }>) => {
                        state.user = action.payload;
                        state.isAuthenticated = true;
                },
                logout: (state) => {
                        state.user = null;
                        state.isAuthenticated = false;
                },
        },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;