import { Form, message, Space } from "antd";
import { TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  deleteDarkIcon,
  editDarkIcon,
  // ellipsisIcon,
} from "../../../../../assets/icons";
import { page } from "../../../../../config/constants";
import {
  ModalButton,
  ModalPrimaryText,
  ModalTitle,
  ModalType,
  Permission,
} from "../../../../../config/enum";
import {
  useCreateDeviceManagerMutation,
  useDeleteDeviceManagerMutation,
  useGetAllDeviceManagerQuery,
  useUpdateDeviceManagerMutation,
} from "../../../../../redux/services/deviceManagerApiSlice";
import { GetPermissions, removeEmptyKeys } from "../../../../../utils";
import { UIbutton, UIsecondaryButton } from "../../../../common/button";
import { UIConfirmModal } from "../../../../common/confirmModal";
import { UIDropdown } from "../../../../common/dropdown";
import { UIModal } from "../../../../common/modal";
import { UITable } from "../../../../common/table";
import { UIErrorAlert } from "../../../../common/uiAlert";
import { dummyManager } from "./dummyManager";
import { DeviceManagerForm } from "./form";
import * as util from "util";
import { EllipsisOutlined } from "@ant-design/icons";
import { ReactComponent as EllipsisIcon } from "../../../../../assets/images/ellipsis.svg";
import { useSelector } from "react-redux";
import UITooltip from "../../../../common/tooltip";
import { UILoader } from "../../../../common/loader";

