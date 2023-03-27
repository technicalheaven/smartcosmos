import { LeftOutlined } from "@ant-design/icons";
import { Card, Col, Tabs, Row } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  tabUser,
  deviceTabIcon,
  featuresIcon,
  siteIcon,
  zoneIcon,
  deviceManagerIcon,
} from "../../../../assets/icons";
import { setTenant } from "../../../../redux/features/tenant/tenantSlice";
import { useGetTenantByIdQuery } from "../../../../redux/services/tenantApiSlice";
import { UIAvatar } from "../../../common/avatar";
import { UIIconbutton } from "../../../common/button";
import { UIProfilePicPreview } from "../../../common/image";
import { UISearchBar } from "../../../common/searchBar";
import UsersList from "../../user/list";
import "./style.css";
import { DeviceList } from "./tabDevice";
import { FeatureList } from "./tabFeatures";
import { SiteList } from "./tabSites";
import { ZoneList } from "./tabZones";
import { Page } from "../../../../routes/config";
import { useGetAllSitesQuery } from "../../../../redux/services/siteApiSlice";
import UITooltip from "../../../common/tooltip";
import { useGetAllZonesQuery } from "../../../../redux/services/zoneApiSlice";
import { GetPermissions } from "../../../../utils";
import { Permission } from "../../../../config/enum";
import { DeviceManager } from "./tabDeviceManager";
import { page, Status } from "../../../../config/constants";
import { TablePaginationConfig } from "antd/es/table";
import { useSelector } from "react-redux";
import { getIsPlatformRole } from "../../../../redux/features/auth/authSlice";
import { getFilterInfo } from "../../../../redux/features/filter/filterSlice";

