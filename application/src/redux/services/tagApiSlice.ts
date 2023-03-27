import { apiSlice } from "./apiSlice";
import { apiRoutes } from "../../config/api";


export const TagService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTags: builder.query({
      query: (params: any) => ({
        url: apiRoutes.TAGS,
        params: params,
        method: "GET",
      }),
    }),
    getTagFilterOptions: builder.query({
      query: (params: any) => ({
        url: apiRoutes.FACTORY_TAG_FILTER_OPTIONS,
        params: params,
        method: "GET",
      }),
    }),
    getTagExportChunks: builder.mutation({
      query: (params: any) => {
        return {
          url: `${apiRoutes.EXPORT_CHUNKS_TAGS}`,
          method: "GET",
          params: params,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    getTagUploadHistory: builder.query({
      query: (params: any) =>{
        const {tenantId, ...queryParams} = params;
        return ({
          url: `${apiRoutes.FACTORY_UPLOAD_HISTORY}/${tenantId}`,
          method: "GET",
          params: queryParams,
        })
      } ,
    })
  }),
});

export const {
   useGetAllTagsQuery,
   useGetTagFilterOptionsQuery,
   useGetTagUploadHistoryQuery,
   useGetTagExportChunksMutation,
} = TagService