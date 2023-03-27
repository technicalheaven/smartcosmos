import { EllipsisOutlined, LeftOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  Form,
  message,
  Row,
  Space,
  TablePaginationConfig,
} from "antd";
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from "antd/lib/table/interface";

import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as util from "util";
import {
  cloneIcon,
  deleteIcon,
  editDarkIcon,
  // ellipsisIcon,
  processDarkIcon,
  tableIcon,
} from "../../../assets/icons";
import {
  constants,
  ModalButton,
  ModalPrimaryText,
  ModalType,
  PageTitle,
  Permission,
} from "../../../config/enum";
import {
  useDeleteProcessMutation,
  useGetAllTenantProcessQuery,
  useGetProcessActionsMutation,
} from "../../../redux/services/processApiSlice";
import { useGetTenantByIdQuery } from "../../../redux/services/tenantApiSlice";
import { Page } from "../../../routes/config";
import { GetPermissions } from "../../../utils";
import { UIIconbutton } from "../../common/button";
import { UIConfirmModal } from "../../common/confirmModal";
import { UIDropdown } from "../../common/dropdown";
import { UIImage } from "../../common/image";
import { UISearchBar } from "../../common/searchBar";
import { UITable } from "../../common/table";
import { ProcessStepForm } from "./form";
import { ReactComponent as EllipsisIcon } from "../../../assets/images/ellipsis.svg";
import "./style.css";
import { useSelector } from "react-redux";
import UITooltip from "../../common/tooltip";
import { page } from "../../../config/constants";
import { getFilterInfo, setFilterState } from "../../../redux/features/filter/filterSlice";
import { useDispatch } from "react-redux";
import { UILoader } from "../../common/loader";

