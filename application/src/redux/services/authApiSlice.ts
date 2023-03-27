import { apiSlice } from "./apiSlice"
import { apiRoutes } from "../../config/api"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: apiRoutes.LOGIN,
                method: 'POST',
                body: { ...credentials }
            })
        }),
        changePassword: builder.mutation({
            query: params => ({
                url: apiRoutes.CHANGE_PASSWORD,
                method: 'POST',
                body: { ...params }
            })
        }),
        resendInvite: builder.mutation({
            query: params => ({
                url: apiRoutes.RESEND_INVITE,
                method: 'POST',
                body: { ...params }
            })
        }),
        forgotPasswordSendMail: builder.mutation({
            query:params => ({
                url: apiRoutes.FORGOT_PASSWORD_MAIL,
                method: 'POST',
                body: { ...params }
            })
        }),
        forgotPassword: builder.mutation({
            query:params => ({
                url: apiRoutes.FORGOT_PASSWORD,
                method: 'POST',
                body: { ...params }
            })
        })
    })
})

export const {
    useLoginMutation, useChangePasswordMutation, useResendInviteMutation, useForgotPasswordSendMailMutation, useForgotPasswordMutation
} = authApiSlice