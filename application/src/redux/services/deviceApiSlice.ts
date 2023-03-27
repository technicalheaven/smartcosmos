import { apiSlice } from "./apiSlice";
import { apiRoutes } from "../../config/api";

export const deviceService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDevices: builder.query({
      query: (params: any) => ({
        url: apiRoutes.GETALLDEVICE,
        params: params,
        method: "GET",
      }),
    }),

    createDevice: builder.mutation({
      query: (formData: any) => {
        console.log("Create device: ", formData);
        return {
          url: apiRoutes.ADD_DEVICE,
          method: "POST",
          body: formData,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    updateDevice: builder.mutation({
      query: (formData:any) => {
        console.log("Update device Data: ", formData);
        const { id, ...data } = formData;
        console.log("Actual Update Data: ", data);
        return {
          url: `${apiRoutes.UPDATE_DEVICE}/${id}`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    deleteDevice: builder.mutation({
      query: (formData:any) => {
        const { id, ...body } = formData;
        console.log("Delete device Data: ", id);
        return {
          url: `${apiRoutes.DELETE_DEVICE}/${id}`,
          method: "DELETE",
          body,
        };
      },
    }),

    updateDeviceStatus: builder.mutation({
      query: (formData:any) => {
        console.log("Update device status: ", formData);
        const { id, ...status } = formData;
        console.log("Actual Update status: ", status);
        return {
          url: `${apiRoutes.UPDATE_DEVICE_STATUS}/${id}`,
          method: "PATCH",
          body: status,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    getAllDeviceType: builder.query({
      query: (params: any) => ({
        url: apiRoutes.GETDEVICETYPE,
        method: "GET",
      }),
    }),
    getAllDeviceModel: builder.query({
      query: (params: any) => ({
        url: apiRoutes.GETDEVICEMODAL,
        method: "GET",
      }),
    }),

  }),
});


export const {
    useGetAllDevicesQuery,
    useCreateDeviceMutation,
    useDeleteDeviceMutation,
    useUpdateDeviceMutation,
    useUpdateDeviceStatusMutation,
    useGetAllDeviceTypeQuery,
    useGetAllDeviceModelQuery
} = deviceService
