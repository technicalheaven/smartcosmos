import { Form, message, Space } from "antd";
import { useEffect, useState } from "react";
import {
  addTenantDropdown,
  deleteDarkIcon,
  editDarkIcon,
  ellipsisIcon,
} from "../../../../../assets/icons";
import * as util from "util";
import {
  ModalButton,
  ModalPrimaryText,
  ModalTitle,
  ModalType,
  Permission,
} from "../../../../../config/enum";
import { page } from "../../../../../config/constants";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { UIbutton, UIsecondaryButton } from "../../../../common/button";
import { UIDropdown } from "../../../../common/dropdown";
import { UIModal } from "../../../../common/modal";
import { UITable } from "../../../../common/table";
import { SiteForm } from "./form";
import { UIConfirmModal } from "../../../../common/confirmModal";
import {
  useCreateSiteMutation,
  useDeleteSiteMutation,
  useGetAllSitesQuery,
  useUpdateSiteMutation,
} from "../../../../../redux/services/siteApiSlice";
import { UIErrorAlert } from "../../../../common/uiAlert";
import { ZoneForm } from "../tabZones/form";
import {
  useCreateZoneMutation,
  useGetAllZoneTypesQuery,
} from "../../../../../redux/services/zoneApiSlice";
import { GetPermissions, removeEmptyKeys } from "../../../../../utils";
import { EllipsisOutlined } from "@ant-design/icons";
import { ReactComponent as EllipsisIcon } from "../../../../../assets/images/ellipsis.svg";
import { useSelector } from "react-redux";
import { UILoader } from "../../../../common/loader";

