import { apiSlice } from "./apiSlice";
import { apiRoutes } from "../../config/api";

export const siteService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSites: builder.query({
      query: (params:any) => {
        const {tenantId} = params;
        if (tenantId) {
          return {
            url: apiRoutes.GETALLSITES,
            params: params,
            method: "GET",
          };
        }else{
          return {
            url: apiRoutes.GETALLSITES,
            method: "GET",
          }
        }
      },
    }),

    getSiteById: builder.query({
      query: (id) => {
        if (id !== undefined) {
          return {
            url: `${apiRoutes.GETSITEBYID}/${id}`,
            method: "GET",
          };
        }
      },
    }),


    createSite: builder.mutation({
      query: (formData: any) => {
        console.log("Create site: ", formData);
        return {
          url: apiRoutes.ADDSITE,
          method: "POST",
          body: formData,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    updateSite: builder.mutation({
      query: (formData) => {
        console.log("Update site Data: ", formData);
        const { id, ...data } = formData;
        console.log("Actual Update Data: ", data);
        return {
          url: `${apiRoutes.UPDATESITE}/${id}`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    deleteSite: builder.mutation({
      query: (formData:any) => {
        const {id, ...body} = formData;
        console.log("Delete site Data: ", id);
        return {
          url: `${apiRoutes.DELETESITE}/${id}`,
          method: "DELETE",
          body,
        };
      },
    }),
  }),
});

export const {
    useGetAllSitesQuery,
    useCreateSiteMutation,
    useUpdateSiteMutation,
    useDeleteSiteMutation,
    useGetSiteByIdQuery
} = siteService