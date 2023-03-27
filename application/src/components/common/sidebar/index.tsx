import { Layout, Menu } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  dashboardIcon, digital_identity, factoryTagLightIcon, logoutIcon, organisationIcon, processIcon, productblackIcon, roleIcon, tenantIcon, uploadTagLightIcon, usersIcon
} from "../../../assets/icons";
import { PageTitle, Roles } from "../../../config/enum";
import { getUserInfo } from "../../../redux/features/auth/authSlice";
import { Page } from "../../../routes/config";
import "./style.css";

const { Sider } = Layout;
const MenuIcon = (props: any) => {
  const { icon, className, height, width } = props;
  return (
    <img
      className={className}
      src={icon}
      alt="icon"
      width={width ?? 32}
      height={height ?? 32}
      style={{ marginRight: 30 }}
    />
  );
};

const UISidebar = (props: any) => {
  const { collapsed, setCollapsed } = props;
  function getItem(label: any, key: any, icon: any = "", children: any = []) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const tenantState = useSelector((state: any) => state.tenant);
  const mql = window.matchMedia("(max-width: 1000px)");
  const roleState = useSelector((state: any) => state.role);
  const processState = useSelector((state: any) => state.process);
  const userInfo = useSelector(getUserInfo);
  const loggedInRole = userInfo?.userRole?.roleName;
  const manageSideBarView = ()=>{
  
      if (mql.matches) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    
  }

  useEffect(()=>{
    if(mql.matches){
      setCollapsed(true);
    }else{
      setCollapsed(false);
    }
    mql.addEventListener("change", manageSideBarView);
  },[])
  
  
  const location = useLocation();
  const currentRoute = location.pathname;
  const navigate = useNavigate();
  const items =
    loggedInRole == Roles.FACTORY_OPERATOR
      ? [
          {
            key: "11",
            icon: <MenuIcon icon={uploadTagLightIcon} />,
            label: (
              <Link to={`${Page.FACTORY_TAGS_HISTORY}/${tenantState.id}`}>
                {PageTitle.FACTORY_TAGS}
              </Link>
            ),
            route: `${Page.FACTORY_TAGS_HISTORY}/${tenantState.id}`,
            disabled: tenantState.id ? false : true,
          },
        ]
      : [
          {
            key: "1",
            icon: <MenuIcon icon={dashboardIcon} />,
            label: <Link to={Page.DASHBOARD}>{PageTitle.DASHBOARD}</Link>,
            route: Page.DASHBOARD,
          },
          {
            key: "2",
            icon: (
              <MenuIcon icon={tenantState.id ? organisationIcon : tenantIcon} />
            ),
            label: (
              <Link
                to={
                  tenantState.id
                    ? `${Page.ORGANISATION}/${tenantState.id}`
                    : Page.TENANTS
                }
              >
                {tenantState.id ? PageTitle.ORGANISATION : PageTitle.TENANTS}
              </Link>
            ),
            route: tenantState.id
              ? `${Page.ORGANISATION}/${tenantState.id}`
              : Page.TENANTS,
          },
          {
            key: "3",
            icon: <MenuIcon icon={usersIcon} />,
            label: (
              <Link to={Page.PLATFORM_USERS}>{PageTitle.PLATFORM_USERS}</Link>
            ),
            disabled: tenantState.id ? true : false,
            route: Page.PLATFORM_USERS,
          },
          {
            key: "5",
            icon: (
              <MenuIcon icon={productblackIcon} className="productdarkIcon" />
            ),
            label: (
              <Link to={`${Page.PRODUCTS}/${tenantState.id}`}>
                {PageTitle.PRODUCTS}
              </Link>
            ),
            disabled: tenantState.id ? false : true,
            route: `${Page.PRODUCTS}/${tenantState.id}`,
          },
          {
            key: "6",
            icon: <MenuIcon icon={processIcon} className="process-icon" />,
            label: PageTitle.PROCESSES,
            disabled: tenantState.id ? false : true,
            children: [
              {
                key: "7",
                label: (
                  <Link to={`${Page.USER_DEFINED_PROCESS}/${tenantState.id}`}>
                    {PageTitle.USERDEFINED}
                  </Link>
                ),
                route: [
                  `${Page.USER_DEFINED_PROCESS}/${tenantState.id}`,
                  `${Page.USERDEFINED_PROCESS_INFO}/${processState.id}`,
                ],
              },
              {
                key: "8",
                label: (
                  <Link to={`${Page.PRE_DEFINED_PROCESS}/${tenantState.id}`}>
                    {PageTitle.PREDEFINED}
                  </Link>
                ),
                route: [
                  `${Page.PRE_DEFINED_PROCESS}/${tenantState.id}`,
                  `${Page.PREDEFINED_PROCESS_INFO}/${processState.id}`,
                ],
              },
            ],
          },
          {
            key: "9",
            icon: <MenuIcon icon={roleIcon} />,
            label: <Link to={Page.ROLES}>{PageTitle.ROLES}</Link>,
            route: [Page.ROLES, `${Page.ROLE_INFO}/${roleState.id}`],
            disabled: tenantState.id ? true : false,
          },
          {
            key: "10",
            icon: <MenuIcon icon={digital_identity} />,
            label: (
              <Link to={`${Page.DIGITAL_IDENTITIES}/${tenantState.id}`}>
                {PageTitle.DIGITTAL_IDENTITIES}
              </Link>
            ),
            disabled: tenantState.id ? false : true,
            route: `${Page.DIGITAL_IDENTITIES}/${tenantState.id}`,
          },

          {
            key: "12",
            icon: <MenuIcon icon={factoryTagLightIcon}/>,
            label: (
              <Link to={`${Page.FACTORY_TAGS}/${tenantState.id}`}>
                {PageTitle.FACTORY_TAGS}
              </Link>
            ),
            route: `${Page.FACTORY_TAGS}/${tenantState.id}`,
            disabled: tenantState.id ? false : true,
          },
        ];


  let isChild = false;
  let selectedRoute: any = items.find((item: any) => {
    if (Array.isArray(item.route)) {
      return item.route.includes(currentRoute);
    } else if (item.children !== undefined && Array.isArray(item.children)) {
      if (
        item.children.findIndex((x: any) => {
          if (Array.isArray(x.route)) {
            console.log(x.route, currentRoute, "hii");

            return x.route.includes(currentRoute);
          } else return x.route === currentRoute;
        }) !== -1
      ) {
        isChild = true;
        return true;
      } else {
        isChild = false;
        return false;
      }
    } else {
      return item.route === currentRoute;
    }
  });

  if (isChild && Array.isArray(selectedRoute?.children)) {
    console.log("hiii", selectedRoute?.children);

    selectedRoute = selectedRoute?.children.find((x: any) => {
      if (Array.isArray(x.route)) return x.route.includes(currentRoute);
      else return x.route === currentRoute;
    });
  }


  const selectedKey: any = selectedRoute?.key;
  

  const onLogoutClick = () => {
    localStorage.clear();
    window.location.href = Page.HOME;
    // navigate(Page.LOGIN);
  };

  return (  
    <Sider
      // collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: "60px",
        bottom: 0,
        transition: "0s",
      }}
      className="sideBar"
    >
      <Menu
        theme="dark"
        selectedKeys={[selectedKey]}
        // defaultOpenKeys={['6']}
        mode="inline"
        items={items}
        aria-expanded={true}
      />
      <div className="signoutBtnContainer">
        <button
          title="Click here to Logout"
          className="signoutBtn"
          onClick={onLogoutClick}
        >
          <img src={logoutIcon} className="logout-icon" alt="icon" />{" "}
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </Sider>
  );
};

export default UISidebar;