export const DeviceManager = (props: any) => {
  const {
    search,
    tenantId,
    isModalVisible,
    setIsModalVisible,
    isTenantActive,
    pagination,
    setPagination,
    selectedTab,
  } = props;
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [sort, setSort] = useState<any>({});

  let queryParams: any = {
    page: pagination.current,
    limit: pagination.pageSize,
    tenant: tenantId,
    ...sort,
  };
  const [total, setTotal] = useState(0);
  const [errorAlert, setErrorAlert] = useState(false);
  const [uuidDisable, setUuidDisable] = useState(false);
  const [loader, setLoader] = useState(false)

  const userInfo = useSelector((state: any) => state.auth)?.user;

  //API
  const [createDeviceManager, createDeviceManagerInfo] =
    useCreateDeviceManagerMutation();

  if (search?.trim() !== "") queryParams = { ...queryParams, search };
  const { data, isSuccess, refetch, isError } = useGetAllDeviceManagerQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [updateDeviceManager, updateDeviceManagerInfo] =
    useUpdateDeviceManagerMutation();
  const [deleteDeviceRequest, deleteDeviceInfo] =
    useDeleteDeviceManagerMutation();

  const [formValues, setFormValues] = useState({});
  const [notifyMessage, setNotifyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [addDeviceManager, setAddDeviceManager] = useState({
    name: "",
    uuid: "",
    url: "",
    description: "",
    type: "",
    tenantId: tenantId,
  });
  const devicePermissions = GetPermissions(Permission.DEVICEMANAGER);
  const [deleteDevice, setDeleteDevice] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const onAddDeviceManagerModalSubmit = () => {
    createDeviceManager({
      ...removeEmptyKeys(addDeviceManager),
      createdBy: userInfo?.id,
    });
    setLoader(true)
  };
  useEffect(() => {
    if (createDeviceManagerInfo?.isSuccess) {
      setIsModalVisible(false);
      form.resetFields();
      setFormValues({
        name: "",
        uuid: "",
        url: "",
        description: "",
        type: "",
        tenantId: tenantId,
      });
      createDeviceManagerInfo?.reset();
      form.setFieldsValue({
        name: "",
        uuid: "",
        url: "",
        description: "",
        type: "",
        tenantId: tenantId,
      });
      setAddDeviceManager({
        name: "",
        uuid: "",
        description: "",
        url: "",
        type: "",
        tenantId: tenantId,
      });
      message.success(`Device Manager created Successfully`);
      refetch();
      setLoader(false)
    }
  }, [createDeviceManagerInfo?.isSuccess]);

  useEffect(() => {
    if (createDeviceManagerInfo?.isError) {
      setLoader(false)
    }
  }, [createDeviceManagerInfo?.isError]);


  useEffect(() => {
    if (isSuccess) {
      setTableData(data?.result?.rows);
      setTotal(data?.result?.count);
      setLoading(false);
      setLoader(false)

    }
  }, [isSuccess, data]);
  useEffect(() => {
    if (isError) {
      setLoading(false);
      setLoader(false)
    }
  }, [isError])
  const handleDelete = () => {
    deleteDeviceRequest({ id: selectedRow?.id, deletedBy: userInfo?.id });
    setDeleteDevice(false);
    refetch();
  };
  interface Params {
    pagination?: TablePaginationConfig;
    sorter?: SorterResult<any> | SorterResult<any>[];
    total?: number;
    sortField?: string;
    sortOrder?: string;
  }
  interface DataType {
    name: string;
    url: string;
    uuid: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    type: string;
  }
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
  const onEditModalSubmit = () => {
    updateDeviceManager({
      ...formValues,
      tenantId: tenantId,
      updatedBy: userInfo?.id,
    });
    setLoader(true)
  };

  useEffect(() => {
    if (updateDeviceManagerInfo?.isSuccess) {
      if (isEditModalVisible) {
        setIsEditModalVisible(false);
        form.resetFields();
        message.success(`Device Manager updated Successfully`);
      } else {
        message.success(notifyMessage);
      }
      updateDeviceManagerInfo?.reset();
      refetch();
      setLoader(false)
    }
  }, [updateDeviceManagerInfo?.isSuccess]);

  useEffect(() => {
    if (selectedTab === '6') {
      refetch();
    }
  }, [selectedTab])

  useEffect(() => {
    if (updateDeviceManagerInfo?.isError) {
      setErrorAlert(true);
      setLoader(false)
    }
  }, [updateDeviceManagerInfo.isError]);

  const showUpdateAlert = () => {
    if (updateDeviceManagerInfo?.isError) {
      return (
        <UIErrorAlert
          type="error"
          message={
            updateDeviceManagerInfo?.error?.data?.error?.message?.errors
              ? "Something  went wrong"
              : updateDeviceManagerInfo.error?.data?.error?.message
          }
          showAlert={errorAlert}
          setShowAlert={setErrorAlert}
        />
      );
    } else {
      return null;
    }
  };
  const showAlert = () => {
    if (createDeviceManagerInfo?.isError) {
      return (
        <UIErrorAlert
          message={
            createDeviceManagerInfo?.error?.data?.error?.message?.errors
              ? "Something  went wrong"
              : createDeviceManagerInfo?.error?.data?.error?.message
          }
          showAlert={createDeviceManagerInfo?.isError}
        />
      );
    } else {
      return null;
    }
  };
  useEffect(() => {
    if (deleteDeviceInfo?.isSuccess) {
      refetch();
      message.success(`Device Manager is deleted Successfully`);
    } else if (deleteDeviceInfo?.isError) {
      message.error({
        content: deleteDeviceInfo?.error?.data?.error?.message,
        key: "errorNotification",
      });
    }
  }, [deleteDeviceInfo?.isSuccess, deleteDeviceInfo?.isError]);

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
  const onEditClick = (row: any) => {
    if (devicePermissions?.isEdit) {
      setUuidDisable(true);
      const { name, uuid, url, description, type } = row;
      setFormValues({ ...row });
      form.setFieldsValue({
        name,
        uuid,
        url,
        description,
        type,
      });
      setIsEditModalVisible(true);
    } else {
      message.error("Permission denied");
    }
  };

  const onEditModalClose = () => {
    setIsEditModalVisible(false);
    form.resetFields();
    setFormValues({});
    setUuidDisable(false);
  };
  const onDeleteClick = (row: any) => {
    if (devicePermissions?.isEdit) {
      setDeleteDevice(true);
      setSelectedRow(row);
    } else {
      message.error("Permission denied");
    }
  };
  const onDeleteModalClose = () => {
    setDeleteDevice(false);
  };

  const UITableColumns: any = [
    {
      title: "NAME",
      dataIndex: "name",
      sorter: true,
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData tableDeviceData slice paragraph">
              {row?.name}
            </p>
          </div>
        );
      },
    },
    {
      title: "UUID",
      dataIndex: "uuid",
      sorter: true,
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableDeviceData slice paragraph">{row?.uuid}</p>
          </div>
        );
      },
    },
    {
      title: "URL",
      dataIndex: "url",
      sorter: true,
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableDeviceData slice paragraph">{row?.url}</p>
          </div>
        );
      },
    },
    {
      title: "CREATE DATE",
      dataIndex: "createdAt",
      sorter: true,
      width: 150,
      minWidth: 120,
      render: (field: any) => moment(field).format("DD MMM YY hh.mm A"),
    },
    {
      title: "LAST ACTIVATE DATE",
      dataIndex: "updatedAt",
      sorter: true,
      width: 200,
      minWidth: 170,
      render: (field: any) => moment(field).format("DD MMM YY hh.mm A"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      width: 130,
      minWidth: 110,
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.description} placement="top">
              <p className="tableDeviceData slice paragraph">
                {row?.description}
              </p>
            </UITooltip>
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: true,
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableDeviceData slice paragraph">
              {row?.type === "onPremise" ? "On Premise" : "On Cloud"}
            </p>
          </div>
        );
      },
    },
    {
      width: 30,
      minWidth: 30,
      fixed: "right",
      dataIndex: "login",
      className: !isTenantActive ? `hideCol` : ``,
      render: (login: any, row: any) => (
        <UIDropdown
          items={[
            {
              label: <a href="javascript:void(0)">Edit</a>,
              key: "1",
              icon: <img src={editDarkIcon} alt="edit" />,
              // disabled: devicePermissions.isEdit ? false : true,
              onClick: () => onEditClick(row),
            },
            {
              type: "divider",
            },
            {
              label: "Delete",
              key: "2",
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
      ),
    },
  ];
  const [columns, setColumns] = useState(UITableColumns);
  const onDeviceModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFormValues({
      name: "",
      uuid: "",
      url: "",
      description: "",
      type: "",
      tenantId: tenantId,
    });
    form.setFieldsValue({
      name: "",
      uuid: "",
      url: "",
      description: "",
      type: "",
      tenantId: tenantId,
    });
    createDeviceManagerInfo?.reset();
  };
  return (
    <>
      <section className="listing-section">
        <div className="card-body">
          <UITable
            columns={columns}
            setColumns={setColumns}
            data={tableData}
            pagination={pagination}
            loading={loading}
            handleTableChange={handleTableChange}
            scroll={{ x: 1400, y: 500 }}
          />
        </div>
      </section>
      <UIModal
        title={ModalTitle.ADD_DEVICE_MANAGER}
        key="addDeviceManager"
        className="deviceManagerAdd zoomModal"
        visible={isModalVisible}
        // handleCancel={onDeviceModalClose}
        footer={[
          <Space>
            <UIsecondaryButton onPress={onDeviceModalClose} size="sm">
              CANCEL
            </UIsecondaryButton>
            <UIbutton
              type="info"
              btnType="submit"
              size="sm"
              data-testid="testButton"
              form="addDeviceManager"
            >
              ADD
            </UIbutton>
          </Space>,
        ]}
      >
        <div>{showAlert()}</div>
        {loader && (<UILoader />)}
        <DeviceManagerForm
          onModalSubmit={onAddDeviceManagerModalSubmit}
          setFormValues={setAddDeviceManager}
          formValues={addDeviceManager}
          id="addDeviceManager"
          form={form}
        />
      </UIModal>
      <UIModal
        title={ModalTitle.EDIT_DEVICE_MANAGER}
        className="zoomModal"
        key="editDeviceManager"
        visible={isEditModalVisible}
        // handleCancel={onEditModalClose}
        footer={[
          <Space>
            <UIsecondaryButton onPress={onEditModalClose} size="sm">
              CANCEL
            </UIsecondaryButton>
            <UIbutton
              form="editDeviceManager"
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
        {loader && (<UILoader />)}
        <DeviceManagerForm
          id="editDeviceManager"
          form={form}
          onModalSubmit={onEditModalSubmit}
          formValues={formValues}
          setFormValues={setFormValues}
          uuidDisable={uuidDisable}
          setUuidDisable={setUuidDisable}
        />
      </UIModal>
      <UIConfirmModal
        key="deleteDevice"
        visible={deleteDevice}
        cancelCallback={onDeleteModalClose}
        confirmCallback={handleDelete}
        cancelButton={ModalButton.CANCEL}
        confirmButton={ModalButton.CONFIRM}
        primaryText={util.format(ModalPrimaryText.DELETE, selectedRow?.name)}
        type={ModalType.WARN}
      />
    </>
  );
};
