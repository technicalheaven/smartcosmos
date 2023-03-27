import { useState, useEffect } from "react";
import { UITable } from "../../common/table";
import "./style.css";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { Card, Space, Form, message, Spin } from "antd";
import * as util from "util";
import {
  editDarkIcon,
  // ellipsisIcon,
  resendInviteIcon,
  deactivateIcon,
  deleteIcon,
  resetPasswordIcon,
  activateIcon,
} from "../../../assets/icons";

import { UIDropdown } from "../../common/dropdown";
import { UIbutton, UIsecondaryButton } from "../../common/button";
import { UIConfirmModal } from "../../common/confirmModal";
import moment from "moment";
import { UIAvatar } from "../../common/avatar";
import {
  ModalButton,
  ModalPrimaryText,
  ModalTitle,
  ModalType,
  Roles,
  Permission,
  rolesOrder,
} from "../../../config/enum";
import { UIModal } from "../../common/modal";
import { UserForm } from "./form";
import "./style.css";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "../../../redux/services/userApiSlice";

import { useGetAllRolesQuery } from "../../../redux/services/roleApiSlice";
import ResetPasswordModal from "./resetPasswordModal";
import { useResendInviteMutation } from "../../../redux/services/authApiSlice";
import { useGetAllTenantsQuery } from "../../../redux/services/tenantApiSlice";
import { UIProfilePicPreview } from "../../common/image";
import { UILoader } from "../../common/loader";
import { GetPermissions } from "../../../utils";
import { useSelector } from "react-redux";
import {
  AppStateSelector,
  setIsUserUpdated,
} from "../../../redux/features/app/appSlice";
import { useDispatch } from "react-redux";
import { EllipsisOutlined } from "@ant-design/icons";
import { ReactComponent as EllipsisIcon } from "../../../assets/images/ellipsis.svg";
import { getUserInfo } from "../../../redux/features/auth/authSlice";
import { UIErrorAlert } from "../../common/uiAlert";
import { getFilterInfo, setFilterState } from "../../../redux/features/filter/filterSlice";
import { page } from "../../../config/constants";