export const SiteList = (props: any) => {
  const {
    isModalVisible,
    setIsModalVisible,
    tenantId,
    search,
    selectedTab,
    isTenantActive,
    pagination,
    setPagination,
  } = props;
  const [tableData, setTableData] = useState();
  const sitePermissions = GetPermissions(Permission.SITE);
  const zonePermissions = GetPermissions(Permission.ZONE);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<any>({});
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [isAddZoneModalVisible, setIsAddZoneModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [deleteSiteModal, setDeleteSiteModal] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [errorAlert, setErrorAlert] = useState(false);
  const [total, setTotal] = useState(0);
  const [loader, setLoader] = useState(false)
  const [addSite, setAddSite] = useState({
    name: "",
    address: null,
    phone: "",
    siteContactName: "",
    email: "",
    siteIdentifier: "",
    latitude: "",
    longitude: "",
    tenantId: tenantId,
  });
  const [addZone, setAddZone] = useState({
    name: "",
    siteId: selectedRow?.id,
    siteName: selectedRow?.name,
    tenantId: tenantId,
    description: "",
    zoneType: "",
    status: "Active",
  });

  const userInfo = useSelector((state: any) => state.auth)?.user;

  const onAddSiteModalClose = () => {
    setIsModalVisible(false);
    createSiteInfo?.reset();
    form.resetFields();
  };

  const onAddSiteModalSubmit = () => {
    createSite(removeEmptyKeys({ ...form.getFieldsValue(), createdBy: userInfo?.id, tenantId }));
    setLoader(true)
  };

  const onEditClick = (row: any) => {
    if (sitePermissions?.isEdit) {
      const {
        name,
        address,
        siteContactName,
        phone,
        email,
        longitude,
        latitude,
        siteIdentifier,
      } = row;
      setSelectedRow(row);
      setFormValues(row);
      form.setFieldsValue({
        name,
        address,
        siteContactName,
        phone,
        longitude,
        latitude,
        email,
        siteIdentifier,
      });
      setIsEditModalVisible(true);
    } else {
      message.error("Permission denied");
    }
  };

  const getSiteName = () => {
    return selectedRow?.name;
  };
  const getSiteId = () => {
    return selectedRow?.id;
  };

  const onEditModalClose = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const onEditModalSubmit = () => {
    updateSite({...form.getFieldsValue(), updatedBy: userInfo?.id, tenantId, id:selectedRow?.id });
    setLoader(true)
  };

  const onAddZoneClick = (row: any) => {
    if (zonePermissions?.isEdit) {
      setIsAddZoneModalVisible(true);
      setSelectedRow(row);
      form1.resetFields();
      setAddZone({
        name: "",
        siteId: row?.id,
        siteName: row?.name,
        tenantId: tenantId,
        description: "",
        zoneType: "",
        status: "Active",
      });
     
    } else {
      message.error("Permission denied");
    }
  };

  const onAddZoneModalClose = () => {
    createZoneInfo?.reset();
    setIsAddZoneModalVisible(false);
    form1.resetFields();
    setFormValues({
      name: "",
      siteId: "",
      siteName: "",
      tenantId: tenantId,
      description: "",
      zoneType: "",
      status: "Active",
    });
    setAddZone({
      name: "",
      siteId: "",
      siteName: "",
      tenantId: tenantId,
      description: "",
      zoneType: "",
      status: "Active",
    });
    form1.setFieldsValue({
      name: "",
      siteId: "",
      siteName: "",
      tenantId: tenantId,
      description: "",
      zoneType: "",
      status: "Active",
    });
  };

  const onDeleteModalClose = () => {
    setDeleteSiteModal(false);
  };

  const handleDelete = () => {
    deleteSite({ id: selectedRow?.id, deletedBy: userInfo?.id });
    setDeleteSiteModal(false);
    refetch();
  };

  const onDeleteClick = (row: any) => {
    if (sitePermissions?.isEdit) {
      setDeleteSiteModal(true);
      setSelectedRow(row);
    } else {
      message.error("Permission denied");
    }
  };

  let queryParams: any = {
    page: pagination.current,
    limit: pagination.pageSize,
    tenantId: tenantId,
    ...sort,
  };

  if (search?.trim() !== "") queryParams = { ...queryParams, search };

  //API
  const [createZone, createZoneInfo] = useCreateZoneMutation();
  const [createSite, createSiteInfo] = useCreateSiteMutation();
  const [updateSite, updateSiteInfo] = useUpdateSiteMutation();
  const [deleteSite, deleteSiteInfo] = useDeleteSiteMutation();
  const { data, isSuccess, refetch, isError } = useGetAllSitesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const getZoneType = useGetAllZoneTypesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const getZoneTypeOptions = () => {
    var zoneTypeOption = getZoneType?.data?.result?.rows?.map((zone: any) => {
      return {
        text: zone?.name,
        value: zone?.id,
      };
    });
    return zoneTypeOption;
  };

  useEffect(() => {
    if (isSuccess) {
      setTableData(data?.result?.rows);
      setTotal(data?.result?.count);
      setLoading(false);
      setLoader(false);
    }
  }, [data, isSuccess]);
  useEffect(() => {
    if (isError) {
      setLoading(false);
      setLoader(false)
    }
  }, [isError])

  useEffect(() => {
    if (selectedTab === "4") {
      refetch();
    }
  }, [selectedTab]);

  useEffect(() => {
    if (deleteSiteInfo?.isSuccess) {
      message.success({
        content: `Site is deleted Successfully`,
        key: "errorNotification",
      });
      refetch();
    } else if (deleteSiteInfo?.isError) {
      message.error({
        content: deleteSiteInfo?.error?.data?.error?.message,
        key: "errorNotification",
      });
    }
  }, [deleteSiteInfo?.isSuccess, deleteSiteInfo?.isError]);

  const onZoneModalSubmit = () => {
    createZone(
      removeEmptyKeys({
        ...addZone,
        siteId: selectedRow?.id,
        siteName: selectedRow?.name,
        createdBy: userInfo?.id,
      })
    )
    setLoader(true)
   
  };

  useEffect(() => {
    if (createSiteInfo?.isSuccess) {
      setIsModalVisible(false);
      form.resetFields();
      createSiteInfo?.reset();
      setAddSite({
        name: "",
        address: null,
        phone: "",
        siteContactName: "",
        email: "",
        siteIdentifier: "",
        latitude: "",
        longitude: "",
        tenantId: tenantId,
      });

      setFormValues({
        name: "",
        address: null,
        phone: "",
        siteContactName: "",
        email: "",
        siteIdentifier: "",
        latitude: "",
        longitude: "",
        tenantId: tenantId,
      });
      form.setFieldsValue({
        name: "",
        address: null,
        phone: "",
        siteContactName: "",
        email: "",
        siteIdentifier: "",
        latitude: "",
        longitude: "",
        tenantId: tenantId,
      });
      message.success({
        content: `Site created Successfully`,
        key: "errorNotification",
        // className:"successMessage"
      });
      refetch();
      setLoader(false)
    }
  }, [createSiteInfo?.isSuccess]);

  useEffect(( ) => {
    if(createSiteInfo?.isError){
      setLoader(false)
    }
  },[createSiteInfo?.isError])

  useEffect(() => {
    if (updateSiteInfo?.isSuccess) {
      setIsEditModalVisible(false);
      form.resetFields();
      message.success({
        content: "Site updated Successfully",
        key: "errorNotification",
        // className:"successMessage"
      });
      updateSiteInfo?.reset();
      refetch();
      setLoader(false)
    }
  }, [updateSiteInfo?.isSuccess]);

  useEffect(() => {
    if (createZoneInfo?.isSuccess) {
      setIsAddZoneModalVisible(false);
      form1.resetFields();
      createZoneInfo?.reset();
      setFormValues({
        name: "",
        siteId: selectedRow?.id,
        siteName: selectedRow?.name,
        tenantId: tenantId,
        description: "",
        zoneType: "",
        status: "Active",
      });
      setAddZone({
        name: "",
        siteId: selectedRow?.id,
        siteName: selectedRow?.name,
        tenantId: tenantId,
        description: "",
        zoneType: "",
        status: "Active",
      });
      form1.setFieldsValue({
        name: "",
        siteId: selectedRow?.id,
        siteName: selectedRow?.name,
        tenantId: tenantId,
        description: "",
        zoneType: "",
        status: "Active",
      });
      console.log(formValues, "formValues");
      console.log(addZone, "addZone");

      message.success({
        content: `Zone created Successfully`,
        key: "errorNotification",
        // className:"successMessage"
      });
      refetch();
      setLoader(false)
    }
  }, [createZoneInfo?.isSuccess]);

  useEffect(() => {
    if (createZoneInfo?.isError) {
      setLoader(false)
    }
  }, [createZoneInfo.isError]);

  const UITableColumns: any = [
    {
      title: "SITE",
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
      title: "SITE IDENTIFIER",
      dataIndex: "siteIdentifier",
      sorter: true,
      minWidth: 120,
      width: 150,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">{row?.siteIdentifier}</p>
          </div>
        );
      },
    },
    {
      title: "ADDRESS",
      dataIndex: "address",
      minWidth: 80,
      width: 100,
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">{row?.address}</p>
          </div>
        );
      },
    },
    {
      title: "NO. DEVICES",
      dataIndex: "numberOfDevice",
      minWidth: 80,
      width: 150,
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <span>{row?.numberOfDevice}</span>
          </div>
        );
      },
    },
    {
      title: "NO. ZONES",
      minWidth: 100,
      width: 120,
      dataIndex: "numberOfZone",
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <span>{row?.numberOfZone}</span>
          </div>
        );
      },
    },
    {
      title: "LATITUDE",
      width: 100,
      minWidth: 100,
      dataIndex: "latitude",
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">{row?.latitude}</p>
          </div>
        );
      },
    },
    {
      title: "LONGITUDE",
      dataIndex: "longitude",
      minWidth: 100,
      width: 130,
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">{row?.longitude}</p>
          </div>
        );
      },
    },
    {
      dataIndex: "login",
      minWidth: 30,
      width: 30,
      fixed: "right",
      className: !isTenantActive ? `hideCol` : ``,
      render: (login: any, row: any) => (
        <UIDropdown
          items={[
            {
              label: <a href="javascript:void(0)">Edit Site</a>,
              key: "1",
              icon: <img src={editDarkIcon} alt="edit" />,
              // disabled: sitePermissions?.isEdit ? false : true,
              onClick: () => onEditClick(row),
            },
            {
              type: "divider",
            },
            {
              label: "Add Zone",
              key: "2",
              icon: <img src={addTenantDropdown} alt="add" />,
              // disabled: zonePermissions?.isEdit ? false : true,
              onClick: () => onAddZoneClick(row),
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

  //success and error alert
  const showAlert = () => {
    if (createSiteInfo?.isError) {
      return (
        <UIErrorAlert
          message={
            createSiteInfo?.error?.data?.error?.message?.errors
              ? "Something  went wrong"
              : createSiteInfo?.error?.data?.error?.message
          }
          showAlert={createSiteInfo?.isError}
        />
      );
    } else {
      return null;
    }
  };

  const showZoneAlert = () => {
    if (createZoneInfo?.isError) {
      return (
        <UIErrorAlert
          message={
            createZoneInfo?.error?.data?.error?.message?.errors
              ? "Something  went wrong"
              : createZoneInfo?.error?.data?.error?.message
          }
          showAlert={createZoneInfo?.isError}
        />
      );
    } else {
      return null;
    }
  };
  
  useEffect(() => {
    if (updateSiteInfo?.isError) {
      setErrorAlert(true);
      setLoader(false)
    }
  }, [updateSiteInfo.isError]);

  const ShowUpdateAlert = () => {
    if (updateSiteInfo?.isError) {
      return (
        <UIErrorAlert
          type="error"
          message={
            updateSiteInfo?.error?.data?.error?.message?.errors
              ? "Something  went wrong"
              : updateSiteInfo?.error?.data?.error?.message
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
      <section>
        <UIModal
          title={ModalTitle.ADD_SITE}
          className="deviceAddModal zoomModal"
          key="addSite"
          visible={isModalVisible}
          // handleCancel={onAddSiteModalClose}
          footer={[
            <Space>
              <UIsecondaryButton onPress={onAddSiteModalClose} size="sm">
                CANCEL
              </UIsecondaryButton>
              <UIbutton
                form="addSite"
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
          <div>{showAlert()}</div>
          <div className="modalMainDiv">
          {loader && (<UILoader />)}
            <SiteForm
              onModalSubmit={onAddSiteModalSubmit}
              id="addSite"
              form={form}
              formValues={addSite}
              setFormValues={setAddSite}
            />
          </div>
        </UIModal>
        <UIModal
          title={ModalTitle.EDIT_SITE}
          className="deviceAddModal zoomModal"
          key="editSite"
          visible={isEditModalVisible}
          // handleCancel={onEditModalClose}
          footer={[
            <Space>
              <UIsecondaryButton onPress={onEditModalClose} size="sm">
                CANCEL
              </UIsecondaryButton>
              <UIbutton
                form="editSite"
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
            <SiteForm
              onModalSubmit={onEditModalSubmit}
              id="editSite"
              form={form}
              formValues={formValues}
              setFormValues={setFormValues}
            />
          </div>
        </UIModal>
        <UIModal
          title={ModalTitle.ADD_ZONE}
          className="deviceAddModal"
          key="addZone"
          visible={isAddZoneModalVisible}
          // handleCancel={onAddZoneModalClose}
          footer={[
            <Space>
              <UIsecondaryButton onPress={onAddZoneModalClose} size="sm">
                CANCEL
              </UIsecondaryButton>
              <UIbutton
                form="addZone"
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
          <div>{showZoneAlert()}</div>
          <div className="modalMainDiv">
          {loader && (<UILoader />)}
            <ZoneForm
              onModalSubmit={onZoneModalSubmit}
              id="addZone"
              form={form1}
              siteId={getSiteId()}
              siteName={getSiteName()}
              formValues={addZone}
              zoneTypeOption={getZoneTypeOptions()}
              setFormValues={setAddZone}
            />
          </div>
        </UIModal>
        <UIConfirmModal
          key="deleteSite"
          visible={deleteSiteModal}
          cancelCallback={onDeleteModalClose}
          confirmCallback={handleDelete}
          cancelButton={ModalButton.CANCEL}
          confirmButton={ModalButton.CONFIRM}
          primaryText={util.format(ModalPrimaryText.DELETE, selectedRow.name)}
          type={ModalType.WARN}
        />
      </section>
    </>
  );
};
