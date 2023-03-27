import { LeftOutlined } from "@ant-design/icons";
import { Card, Row } from "antd";
import Col from "antd/es/grid/col";
import {
  ColumnsType,
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from "antd/lib/table/interface";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  factoryTagIcon,
  factoryTagLightIcon,
  tableIcon,
} from "../../../assets/icons";
import { apiRoutes, baseURL } from "../../../config/api";
import { page, TIMEZONE } from "../../../config/constants";
import { ModalTitle, PageTitle } from "../../../config/enum";
import { getFilterInfo, setFilterState } from "../../../redux/features/filter/filterSlice";
import {
  useGetAllTagsQuery,
  useGetTagExportChunksMutation,
  useGetTagFilterOptionsQuery,
} from "../../../redux/services/tagApiSlice";
import { Page } from "../../../routes/config";
import { downloadWithAxios, removeEmptyKeys } from "../../../utils";
import { UIIconbutton } from "../../common/button";
import UIExportModal from "../../common/exportModal";
import { UIImage } from "../../common/image";
import { UILoader } from "../../common/loader";
import { UISearchInput } from "../../common/searchBar";
import { UISelectInput } from "../../common/selectInput";
import { UITable } from "../../common/table";
import "./style.css";

const FactoryTags = () => {
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
  const [loading, setLoading] = useState(true);
  const [tagTypes, setTagTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [search, setSearch] = useState<any>({
    ...(filterState?.FtTagType && { type: filterState?.FtTagType }),
    ...(filterState?.FtManufacturer && { manufacturers: filterState?.FtManufacturer }),
    ...(filterState?.FtTagId && { value: filterState?.FtTagId })
  });
  const [searchValue, setSearchValue] = useState<any>(filterState?.FtTagId);
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(true);

  let dispatch = useDispatch();

  const tenantState = useSelector((state: any) => state.tenant);
  let { tenantId } = useParams();
  let queryParams: any = {
    page: pagination.current,
    limit: pagination.pageSize,
    ...sort,
    tenantId,
    ...search,
    // render: Math.round(new Date().getSeconds() / 5),
  };

  const [getExportChunks, exportChunksInfo] = useGetTagExportChunksMutation();
  const dateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  const { data, isSuccess, refetch, isError } = useGetAllTagsQuery(
    queryParams
    //   {
    //   refetchOnMountOrArgChange: true,
    // }
  );

  const tagTypeQuery = useGetTagFilterOptionsQuery({
    type: "tagType",
    tenantId,
  });
  const manufacturerQuery = useGetTagFilterOptionsQuery({
    type: "manufacturerName",
    tenantId,
    tagType: search?.type,
  });


  const getExportFilters = () => {
    return removeEmptyKeys({
      tenantId,
      timeZone: TIMEZONE,
      ...(search?.type && { tagType: search?.type }),
      ...(search?.manufacturers && { manufacturerName: search?.manufacturers }),
      ...(search?.value && { tagId: search?.value }),
    })
  }


  // useEffect : fetching export chunks
  useEffect(() => {
    if (exportChunksInfo?.isSuccess) {
      const totalCount = exportChunksInfo?.data?.result?.totalCount;
      const chunkSize = exportChunksInfo?.data?.result?.chunkSize;
      const qs = new URLSearchParams(getExportFilters()).toString();
      const url = `${baseURL + apiRoutes.FACTORY_TAG_EXPORT}?${qs}`;
      const filename = `${tenantState?.name}-factorytags-${dateTime}.xlsx`;
      if (totalCount <= chunkSize) {
        downloadWithAxios(url, filename, setLoading);
      } else {
        setTimeout(() => {
          setLoading(false);
          setIsModalVisible(true);
        }, 500)
      }
    }
  }, [exportChunksInfo?.isSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setTableData(data?.result?.data);
      setTotal(data?.result?.count);
      setLoader(false)
      setLoading(false)
    }
  }, [isSuccess, data?.time]);
  useEffect(() => {
    if (isError) {
      setLoader(false)
      setLoading(false)
    }
  }, [isError])

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
    if (tagTypeQuery?.data?.statusCode) {
      const x = tagTypeQuery?.data?.result.map((x: any) => ({
        text: x.capitalize(),
        value: x,
      }));
      setTagTypes(x);
    }
  }, [tagTypeQuery?.isSuccess]);

  useEffect(() => {
    if (manufacturerQuery?.data?.statusCode) {
      const x = manufacturerQuery?.data?.result.map((x: any) => ({
        text: x.capitalize(),
        value: x,
      }));

      setManufacturers(x);
    }
  }, [manufacturerQuery?.isSuccess, manufacturerQuery?.fulfilledTimeStamp]);

  interface Params {
    pagination?: TablePaginationConfig;
    sorter?: SorterResult<any> | SorterResult<any>[];
    total?: number;
    sortField?: string;
    sortOrder?: string;
  }
  interface DataType {
    manufacturerName: string;
    tagId: string;
    batchId: string;
    tagType: string;
    tagClass: string;
    userName: string;
    createdAt: string;
  }

  const UITableColumns: any = [
    {
      title: "Manufacture name",
      dataIndex: "manufacturerName",
      ...(sort?.sortBy == "manufacturerName" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 150,
      minWidth: 180,
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">
              {row?.manufacturerName}
            </p>
          </div>
        );
      },
    },
    {
      title: "Tag ID",
      dataIndex: "tagId",
      ...(sort?.sortBy == "tagId" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">
              {row?.tagId}
            </p>
          </div>
        );
      },
    },
    {
      title: "Batch ID",
      dataIndex: "batchId",
      ...(sort?.sortBy == "batchId" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">
              {row?.batchId}
            </p>
          </div>
        );
      },
    },
    {
      title: "Tag Type",
      dataIndex: "tagType",
      ...(sort?.sortBy == "tagType" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">
              {row?.tagType}
            </p>
          </div>
        );
      },
    },
    {
      title: "Tag Class",
      dataIndex: "tagClass",
      ...(sort?.sortBy == "tagClass" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">
              {row?.tagClass}
            </p>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      ...(sort?.sortBy == "status" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      sorter: true,
      render: (field: any, row: any) => (
        <>
          {field == "active" ? (
            <span className="status active">Active</span>
          ) : (
            <span className="status inactive">Inactive</span>
          )}
        </>
      ),
    },
    {
      title: "Created By",
      dataIndex: "userName",
      ...(sort?.sortBy == "name" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 140,
      minWidth: 130,
      sorter: true,
      render: (_: any, row: any) => {
        return (
          <div>
            <p className="tableData slice paragraph">
              {row?.userName}
            </p>
          </div>
        );
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      ...(sort?.sortBy == "name" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 140,
      minWidth: 130,
      sorter: true,
      render: (field: any) => moment(field).format("DD MMM YY hh.mm A"),
    },
  ];
  const [columns, setColumns] = useState(UITableColumns);

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
    setLoading(false);
  };
  useEffect(() => {
    setPagination({
      ...pagination,
      locale: { items_per_page: "" },
      total,
    });
  }, [total]);

  const ontagTypeChange = (val: any) => {
    setSearch({
      ...search,
      type: val,
      manufacturers: undefined,
    });
    dispatch(setFilterState({ FtTagType: val, FtManufacturer: null, FtTagId: null }));
    setSearchValue("")
    // searchSelectInput
    setPagination({ ...pagination, current: 1 });
  };

  const onManufacturerChange = (val: any) => {
    setSearch({
      ...search,
      manufacturers: val,
    });
    dispatch(setFilterState({ FtManufacturer: val }));
    setSearchValue("");
    //searchSelectInput
    setPagination({ ...pagination, current: 1 });
  };


  useEffect(() => {
    const value = searchValue || undefined;
    setSearch({
      ...search,
      value,
    });
    dispatch(setFilterState({ FtTagId: value }));
    setPagination({ ...pagination, current: 1 });
  }, [searchValue]);




  return (
    <>
      <section className="title-section factoryTags">
        <Card className="uicard detailed-top-card">
          <Row>
            <Col span={24} style={{ marginBottom: "5px" }}>
              <div className="backButton">
                <Link
                  className="link backButton"
                  to={`${Page.ORGANISATION}/${tenantId}`}
                >
                  <LeftOutlined className="left-back-button" />
                  <b className="top-back-text">BACK</b>
                </Link>
              </div>
            </Col>
          </Row>

          <Row className="factoryTag">
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <div className="d-flex align-items-center">
                <div className="icon">
                  <UIImage src={factoryTagIcon} text="icon" />
                </div>
                <div className="title">{PageTitle.FACTORY_TAGS}</div>
              </div>
            </Col>
            {/* <Col span={16}> */}
            {total != 0 ||
              search?.value !== undefined ||
              search?.type !== undefined ||
              search?.manufacturers !== undefined ? (
              <Col xl={16} lg={24} md={24} sm={24} xs={24} className="margin">
                <div className="actionBtns d-flex">
                  <Row gutter={20} className="w-100">
                    <Col span={6} style={{ textAlign: "right" }}>
                      <UIIconbutton
                        className="uiBtn"
                        icon="export"
                        type="info"
                        size="sm"
                        onPress={() => {
                          setLoading(true);
                          getExportChunks(getExportFilters());
                        }}
                        disableBtn={total == 0}
                      >
                        EXPORT
                      </UIIconbutton>
                    </Col>
                    <Col span={6}>
                      <UISelectInput
                        optionValue={tagTypes}
                        value={search?.type}
                        placeholder="Select TagType"
                        onChange={ontagTypeChange}
                      />
                    </Col>
                    <Col span={6}>
                      <UISelectInput
                        optionValue={manufacturers}
                        value={search?.manufacturers}
                        placeholder="Select Manufacturer"
                        onChange={onManufacturerChange}
                      />
                    </Col>
                    <Col span={6}>
                      <UISearchInput
                        placeholder="Search by TagID"
                        search={searchValue}
                        setSearch={setSearchValue}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            ) : (
              <></>
            )}
          </Row>
        </Card>
      </section>

      <section className="listing-section">
        <Card className="uicard table">
          {loader && <UILoader />}
          <div className="card-body">
            {total ?
              <UITable
                columns={columns}
                setColumns={setColumns}
                data={tableData}
                pagination={pagination}
                setPagination={setPagination}
                loading={loading}
                handleTableChange={handleTableChange}
                scroll={{ x: 2000, y: 500 }}
              ></UITable>
              : !loader ?
                <div className="tablePlaceholder">
                  <div className="icon">
                    <UIImage src={tableIcon} />
                  </div>
                  <div className="text">No Tag Data Available</div>
                </div> : <></>
            }
          </div>
        </Card>
      </section>

       {/* Export UI modal */}

       <UIExportModal 
      total={exportChunksInfo?.data?.result?.totalCount}
      chunkSize={exportChunksInfo?.data?.result?.chunkSize}
      isModalVisible={isModalVisible}
      filters={getExportFilters()}
      apiEndPoint={apiRoutes.FACTORY_TAG_EXPORT}
      filename={`${tenantState?.name}-factorytags-${dateTime}-%s.xlsx`}
      setIsModalVisible={setIsModalVisible}
      title={ModalTitle.EXPORT_TAGS}
      />

      {/* Export UI modal */}
    </>
  );
};

export default FactoryTags;
