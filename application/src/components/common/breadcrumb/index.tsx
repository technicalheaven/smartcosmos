import { Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom'
import { PageTitle, Roles } from '../../../config/enum';
import { getUserInfo } from '../../../redux/features/auth/authSlice';
import { useGetRoleDetailsQuery } from '../../../redux/services/roleApiSlice';
import { Page } from '../../../routes/config';

const UIBreadcrumb = () => {
  const location = useLocation(); 
  const currentRoute = location.pathname;
  const userInfo = useSelector(getUserInfo);
  const loggedInRole = userInfo?.userRole?.roleName;
   
   const roleCond= loggedInRole == Roles.PLATFORM_SUPER_ADMIN ||loggedInRole == Roles.PLATFORM_ADMIN
  
  const tenantState = useSelector((state:any) => state.tenant);
  const roleState = useSelector((state:any) => state.role);
  const processState = useSelector((state:any) => state.process);
  console.log({processState});
  
  
 const platformTenantLink=[
  { title: PageTitle.HOME, path: Page.HOME },
  { title: tenantState.name, path: `${Page.ORGANISATION}/${tenantState.id}` },];


  const tenantLinks = [
    { title: PageTitle.HOME, path: Page.HOME },
    { title: PageTitle.TENANTS, path: Page.TENANTS },
    { title: tenantState.name, path: `${Page.ORGANISATION}/${tenantState.id}` },
  ];
  const config = [
    {
      route:  loggedInRole == Roles.FACTORY_OPERATOR ? `${Page.FACTORY_TAGS_HISTORY}/${tenantState.id}`: Page.HOME,
      links: [
        { title: PageTitle.HOME, path:  loggedInRole == Roles.FACTORY_OPERATOR ? `${Page.FACTORY_TAGS_HISTORY}/${tenantState.id}`: Page.HOME },
      ] 
    },
   
    {
      route: Page.TENANTS,
      links: [
        { title: PageTitle.HOME, path: Page.HOME },
        { title: PageTitle.TENANTS, path: Page.TENANTS },
      ] 
    },
    {
      route: Page.PLATFORM_USERS,
      links: [
        { title: PageTitle.HOME, path: Page.HOME },
        { title: PageTitle.PLATFORM_USERS, path: Page.PLATFORM_USERS },
      ] 
    },
    {
      route: Page.FACTORY_TAGS,
      links: [
        { title: PageTitle.HOME, path: Page.HOME },
        { title: PageTitle.FACTORY_TAGS, path: Page.FACTORY_TAGS },
      ] 
    },
    {
      route: `${Page.DIGITAL_IDENTITIES}/${tenantState.id}`,
      links: roleCond?[
        ...tenantLinks,
        {title: PageTitle.DIGITTAL_IDENTITIES, path: `${Page.DIGITAL_IDENTITIES}/${tenantState.id}`},
      ]:[
        ...platformTenantLink,
        { title: PageTitle.DIGITTAL_IDENTITIES, path: `${Page.DIGITAL_IDENTITIES}/${tenantState.id}`},
      ]
    },
    {
      route: `${Page.ORGANISATION}/${tenantState.id}`,
      links: roleCond?tenantLinks:platformTenantLink
    },
    {
      route:  `${Page.PRODUCTS}/${tenantState.id}`,
      links: roleCond?[
        ...tenantLinks,
        { title: PageTitle.PRODUCTS, path: `${Page.PRODUCTS}/${tenantState.id}`},
      ]:[
        ...platformTenantLink,
        { title: PageTitle.PRODUCTS, path: `${Page.PRODUCTS}/${tenantState.id}`},
      ]
    },


    {
      route:  `${Page.FACTORY_TAGS}/${tenantState.id}`,
      links: roleCond?[
        ...tenantLinks,
        { title: PageTitle.FACTORY_TAGS, path: `${Page.FACTORY_TAGS}/${tenantState.id}`},
      ]:[
        ...platformTenantLink,
        { title: PageTitle.FACTORY_TAGS, path: `${Page.FACTORY_TAGS}/${tenantState.id}`},
      ]
    },
    {
      route:  `${Page.USER_DEFINED_PROCESS}/${tenantState.id}`,
      links:roleCond? [
        ...tenantLinks,
        { title: PageTitle.PROCESSES, path: "#" },
        { title: PageTitle.USER_DEFINED_PROCESS, path: `${Page.USER_DEFINED_PROCESS}/${tenantState.id}` },
      ]:
      [
        ...platformTenantLink,
        { title: PageTitle.PROCESSES, path: "#" },
        { title: PageTitle.USER_DEFINED_PROCESS, path: `${Page.USER_DEFINED_PROCESS}/${tenantState.id}` },
      ]
    },
    {
      route:  `${Page.PRE_DEFINED_PROCESS}/${tenantState.id}`,
      links:roleCond? [
        ...tenantLinks,
        { title: PageTitle.PROCESSES, path: "#" },
        { title: PageTitle.PRE_DEFINED_PROCESS, path: `${Page.PRE_DEFINED_PROCESS}/${tenantState.id}` },
      ]:
      [
        ...platformTenantLink,
        { title: PageTitle.PROCESSES, path: "#" },
        { title: PageTitle.PRE_DEFINED_PROCESS, path: `${Page.PRE_DEFINED_PROCESS}/${tenantState.id}` },
      ]
    },
    {
      route:  `${Page.USERDEFINED_PROCESS_INFO}/${processState.id}`,
      links:roleCond? [
        ...tenantLinks,
        { title: PageTitle.PROCESSES, path:`${Page.USER_DEFINED_PROCESS}/${tenantState.id}` },
        { title: PageTitle.USER_DEFINED_PROCESS, path: `${Page.USER_DEFINED_PROCESS}/${tenantState.id}` },
        {title: processState.name, path:`${Page.USERDEFINED_PROCESS_INFO}/${processState.id}`},
      ]:
      [
        ...platformTenantLink,
        { title: PageTitle.PROCESSES, path: `${Page.USER_DEFINED_PROCESS}/${tenantState.id}` },
        { title: PageTitle.USER_DEFINED_PROCESS, path: `${Page.USER_DEFINED_PROCESS}/${tenantState.id}` },
        {title: processState.name, path:`${Page.USERDEFINED_PROCESS_INFO}/${processState.id}`},
      ]
    },
    {
      route:  `${Page.PREDEFINED_PROCESS_INFO}/${processState.id}`,
      links:roleCond? [
        ...tenantLinks,
        { title: PageTitle.PROCESSES, path:`${Page.PRE_DEFINED_PROCESS}/${tenantState.id}`},
        { title: PageTitle.PRE_DEFINED_PROCESS, path: `${Page.PRE_DEFINED_PROCESS}/${tenantState.id}` },
        {title: processState.name, path:`${Page.PREDEFINED_PROCESS_INFO}/${processState.id}`},
      ]:
      [
        ...platformTenantLink,
        { title: PageTitle.PROCESSES, path:`${Page.PRE_DEFINED_PROCESS}/${tenantState.id}` },
        { title: PageTitle.PRE_DEFINED_PROCESS, path: `${Page.PRE_DEFINED_PROCESS}/${tenantState.id}` },
        {title: processState.name, path:`${Page.PREDEFINED_PROCESS_INFO}/${processState.id}`},
      ]
    },
    {
      route: Page.ROLES,
      links: [
        { title: PageTitle.HOME, path:  Page.HOME },
        { title: PageTitle.ROLES, path: Page.ROLES },
      ] 
    },
    {
      route:`${Page.ROLE_INFO}/${roleState.id}`,
      links:[
        {title: PageTitle.HOME, path: Page.HOME},
        {title: PageTitle.ROLES, path:Page.ROLES},
        {title: roleState.name, path:`${Page.ROLE_INFO}/${roleState.id}`},
      ]

    }
  ];
 
  
  const breadcrumbObj:any = config.find((item) => item.route === currentRoute);
  const breadcrumbLinks:any  = breadcrumbObj !== undefined && Object.keys(breadcrumbObj).length > 0 ? breadcrumbObj?.links : [];

  return (
    <Breadcrumb
            style={{
              margin: "16px 0",
            }}
            separator=">"
          >
            {breadcrumbLinks.map((breadcrumb:any)=>{
              return (<Breadcrumb.Item><Link to={breadcrumb.path} style={{textTransform: "capitalize"}}>{breadcrumb.title}</Link></Breadcrumb.Item>)
            })}
    </Breadcrumb>
  )
}

export default UIBreadcrumb