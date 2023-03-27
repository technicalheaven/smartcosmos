import { apiSlice } from "./apiSlice";
import { apiRoutes } from "../../config/api";

export const userService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params: any) => ({
        url: apiRoutes.GETALLUSERS,
        params: params,
        method: "GET",
      }),
    }),

    createUser: builder.mutation({
      query: (formData: any) => {
        console.log("Create User: ", formData);
        return {
          url: apiRoutes.ADDUSER,
          method: "POST",
          body: formData,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    updateUser: builder.mutation({
      query: (formData) => {
        console.log("Update User Data: ", formData);
        const { id, ...data } = formData;
        console.log("Actual Update Data: ", data);
        return {
          url: `${apiRoutes.UPDATE_USER}/${id}`,
          method: "PATCH",
          body: data,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
    }),

    deleteUser: builder.mutation({
      query: (formData:any) => {
        const {id, ...body} = formData;
        console.log("Delete User Data: ", id);
        return {
          url: `${apiRoutes.DELETEUSER}/${id}`,
          method: "DELETE",
          body,
        };
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = userService;
