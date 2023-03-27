import { apiRoutes } from "../../config/api";
import { apiSlice } from "./apiSlice";

export const roleService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query({
      query: (params: any) => ({
        url: apiRoutes.GETALLROLES,
        ...(Object.keys(params).length && {params: params}),
        method: "GET",
      }),
    }),
    getRoleList: builder.query({
      query: (params: any) => ({
        url: apiRoutes.GETROLELIST,
        method: "GET",
      }),
    }),
    getRoleDetail: builder.mutation({
      query: (id: any) => ({
        url: `${apiRoutes.GETROLEDETAILS}/${id}`,
        method: "GET",
      }),
    }),
    getRoleDetails: builder.query({
      query:(id)=>({
        url:`${apiRoutes.GETROLES}/${id}`,
        method:"GET"
      })
    })
  }),
});


export const {
    useGetAllRolesQuery,
    useGetRoleListQuery,
    useGetRoleDetailMutation,
    useGetRoleDetailsQuery,
} = roleService