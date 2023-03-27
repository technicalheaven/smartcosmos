import { DownloadOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  message,
  Row,
  TablePaginationConfig,
  UploadFile,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { tableIcon, tenanDarkIcon, uploadTagIcon } from "../../../assets/icons";
import { page } from "../../../config/constants";
import { PageTitle } from "../../../config/enum";
import { getLoggedInUser } from "../../../redux/features/auth/authSlice";
import { getFilterInfo, setFilterState } from "../../../redux/features/filter/filterSlice";
import {
  useGetAllTagsQuery,
  useGetTagUploadHistoryQuery,
} from "../../../redux/services/tagApiSlice";
import { UIIconbutton } from "../../common/button";
import { UIImage } from "../../common/image";
import { UITable } from "../../common/table";
import { UIAlert, UIErrorAlert } from "../../common/uiAlert";
import UploadProductModal from "../product/uploadProductModal";

export const FactoryTagHistory = (props: any) => {
  const [uploadProductModal, setUploadProductModal] = useState(false);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { tenantId } = useParams();
  const [editProductModal, setEditProductModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [errorAlert, setErrorAlert] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const [selectedRow, setSelectedRow] = useState({
    upc: null,
    otherAttributes: null,
  });
  const userId = useSelector(getLoggedInUser);
  let queryParams: any = {
    page: pagination.current,
    limit: pagination.pageSize,
    tenantId,
    userId,
    ...sort,
  };

  let dispatch = useDispatch();

  if (search?.trim() !== "") queryParams = { ...queryParams, name: search };

  const tagUploadHistoryQuery: any = useGetTagUploadHistoryQuery(queryParams);

  useEffect(() => {
    if (tagUploadHistoryQuery?.data?.statusCode) {
      setTableData(tagUploadHistoryQuery?.data?.result?.data);
      setTotal(tagUploadHistoryQuery?.data?.result?.count);
    }
  }, [
    tagUploadHistoryQuery?.isSuccess,
    tagUploadHistoryQuery?.fulfilledTimeStamp,
  ]);

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

  const UITableColumns: any = [
    {
      title: "TENANT",
      dataIndex: "tenantName",
      sorter: true,
      ...(sort?.sortBy == "tenantName" && {defaultSortOrder: sort?.sortOrder == 'ASC' ?  'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : ""}),
      width: 100,
      minWidth: 80,
    },
    {
      title: "DATE",
      dataIndex: "createdAt",
      sorter: true,
      ...(sort?.sortBy == "createdAt" && {defaultSortOrder: sort?.sortOrder == 'ASC' ?  'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : ""}),
      width: 100,
      minWidth: 80,
      render: (field: any) => moment(field).format("DD MMM YY hh.mm A"),
    },
    {
      title: "UPLOADED COUNT",
      dataIndex: "uploadCount",
      sorter: true,
      ...(sort?.sortBy == "uploadCount" && {defaultSortOrder: sort?.sortOrder == 'ASC' ?  'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : ""}),
      width: 100,
      minWidth: 80,
    },
    {
      title: "ERROR COUNT",
      dataIndex: "errorCount",
      sorter: true,
      ...(sort?.sortBy == "errorCount" && {defaultSortOrder: sort?.sortOrder == 'ASC' ?  'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : ""}),
      width: 100,
      minWidth: 80,
    },
    {
      title: "USERNAME",
      dataIndex: "userName",
      sorter: true,
      ...(sort?.sortBy == "userName" && {defaultSortOrder: sort?.sortOrder == 'ASC' ?  'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : ""}),
      width: 100,
      minWidth: 80,
    },
    {
      title: "FILENAME",
      dataIndex: "fileName",
      sorter: true,
      ...(sort?.sortBy == "fileName" && {defaultSortOrder: sort?.sortOrder == 'ASC' ?  'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : ""}),
      width: 100,
      minWidth: 80,
      render: (field: any, row: any) => (
        <a href={row?.fileLink} download>
          <DownloadOutlined /> {field}
        </a>
      ),
    },
    {
      title: "STATUS LINK",
      dataIndex: "statusLink",
      sorter: true,
      ...(sort?.sortBy == "statusLink" && {defaultSortOrder: sort?.sortOrder == 'ASC' ?  'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : ""}),
      width: 100,
      minWidth: 80,
      render: (field: any, row: any) =>
        row?.errorCount == 0 ? (
          <a
            href="javascript:void(0)"
            onClick={() => message.error("Report not found")}
          >
            <DownloadOutlined /> Link
          </a>
        ) : (
          <a href={row?.errorReportLink} download>
            <DownloadOutlined /> Link
          </a>
        ),
    },
  ];
  const [columns, setColumns] = useState(UITableColumns);
  interface DataType {
    upc: string;
    name: string;
    description: string;
    experienceId: string;
    experienceTenantId: string;
    experienceStudioId: string;
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

  const fetchData = (params: Params = {}) => {
    setLoading(true);
    tagUploadHistoryQuery.refetch();
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
  useEffect(() => {
    setPagination({
      ...pagination,
      locale: { items_per_page: "" },
      total,
    });
  }, [total]);

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

  return (
    <>
      <section className="title-section">
        <Card className="uicard tanent-card topui-card">
          <Row className="front-top-card">
            <Col xl={8} lg={10} md={8} sm={24} xs={24}>
              <div className="d-flex align-items-center">
                <div className="icon">
                  <UIImage
                    src={uploadTagIcon}
                    //  width={30}
                    text="icon"
                  />
                </div>
                <div className="title">{PageTitle.FACTORY_TAGS}</div>
              </div>
            </Col>

            <Col xl={16} lg={14} md={16} sm={24} xs={24}>
              <div className="actions factoryCard">
                <div className="addBtn inputField">
                  <UIIconbutton
                    onPress={() => setUploadProductModal(true)}
                    icon="plus"
                    type="info"
                    size="md"
                    data-testid="addbutton"
                  >
                    UPLOAD FACTORY TAGS
                  </UIIconbutton>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </section>
      <section className="listing-section">
        <Card className="uicard table">
          <div className="card-body">
            {total ? (
              <UITable
                columns={columns}
                setColumns={setColumns}
                data={tableData}
                pagination={pagination}
                loading={loading}
                handleTableChange={handleTableChange}
                scroll={{ x: 2000, y: 500 }}
              />
            ) : (
              <div className="tablePlaceholder">
                <div className="icon">
                  <UIImage src={tableIcon} />
                </div>
                <div className="text">No Data Available</div>
              </div>
            )}
          </div>
        </Card>
      </section>

      <UploadProductModal
        title="Upload Factory Tags"
        visible={uploadProductModal}
        refetch={tagUploadHistoryQuery?.refetch}
        page={PageTitle.FACTORY_TAGS}
        handleCancel={() => {
          setUploadProductModal(false);
          setFileList([]);
        }}
        setProductUploadModal={setUploadProductModal}
        tenantId={tenantId}
        userId={userId}
        tenantName={useSelector((state: any) => state.tenant)?.name}
        userName={useSelector((state: any) => state.auth)?.userInfo?.username}
        fileList={fileList}
        setFileList={setFileList}
      />
    </>
  );
};
