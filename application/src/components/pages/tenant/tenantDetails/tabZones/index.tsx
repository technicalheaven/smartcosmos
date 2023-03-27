import { Form, message, Space } from "antd";
import { useEffect, useState } from "react";
import { UITable } from "../../../../common/table";
import { TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import * as util from "util";
import {
  deleteDarkIcon,
  editDarkIcon,
  ellipsisIcon,
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
import { page } from "../../../../../config/constants";
import { UIModal } from "../../../../common/modal";
import { UIbutton, UIsecondaryButton } from "../../../../common/button";
import {
  useDeleteZoneMutation,
  useGetAllZonesQuery,
  useUpdateZoneMutation,
  useGetAllZoneTypesQuery,
} from "../../../../../redux/services/zoneApiSlice";
import { ZoneForm } from "./form";
import { UIErrorAlert } from "../../../../common/uiAlert";
import { GetPermissions } from "../../../../../utils";
import { EllipsisOutlined } from "@ant-design/icons";
import { ReactComponent as EllipsisIcon } from "../../../../../assets/images/ellipsis.svg";
import { useSelector } from "react-redux";
import UITooltip from "../../../../common/tooltip";
import { UILoader } from "../../../../common/loader";

export const ZoneList = (props: any) => {
  const { search, tenantId, isTenantActive, pagination, setPagination } = props;
  const [tableData, setTableData] = useState();
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [sort, setSort] = useState<any>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteZoneModal, setDeleteZoneModal] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [errorAlert, setErrorAlert] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loader, setLoader] = useState(false)

  const UITableColumns: any = [
    {
      title: "Zone NAME",
      dataIndex: "name",
      sorter: true,
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">{row?.name}</p>
          </div>
        );
      },
    },
    {
      title: "ZONE DESCRIPTION",
      dataIndex: "description",
      width: 120,
      minWidth: 100,
      sorter: true,
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
      title: "Zone TYPE",
      dataIndex: "zoneType",
      width: 100,
      minWidth: 80,
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">
              {
                getZoneTypeOptions()?.find(
                  (x: any) => x?.value === row?.zoneType
                )?.text
              }
            </p>
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
            <p className="tableData slice paragraph">{row?.siteName}</p>
          </div>
        );
      },
    },
    {
      dataIndex: "login",
      width: 30,
      minWidth: 30,
      fixed: "right",
      className: !isTenantActive ? `hideCol` : ``,
      render: (login: any, row: any) => (
        <UIDropdown
          items={[
            {
              label: <a href="javascript:void(0)">Edit Zone</a>,
              key: "1",
              icon: <img src={editDarkIcon} alt="edit" />,
              // disabled: zonePermissions?.isEdit ? false : true,
              onClick: () => onEditClick(row),
            },
            {
              type: "divider",
            },
            {
              label: "Delete Zone",
              key: "2",
              icon: <img src={deleteDarkIcon} alt="delete" />,
              onClick: () => onDeleteClick(row),
            },
          ]}
          placement="bottom"
        >
          <a href="javascript:void(0)" className="actionTag">
            <EllipsisIcon className="ellipses" />
          </a>
        </UIDropdown>
      ),
    },
  ];
  const [columns, setColumns] = useState(UITableColumns);

  const zonePermissions = GetPermissions(Permission.ZONE);
  const [formData, setFormData] = useState({});

  let queryParams: any = {
    page: pagination.current,
    limit: pagination.pageSize,
    tenant: tenantId,
    ...sort,
  };

  if (search?.trim() !== "") queryParams = { ...queryParams, search };

  //API
  const { data, isSuccess, refetch, isError } = useGetAllZonesQuery(queryParams);
  const [updateZone, updateZoneInfo] = useUpdateZoneMutation();
  const [deleteZone, deleteZoneInfo] = useDeleteZoneMutation();

  const userInfo = useSelector((state: any) => state.auth)?.user;

  useEffect(() => {
    refetch();
  }, [props]);

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

  const getZoneType: any = useGetAllZoneTypesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (getZoneType?.isSuccess) {
      setColumns(UITableColumns);
    }
  }, [getZoneType?.data, getZoneType?.isSuccess]);

  const getZoneTypeOptions = () => {
    var zoneTypeOption = getZoneType?.data?.result?.rows?.map((zone: any) => {
      return {
        text: zone?.name,
        value: zone?.id,
      };
    });
    return zoneTypeOption;
  };

  const onDeleteModalClose = () => {
    setDeleteZoneModal(false);
  };

  const onDeleteClick = (row: any) => {
    if (zonePermissions?.isEdit) {
      setDeleteZoneModal(true);
      setSelectedRow(row);
    } else {
      message.error("Permission denied");
    }
  };

  const onEditClick = (row: any) => {
    if (zonePermissions?.isEdit) {
      const { name, description, zoneType, siteName, siteId } = row;
      setFormValues(row);
      setSelectedRow(row);
      form.setFieldsValue({
        name,
        description,
        zoneType,
        siteName,
        siteId,
      });
      setIsEditModalVisible(true);
    } else {
      message.error("Permission denied");
    }
  };

  const handleDelete = () => {
    deleteZone({ id: selectedRow?.id, deletedBy: userInfo?.id });
    setDeleteZoneModal(false);
    refetch();
  };

  useEffect(() => {
    if (deleteZoneInfo?.isSuccess) {
      message.success({
        content: `Zone is deleted Successfully`,
        key: "errorNotification",
        // className:"successMessage"
      });
      refetch();
    } else if (deleteZoneInfo?.isError) {
      message.error({
        content: deleteZoneInfo?.error?.data?.error?.message,
        key: "errorNotification",
      });
    }
  }, [deleteZoneInfo?.isSuccess, deleteZoneInfo?.isError]);

  const onEditModalClose = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const onEditModalSubmit = () => {
    updateZone({ ...formData, id: selectedRow?.id, updatedBy: userInfo?.id });
    console.log(formValues, ">>>index");
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

  useEffect(() => {
    if (updateZoneInfo?.isSuccess) {
      setIsEditModalVisible(false);
      form.resetFields();
      message.success({
        content: `Zone updated Successfully`,
        //  className:"successMessage"
      });
      updateZoneInfo?.reset();
      refetch();
      setFormData({});
      setLoader(false)
    }
  }, [updateZoneInfo.isSuccess]);

  useEffect(() => {
    if (updateZoneInfo?.isError) {
      setErrorAlert(true);
      setLoader(false)
    }
  }, [updateZoneInfo.isError]);

  //success and error alert
  const ShowUpdateAlert = () => {
    return (
      <UIErrorAlert
        type="error"
        message={updateZoneInfo?.error?.data?.error?.message}
        showAlert={errorAlert}
        setShowAlert={setErrorAlert}
      />
    );
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
            scroll={{ x: 1200, y: 500 }}
          />
        </div>
      </section>
      <UIModal
        title={ModalTitle.EDIT_ZONE}
        className="deviceAddModal"
        key="editZone"
        visible={isEditModalVisible}
        // handleCancel={onEditModalClose}
        footer={[
          <Space>
            <UIsecondaryButton onPress={onEditModalClose} size="sm">
              CANCEL
            </UIsecondaryButton>
            <UIbutton
              form="editZone"
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
        <div>
          <ShowUpdateAlert />
        </div>
        <div className="modalMainDiv">
        {loader && (<UILoader />)}
          <ZoneForm
            onModalSubmit={onEditModalSubmit}
            id="editZone"
            form={form}
            formValues={formValues}
            formData={formData}
            setFormData={setFormData}
            setFormValues={setFormValues}
            zoneTypeOption={getZoneTypeOptions()}
          />
        </div>
      </UIModal>
      <UIConfirmModal
        key="deleteZone"
        visible={deleteZoneModal}
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
