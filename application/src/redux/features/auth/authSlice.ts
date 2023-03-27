import { createSlice } from "@reduxjs/toolkit"
const initialState = { userInfo: {}, accessToken: null, idToken: null, refreshToken: null, userId: null, isLoggedIn:false, tenantInfo: {}, isPlatformRole: null, permissions: [] } as {
    userInfo: null | object;
    accessToken: null | string;
    idToken: null | string;
    refreshToken: null | string;
    userId: null | string;
    isLoggedIn: null | boolean;
    tenantInfo: null | object;
    isPlatformRole: null | boolean;
    permissions: null | object;
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthInfo: (
            state,{ payload: { userInfo, accessToken, idToken, refreshToken, userId, tenantInfo, isPlatformRole} }
        ) => {
            state.userInfo = userInfo;
            state.accessToken = accessToken;
            state.idToken = idToken;
            state.refreshToken = refreshToken;
            state.userId = userId;
            state.tenantInfo = tenantInfo;
            state.isPlatformRole = isPlatformRole;
        },
        setAuthTokens:(state, {payload})=>{
            state.accessToken = payload?.accessToken;
            state.idToken = payload?.idToken;
            state.refreshToken = payload?.refreshToken;
        },
        setPermissions:(state, {payload}) => {
            state.permissions = payload;
        },
        setUserInfo: (state, {payload}) => {
            state.userInfo = payload;
        },
        logOut: (state) => {
            state = initialState;
        },
        setLogin: (state, {payload}) => {
            state.isLoggedIn = payload;
        },

    },
    extraReducers: (builder) => {}
});

export const { setAuthInfo, logOut, setLogin, setPermissions, setUserInfo, setAuthTokens } = authSlice.actions
export default authSlice.reducer
export const getLoggedInUser = (state: any) => state?.auth?.userId
export const getIsLoggedIn = (state: any) => state?.auth?.isLoggedIn
export const getPermissionsList = (state: any) => state?.auth?.permissions
export const getUserInfo = (state: any) => state?.auth?.userInfo
export const getAuthTokens = (state: any) => ({accessToken: state?.auth?.accessToken, idToken: state?.auth?.idToken, refreshToken: state?.auth?.refreshToken})
export const getIsPlatformRole = (state: any) => state?.auth?.isPlatformRole
export const getTenantInfo = (state: any) => state?.auth?.tenantInfo
