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

const storedUser = localStorage.getItem("wallpaper_user");
const storedToken = localStorage.getItem("wallpaper_token");


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
        // Register
        register: (state, actions: PayloadAction<{ user: User, token: string }>) => {
            state.token = actions.payload.token;
            state.user = actions.payload.user;
            state.isAuthenticated = true;
            localStorage.setItem("wallpaper_user", JSON.stringify(state.user));
            localStorage.setItem("wallpaper_token", state.token);
            localStorage.setItem("wallpaper_login_time", Date.now().toString()); // Store login time
        },
        // Login
        login: (state, action: PayloadAction<{ user: User, token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem("wallpaper_user", JSON.stringify(state.user));
            localStorage.setItem("wallpaper_token", state.token);
            localStorage.setItem("wallpaper_login_time", Date.now().toString()); // Store login time
        },

        // Logout
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("wallpaper_user");
            localStorage.removeItem("wallpaper_token");
            localStorage.removeItem("wallpaper_login_time"); // Store login time
        },
    }
});

export const { login, register, logout } = authReducer.actions;
export default authReducer.reducer;