const UsersList = ({
  setIsAddModalVisible,
  isAddModalVisible,
  search,
  tenantId,
  siteOption,
  inputKey,
  isTenantActive = true,
  pagination,
  setPagination,
  checked,
  setChecked,
}: any) => {
  // state variables
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState<any>([]);
  const [SCTenant, setSCTenant] = useState<any>("");
  const [usernameDisable, setUsernameDisable] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [formValues, setFormValues] = useState<any>({
    name: "",
    roleId: "",
    email: "",
    username: "",
    siteId: null,
    homeSite: "",
    tenantId,
    gender: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const filterState = useSelector(getFilterInfo);
  const currentURL = window.location.href;
  const [sort, setSort] = useState<any>({
    ...((currentURL == filterState?.url && filterState?.sortBy) && { sortBy: filterState?.sortBy }),
    ...((currentURL == filterState?.url && filterState?.sortOrder) && { sortOrder: filterState?.sortOrder }),
  });
  const [total, setTotal] = useState(0);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deactiveConfirm, setDeactiveConfirm] = useState(false);
  const [resetInviteConfirm, setResetInviteConfirm] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>();
  const userInfo = useSelector(getUserInfo);
  const roleName = userInfo?.userRole?.roleName;

  const userId = userInfo?.id;

  // permissions
  const userPermissions = GetPermissions(Permission.USER);

  const { isUserUpdated } = useSelector((state: any) => state.app);

  const onAddModalSubmit = (values: any) => {
    createUser({
      ...formValues,
      tenantId: tenantId ? tenantId : SCTenant,
      createdBy: userId,
    });
    setLoader(true)

  };

  const onEditModalSubmit = (values: any) => {
    const { name, email, imageUrl, siteId, roleId, homeSite } = formValues;
    updateUser({
      name,
      email,
      imageUrl,
      siteId,
      roleId,
      homeSite,
      id: selectedRow?.id,
      updatedBy: userId,
    });
    setLoader(true)
  };

  const onEditModalClose = () => {
    setIsEditModalVisible(false);
    setError("");
    form.resetFields();
    setChecked(false);
    setFormValues({});
    setLoader(false)
    updateUserInfo?.reset()
  };

  let queryParams: any = {
    page: pagination.current,
    limit: pagination.pageSize,
    tenant: tenantId ? tenantId : SCTenant,
    ...sort,
  };

  if (search?.trim() !== "") queryParams = { ...queryParams, search };

  //API integration
  const [createUser, createUserInfo] = useCreateUserMutation();
  const [updateUser, updateUserInfo] = useUpdateUserMutation();
  const [deleteUser, deleteUserInfo] = useDeleteUserMutation();
  const [resendInvite, resendInviteInfo] = useResendInviteMutation();

  const userQuery = useGetAllUsersQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const SCTenantdata = useGetAllTenantsQuery({ type: "smartcosmos" });

  const getErrorMessage = (data: any) => {
    if (data?.error) {
      return data?.error?.message;
    } else if (data?.errors) {
      return data?.errors[0]?.msg;
    } else {
      return "something went wrong";
    }
  };

  const showAlert = () => {
    if (createUserInfo?.isError) {
      const { error } = createUserInfo;
      console.log(getErrorMessage(error?.data), "errormsg");
      return (
        <UIErrorAlert
          message={getErrorMessage(error?.data)}
          showAlert={createUserInfo?.isError}
        ></UIErrorAlert>
      );
    } else {
      return null;
    }
  };
  const showUpdateAlert = () => {
    if (updateUserInfo?.isError) {
      const { error } = updateUserInfo;
      return (
        <UIErrorAlert
          message={getErrorMessage(error?.data)}
          showAlert={updateUserInfo?.isError}
        ></UIErrorAlert>
      );
    } else {
      return null;
    }
  }

  // persist pagination data
  useEffect(() => {
    dispatch(setFilterState({
      page: queryParams?.page,
      limit: queryParams?.limit,
      sortBy: queryParams?.sortBy,
      sortOrder: queryParams?.sortOrder
    }));
  }, [
    queryParams?.page,
    queryParams?.limit,
    queryParams?.sortBy,
    queryParams?.sortOrder
  ]);


  useEffect(() => {
    setUsernameDisable(false);
  }, [isAddModalVisible]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (isUserUpdated) {
      userQuery?.refetch();
      dispatch(setIsUserUpdated(false));
    }
  }, [isUserUpdated]);

  const onAddModalClose = () => {
    setChecked(false);
    setIsAddModalVisible(!isAddModalVisible);
    form.resetFields();
    setError("");
    setFormValues({
      name: "",
      roleId: null,
      email: "",
      username: "",
      siteId: null,
      homeSite: null,
      tenantId,
      gender: "",
      imageUrl: "",
    });

    setImageUrl("");
    createUserInfo?.reset();
  };

  useEffect(() => {
    if (userQuery?.isSuccess) {
      const tableData = userQuery?.data?.result?.rows.map((data: any) => ({
        id: data?.id,
        name: data?.name,
        imageUrl: data?.imageUrl,
        username: data?.username,
        roleName: data?.userRole?.roleName,
        roleId: data?.userRole?.roleId,
        email: data?.email,
        siteId: data?.userRole?.siteId,
        homeSite: data?.userRole?.homeSite,
        createdAt: data?.createdAt,
        updatedAt: data?.updatedAt,
        status: data?.status,
        tenantId: tenantId ? tenantId : SCTenant,
      }));

      setTableData(tableData.filter((x: any) => x?.id != userId));
      setTotal(userQuery?.data?.result?.count);
      setLoading(false);

    }
  }, [userQuery?.data, userQuery?.isSuccess]);
  useEffect(() => {
    if (userQuery?.isError) {
      setLoading(false)
    }
  }, [userQuery?.isError])
  //roles
  const tenantRoleQuery = useGetAllRolesQuery(
    { isPlatformRole: 0 },
    { refetchOnMountOrArgChange: true }
  );
  const platformRoleQuery = useGetAllRolesQuery(
    { isPlatformRole: 1 },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (tenantId) {
      let x: any[] = tenantRoleQuery?.data?.result?.rows?.map((role: any) => {
        return {
          text: role?.name,
          value: role?.id,
        };
      });

      let loggedInRoleOrder: any = rolesOrder?.find(
        (x: any) => x?.name === roleName
      );

      let filteredRoles = rolesOrder
        ?.filter((p: any) => {
          return !p?.isPlatform && p?.order >= loggedInRoleOrder?.order;
        })
        .map((c: any) => {
          return {
            text: c?.name,
            value: tenantRoleQuery?.data?.result?.rows?.find((y: any) => {
              return y?.name === c?.name;
            })?.id,
          };
        });
      setRoles(filteredRoles);
    } else {
      let x: any[] = platformRoleQuery?.data?.result?.rows?.map((role: any) => {
        return {
          text: role?.name,
          value: role?.id,
        };
      });
      console.log("platform roles", x);

      setRoles(x);
    }
  }, [tenantRoleQuery?.isSuccess, platformRoleQuery?.isSuccess]);

  // refetch data on page load
  useEffect(() => {
    if (createUserInfo.isSuccess) {
      setIsAddModalVisible(false);
      form.resetFields();
      setFormValues({
        name: "",
        roleId: null,
        email: "",
        username: "",
        siteId: null,
        homeSite: null,
        tenantId,
        gender: "",
        imageUrl: "",
      });
      createUserInfo?.reset();
      userQuery?.refetch();
      setImageUrl("");
      message.success({
        content: "User created successfully",
      });
      setLoader(false)
    }
  }, [createUserInfo.isSuccess]);

  useEffect(() => {
    if (resendInviteInfo.isSuccess) {
      setResetInviteConfirm(false);
      message.success({ content: "Invite sent on email successfully." });
    }
  }, [resendInviteInfo.isSuccess]);

  useEffect(() => {
    if (SCTenantdata.isSuccess) {
      setSCTenant(SCTenantdata?.data?.result?.rows[0]?.id);
    }
  }, [SCTenantdata.isSuccess]);

  useEffect(() => {
    if (resendInviteInfo.isError) {
      // Error Handling
    }
  }, [resendInviteInfo.isError]);

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

  useEffect(() => {
    if (updateUserInfo.isError) {
      let error = updateUserInfo?.error?.data?.error?.message;
      if (typeof error != "string" && error?.code == "Request_BadRequest") {
        let body = JSON.parse(error?.body);
        error = body.message;
      }
      setLoader(false)
      setError(error);
    } else {
      setError("");
    }
  }, [updateUserInfo.isError]);

  useEffect(() => {
    if (deleteUserInfo.isSuccess) {
      message.success("User deleted successfully");
    }
  }, [deleteUserInfo.isSuccess]);

  useEffect(() => {
    const username = updateUserInfo?.data?.result?.username;
    if (updateUserInfo.isSuccess) {
      if (isEditModalVisible) {
        message.success("User updated successfully.");
        setIsEditModalVisible(false);
      } else {
        const status = updateUserInfo?.data?.result?.status;

        if (status === "active") {
          message.success("User activated successfully.");
        } else {
          message.success("User deactivated successfully.");
        }
      }
      setLoader(false)
      form.resetFields();
      setFormValues({});
      userQuery?.refetch();
    }
  }, [updateUserInfo.isSuccess]);

  let loggedInRoleOrder: any = rolesOrder?.find(
    (x: any) => x?.name === roleName
  );

  const selectedRowOrder: any = (role: any) => {
    return rolesOrder.find((x: any) => x?.name == role)?.order;
  };

  const onStatusChange = (row: any) => {
    if (loggedInRoleOrder?.order <= selectedRowOrder(row?.roleName)) {
      setDeactiveConfirm(true);
      setSelectedRow(row);
    } else {
      message.error(
        "You don't have privilege to activate / deactivate this user."
      );
    }
  };

  const onEditClick = (row: any) => {
    if (loggedInRoleOrder?.order <= selectedRowOrder(row?.roleName)) {
      setSelectedRow(row);
      const { name, username, email, roleId, siteId, homeSite } = row;
      setFormValues(row);
      form.setFieldsValue({
        name,
        username,
        email,
        roleId,
        siteId,
        homeSite,
      });

      setIsEditModalVisible(true);
    } else {
      message.error("You don't have privilege to edit this user.");
    }
  };
  const onResetChange = (row: any) => {
    if (loggedInRoleOrder?.order <= selectedRowOrder(row?.roleName)) {
      setIsResetPasswordModalVisible(true);
      setSelectedRow(row);
    } else {
      message.error("You don't have privilege to reset password of this user.");
    }
  };
  const onDeleteChange = (row: any) => {
    if (loggedInRoleOrder?.order <= selectedRowOrder(row?.roleName)) {
      setDeleteConfirm(true);
      setSelectedRow(row);
    } else {
      message.error("You don't have privilege to delete this user.");
    }
  };
  const onResendInviteChange = (row: any) => {
    if (loggedInRoleOrder?.order <= selectedRowOrder(row?.roleName)) {
      setResetInviteConfirm(true);
      setSelectedRow(row);
    } else {
      message.error("You don't have privilege to resend invite to this user.");
    }
  };
  //table
  const UITableColumns: any = [
    {
      title: "USERNAME",
      dataIndex: "username",
      sorter: true,
      ...(sort?.sortBy == "username" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 250,
      minWidth: 230,
      render: (field: any, row: any) => (
        <div className="d-flex align-items-center">
          {row.imageUrl ? (
            <UIProfilePicPreview src={row.imageUrl} text="profile pic" />
          ) : (
            <UIAvatar text={field} type="username" />
          )}
          <p className="pl-10 tableData slice paragraph">{field}</p>
        </div>
      ),
    },
    {
      title: "NAME",
      dataIndex: "name",
      sorter: true,
      ...(sort?.sortBy == "name" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 130,
      minWidth: 130,
      render: (_: any, row: any) => (
        <div>
          <p className="tableData slice paragraph">{row?.name}</p>
        </div>
      ),
    },
    {
      title: "ROLE",
      dataIndex: "roleName",
      sorter: true,
      ...(sort?.sortBy == "roleName" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 130,
      minWidth: 130,
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      sorter: true,
      ...(sort?.sortBy == "email" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 140,
      minWidth: 140,
      render: (_: any, row: any) => (
        <div>
          <p className="tableData slice paragraph">{row?.email}</p>
        </div>)
    },
    {
      title: "LAST UPDATED",
      dataIndex: "updatedAt",
      sorter: true,
      ...(sort?.sortBy == "updatedAt" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      render: (field: any) => moment(field).format("DD MMM YY hh.mm A"),
      width: 130,
      minWidth: 100,
    },
    {
      title: "CREATED",
      dataIndex: "createdAt",
      sorter: true,
      ...(sort?.sortBy == "createdAt" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (field: any) => moment(field).format("DD MMM YY hh.mm A"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      ...(sort?.sortBy == "status" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (field: any) =>
        field == "invited" ? (
          <span className="status invited">Invited</span>
        ) : field == "active" ? (
          <span className="status active">Active</span>
        ) : (
          <span className="status deactive">Inactive</span>
        ),
    },
    {
      dataIndex: "login",
      width: 30,
      minWidth: 30,
      fixed: "right",
      className: !isTenantActive ? `hideCol` : ``,
      render: (login: any, row: any) => (
        <UIDropdown
          trigger={
            row?.roleName === Roles.PLATFORM_SUPER_ADMIN &&
              roleName !== Roles.PLATFORM_SUPER_ADMIN
              ? []
              : ["click"]
          }
          items={[
            {
              label: "Edit User",
              key: "1",
              icon: <img src={editDarkIcon} alt="icon" />,
              onClick: () => onEditClick(row),
            },
            {
              type: "divider",
            },
            {
              label: "Resend Invite",
              key: "2",
              icon: <img src={resendInviteIcon} alt="icon" />,
              onClick: () => onResendInviteChange(row),
              disabled: row.status === "invited" ? false : true,
            },
            {
              type: "divider",
            },

            {
              label: row.status === "active" ? "Deactivate" : "Activate",
              key: "3",
              disabled: row.status === "invited" ? true : false,
              icon:
                row.status === "active" ? (
                  <img src={deactivateIcon} alt="deactivate" />
                ) : (
                  <img src={activateIcon} alt="activate" />
                ),
              onClick: () => onStatusChange(row),
            },
            {
              type: "divider",
            },
            {
              label: "Delete",
              key: "4",
              icon: <img src={deleteIcon} alt="icon" />,
              onClick: () => onDeleteChange(row),
            },
            {
              type: "divider",
            },

            {
              label: "Reset Password",
              key: "5",
              icon: <img src={resetPasswordIcon} alt="icon" />,
              onClick: () => onResetChange(row),
            },
          ]}
          placement="bottom"
        >
          <a
            href="javascript:void(0)"
            className="actionTag"
            onClick={() => {
              if (
                row?.roleName === Roles.PLATFORM_SUPER_ADMIN &&
                roleName !== Roles.PLATFORM_SUPER_ADMIN
              ) {
                message.warning("Not allowed to perform actions on it");
              }
              setSelectedRow(row);
            }}
          >
            {/* <img width={20} src={ellipsisIcon} /> */}
            {/* < EllipsisOutlined className="ellipses"/> */}
            <EllipsisIcon className="ellipses" />
          </a>
        </UIDropdown>
      ),
    },
  ];
  const [columns, setColumns] = useState(UITableColumns);
  interface DataType {
    id: string;
    name: string;
    imageUrl: string;
    username: string;
    roleName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    status: string;
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


  useEffect(() => {
    setColumns(UITableColumns);
  }, [isTenantActive])

  const fetchData = (params: Params = {}) => {
    // let totalRows = 200;
    setLoading(true);
    userQuery?.refetch();
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

      <section className="listing-section user-listing">
        <div className="card-body">
          <UITable
            columns={columns}
            setColumns={setColumns}
            data={tableData}
            pagination={pagination}
            setPagination={setPagination}
            // pagination={{showSizeChanger: true}}
            loading={loading}
            handleTableChange={handleTableChange}
            scroll={{ x: 2200, y: 500 }}
          />
        </div>
      </section>

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
              error={error}
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
          <UserForm
            onModalSubmit={onAddModalSubmit}
            formId="addUser"
            inputKey={inputKey}
            usernameDisable={usernameDisable}
            setUsernameDisable={setUsernameDisable}
            setError={setError}
            error={error}
            isAddModalVisible={isAddModalVisible}
            form={form}
            formValues={formValues}
            setFormValues={setFormValues}
            roles={roles}
            siteOptions={siteOption}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            checked={checked}
            setChecked={setChecked}
          />
        </div>
      </UIModal>

      <UIModal
        title={ModalTitle.EDIT_USER}
        className="userAddModal"
        key="editUser"
        visible={isEditModalVisible}
        // handleCancel={onEditModalClose}
        footer={[
          <Space>
            <UIsecondaryButton onPress={onEditModalClose} size="sm">
              CANCEL
            </UIsecondaryButton>
            <UIbutton
              form="editUser"
              error={error}
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
        <div className="pb-10">{showUpdateAlert()}</div>
        <div className="modalMainDiv">
          {loader && (<UILoader />)}
          <UserForm
            onModalSubmit={onEditModalSubmit}
            formId="editUser"
            isAddModalVisible={isAddModalVisible}
            form={form}
            usernameDisable={usernameDisable}
            setUsernameDisable={setUsernameDisable}
            setError={setError}
            error={error}
            inputKey={inputKey}
            formValues={formValues}
            siteOptions={siteOption}
            setFormValues={setFormValues}
            roles={roles}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            checked={checked}
            setChecked={setChecked}
          />
        </div>
      </UIModal>

      <UIConfirmModal
        key="deleteConfirm"
        visible={deleteConfirm}
        cancelCallback={() => {
          setDeleteConfirm(false);
        }}
        confirmCallback={() => {
          deleteUser({ id: selectedRow?.id, deletedBy: userId });
          setDeleteConfirm(false);
          userQuery?.refetch();
        }}
        cancelButton={ModalButton.CANCEL}
        confirmButton={ModalButton.CONFIRM}
        primaryText={util.format(ModalPrimaryText.DELETE, selectedRow.username)}
        type={ModalType.WARN}
      />
      <UIConfirmModal
        key="deactiveConfirm"
        visible={deactiveConfirm}
        cancelCallback={() => {
          setDeactiveConfirm(false);
        }}
        confirmCallback={() => {
          updateUser({
            id: selectedRow?.id,
            status: selectedRow.status === "inactive" ? "active" : "inactive",
          });
          setDeactiveConfirm(false);
          userQuery?.refetch();
        }}
        cancelButton={ModalButton.CANCEL}
        confirmButton={ModalButton.CONFIRM}
        primaryText={util.format(
          selectedRow.status == "inactive"
            ? ModalPrimaryText.ACTIVATE
            : ModalPrimaryText.DEACTIVATE,
          selectedRow.username
        )}
        type={
          selectedRow.status == "inactive" ? ModalType.SUCCESS : ModalType.WARN
        }
      />

      <UIConfirmModal
        key="resendInviteConfirm"
        visible={resetInviteConfirm}
        cancelCallback={() => {
          setResetInviteConfirm(false);
        }}
        confirmCallback={() => {
          resendInvite({ email: selectedRow?.email });
        }}
        cancelButton={ModalButton.CANCEL}
        confirmButton={ModalButton.CONFIRM}
        primaryText={util.format(ModalPrimaryText.INVITE, selectedRow.name)}
        type={ModalType.INVITE}
      />

      <ResetPasswordModal
        title={ModalTitle.RESET_PASSWRD}
        isModalVisible={isResetPasswordModalVisible}
        setIsModalVisible={setIsResetPasswordModalVisible}
        data={selectedRow}
        type="resetPassword"
        userQuery={userQuery}
      />
    </>
  );
};

export default UsersList;
