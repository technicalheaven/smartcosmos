import { apiSlice } from "./apiSlice";
import { apiRoutes } from "../../config/api";
import * as util from "util";

export const dashboardService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardReport: builder.query({
      query: (params: any = "") => ({
        url: apiRoutes.DASHBOARD_REPORT,
        params: Object.keys(params).length ?  params : "",
        method: "GET",
      }),
    })
  }),
});

export const {
    useGetDashboardReportQuery
} = dashboardService