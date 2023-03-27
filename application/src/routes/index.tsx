import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import NoPermission from "../components/common/noPermission";
import NotFound from "../components/common/page404";
import UILayout from "../components/layouts";
import Login from "../components/pages/auth";
import CreatePassword from "../components/pages/auth/createPassword";
import Dashboard from "../components/pages/dashboard";
import FactoryTags from "../components/pages/factoryTag/factoryTags";
import { FactoryTagHistory } from "../components/pages/factoryTag/history";
import Identities from "../components/pages/identities";
import ProcessList from "../components/pages/process";
import ProcessDetails from "../components/pages/process/details";
import Products from "../components/pages/product";
import UserRoles from "../components/pages/role";
import { RolesDetails } from "../components/pages/role/roleDetails";
import Tenants from "../components/pages/tenant/main";
import { TenantDetail } from "../components/pages/tenant/tenantDetails";
import Users from "../components/pages/user";
import { getIsLoggedIn, getIsPlatformRole } from "../redux/features/auth/authSlice";
import { Page } from "./config";
import { ProtectedRoute } from "./ProtectedRoute";


const UIRoutes = () => {
  const isPlatformRole = parseInt(useSelector(getIsPlatformRole));
  const isLoggedIn = useSelector(getIsLoggedIn);

  return (
    <Routes>
      {!isLoggedIn && <Route index element={<Login/>} />} 
      <Route element={<ProtectedRoute redirectPath={Page.HOME} isLoggedIn={isLoggedIn}/>}>
      <Route path={Page.HOME} element={<UILayout />}>
        <Route path="*" element={<NotFound/>}/>
        <Route index element={<Dashboard />} />
        <Route path={Page.TENANTS} element={isPlatformRole == 1 ? <Tenants /> : <NoPermission/>} />
        <Route path={Page.PLATFORM_USERS} element={isPlatformRole == 1 ? <Users /> : <NoPermission/>} />
        <Route path={Page.ROLES} element={<UserRoles />} />
        <Route path={Page.ROLES_INFO} element={<RolesDetails/>}/>
        <Route path={Page.TENANT_INFO} element={<TenantDetail />} />
        <Route path={Page.TENANT_PRODUCTS} element={<Products />} />
        <Route path={Page.TENANT_PROCESSES} element={<ProcessList />} />
        <Route path={Page.PROCESS_INFO} element={<ProcessDetails />} />
        <Route path={Page.TENANT_DIGITAL_IDENTITIES} element={<Identities />} />
        <Route path={Page.TENANT_FACTORY_TAGS_HISTORY} element={ <FactoryTagHistory /> } />
        <Route path={Page.TENANT_FACTORY_TAGS} element={ <FactoryTags /> } />
      </Route>
      </Route>
      <Route path={Page.CREATE_PASSWORD} element={<CreatePassword />} />
    </Routes>
  );
};

export default UIRoutes;
