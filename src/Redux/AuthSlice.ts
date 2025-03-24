import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");


// Define the Initial State
const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
};

const authReducer = createSlice({
    name: "auth",
    initialState,
    reducers: {
        register: (state, actions: PayloadAction<{ user: User, token: string }>) => {
            state.token = actions.payload.token;
            state.user = actions.payload.user;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(state.user));
            localStorage.setItem("token", state.token);
        },
        // Login
        login: (state, action: PayloadAction<{ user: User, token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(state.user));
            localStorage.setItem("token", state.token);
        },

        // Logout
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    }
});

export const { login, register, logout } = authReducer.actions;
export default authReducer.reducer;

