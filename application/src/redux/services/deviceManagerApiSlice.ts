import { apiSlice } from "./apiSlice";
import { apiRoutes } from "../../config/api";

export const deviceManagerService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDeviceManager: builder.query({
      query: (params: any) => ({
        url: apiRoutes.GETALLDEVICEMANAGERS,
        params: params,
        method: "GET",
      }),
    }),

    createDeviceManager: builder.mutation({
      query: (formData: any) => {
        console.log("Create device: ", formData);
        return {
          url: apiRoutes.ADD_DEVICE_MANAGER,
          method: "POST",
          body: formData,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    updateDeviceManager: builder.mutation({
      query: (formData:any) => {
        console.log("Update device Data: ", formData);
        const { id, ...data } = formData;
        console.log("Actual Update Data: ", id);
        return {
          url: `${apiRoutes.UPDATE_DEVICE_MANAGER}/${id}`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    deleteDeviceManager: builder.mutation({
      query: (formData:any) => {
        const {id, ...body} = formData;
        console.log("Delete device manager Data: ", id);
        return {
          url: `${apiRoutes.DELETE_DEVICE_MANAGER}/${id}`,
          method: "DELETE",
          body,
        };
      },
    }),

  }),
});


export const {
    useGetAllDeviceManagerQuery,
    useCreateDeviceManagerMutation,
    useDeleteDeviceManagerMutation,
    useUpdateDeviceManagerMutation,
} = deviceManagerService