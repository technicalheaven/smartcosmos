import { apiSlice } from "./apiSlice";
import { apiRoutes } from "../../config/api";

export const tenantService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTenants: builder.query({
      query: (params:any) => ({
        url: apiRoutes.GETALLTENANTS,
        params: params,
        method: "GET",
      }),
    }),

    createTenant: builder.mutation({
      query: (formData: any) => {
        return {
          url: apiRoutes.ADDTENANT,
          method: "POST",
          body: formData,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    updatetenant: builder.mutation({
      query: (formData) => {
        const { id, ...data } = formData;
        return {
          url: `${apiRoutes.UPDATE_TENANT}/${id}`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    deleteTenant: builder.mutation({
      query: (id) => {
        return {
          url: `${apiRoutes.DELETE_TENANT}/${id}`,
          method: "DELETE",
        };
      },
    }),

    getTenantById: builder.query({
      query: (id) => {
        if (id !== undefined) {
          return {
            url: `${apiRoutes.GETTENANTBYID}/${id}`,
            method: "GET",
          };
        }
      },
    }),
  }),
});

export const {
  useCreateTenantMutation,
  useUpdatetenantMutation,
  useGetAllTenantsQuery,
  useGetTenantByIdQuery,
  useDeleteTenantMutation,
} = tenantService;