const ProcessList = () => {
  // state variables
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true)

  const filterState = useSelector(getFilterInfo);
  const currentURL = window.location.href;
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: filterState?.page && currentURL == filterState?.url ? filterState?.page : page?.current,
    pageSize: filterState.limit && currentURL == filterState?.url ? filterState.limit : page?.pageSize,
    showSizeChanger: true,
  });
  const [sort, setSort] = useState<any>({
    ...((currentURL == filterState?.url && filterState?.sortBy) && { sortBy: filterState?.sortBy }),
    ...((currentURL == filterState?.url && filterState?.sortOrder) && { sortOrder: filterState?.sortOrder }),
  });
  const [total, setTotal] = useState(0);
  const { tenantId, type } = useParams();
  const [formValues, setFormValues] = useState<any>({});
  const [processTypes, setProcessTypes] = useState([]);
  const [actions, setActions] = useState([]);
  const [isClone, setIsClone] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isCustomizedLoop, setIsCustomizedLoop] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const processPermissions = GetPermissions(Permission.Process);
  const [selectedRow, setSelectedRow] = useState({ name: null, id: null });
  const [deleteProcessConfirm, setDeleteProcessConfirm] = useState(false);
  const tenantQuery: any = useGetTenantByIdQuery(tenantId);
  const [getFeatureActions, featureActions] = useGetProcessActionsMutation();
  const [deleteProcess, deleteProcessInfo] = useDeleteProcessMutation();
  const [form] = Form.useForm();
  let queryParams: any = {
    page: pagination.current,
    limit: pagination.pageSize,
    tenantId: tenantId,
    isPredefined: type === "predefined" ? 1 : 0,
    ...sort,
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tenantState = useSelector((state: any) => state.tenant);
  const userInfo = useSelector((state: any) => state.auth)?.user;
  console.log('#96', search);

  if (search?.trim() !== "") queryParams = { ...queryParams, search };
  const { data, isSuccess, refetch, isError } = useGetAllTenantProcessQuery(
    queryParams,
    { refetchOnMountOrArgChange: true }
  );

  const onDeleteClick = (row: any) => {
    if (processPermissions?.isEdit) {
      setSelectedRow(row);
      setDeleteProcessConfirm(true);
    } else {
      message.error("Permission denied");
    }
  };

  // Get process types
  useEffect(() => {
    if (tenantQuery?.data?.statusCode) {
      let x = tenantQuery?.data?.result?.tenantFeatures;
      x = x
        .filter((item: any) => item.isEnabled)
        .map((item: any) => ({
          text: item?.featureName,
          value: item?.featureId,
        }));
      setProcessTypes(x);
    }
  }, [tenantQuery?.isSuccess]);
  useEffect(() => {
    if (processTypes?.length) {
      setColumns(UITableColumns)
    }
  }, [processTypes])

  // delete process
  useEffect(() => {
    if (deleteProcessInfo?.data?.statusCode) {
      message.success("Process Deleted SuccessFully");
      setDeleteProcessConfirm(false);
      refetch();
    }
  }, [deleteProcessInfo?.isSuccess]);



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

  // Get feature actions
  useEffect(() => {
    if (featureActions?.data?.statusCode) {
      console.log(featureActions?.data?.result[0]?.featureActions, "pageType");
      let x = featureActions?.data?.result[0]?.featureActions;
      x = x
        .filter((item: any) =>
          type === constants.PREDEFINED
            ? item?.name !== "Scan Barcode" && item?.isPredefined == true
            : item?.isPredefined == false
        )
        .map((item: any) => ({
          text: item?.name,
          label: item?.name,
          value: item?.id,
        }));
      setActions(x);
    }
  }, [featureActions?.isSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setTableData(data?.result?.rows);
      setTotal(data?.result?.count);
      setLoading(false);
      setLoader(false)
    }
  }, [data?.time, isSuccess]);
  useEffect(() => {
    if (isError) {
      setLoader(false)
    }
  }, [isError])

  useEffect(() => {
    if (type) {
      setColumns(UITableColumns)
    }
  }, [type]);

  //table

  const UITableColumns: any = [
    {
      title: "NAME",
      dataIndex: "name",
      sorter: true,
      ...(sort?.sortBy == "name" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div className="clickable" onClick={() => onRowClick(row)}>
            <p className="tableData slice paragraph">{row?.name}</p>
          </div>
        );
      },
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      ...(sort?.sortBy == "description" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 130,
      minWidth: 120,
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
      title: "TYPE",
      dataIndex: "processType",
      sorter: true,
      ...(sort?.sortBy == "processType" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (field: any, row: any) => {
        const type: any = processTypes.find((x: any) => x?.value == field);
        return (
          <div className="clickable" onClick={() => onRowClick(row)}>
            <p className="tableData slice paragraph">
              {type ? type?.text : ""}
            </p>
          </div>
        );
      },
    },
    {
      title: "LAST UPDATED",
      sorter: true,
      dataIndex: "updatedAt",
      ...(sort?.sortBy == "updatedAt" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 140,
      minWidth: 120,
      render: (field: any, row: any) => {
        return (
          <div className="clickable" onClick={() => onRowClick(row)}>
            <p className="tableData slice paragraph">
              {moment(field).format("DD MMM YY hh:mm A")}
            </p>
          </div>
        );
      },
    },
    {
      title: "CREATED",
      sorter: true,
      dataIndex: "createdAt",
      ...(sort?.sortBy == "createdAt" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (field: any, row: any) => {
        return (
          <div className="clickable" onClick={() => onRowClick(row)}>
            <p className="tableData slice paragraph">
              {moment(field).format("DD MMM YY hh:mm A")}
            </p>
          </div>
        );
      },
    },
    {
      title: "STATUS",
      sorter: true,
      dataIndex: "status",
      ...(sort?.sortBy == "status" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (field: any, row: any) => {
        return (
          <div className="clickable" onClick={() => onRowClick(row)}>
            {!row?.isFinalized ? (
              <span className="status draft">Draft</span>
            ) : field.toUpperCase() == "RUNNING" ? (
              <span className="status running">Running</span>
            ) : field.toUpperCase() == "ACTIVE" ? (
              <span className="status active">Active</span>
            ) : (
              <span className="status inactive">Inactive</span>
            )}
          </div>
        );
      },
    },
    {
      width: 30,
      minWidth: 30,
      fixed: "right",
      className: tenantState.status === "Inactive" ? `hideCol` : ``,
      render: (_: any, row: any) => (
        <UIDropdown
          items={[
            {
              label: "Edit Process",
              key: "1",
              icon: <img src={editDarkIcon} alt="icon" />,
              onClick: () => {
                onEditProcess(row);
              },
            },
            {
              type: "divider",
            },
            ...(type !== constants.PREDEFINED
              ? [
                {
                  label: "Clone Process",
                  key: "2",
                  icon: <img src={cloneIcon} alt="icon" />,
                  onClick: () => {
                    onCloneProcess(row);
                  },
                },
                {
                  type: "divider",
                },
                {
                  label: "Delete Process",
                  key: "3",
                  icon: <img src={deleteIcon} alt="icon" />,
                  onClick: () => onDeleteClick(row),
                },
              ]
              : []),
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
    name: string;
    description: string;
    type: string;
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

  const handleCreateProcess = () => {
    form.resetFields();
    setActions([]);
    setIsCustomizedLoop(false);
    if (processPermissions?.isEdit) {
      setProcessModalVisible(true);
      setIsEdit(false);
      setFormValues({});
      setIsClone(false);
    } else {
      message.error("Permission denied");
    }
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
    setLoading(false);
  };

  const onEditProcess = (data: any) => {
    if (processPermissions?.isEdit) {
      getFeatureActions(data?.processType);
      setIsEdit(true);
      setIsClone(false);
      setFormValues(data);
      setIsCustomizedLoop(data?.isCustomizedLoop);
      setProcessModalVisible(true);
    } else {
      message.error("Permission denied");
    }
  };

  const onCloneProcess = (data: any) => {
    const { id, name, ...fields } = data;
    if (processPermissions?.isEdit) {
      getFeatureActions(data?.processType);
      setIsClone(true);
      setIsEdit(false);
      setFormValues(fields);
      setProcessModalVisible(true);
    } else {
      message.error("Permission denied");
    }
  };

  const handleDelete = () => {
    deleteProcess({ id: selectedRow?.id, deletedBy: userInfo?.id });
  };

  const onRowClick = (row: any) => {
    const route = row?.isPredefined
      ? Page.PREDEFINED_PROCESS_INFO
      : Page.USERDEFINED_PROCESS_INFO;
    navigate(`../${route}/${row?.id}`);
  };

  return (
    <>
      <section className="title-section">
        <Card className="uicard detailed-top-card">
          <Row>
            <Col span={24} style={{ marginBottom: "5px" }}>
              <div className="backButton">
                <Link className="link" to={`${Page.ORGANISATION}/${tenantId}`}>
                  <LeftOutlined className="left-back-button" />
                  <b className="top-back-text">BACK</b>
                </Link>
              </div>
            </Col>
            <Col xl={4} lg={4} md={24} sm={24} xs={24}>
              <div className="d-flex align-items-center">
                <div className="icon">
                  <UIImage src={processDarkIcon} text="icon" />
                </div>
                <div className="title">
                  {type === "userdefined"
                    ? PageTitle.USER_DEFINED_PROCESS
                    : PageTitle.PRE_DEFINED_PROCESS}
                </div>
              </div>
            </Col>
            <Col xl={20} lg={24} md={24} sm={24} xs={24}>
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
                    <div className="actionBtns">
                      <Space>
                        {type !== constants.PREDEFINED && (
                          <UIIconbutton
                            onPress={() => handleCreateProcess()}
                            icon="plus"
                            type="info"
                            size="sm"
                            data-testid="addbutton"
                            disableBtn={tenantState.status === "Inactive"}
                          >
                            CREATE PROCESS
                          </UIIconbutton>
                        )}
                      </Space>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
      </section>
      <section className="listing-section">
        <Card className="uicard table">
          {loader && <UILoader />}
          <div className="card-body">
            {total ?
              <UITable
                className="columnHeader"
                columns={columns}
                setColumns={setColumns}
                data={tableData}
                pagination={pagination}
                loading={loading}
                handleTableChange={handleTableChange}
                scroll={{ x: 1300, y: 500 }}
              />
              : !loader ?
                <div className="tablePlaceholder">
                  <div className="icon">
                    <UIImage src={tableIcon} />
                  </div>
                  <div className="text">No Process Data Available</div>
                </div> : <></>
            }
          </div>
        </Card>
      </section>
      {isEdit ? (
        <ProcessStepForm
          visible={processModalVisible}
          setVisible={setProcessModalVisible}
          refetch={refetch}
          formValues={formValues}
          setFormValues={setFormValues}
          processTypes={processTypes}
          actions={actions}
          setActions={setActions}
          isEdit={true}
          form={form}
          isCustomizedLoop={isCustomizedLoop}
          setIsCustomizedLoop={setIsCustomizedLoop}
          pageType={type}
        />
      ) : isClone ? (
        <ProcessStepForm
          visible={processModalVisible}
          setVisible={setProcessModalVisible}
          refetch={refetch}
          formValues={formValues}
          setFormValues={setFormValues}
          processTypes={processTypes}
          actions={actions}
          setActions={setActions}
          isEdit={false}
          isClone={true}
          form={form}
          isCustomizedLoop={isCustomizedLoop}
          setIsCustomizedLoop={setIsCustomizedLoop}
          pageType={type}
        />
      ) : (
        <ProcessStepForm
          visible={processModalVisible}
          setVisible={setProcessModalVisible}
          refetch={refetch}
          formValues={formValues}
          setFormValues={setFormValues}
          processTypes={processTypes}
          actions={actions}
          setActions={setActions}
          isEdit={false}
          form={form}
          isCustomizedLoop={isCustomizedLoop}
          setIsCustomizedLoop={setIsCustomizedLoop}
          pageType={type}
        />
      )}

      <UIConfirmModal
        key="deleteProcess"
        visible={deleteProcessConfirm}
        cancelCallback={() => {
          setDeleteProcessConfirm(false);
        }}
        confirmCallback={handleDelete}
        cancelButton={ModalButton.CANCEL}
        confirmButton={ModalButton.CONFIRM}
        primaryText={util.format(ModalPrimaryText.DELETE, selectedRow?.name)}
        type={ModalType.WARN}
      />
    </>
  );
};

export default ProcessList;
