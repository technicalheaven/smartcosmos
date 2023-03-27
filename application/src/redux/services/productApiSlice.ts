import { apiSlice } from "./apiSlice";
import { apiRoutes } from "../../config/api";
import * as util from "util";

export const productService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTenantProducts: builder.query({
      query: (params: any) => ({
        url: apiRoutes.GET_TENANT_PRODUCTS,
        params: params,
        method: "GET",
      }),
    }),
    getProductExportChunks: builder.mutation({
      query: ({tenantId, ...params}: any) => {
        return {
          url: `${util.format(apiRoutes.EXPORT_CHUNKS_PRODUCTS,tenantId)}`,
          method: "GET",
          ...(Object.keys(params).length && {params}),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),
    updateProductByUPC: builder.mutation({
      query: (formData) => {
        const { upc,...data } = formData;
        return {
          url: `${util.format(apiRoutes.UPDATE_PRODUCT_UPC, upc)}`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

  }),
});

export const {
    useGetAllTenantProductsQuery,
    useUpdateProductByUPCMutation,
    useGetProductExportChunksMutation,
} = productService