import { apiSlice } from "./apiSlice";
import { apiRoutes } from "../../config/api";

export const identityService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDigitizedTag: builder.mutation({
      query: (params: any) => {
        return {
          url: apiRoutes.GET_ALL_TAGS,
          params: params,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    getDiExportChunks: builder.mutation({
      query: (params: any) => {
        return {
          url: `${apiRoutes.EXPORT_CHUNKS_DI}`,
          method: "GET",
          params: params,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    deEnableTag: builder.mutation({
      query: (formData: any) => {
        return {
          url: `${apiRoutes.DEENABLE_TAGS}`,
          method: "PATCH",
          body: formData,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
  }),
});

export const { useGetAllDigitizedTagMutation, useDeEnableTagMutation, useGetDiExportChunksMutation } = identityService;