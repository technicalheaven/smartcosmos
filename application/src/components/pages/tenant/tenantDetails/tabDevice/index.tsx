import { Card, Form, message, Space } from "antd";
import { useEffect, useState } from "react";
import { UIAvatar } from "../../../../common/avatar";
import { UITable } from "../../../../common/table";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { Link, useNavigate } from "react-router-dom";
import * as util from "util";
import moment from "moment";
import { UIImage } from "../../../../common/image";
import {
  addTenantDropdown,
  activateIcon,
  deactivateIcon,
  deleteDarkIcon,
  editDarkIcon,
  ellipsisIcon,
  green,
  red,
} from "../../../../../assets/icons";
import { UIDropdown } from "../../../../common/dropdown";
import {
  ModalButton,
  ModalPrimaryText,
  ModalTitle,
  ModalType,
  Permission,
} from "../../../../../config/enum";
import { UIConfirmModal } from "../../../../common/confirmModal";
import { page, Status } from "../../../../../config/constants";
import { DeviceDum } from "./dummyDevice";
import { UIModal } from "../../../../common/modal";
import { UIbutton, UIsecondaryButton } from "../../../../common/button";
import { DeviceForm } from "./form";
import "./style.css";
import {
  useCreateDeviceMutation,
  useDeleteDeviceMutation,
  useGetAllDeviceModelQuery,
  useGetAllDevicesQuery,
  useGetAllDeviceTypeQuery,
  useUpdateDeviceMutation,
  useUpdateDeviceStatusMutation,
} from "../../../../../redux/services/deviceApiSlice";
import { GetPermissions, removeEmptyKeys } from "../../../../../utils";
import { useGetAllSitesQuery } from "../../../../../redux/services/siteApiSlice";
import { useGetAllZonesQuery } from "../../../../../redux/services/zoneApiSlice";
import { UIErrorAlert } from "../../../../common/uiAlert";
import { EllipsisOutlined } from "@ant-design/icons";
import { ReactComponent as EllipsisIcon } from "../../../../../assets/images/ellipsis.svg";
import { useSelector } from "react-redux";
import UITooltip from "../../../../common/tooltip";
import { UILoader } from "../../../../common/loader";

