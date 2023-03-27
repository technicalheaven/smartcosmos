import { apiSlice } from "./apiSlice";
import { apiRoutes } from "../../config/api";
import * as util from "util";

export const processService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTenantProcess: builder.query({
      query: (params: any) => ({
        url: apiRoutes.GET_TENANT_PROCESSES,
        params: params,
        method: "GET",
      }),
    }),
    getProcessDetails: builder.query({
      query:(id)=>({
        url:`${apiRoutes.GET_TENANT_PROCESSES}/${id}`,
        method:"GET"
      })
    }),
    getProcessActions: builder.mutation({
      query: (featureId) => {
        return {
          url: `${util.format(apiRoutes.FEATURE_ACTIONS, featureId)}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    createProcess: builder.mutation({
      query: (formData: any) => {
        console.log("Create Process: ", formData);
        return {
          url: apiRoutes.ADD_PROCESS,
          method: "POST",
          body: formData,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    updateProcess: builder.mutation({
      query: (formData:any) => {
        console.log("Update Process Data: ", formData);
        const { id, ...data } = formData;
        return {
          url: `${apiRoutes.UPDATE_PROCESS}/${id}`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    deleteProcess: builder.mutation({
      query: (formData:any) => {
        const {id, ...body} = formData;
        console.log("Delete Process: ", id);
        return {
          url: `${apiRoutes.DELETE_PROCESS}/${id}`,
          method: "DELETE",
          body,
        };
      },
    }),

  }),
});

export const {
    useGetAllTenantProcessQuery,
    useGetProcessActionsMutation,
    useCreateProcessMutation,
    useUpdateProcessMutation,
    useDeleteProcessMutation,
    useGetProcessDetailsQuery,
} = processService