export const TenantDetail = (props: any) => {
  const { TabPane } = Tabs;
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const filterState = useSelector(getFilterInfo);
  const [selectedTab, setSelectedTab] = useState(filterState?.tab ? filterState?.tab : "1");
  const [checked, setChecked] = useState(false);
  const isPlatformRole = parseInt(useSelector(getIsPlatformRole));
  // Get permissions
  const userPermissions = GetPermissions(Permission.USER);
  const devicePermissions = GetPermissions(Permission.DEVICE);
  const sitePermissions = GetPermissions(Permission.SITE);
  const deviceManagerPermissions = GetPermissions(Permission.DEVICEMANAGER);
  const currentURL = window.location.href;
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: filterState?.page && currentURL == filterState?.url ? filterState?.page : page?.current,
    pageSize: filterState.limit && currentURL == filterState?.url ? filterState.limit : page?.pageSize,
    showSizeChanger: true,
  });
  const onTabChange = (key: any) => {
    setSelectedTab(key);
    setSearch("");
    setPagination({
      ...pagination,
      current: page.current,
      pageSize: page.pageSize,
    });
  };
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, isSuccess, refetch } = useGetTenantByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const [isDeviceModalVisible, setIsDeviceModalVisible] = useState(false);
  const [isAddSiteModalVisible, setIsAddSiteModalVisible] = useState(false);
  const [isAddDeviceManagerModalVisible, setIsAddDeviceManagerModalVisible] =
    useState(false);

  useEffect(() => {
    dispatch(
      setTenant({ id, name: data?.result?.name, status: data?.result?.status })
    );
  }, [isSuccess]);

  const getSitesFromQuery = useGetAllSitesQuery(
    { tenantId: id },
    { refetchOnMountOrArgChange: true }
  );
  const getZonesFromQuery = useGetAllZonesQuery(
    { tenant: id },
    { refetchOnMountOrArgChange: true }
  );

  const getSiteOptions = () => {
    let siteOption: any[] = getSitesFromQuery?.data?.result?.rows?.map(
      (site: any) => {
        return {
          text: site?.name,
          value: site?.id,
        };
      }
    );
    return siteOption;
  };

  useEffect(() => {
    if (selectedTab === "1" || selectedTab === "2") {
      getSitesFromQuery?.refetch();
      getZonesFromQuery?.refetch();
    }
  }, [selectedTab]);

  const isTenantActive = () => {
    if (data?.result?.status === Status?.INACTIVE) {
      return false;
    } else {
      return true;
    }
  };

  const operations = () => {
    switch (selectedTab) {
      case "1": {
        return (
          <div className="actions align-items-center">
            <Row>
              <Col className="search searchTabUser">
                <Row>
                  <Col className="search-icon-align">
                    <div className="search">
                      <UISearchBar
                        placeholder="Search by username"
                        setSearch={setSearch}
                        search={search}
                        pagination={pagination}
                        setPagination={setPagination}
                        selectedTab={selectedTab}
                      />
                    </div>
                  </Col>
                </Row>

                {userPermissions?.isEdit && (
                  <span className="addbtn">
                    <UIIconbutton
                      onPress={() => {
                        setIsModalVisible(true);
                        setChecked(false);
                      }}
                      icon="plus"
                      type="info"
                      size="md"
                      data-testid="addbutton"
                      disableBtn={!isTenantActive()}
                    >
                      ADD USER
                    </UIIconbutton>
                  </span>
                )}
              </Col>
            </Row>
          </div>
        );
      }
      case "2": {
        return (
          <div className="actions align-items-center">
            <div className="search searchTabUser">
              <Row>
                <Col className="search-icon-align">
                  <div className="search">
                    <UISearchBar
                      placeholder="Search by device name"
                      setSearch={setSearch}
                      search={search}
                      pagination={pagination}
                      setPagination={setPagination}
                      selectedTab={selectedTab}
                    />
                  </div>
                </Col>
              </Row>

              {devicePermissions?.isEdit && (
                <span className="addbtn">
                  <UIIconbutton
                    onPress={() => setIsDeviceModalVisible(true)}
                    icon="plus"
                    type="info"
                    size="md"
                    data-testid="addbutton"
                    disableBtn={!isTenantActive()}
                  >
                    ADD DEVICE
                  </UIIconbutton>
                </span>
              )}
            </div>
          </div>
        );
      }
      case "4": {
        return (
          <div className="actions align-items-center">
            <span className="addbtn">
              <div className="search searchTabUser">
                <Row>
                  <Col className="search-icon-align">
                    <div className="search">
                      <UISearchBar
                        placeholder="Search by sites"
                        setSearch={setSearch}
                        search={search}
                        pagination={pagination}
                        setPagination={setPagination}
                        selectedTab={selectedTab}
                      />
                    </div>
                  </Col>
                </Row>
                {sitePermissions?.isEdit && (
                  <UIIconbutton
                    onPress={() => setIsAddSiteModalVisible(true)}
                    icon="plus"
                    type="info"
                    size="md"
                    data-testid="addbutton"
                    disableBtn={!isTenantActive()}
                  >
                    ADD SITE
                  </UIIconbutton>
                )}
              </div>
            </span>
          </div>
        );
      }
      case "5": {
        return (
          <div className="actions align-items-center">
            <span className="addbtn">
              <div className="search searchTabUser">
                <Row>
                  <Col className="search-icon-align">
                    <div className="search">
                      <UISearchBar
                        placeholder="Search zone name"
                        setSearch={setSearch}
                        search={search}
                        pagination={pagination}
                        setPagination={setPagination}
                        selectedTab={selectedTab}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </span>
          </div>
        );
      }
      case "6": {
        return (
          <div className="actions align-items-center">
            <div className="search searchTabUser">
              <Row>
                <Col className="search-icon-align">
                  <div className="search">
                    <UISearchBar
                      placeholder="Search by device manager name"
                      setSearch={setSearch}
                      search={search}
                      pagination={pagination}
                      setPagination={setPagination}
                      selectedTab={selectedTab}
                    />
                  </div>
                </Col>
              </Row>
              {deviceManagerPermissions?.isEdit && (
                <span className="addbtn">
                  <UIIconbutton
                    onPress={() => setIsAddDeviceManagerModalVisible(true)}
                    icon="plus"
                    type="info"
                    size="md"
                    data-testid="addbutton"
                    disableBtn={!isTenantActive()}
                  >
                    ADD DEVICE MANAGER
                  </UIIconbutton>
                </span>
              )}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <>
      <section className="title-section">
        <Card className="uicard detailed-top-card">
          <Row>
            {isPlatformRole !== 0 && (
              <Col span={24} style={{ marginBottom: "5px" }}>
                <div className="backButton">
                  <Link className="link" to={Page.TENANTS}>
                    <LeftOutlined className="bckIcn left-back-button" />
                    <b className="top-back-text">BACK</b>
                  </Link>
                </div>
              </Col>
            )}
            <Col span={24}>
              <Row gutter={5}>
                <Col
                  sm={4}
                  xxl={1}
                  xl={2}
                  lg={2}
                  md={3}
                  xs={7}
                  className="iconCol"
                >
                  {data?.result?.logo ? (
                    <UIProfilePicPreview
                      className="iconTenant"
                      height="65px"
                      width="65px"
                      src={data?.result?.logo}
                      text="profile pic"
                    />
                  ) : (
                    <UIAvatar
                      height="60px"
                      width="60px"
                      text={data?.result?.name}
                      type="name"
                    />
                  )}
                </Col>
                <Col sm={20} xs={16} className="slice">
                  <div>
                    <p className="title titleTenant slice tenant-subheading">
                      {data?.result?.name}
                    </p>
                    <UITooltip
                      title={data?.result?.description}
                      color="#fff"
                      content="show"
                      placement="topLeft"
                    >
                      <p className="tenantDescription slice tenant-subheading paragraph">
                        {data?.result?.description}
                      </p>
                    </UITooltip>
                    {/* </div> */}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </section>

      <section className="tenant-listing-section">
        <Card className="uicard table bottom-card">
          <Tabs
            tabBarExtraContent={operations()}
            activeKey={selectedTab}
            className="tab-container"
            type="card"
            onChange={onTabChange}
          >
            <TabPane
              tab={
                <span className="image tabText">
                  <img className="tabIcon" src={tabUser} />
                  Users
                </span>
              }
              key="1"
            >
              <UsersList
                search={search}
                isAddModalVisible={isModalVisible}
                setIsAddModalVisible={setIsModalVisible}
                tenantId={id}
                siteOption={getSiteOptions()}
                isTenantActive={isTenantActive()}
                pagination={pagination}
                setPagination={setPagination}
                checked={checked}
                setChecked={setChecked}
              />
            </TabPane>
            <TabPane
              tab={
                <span className="image tabText">
                  <img className="tabIcon" src={deviceTabIcon} />
                  Devices
                </span>
              }
              key="2"
            >
              <DeviceList
                search={search}
                tenantId={id}
                selectedTab={selectedTab}
                isModalVisible={isDeviceModalVisible}
                setIsModalVisible={setIsDeviceModalVisible}
                isTenantActive={isTenantActive()}
                pagination={pagination}
                setPagination={setPagination}
              />
            </TabPane>
            <TabPane
              tab={
                <span className="image tabText">
                  <img className="tabIcon" src={featuresIcon} />
                  Features
                </span>
              }
              key="3"
            >
              <FeatureList
                featuresData={data}
                refetch={refetch}
                isTenantActive={isTenantActive()}
                pagination={pagination}
                setPagination={setPagination}
              />
            </TabPane>
            <TabPane
              tab={
                <span className="image tabText">
                  <img className="tabIcon" src={siteIcon} />
                  Sites
                </span>
              }
              key="4"
            >
              <SiteList
                search={search}
                tenantId={id}
                selectedTab={selectedTab}
                isModalVisible={isAddSiteModalVisible}
                setIsModalVisible={setIsAddSiteModalVisible}
                isTenantActive={isTenantActive()}
                pagination={pagination}
                setPagination={setPagination}
              />
            </TabPane>
            <TabPane
              tab={
                <span className="image tabText">
                  <img className="zoneIconTop" src={zoneIcon} />
                  <img className="zoneLocation" src={siteIcon} />
                  Zones
                </span>
              }
              key="5"
            >
              <ZoneList
                search={search}
                tenantId={id}
                isTenantActive={isTenantActive()}
                pagination={pagination}
                setPagination={setPagination}
              />
            </TabPane>
            <TabPane
              tab={
                <span className="image tabText">
                  <img className="tabIcon" src={deviceManagerIcon} />
                  <span>Device Manager</span>
                </span>
              }
              key="6"
            >
              <DeviceManager
                search={search}
                tenantId={id}
                selectedTab={selectedTab}
                isModalVisible={isAddDeviceManagerModalVisible}
                setIsModalVisible={setIsAddDeviceManagerModalVisible}
                isTenantActive={isTenantActive()}
                pagination={pagination}
                setPagination={setPagination}
              />
            </TabPane>
          </Tabs>
        </Card>
      </section>
    </>
  );
};
