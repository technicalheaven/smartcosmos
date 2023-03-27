import { apiSlice } from "./apiSlice";
import { apiRoutes } from "../../config/api";

export const zoneService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllZones: builder.query({
      query: (params: any) => ({
        url: apiRoutes.GETALLZONES,
        params: params,
        method: "GET",
      }),
    }),

    createZone: builder.mutation({
      query: (formData: any) => {
        console.log("Create Zone: ", formData);
        return {
          url: apiRoutes.ADD_ZONE,
          method: "POST",
          body: formData,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    updateZone: builder.mutation({
      query: (formData:any) => {
        console.log("Update Zone Data: ", formData);
        const { id, ...data } = formData;
        console.log("Actual Update Data: ", data);
        return {
          url: `${apiRoutes.UPDATE_ZONE}/${id}`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    deleteZone: builder.mutation({
      query: (formData:any) => {
        const {id, ...body} = formData;
        console.log("Delete Zone Data: ", id);
        return {
          url: `${apiRoutes.DELETE_ZONE}/${id}`,
          method: "DELETE",
          body,
        };
      },
    }),

    getAllZoneTypes: builder.query({
      query: (params: any) =>{
        return {
          url: apiRoutes.ZONE_TYPES,
          method: "GET",
        }
      },
    })

}),
});

export const {
    useGetAllZonesQuery,
    useCreateZoneMutation,
    useDeleteZoneMutation,
    useUpdateZoneMutation,
    useGetAllZoneTypesQuery
} = zoneService
