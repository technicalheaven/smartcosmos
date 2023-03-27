import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiRoutes, baseURL } from '../../config/api'
import { logOut,setAuthTokens } from '../features/auth/authSlice';
import { store } from '../store'



const baseQuery = fetchBaseQuery({
    baseUrl: baseURL,
    // credentials: 'include',
    prepareHeaders: (headers, { getState }:any) => {
        
        // Get auth tokens from auth state
        const {auth:{accessToken, idToken, refreshToken}}:any = store.getState();
        
        let serviceToken = "";
        // serviceToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.wSYzQkeEsKSbAAVJtVMjodiKPtwOiM6UjulQWyz9qNE';


        if (idToken != undefined &&  accessToken != undefined  && refreshToken != undefined && serviceToken  === "") {
            headers.set("id-token", idToken);
            headers.set("access-token", accessToken);
            headers.set("refresh-token", refreshToken);
        }else{
            headers.set("service-token", serviceToken);
        }
        return headers
    }
})

const baseQueryWithReauth = async (args:any, api:any, extraOptions:any) => {
    let result:any = await baseQuery(args, api, extraOptions)
 
    if (result?.error?.data?.statusCode === 0 && result?.error?.data?.error?.errType == 'BadRequestError') {
        // send refresh token to get new access token 
        const refreshResult:any = await baseQuery({url: apiRoutes.REFRESH_TOKEN}, api, extraOptions) 
        if (refreshResult?.data) {
            const {idToken, accessToken, refreshToken } = refreshResult?.data?.result;
            // store the new token 
            api.dispatch(setAuthTokens({idToken, accessToken, refreshToken }))
            // retry the original query with new access token 
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({}),
    refetchOnMountOrArgChange: true,
    keepUnusedDataFor: 1,
})