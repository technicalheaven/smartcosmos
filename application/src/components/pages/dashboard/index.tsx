import { Col, message, Row } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTenant } from "../../../redux/features/tenant/tenantSlice";
import { useGetDashboardReportQuery } from "../../../redux/services/dashboardApiSlice";
import { useGetAllTenantsQuery } from "../../../redux/services/tenantApiSlice";
import UIBarChart from "../../common/charts/barChart";
import UIPieChart from "../../common/charts/pieChart";
import UICountCard from "../../common/countCard";
import UIFilterSelectInput from "../../common/selectInput/filterSelectInput";
import { projectIcon } from "../../../assets/icons";
import { UICalendar } from "../../common/uiCalendar";
import "./style.css";
import { useGetAllSitesQuery } from "../../../redux/services/siteApiSlice";
import { Roles } from "../../../config/enum";
import { useNavigate } from "react-router-dom";
import { Page } from "../../../routes/config";
import { useSelector } from "react-redux";
import {
  getIsPlatformRole,
  getTenantInfo,
  getUserInfo,
} from "../../../redux/features/auth/authSlice";
import { UILoader } from "../../common/loader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<any>();
  const [tenantList, setTenantList] = useState<any>();
  const [selectedTenantSite, setSelectedTenantSite] = useState<any>();
  const [siteList, setSiteList] = useState<any>();
  const [search, setSearch] = useState<any>({});
  const [params, setParams] = useState<any>([]);
  const [loader, setLoader] = useState(true);
  const tenantInfo = useSelector(getTenantInfo);
  const userInfo = useSelector(getUserInfo);
  let isPlatformRole = parseInt(useSelector(getIsPlatformRole));
  let queryParams = { ...(isPlatformRole == 0 && { tenantId: tenantInfo?.id }) };

  if (search) queryParams = { ...queryParams, ...JSON.parse(JSON.stringify(search)) };

  const dashboardQuery: any = useGetDashboardReportQuery(queryParams);
  const tenantsQuery = useGetAllTenantsQuery("");
  const sitesQuery = useGetAllSitesQuery({ tenantId: tenantInfo?.id });

  if (isPlatformRole == 1) {
    dispatch(setTenant({ id: "", name: "" }));
  } else {
    const loggedInRole = userInfo?.userRole?.roleName;
    dispatch(setTenant({ id: tenantInfo.id, name: tenantInfo.name }));

    // if logged in role - factory tag operator then change landing page
    if (loggedInRole === Roles.FACTORY_OPERATOR)
      navigate(`${Page.FACTORY_TAGS_HISTORY}/${tenantInfo.id}`);
  }

  function counter(id: any, start: any, end: any, duration: any) {
    // let end:any = 100;
    let obj: any = document.getElementById(id),
      current = start,
      range = end - start,
      increment = end > start ? 1 : 0,
      step = Math.abs(Math.floor(duration / range)),
      timer = setInterval(() => {
        current += increment;
        obj.textContent = current ?? 0;
        if (current == end) {
          clearInterval(timer);
        }
      }, step);
  }

  // fetch dashboard report
  useEffect(() => {
    if (dashboardQuery?.data?.statusCode) {
      setLoader(false);
      setReportData(dashboardQuery?.data?.result);
      const result: any = dashboardQuery?.data?.result;

      // counter("enabled", 0, result?.tagInfo?.tagsCount?.enabled, 2000);
      // counter("deEnabled", 0, result?.tagInfo?.tagsCount?.deEnabled, 2000);
      // counter("totalSites", 0, result?.totalCounts?.totalSites, 2000);
      // counter("totalDevices", 0, result?.totalCounts?.totalDevices, 2000);
      // counter("unUsed", 0, result?.tagInfo?.tagsCount?.unUsed, 2000);
    }
  }, [dashboardQuery?.fulfilledTimeStamp]);
  useEffect(() => {
    if (dashboardQuery?.error?.status === 500) {
      setLoader(false)
      message.error("Something went wrong")
    }

  }, [dashboardQuery?.isError])

  // fetch tenant
  useEffect(() => {
    if (tenantsQuery?.data?.statusCode) {
      const x = tenantsQuery?.data?.result?.rows?.map((x: any) => ({
        label: x?.name,
        value: x?.id,
      }));
      setTenantList(x);
    }
  }, [tenantsQuery?.isSuccess]);

  // fetch site
  useEffect(() => {
    if (sitesQuery?.data?.statusCode) {
      const x = sitesQuery?.data?.result?.rows?.map((x: any) => ({
        label: x?.name,
        value: x?.id,
      }));
      setSiteList(x);
    }
  }, [sitesQuery?.isSuccess]);

  const tagsCount = reportData?.tagInfo?.tagsCount;

  const tagsChartData = {
    labels: ["Total", "Secure", "Standard", "Enabled", "Un-Used"],
    datasets: [
      {
        label: "Tags",
        data: [
          tagsCount?.total,
          tagsCount?.secure,
          tagsCount?.standard,
          tagsCount?.enabled,
          tagsCount?.unUsed,
        ],
        backgroundColor: "#4fb054",
        barThickness: 20,
      },
    ],
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].map((x: any, i: any) => ({ month: i, name: x }));
  const currentMonth = moment().month();
  const limit = 6;
  const displayMonths =
    currentMonth <= limit
      ? months.slice(0, limit + 1)
      : months.slice(currentMonth - limit, currentMonth + 1);
  const monthlyEnablementsReport =
    reportData?.tagInfo?.monthlyEnablementReport ?? [];

  const monthlyEnablements = displayMonths.map((x: any) => {
    const temp: any = monthlyEnablementsReport.find(
      (y: any) => y?.month === x?.month
    );
    return temp?.enabled ?? 0;
  });

  const monthlyDeEnablements = displayMonths.map((x: any) => {
    const temp: any = monthlyEnablementsReport.find(
      (y: any) => y?.month === x?.month
    );
    return temp?.deEnabled ?? 0;
  });

  const tagsEnablementData = {
    labels: displayMonths.map((x: any) => x?.name),
    datasets: [
      {
        label: "Enabled",
        data: monthlyEnablements,
        backgroundColor: "#ff7648",
        barThickness: 20,
      },
      {
        label: "De-Enabled",
        data: monthlyDeEnablements,
        backgroundColor: "#ffaf93",
        barThickness: 20,
      },
    ],
  };

  const tagsTableData = {
    total: tagsCount?.total,
    secure: tagsCount?.secure,
    standard: tagsCount?.standard,
    enabled: tagsCount?.enabled,
    unused: tagsCount?.unUsed,
  };

  const enablementsTableData = displayMonths.map((x: any) => {
    const obj = monthlyEnablementsReport.find(
      (y: any) => y?.month === x?.month
    );
    return {
      Month: months[x?.month]?.name,
      Enabled: obj?.enabled ?? 0,
      "De-enabled": obj?.deEnabled ?? 0,
    };
  });

  const topProductsEnablements: any = {
    labels: reportData?.topEnablementProducts?.map((x: any) => x?.name),
    datasets: [
      {
        label: "Products",
        data: reportData?.topEnablementProducts?.map((x: any) => x?.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          // 'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          // 'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topProcessEnablements: any = {
    labels: reportData?.topEnablementProcesses?.map((x: any) => x?.name),
    datasets: [
      {
        label: "Processes",
        data: reportData?.topEnablementProcesses?.map((x: any) => x?.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {loader && (<UILoader />)}
      <main className="dashboard">
        <section className="filters-section">
          <Row>
            <Col span={4} md={8} lg={7} xl={6} xxl={4}>
              <div className="filter-input">
                {isPlatformRole == 1 ? (
                  <UIFilterSelectInput
                    options={tenantList}
                    placeholder="Select Tenant"
                    allowClear={true}
                    onChange={(value: any) => {
                      console.log({ tenantList });
                      let tenantName = tenantList.find(
                        (x: any) => x?.value === value
                      )?.label;
                      setSelectedTenantSite({
                        name: tenantName,
                        entity: "tenant",
                      });
                      setSearch({ ...search, tenantId: value });
                    }}
                    prefixIcon={projectIcon}
                  />
                ) : (
                  <UIFilterSelectInput
                    options={siteList}
                    placeholder="Select Sites"
                    allowClear={true}
                    onChange={(value: any) => {
                      let siteName = siteList.find(
                        (x: any) => x?.value === value
                      )?.label;
                      setSelectedTenantSite({ name: siteName, entity: "site" });
                      setSearch({ ...search, siteId: value });
                    }}
                    prefixIcon={projectIcon}
                  />
                )}
              </div>
            </Col>

            <Col>
              <div className="filter-input">
                <UICalendar handleChange={(values: any) => {
                  const dateFilterObj = values.length ? { from: moment.utc(moment(values[0])).format("YYYY-MM-DD") , to: moment.utc(moment(values[1])).format("YYYY-MM-DD") } : { from: undefined, to: undefined };
                  setSearch({ ...search, ...dateFilterObj });
                  setParams(values)
                }} params={params} setParams={setParams} />
              </div>
            </Col>
          </Row>
        </section>

        <section className="counts-section">
          <Row justify="start">
            <Col flex="1 0 auto">
              <UICountCard
                title="Total Enablements"
                id="enabled"
                count={reportData?.tagInfo?.tagsCount?.enabled}
                color="#FF7841"
              />
            </Col>
            <Col flex="1 0 auto">
              <UICountCard
                title="Total De-enablements"
                id="deEnabled"
                count={reportData?.tagInfo?.tagsCount?.deEnabled}
                color="#0E3077"
              />
            </Col>
            <Col flex="1 0 auto">
              <UICountCard
                title="Total Sites"
                id="totalSites"
                count={reportData?.totalCounts?.totalSites}
                color="#227F99"
              />
            </Col>
            <Col flex="1 0 auto">
              <UICountCard
                title="Total Devices"
                id="totalDevices"
                count={reportData?.totalCounts?.totalDevices}
                color="#60BD58"
              />
            </Col>
            <Col flex="1 0 auto">
              <UICountCard
                title="Total Unused Tags"
                id="unUsed"
                count={reportData?.tagInfo?.tagsCount?.unUsed}
                color="#b1182e"
              />
            </Col>
          </Row>
        </section>

        <section className="content">
          <Row gutter={[20, 20]}>
            <Col
              xl={isPlatformRole ? 12 : 8}
              lg={isPlatformRole ? 8 : 12}
              md={12}
              sm={12}
              xs={24}
            >
              <UIBarChart
                info={selectedTenantSite}
                className="enablementsReport"
                title="Enablements Per Month"
                data={tagsEnablementData}
                tableData={enablementsTableData}
                height={"200px"}
              />
            </Col>

            {isPlatformRole == 0 && (
              <Col xl={8} lg={12} md={12} sm={12} xs={24}>
                <UIPieChart
                  info={selectedTenantSite}
                  title="Top 5 Enablements By Process"
                  className="topProductsChart"
                  data={topProcessEnablements}
                  tableData={reportData?.topEnablementProcesses.map((x: any) => ({
                    process: x?.name,
                    count: x?.count,
                  }))}
                  height={200}
                />
              </Col>
            )}

            <Col
              xl={isPlatformRole ? 12 : 8}
              lg={isPlatformRole ? 8 : 12}
              md={12}
              sm={12}
              xs={24}
            >
              {isPlatformRole == 1 ? (
                <UIBarChart
                  info={selectedTenantSite}
                  title="Tags in System"
                  className="tagsInSystemReport"
                  data={tagsChartData}
                  tableData={tagsTableData}
                  height={200}
                />
              ) : (
                <UIPieChart
                  info={selectedTenantSite}
                  title="Top 5 Enablements By Product"
                  className="topProcessChart"
                  data={topProductsEnablements}
                  tableData={reportData?.topEnablementProducts.map((x: any) => ({
                    upc: x?.upc,
                    product: x?.name,
                    count: x?.count,
                  }))}
                  width={100}
                  height={100}
                />
              )}
            </Col>
          </Row>
        </section>
      </main>
    </>
  );
};

export default Dashboard;