export const DeviceList = (props: any) => {
  const [checked, setChecked] = useState(false);
  const {
    setIsModalVisible,
    isModalVisible,
    search,
    tenantId,
    isTenantActive,
    pagination,
    setPagination,
    selectedTab,
  } = props;
  const [tableData, setTableData] = useState();
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [sort, setSort] = useState<any>({});
  const [errorAlert, setErrorAlert] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activateDevice, setActivateDevice] = useState(false);
  const [deleteDevice, setDeleteDevice] = useState(false);
  const [loader, setLoader] = useState(false)
  const [isEditDeviceModalVisible, setIsEditDeviceModalVisible] =
    useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [formValues, setFormValues] = useState<any>({});
  const [addDevice, setAddDevice] = useState({
    name: "",
    description: "",
    type: null,
    check: "",
    siteId: null,
    model: null,
    zoneId: null,
    ip: "",
    ipType: "",
    mac: "",
    tenantId: tenantId,
  });
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const devicePermissions = GetPermissions(Permission.DEVICE);

  let queryParams: any = {
    page: pagination.current,
    limit: pagination.pageSize,
    tenant: tenantId,
    ...sort,
  };

  if (search?.trim() !== "") queryParams = { ...queryParams, search };

  useEffect(() => {
    setChecked(false);
  }, [isModalVisible]);

  const userInfo = useSelector((state: any) => state.auth)?.user;

  //API integration
  const [createDevice, createDeviceInfo] = useCreateDeviceMutation();
  const [updateDevice, updateDeviceInfo] = useUpdateDeviceMutation();
  const [deleteDeviceRequest, deleteDeviceInfo] = useDeleteDeviceMutation();
  const { data, isSuccess, refetch, isError } = useGetAllDevicesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [updateStatus, deviceStatusInfo] = useUpdateDeviceStatusMutation();

  const getSitesFromQuery = useGetAllSitesQuery(
    { tenantId: tenantId },
    { refetchOnMountOrArgChange: true }
  );
  const [sites, setSites] = useState([]);

  const getSites = () => {
    var siteOption = getSitesFromQuery?.data?.result?.rows?.map((site: any) => {
      return {
        text: site?.name,
        value: site?.id,
      };
    });
    return siteOption;
  };

  const getDeviceType = useGetAllDeviceTypeQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const getDeviceTypeOptions = () => {
    var deviceTypeOption = getDeviceType?.data?.result?.map((device: any) => {
      return {
        text: device?.type,
        value: device?.type,
      };
    });
    return deviceTypeOption;
  };

  const getDeviceModel = useGetAllDeviceModelQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deviceModel, setDeviceModel] = useState();
  useEffect(() => {
    if (addDevice?.type || formValues?.type) {
      var deviceModelOption: any = getDeviceModel?.data?.result?.rows
        ?.filter(
          (x: any) => x.type === addDevice.type || x.type === formValues.type
        )
        ?.map((model: any) => {
          return {
            text: model?.model,
            value: model?.id,
          };
        });
      setDeviceModel(deviceModelOption);
    }
  }, [addDevice?.type, formValues?.type]);

  const getErrorMessage = (data: any) => {
    if (data?.error) {
      return data?.error?.message;
    } else if (data?.errors) {
      return data?.errors[0]?.msg;
    } else {
      return "something went wrong";
    }
  };

  const getZonesFromQuery = useGetAllZonesQuery(
    { tenant: tenantId },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [zones, setZones] = useState([]);

  useEffect(() => {
    // getZonesFromQuery?.refetch()
    if (addDevice.siteId || formValues?.siteId) {
      var zoneOption = getZonesFromQuery?.data?.result?.rows
        ?.filter(
          (x: any) =>
            x.siteId === addDevice.siteId || x.siteId === formValues.siteId
        )
        .map((zone: any) => {
          return {
            text: zone?.name,
            value: zone?.id,
          };
        });
      setZones(zoneOption);
    }
  }, [addDevice?.siteId, formValues?.siteId]);

  useEffect(() => {
    if (isSuccess) {
      setTableData(data?.result?.rows);
      setTotal(data?.result?.count);
      setLoading(false);
      setLoader(false)
    }
  }, [data, isSuccess]);
  useEffect(() => {
    if (isError) {
      setLoading(false);
      setLoader(false)
    }
  }, [isError])

  useEffect(() => {
    if (selectedTab === '2') {
      refetch();
    }
  }, [selectedTab])

  useEffect(() => {
    if (createDeviceInfo?.isSuccess) {
      setIsModalVisible(false);
      form.resetFields();
      createDeviceInfo?.reset();
      setAddDevice({
        name: "",
        description: "",
        type: null,
        check: "",
        siteId: null,
        model: null,
        zoneId: null,
        ip: "",
        ipType: "",
        mac: "",
        tenantId: tenantId,
      });
      setFormValues({
        name: "",
        description: "",
        check: "",
        type: null,
        siteId: null,
        model: null,
        zoneId: null,
        ip: "",
        ipType: "",
        mac: "",
        tenantId: tenantId,
      });
      form.setFieldsValue({
        name: "",
        description: "",
        type: null,
        check: "",
        siteId: null,
        model: null,
        zoneId: null,
        ip: "",
        ipType: "",
        mac: "",
        tenantId: tenantId,
      });

      message.success(`Device created Successfully`);
      refetch();
      setLoader(false)
    }
  }, [createDeviceInfo?.isSuccess]);

  useEffect(() => {
    if (createDeviceInfo?.isError) {
      setLoader(false)
    }
  }, [createDeviceInfo?.isError]);

  useEffect(() => {
    if (updateDeviceInfo?.isSuccess) {
      if (isEditModalVisible) {
        form.resetFields();
        message.success(`Device updated Successfully`);
        setIsEditModalVisible(false);
      } else {
        message.success(notifyMessage);
      }
      updateDeviceInfo?.reset();
      refetch();
      setFormValues({});
      form.resetFields();
      setZones([]);
      setLoader(false)
    }
  }, [updateDeviceInfo?.isSuccess]);

  

  const onActivateClick = (row: any) => {
    if (devicePermissions?.isEdit) {
      setActivateDevice(true);
      setSelectedRow(row);
    } else {
      message.error("Permission denied");
    }
  };

  const onActivateModalClose = () => {
    setActivateDevice(false);
  };

  const onDeleteModalClose = () => {
    setDeleteDevice(false);
  };

  const onDeleteClick = (row: any) => {
    if (devicePermissions?.isEdit) {
      setDeleteDevice(true);
      setSelectedRow(row);
    } else {
      message.error("Permission denied");
    }
  };

  const onEditClick = (row: any) => {
    if (devicePermissions?.isEdit) {
      const { name, description, check, type, mac, ip, ipType, model } = row;
      const siteId = row.deviceSiteZoneProcess[0].siteId;
      const zoneId = row.deviceSiteZoneProcess[0].zoneId;
      setFormValues({ ...row, siteId: siteId, zoneId: zoneId });
      form.setFieldsValue({
        name,
        description,
        check,
        type,
        siteId,
        zoneId,
        model,
        ip,
        ipType,
        mac,
      });
      setIsEditModalVisible(true);
    } else {
      message.error("Permission denied");
    }
  };

  const handleActivate = () => {
    if (selectedRow?.status === Status?.ACTIVE_IDLE) {
      updateStatus({ id: selectedRow.id, status: Status?.INACTIVE });
      setNotifyMessage(`Device deactivated successfully`);
    } else if (selectedRow?.status === Status?.ACTIVE_RUNNING) {
      updateStatus({ id: selectedRow.id, status: Status?.INACTIVE });
      setNotifyMessage(`Device deactivated successfully`);
    } else {
      updateStatus({ id: selectedRow.id, status: Status?.ACTIVE_IDLE });
      setNotifyMessage(`Device activated successfully`);
    }
    setActivateDevice(false);
  };

  const handleDelete = () => {
    deleteDeviceRequest({ id: selectedRow?.id, deletedBy: userInfo?.id });
    setDeleteDevice(false);
    refetch();
  };

  const onDeviceModalClose = () => {
    setIsModalVisible(false);
    setFormValues({});
    form.resetFields();
    setZones([]);
    setAddDevice({
      name: "",
      description: "",
      type: null,
      check: "",
      siteId: null,
      model: null,
      zoneId: null,
      ip: "",
      ipType: "",
      mac: "",
      tenantId: tenantId,
    });
    createDeviceInfo?.reset();
  };

  const onEditModalClose = () => {
    setIsEditModalVisible(false);
    setFormValues({});
    form.resetFields();
    setZones([]);
  };

  useEffect(() => {
    if (deviceStatusInfo?.isSuccess) {
      message.success(notifyMessage);
      refetch();
    }
  }, [deviceStatusInfo?.isSuccess]);

  useEffect(() => {
    if (deleteDeviceInfo?.isSuccess) {
      refetch();
      message.success(`Device is deleted Successfully`);
    } else if (deleteDeviceInfo?.isError) {
      message.error({
        content: deleteDeviceInfo?.error?.data?.error?.message,
        key: "errorNotification",
        className: "errorMessage",
      });
    }
  }, [deleteDeviceInfo?.isSuccess, deleteDeviceInfo?.isError]);

  const onAddDeviceModalSubmit = () => {
    createDevice(removeEmptyKeys({ ...addDevice, createdBy: userInfo?.id }));
    setLoader(true)
  };

  const onEditModalSubmit = () => {
    updateDevice({
      ...formValues,
      tenantId: tenantId,
      updatedBy: userInfo?.id,
    });
    setLoader(true)
  };

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

  const UITableColumns: any = [
    {
      title: "DEVICE NAME",
      dataIndex: "name",
      sorter: true,
      width: 150,
      minWidth: 130,
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
      title: "DEVICE TYPE",
      dataIndex: "type",
      sorter: true,
      width: 130,
      minWidth: 100,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">{row?.type}</p>
          </div>
        );
      },
    },
    {
      title: "VERSION",
      dataIndex: "mac",
      sorter: true,
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div>
            <span className="tableData"></span>
          </div>
        );
      },
    },
    {
      title: "SITE",
      dataIndex: "siteName",
      width: 100,
      minWidth: 80,
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">
              {row?.deviceSiteZoneProcess[0]?.siteName}
            </p>
          </div>
        );
      },
    },
    {
      title: "ZONE",
      dataIndex: "zoneName",
      width: 100,
      minWidth: 80,
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">
              {row?.deviceSiteZoneProcess[0]?.zoneName}
            </p>
          </div>
        );
      },
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      width: 140,
      minWidth: 120,
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.description} placement="top">
              <p className="tableData slice paragraph">{row?.description}</p>
            </UITooltip>
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
      render: (data: any, row: any) => {
        return (
          <div>
            <Space>
              {row?.status === Status?.ACTIVE_IDLE ||
                row?.status === Status?.ACTIVE_RUNNING ? (
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
              label:
                row.status === Status?.ACTIVE_IDLE ||
                  row?.status === Status?.ACTIVE_RUNNING
                  ? "Deactivate"
                  : "Activate",
              key: "2",
              icon:
                row.status === Status?.ACTIVE_IDLE ||
                  row?.status === Status?.ACTIVE_RUNNING ? (
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

  //erroe alert
  const showAlert = () => {
    if (createDeviceInfo?.isError) {
      const { error } = createDeviceInfo;
      return (
        <UIErrorAlert
          message={getErrorMessage(error?.data)}
          showAlert={createDeviceInfo?.isError}
        />
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (updateDeviceInfo?.isError) {
      setErrorAlert(true);
      setLoader(false)
    }
  }, [updateDeviceInfo.isError]);

  const showUpdateAlert = () => {
    if (updateDeviceInfo?.isError) {
      return (
        <UIErrorAlert
          type="error"
          message={
            updateDeviceInfo?.error?.data?.error?.message?.errors
              ? "Something  went wrong"
              : updateDeviceInfo.error?.data?.error?.message
          }
          showAlert={errorAlert}
          setShowAlert={setErrorAlert}
        />
      );
    } else {
      return null;
    }
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
            // pagination={{ showSizeChanger: true}}
            loading={loading}
            handleTableChange={handleTableChange}
            scroll={{ x: 1300, y: 500 }}
          />
        </div>
      </section>
      <UIModal
        title={ModalTitle.ADD_DEVICE}
        className="deviceAddModal zoomModal"
        key="addDevice"
        width={1000}
        visible={isModalVisible}
        // handleCancel={onDeviceModalClose}
        footer={[
          <Space>
            <UIsecondaryButton onPress={onDeviceModalClose} size="sm">
              CANCEL
            </UIsecondaryButton>
            <UIbutton
              form="addDevice"
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
          <DeviceForm
            onModalSubmit={onAddDeviceModalSubmit}
            id="addDevice"
            checked={checked}
            setChecked={setChecked}
            form={form}
            formValues={addDevice}
            siteOptions={getSites()}
            zoneOptions={zones}
            deviceModel={deviceModel}
            setFormValues={setAddDevice}
            deviceTypeOptions={getDeviceTypeOptions()}
            setZones={setZones}
          />
        </div>
      </UIModal>
      <UIModal
        title={ModalTitle.EDIT_DEVICE}
        className="deviceAddModal zoomModal"
        key="editDevice"
        visible={isEditModalVisible}
        // handleCancel={onEditModalClose}
        width={1000}
        footer={[
          <Space>
            <UIsecondaryButton onPress={onEditModalClose} size="sm">
              CANCEL
            </UIsecondaryButton>
            <UIbutton
              form="editDevice"
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
        <div>{showUpdateAlert()}</div>
        <div className="modalMainDiv">
        {loader && (<UILoader />)}
          <DeviceForm
            onModalSubmit={onEditModalSubmit}
            id="editDevice"
            form={form}
            checked={checked}
            setChecked={setChecked}
            siteOptions={getSites()}
            zoneOptions={zones}
            formValues={formValues}
            setFormValues={setFormValues}
            deviceModel={deviceModel}
            deviceTypeOptions={getDeviceTypeOptions()}
            setZones={setZones}
          />
        </div>
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
      <UIConfirmModal
        key="activateDevice"
        visible={activateDevice}
        cancelCallback={onActivateModalClose}
        confirmCallback={handleActivate}
        cancelButton={ModalButton.CANCEL}
        confirmButton={ModalButton.CONFIRM}
        primaryText={
          selectedRow?.status === Status?.ACTIVE_IDLE
            ? util.format(ModalPrimaryText.DEACTIVATE, selectedRow?.name)
            : util.format(ModalPrimaryText.ACTIVATE, selectedRow?.name)
        }
        type={
          selectedRow?.status === Status?.ACTIVE_IDLE
            ? ModalType.WARN
            : ModalType.SUCCESS
        }
      />
    </>
  );
};
