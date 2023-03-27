import { Card, Col, Form, message, Row, Space, Upload } from "antd";
import * as util from "util";
import "./style.css";
import {
  activateIcon,
  deactivateIcon,
  deleteDarkIcon,
  editDarkIcon,
  ellipsisIcon,
  green,
  red,
  tenanDarkIcon,
} from "../../../../assets/icons";
import {
  UIbutton,
  UIIconbutton,
  UIsecondaryButton,
} from "../../../common/button";

import { UISearchBar } from "../../../common/searchBar";
import { useEffect, useState } from "react";
import { UIImage, UIProfilePicPreview } from "../../../common/image";
import { UIModal } from "../../../common/modal";
import {
  ModalButton,
  ModalPrimaryText,
  ModalTitle,
  ModalType,
  Permission,
} from "../../../../config/enum";
import { TenantForm } from "./form";
import { UITable } from "../../../common/table";
import { UIDropdown } from "../../../common/dropdown";
import { TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import {
  useCreateTenantMutation,
  useDeleteTenantMutation,
  useGetAllTenantsQuery,
  useUpdatetenantMutation,
} from "../../../../redux/services/tenantApiSlice";
import { UIErrorAlert } from "../../../common/uiAlert";
import { UIConfirmModal } from "../../../common/confirmModal";
import { page, Status } from "../../../../config/constants";
import { addTenantDropdown } from "../../../../assets/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { UIAvatar } from "../../../common/avatar";
import { useDispatch } from "react-redux";
import { setTenant } from "../../../../redux/features/tenant/tenantSlice";
import { useGetAllRolesQuery } from "../../../../redux/services/roleApiSlice";
import { useCreateUserMutation } from "../../../../redux/services/userApiSlice";
import { UserForm } from "../../user/form";
import { useGetAllSitesQuery } from "../../../../redux/services/siteApiSlice";
import { GetPermissions, removeEmptyKeys } from "../../../../utils";
import UITooltip from "../../../common/tooltip";
import { EllipsisOutlined } from "@ant-design/icons";
import { ReactComponent as EllipsisIcon } from "../../../../assets/images/ellipsis.svg";
import { UILoader } from "../../../common/loader";
import { getFilterInfo, resetFilterState, setFilterState } from "../../../../redux/features/filter/filterSlice";
import { useSelector } from "react-redux";

const Tenants = () => {
  // Get permissions
  const userPermissions = GetPermissions(Permission.USER);

  let navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const [addTenant, setAddTenant] = useState({
    name: "",
    description: "",
    features: [],
    logo: "",
  });
  const [roles, setRoles] = useState<any>([]);
  const [SCTenant, setSCTenant] = useState<any>("");
  const [siteParams, setSiteParams] = useState<any>({});
  const [tableData, setTableData] = useState([]);
  const filterState = useSelector(getFilterInfo);
  const currentURL = window.location.href;
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: filterState?.page &&  currentURL == filterState?.url ?  filterState?.page : page?.current,
    pageSize: filterState.limit && currentURL == filterState?.url ? filterState.limit : page?.pageSize,
    showSizeChanger: true,
  });
  const [sort, setSort] = useState<any>({
    ...((currentURL == filterState?.url && filterState?.sortBy) && {sortBy: filterState?.sortBy}),
    ...((currentURL == filterState?.url && filterState?.sortOrder) && {sortOrder: filterState?.sortOrder}),
  });
  const [isAddModalVisible, setIsAddModalVisible] = useState<any>(false);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [usernameDisable, setUsernameDisable] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  dispatch(setTenant({ id: "", name: "" }));
  const [addUser, setAddUser] = useState({
    name: "",
    roleId: null,
    roleName: "",
    email: "",
    username: "",
    siteId: null,
    homeSite: null,
    tenantId: selectedRow?.id,
    gender: "",
    imageUrl: "",
  });
  //modal create tenant functions and state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loader,setLoader]=useState(true)
  const onModalClose = () => {
    setIsModalVisible(!isModalVisible);
    form.resetFields();
    // setError("");
    setFormValues({
      name: "",
      description: "",
      features: [],
      logo: "",
    });
    form.setFieldsValue({
      name: "",
      description: "",
      features: [],
      logo: "",
    });
    createTenantInfo?.reset();
  };
  const onModalSubmit = (values: any) => {
    createTenant(removeEmptyKeys(addTenant));
    setLoader(true)
  };
  let tenantId = selectedRow?.id;
  //edit tenant functions and state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const onEditModalSubmit = (values: any) => {
    updateTenant(formValues);
    setLoader(true)
  };
  const onEditModalClose = () => {
    form.resetFields();
    setFormValues({
      name: "",
      description: "",
      features: [],
      logo: "",
    });
    setAddTenant({
      name: "",
      description: "",
      features: [],
      logo: "",
    });
    setIsEditModalVisible(false);
  };
  console.log(formValues, "jknjk");

  const onEditClick = (row: any) => {
    const { name, description } = row;
    setError("");
    setFormValues(row);
    form.setFieldsValue({
      name,
      description,
    });
    setIsEditModalVisible(true);
  };

  //modal delete tenant functions and state
  const [deleteModal, setDeleteModal] = useState(false);
  const handleDelete = () => {
    deleteTenant(selectedRow?.id);
    setDeleteModal(false);
    refetch();
  };

  const SCTenantdata = useGetAllTenantsQuery({ type: "smartcosmos" });
  useEffect(() => {
    if (SCTenantdata.isSuccess) {
      console.log("SC tenant : ", SCTenantdata?.data?.result?.rows[0]?.id);
      setSCTenant(SCTenantdata?.data?.result?.rows[0]?.id);
    }
  }, [SCTenantdata.isSuccess]);
  //roles
  const tenantRoleQuery = useGetAllRolesQuery({ isPlatformRole: 0 });
  useEffect(() => {
    let x: any[] = tenantRoleQuery?.data?.result?.rows?.map((role: any) => {
      return {
        text: role?.name,
        value: role?.id,
      };
    });
    setRoles(x);
  }, [tenantRoleQuery?.isSuccess]);

  const onDeleteModalClose = () => {
    setDeleteModal(false);
  };

  const onDeleteClick = (row: any) => {
    setDeleteModal(true);
    setSelectedRow(row);
  };

  //modal tenant activate
  const [activateTenant, setActivateTenant] = useState(false);
  const handleActivate = () => {
    if (selectedRow?.status === Status?.ACTIVE) {
      updateTenant({ id: selectedRow.id, status: Status?.INACTIVE });
      setNotifyMessage(`Tenant deactivated successfully`);
    } else {
      updateTenant({ id: selectedRow.id, status: Status?.ACTIVE });
      setNotifyMessage(`Tenant activated successfully`);
    }
    setActivateTenant(false);
  };
  const onActivateClick = (row: any) => {
    setActivateTenant(true);
    setSelectedRow(row);
  };

  const onActivateModalClose = () => {
    setActivateTenant(false);
  };

  

 

  let queryParams: any = {
    page:  pagination.current,
    limit: pagination.pageSize,
    type: "tenant",
    // tenant: tenantId ? tenantId : "",
    ...sort,
  };
  
  if (search?.trim() !== "") queryParams = { ...queryParams, search };

  //API integration
  const [createTenant, createTenantInfo] = useCreateTenantMutation();
  const [updateTenant, updateTenantInfo] = useUpdatetenantMutation();
  const [createUser, createUserInfo] = useCreateUserMutation();
  const [deleteTenant, deleteTenantInfo] = useDeleteTenantMutation();
  const { data, isSuccess, refetch,isError } = useGetAllTenantsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });


  // persist pagination data
  useEffect(()=>{
      dispatch(setFilterState({
        page: queryParams?.page,
        limit : queryParams?.limit,
        sortBy: queryParams?.sortBy,
        sortOrder: queryParams?.sortOrder
      }));
  },[
    queryParams?.page,
    queryParams?.limit,
    queryParams?.sortBy,
    queryParams?.sortOrder
  ]);

  useEffect(() => {
    if (deleteTenantInfo?.isSuccess) {
      message.success({
        content: `Tenant is deleted Successfully`,
        key: "errorNotification",
        className: "successMessage",
      });
      refetch();
    } else if (deleteTenantInfo?.isError) {
      message.error({
        content: deleteTenantInfo?.error?.data?.error?.message,
        key: "errorNotification",
        className: "errorMessage",
      });
    }
  }, [deleteTenantInfo?.isSuccess, deleteTenantInfo?.isError]);

  const onAddUserClick = (row: any) => {
    setSelectedRow(row);
    setError("");
    setIsAddModalVisible(true);
    form1.resetFields();
  };

  useEffect(() => {
    if (selectedRow) {
      setSiteParams({ ...siteParams, tenantId: selectedRow?.id });
    }
  }, [selectedRow]);

  const getSitesFromQuery = useGetAllSitesQuery(siteParams, {
    refetchOnMountOrArgChange: true,
  });
  const [sites, setSites] = useState([]);

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
    if (isSuccess) {
      setTableData(data?.result?.rows);
      setTotal(data?.result?.count);
      setLoading(false);
      setLoader(false)
    }
  }, [data, isSuccess]);
  useEffect(()=>{
if(isError){
  setLoading(false)
}
  },[isError])

  // refectch data on page load
  useEffect(() => {
    if (createTenantInfo.isSuccess) {
      setIsModalVisible(false);
      form.resetFields();
      setFormValues({
        name: "",
        description: "",
        features: [],
        logo: "",
      });
      form.setFieldsValue({
        name: "",
        description: "",
        features: [],
        logo: "",
      });
      setAddTenant({
        name: "",
        description: "",
        features: [],
        logo: "",
      });
      createTenantInfo?.reset();
      message.success({
        content: `Tenant created Successfully`,
        className: "successMessage",
      });
      refetch();
      setLoader(false)
    }
  }, [createTenantInfo.isSuccess]);

  useEffect(() => {
    if (updateTenantInfo?.isSuccess) {
      if (isEditModalVisible) {
        setIsEditModalVisible(false);
        form.resetFields();
        message.success({
          content: `Tenant updated Successfully`,
          className: "successMessage",
        });
      } else {
        message.success({
          content: notifyMessage,
          key: "tenantErrorKey",
          className: "successMessage",
        });
        setLoader(false)
      }
      updateTenantInfo?.reset();
      refetch();
    }
  }, [updateTenantInfo?.isSuccess]);

  useEffect(() => {
    if (createUserInfo.isSuccess) {
      setIsAddModalVisible(false);
      form1.resetFields();
      message.success({
        content: "User created successfully",
        className: "successMessage",
      });
      createUserInfo?.reset();
      setAddUser({
        name: "",
        roleId: null,
        roleName: "",
        email: "",
        username: "",
        siteId: null,
        homeSite: null,
        tenantId: "",
        gender: "",
        imageUrl: "",
      });
      setLoader(false)
    }
  }, [createUserInfo.isSuccess]);

  useEffect(() => {
    if (createUserInfo.isError) {
      let error = createUserInfo?.error?.data?.error?.message;
      if (typeof error != "string" && error?.code == "Request_BadRequest") {
        let body = JSON.parse(error?.body);
        error = body.message;
      }
      setError(error);
      setLoader(false)
    } else {
      setError("");
    }
  }, [createUserInfo.isError]);

  const getErrorMessage = (data: any) => {
    if (data?.error) {
      return data?.error?.message;
    } else if (data?.errors) {
      return data?.errors[0]?.msg;
    } else {
      return "something went wrong";
    }
  };

  //success and error alert
  const showAlert = () => {
    if (createTenantInfo?.isError) {
      const { error } = createTenantInfo;
      return (
        <UIErrorAlert
          // message={createTenantInfo?.error?.data?.error?.message}
          message={getErrorMessage(error?.data)}
          showAlert={createTenantInfo?.isError}
        />
      );
    } else {
      return null;
    }
  };

  const showAlertUser = () => {
    if (createUserInfo?.isError) {
      const { error } = createUserInfo;
      return (
        <UIErrorAlert
          // message={createTenantInfo?.error?.data?.error?.message}
          message={getErrorMessage(error?.data)}
          showAlert={createUserInfo?.isError}
        />
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (updateTenantInfo?.isError) {
      setErrorAlert(true);
      setLoader(false)
    }
  }, [updateTenantInfo.isError]);

  useEffect(() => {
    if (createTenantInfo?.isError) {
      setErrorAlert(true);
      setLoader(false)
    }
  }, [createTenantInfo.isError]);

  const showUpdateAlert = () => {
    if (updateTenantInfo?.isError) {
      return (
        <UIErrorAlert
          type="error"
          message={updateTenantInfo?.error?.data?.error?.message}
          showAlert={errorAlert}
          setShowAlert={setErrorAlert}
        />
      );
    } else {
      return null;
    }
  };

  //table
  const onRowClick = (row: any) => {
    setSelectedRow(row);
    navigate(`../tenant/info/${row?.id}`);
  };

  const onAddModalSubmit = (values: any) => {
    createUser({ ...addUser, tenantId: tenantId ? tenantId : SCTenant });
    setLoader(true)
  };

  const onAddModalClose = () => {
    setIsAddModalVisible(!isAddModalVisible);
    form1.resetFields();
    createUserInfo.reset();
    setError("");
    setChecked(false);
    setAddUser({
      name: "",
      roleId: null,
      roleName: "",
      email: "",
      username: "",
      siteId: null,
      homeSite: null,
      tenantId: selectedRow?.id,
      gender: "",
      imageUrl: "",
    })

  };

  const UITableColumns: any = [
    {
      title: "Name",
      dataIndex: "name",
      width: 170,
      minWidth: 160,
      sorter: true,
      ...(sort?.sortBy == "name" && {defaultSortOrder: sort?.sortOrder == 'ASC' ?  'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : ""}),
      render: (field: any, row: any) => {
        return (
          <div
            className="d-flex align-items-center clickable"
            onClick={() => onRowClick(row)}
          >
            {row?.logo ? (
              <UIProfilePicPreview src={row?.logo} text="profile pic" />
            ) : (
              <UIAvatar text={field} type="username" />
            )}
            <p className="pl-10 tableData slice paragraph">{field}</p>
          </div>
        );
      },
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 170,
      minWidth: 160,
      sorter: true,
      ...(sort?.sortBy == "description" && {defaultSortOrder: sort?.sortOrder == 'ASC' ?  'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : ""}),
      render: (_: any, row: any) => {
        return (
          <div className="clickable" onClick={() => onRowClick(row)}>
            <UITooltip title={row?.description} placement="top">
              <p className="tableData slice paragraph">{row?.description}</p>
            </UITooltip>
          </div>
        );
      },
    },
    {
      title: "LAST UPDATED",
      dataIndex: "updatedAt",
      width: 140,
      minWidth: 130,
      sorter: true,
      ...(sort?.sortBy == "updatedAt" && {defaultSortOrder: sort?.sortOrder == 'ASC' ?  'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : ""}),
      render: (updatedAt: any, row: any) => {
        return (
          <div className="clickable" onClick={() => onRowClick(row)}>
            {moment(updatedAt).format("DD MMM YYYY hh:mm A")}
          </div>
        );
      },
    },
    {
      title: "CREATED",
      dataIndex: "createdAt",
      width: 100,
      minWidth: 80,
      sorter: true,
      ...(sort?.sortBy == "createdAt" && {defaultSortOrder: sort?.sortOrder == 'ASC' ?  'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : ""}),
      render: (createdAt: any, row: any) => {
        return (
          <div className="clickable" onClick={() => onRowClick(row)}>
            {moment(createdAt).format("DD MMM YYYY hh:mm A")}
          </div>
        );
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 100,
      minWidth: 80,
      sorter: true,
      ...(sort?.sortBy == "status" && {defaultSortOrder: sort?.sortOrder == 'ASC' ?  'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : ""}),      render: (data: any, row: any) => {
        return (
          <div className="clickable" onClick={() => onRowClick(row)}>
            <Space>
              {row?.status === Status?.ACTIVE ? (
                <UIImage src={green} text="active" />
              ) : (
                <UIImage src={red} text="inactive" />
              )}
              <span className="tableData">{row?.status}</span>
            </Space>
          </div>
        );
      },
    },
    {
      width: 30,
      minWidth: 30,
      fixed: "right",
      render: (login: any, row: any) => {
        return row?.status === Status?.INACTIVE ? (
          <UIDropdown
            items={[
              {
                label:
                  row.status === Status?.ACTIVE ? "Deactivate" : "Activate",
                key: "2",
                icon:
                  row.status === Status?.ACTIVE ? (
                    <img src={deactivateIcon} alt="deactivate" />
                  ) : (
                    <img src={activateIcon} alt="activate" />
                  ),
                onClick: () => onActivateClick(row),
              },
              {
                label: "Delete",
                key: "3",
                icon: <img src={deleteDarkIcon} alt="delete" />,
                onClick: () => onDeleteClick(row),
              },
            ]}
            placement="bottom"
          >
            <a href="javascript:void(0)" className="actionTag">
              {/* <img width={20} src={ellipsisIcon} /> */}
              {/* < EllipsisOutlined className="ellipses"/> */}
              <EllipsisIcon className="ellipses" />
            </a>
          </UIDropdown>
        ) : (
          <UIDropdown
            items={[
              {
                label: <a href="javascript:void(0)">Edit</a>,
                key: "1",
                icon: <img src={editDarkIcon} alt="edit" />,
                onClick: () => onEditClick(row),
              },
              {
                type: "divider",
              },
              {
                label:
                  row.status === Status?.ACTIVE ? "Deactivate" : "Activate",
                key: "2",
                icon:
                  row.status === Status?.ACTIVE ? (
                    <img src={deactivateIcon} alt="deactivate" />
                  ) : (
                    <img src={activateIcon} alt="activate" />
                  ),
                onClick: () => onActivateClick(row),
              },
              {
                type: "divider",
              },
              {
                label: "Delete",
                key: "3",
                icon: <img src={deleteDarkIcon} alt="delete" />,
                onClick: () => onDeleteClick(row),
              },
              {
                type: "divider",
              },
              {
                label: "Add Tenant User",
                key: "4",
                icon: <img src={addTenantDropdown} alt="add tenant" />,
                onClick: () => onAddUserClick(row),
                disabled: userPermissions?.isEdit ? false : true,
              },
            ]}
            placement="bottom"
          >
            <a href="javascript:void(0)" className="actionTag">
              {/* <img width={20} src={ellipsisIcon} /> */}
              {/* < EllipsisOutlined className="ellipses"/> */}
              <EllipsisIcon className="ellipses" />
            </a>
          </UIDropdown>
        );
      },
    },
  ];
  const [columns, setColumns] = useState(UITableColumns);
  interface DataType {
    name: {
      first: string;
      last: string;
    };
    description: string;
    lastUpdated: string;
    createdAt: string;
  }
  interface Params {
    pagination?: TablePaginationConfig;
    sorter?: SorterResult<any> | SorterResult<any>[];
    total?: number;
    sortField?: string;
    sortOrder?: string;
  }

  useEffect(() => {
    setPagination({
      ...pagination,
      locale: { items_per_page: "" },
      total,
    });
  }, [total]);

  const fetchData = (params: Params = {}) => {
    setLoading(true);
    refetch();
    setSort({
      sortBy: params.sortField,
      sortOrder:
        params.sortOrder == "ascend"
          ? "ASC"
          : params.sortOrder == "descend"
            ? "DESC"
            : undefined,
    });
    setPagination({
      ...params.pagination,
      locale: { items_per_page: "" },
      total,
    });
  };
  const onAddTenantClick = () => {
    form.resetFields();
    setFormValues({
      name: "",
      description: "",
      features: [],
      logo: "",
    });
    setAddTenant({
      name: "",
      description: "",
      features: [],
      logo: "",
    });
    setIsModalVisible(true);
  };
  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<DataType>
  ) => {
    fetchData({
      sortField: sorter.field as string,
      sortOrder: sorter.order as string,
      pagination: newPagination,
      ...filters,
    });
  };

  return (
    <>
      <section className="title-section">
        <Card className="uicard tanent-card topui-card">
          <Row className="front-top-card">
            <Col xl={10} lg={6} md={6} sm={24} xs={24}>
              <div className="d-flex align-items-center">
                <div className="icon">
                  <UIImage
                    src={tenanDarkIcon}
                    //  width={30}
                    text="icon"
                  />
                </div>
                <div className="title">Tenants</div>
              </div>
            </Col>
            <Col xl={14} lg={18} md={18} sm={24} xs={24}>
              <div className="actions align-items-center">
                <Row>
                  <Col className="search-icon-align">
                    <div className="search">
                      <UISearchBar
                        placeholder="Search by name"
                        pagination={pagination}
                        setPagination={setPagination}
                        setSearch={setSearch}
                        search={search}
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="addbtn">
                      <UIIconbutton
                        onPress={onAddTenantClick}
                        icon="plus"
                        type="info"
                        size="md"
                        data-testid="addbutton"
                      >
                        ADD TENANT
                      </UIIconbutton>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
      </section>
      
      <section className="listing-section">
        <Card className="uicard table ">
          <div className="card-body ">
            <UITable
              className="columnHeader tenantTable"
              columns={columns}
              setColumns={setColumns}
              data={tableData}
              pagination={pagination}
              loading={loading}
              handleTableChange={handleTableChange}
              scroll={{ x: 1300, y: 500 }}
              rowSelection={onRowClick}
            />
          </div>
        </Card>
      </section>
      <UIModal
        title={ModalTitle.ADD_TENANT}
        width={503}
        key="addTenant"
        visible={isModalVisible}
        // handleCancel={onModalClose}
        footer={[
          <Space>
            <UIsecondaryButton onPress={onModalClose} size="sm">
              CANCEL
            </UIsecondaryButton>
            <UIbutton
              form="addTenant"
              type="info"
              btnType="submit"
              size="sm"
              data-testid="testButton"
            >
              ADD
            </UIbutton>
          </Space>,
        ]}
      >
        <div className="pb-10">{showAlert()}</div>
        <div className="modalMainDiv">
        {loader && (<UILoader />)}
          <TenantForm
            onModalSubmit={onModalSubmit}
            id="addTenant"
            form={form}
            formValues={addTenant}
            setFormValues={setAddTenant}
          />
        </div>
      </UIModal>
      <UIModal
        title={ModalTitle.EDIT_TENANT}
        key="editTenant"
        visible={isEditModalVisible}
        // handleCancel={onEditModalClose}
        footer={[
          <Space>
            <UIsecondaryButton onPress={onEditModalClose} size="sm">
              CANCEL
            </UIsecondaryButton>
            <UIbutton
              form="editTenant"
              type="info"
              btnType="submit"
              size="sm"
              data-testid="testButton"
            >
              SAVE
            </UIbutton>
          </Space>,
        ]}
      >
        <div>{showUpdateAlert()}</div>
        <div className="modalMainDiv">
        {loader && (<UILoader />)}
          <TenantForm
            onModalSubmit={onEditModalSubmit}
            id="editTenant"
            form={form}
            formValues={formValues}
            setFormValues={setFormValues}
          />
        </div>
      </UIModal>
      <UIModal
        title={ModalTitle.ADD_USER}
        className="userAddModal"
        key="addUser"
        visible={isAddModalVisible}
        // handleCancel={onAddModalClose}
        footer={[
          <Space>
            <UIsecondaryButton onPress={onAddModalClose} size="sm">
              CANCEL
            </UIsecondaryButton>
            <UIbutton
              form="addUser"
              type="info"
              btnType="submit"
              size="sm"
              data-testid="testButton"
            >
              ADD
            </UIbutton>
          </Space>,
        ]}
      >
        <div className="pb-10">{showAlertUser()}</div>
        <div className="modalMainDiv">
        {loader && (<UILoader />)}
          <UserForm
            onModalSubmit={onAddModalSubmit}
            formId="addUser"
            error={error}
            form={form1}
            formValues={addUser}
            setFormValues={setAddUser}
            roles={roles}
            siteOptions={getSiteOptions()}
            checked={checked}
            setChecked={setChecked}
            usernameDisable={usernameDisable}
            setUsernameDisable={setUsernameDisable}
          />
        </div>
      </UIModal>
      <UIConfirmModal
        key="deleteTenant"
        visible={deleteModal}
        cancelCallback={onDeleteModalClose}
        confirmCallback={handleDelete}
        cancelButton={ModalButton.CANCEL}
        confirmButton={ModalButton.CONFIRM}
        primaryText={util.format(ModalPrimaryText.DELETE, selectedRow.name)}
        type={ModalType.WARN}
      />
      <UIConfirmModal
        key="activateTenant"
        visible={activateTenant}
        cancelCallback={onActivateModalClose}
        confirmCallback={handleActivate}
        cancelButton={ModalButton.CANCEL}
        confirmButton={ModalButton.CONFIRM}
        primaryText={
          selectedRow?.status === Status?.ACTIVE
            ? util.format(ModalPrimaryText.DEACTIVATE, selectedRow.name)
            : util.format(ModalPrimaryText.ACTIVATE, selectedRow.name)
        }
        type={
          selectedRow?.status === Status?.ACTIVE
            ? ModalType.WARN
            : ModalType.SUCCESS
        }
      />
    </>
  );
};

export default Tenants;
