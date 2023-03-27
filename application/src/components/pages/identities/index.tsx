import { LeftOutlined } from "@ant-design/icons";
import { Card, Col, message, Row, Space, Tabs } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as util from "util";
import {
  deenable,
  digitalIcon,
  disable_btn,
  duplicates,
  editDarkIcon,
  identityIcon,
  tableIcon,
} from "../../../assets/icons";
import { apiRoutes, baseURL } from "../../../config/api";
import { ModalTitle, PageTitle } from "../../../config/enum";
import { useDeEnableTagMutation, useGetAllDigitizedTagMutation, useGetDiExportChunksMutation } from "../../../redux/services/identityApiSlice";
import { useGetAllTenantProcessQuery } from "../../../redux/services/processApiSlice";
import { useGetAllSitesQuery } from "../../../redux/services/siteApiSlice";
import { useGetAllZonesQuery } from "../../../redux/services/zoneApiSlice";
import { Page } from "../../../routes/config";
import { downloadWithAxios, isJsonString, removeEmptyKeys } from "../../../utils";
import { UIIconbutton } from "../../common/button";
import { UIImage } from "../../common/image";
import { UISearchInput } from "../../common/searchBar";
import { UISelectInput } from "../../common/selectInput";
import UIFilterSelectInput from "../../common/selectInput/filterSelectInput";
import { UICalendar } from "../../common/uiCalendar";
import { EnableTab } from "./enableTab/identityTable";
import "./style.css";
import diData from "./dummyIdentityTble.json";
import { UIDropdown } from "../../common/dropdown";
import { ReactComponent as EllipsisIcon } from "../../.././assets/images/ellipsis.svg";
import UITooltip from "../../common/tooltip";
import { useDispatch } from "react-redux";
import { getFilterInfo, resetFilterState, setFilterState } from "../../../redux/features/filter/filterSlice";
import { useSelector } from "react-redux";
import { page, TIMEZONE } from "../../../config/constants";
import UIExportModal from "../../common/exportModal";


const Identities = (props: any) => {
  // states
  const [tagData, setTagData] = useState<any>({});

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
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
  const [search, setSearch] = useState<any>({ field: filterState?.diField });
  const [searchValue, setSearchValue] = useState<any>(filterState?.diValue);
  const [selectedTab, setSelectedTab] = useState(filterState?.diType ?? "enabled");
  const [processName, setProcessName] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState([]);
  const [tagId, setTagId] = useState([])



  const { tenantId } = useParams();
  const dispatch = useDispatch();
  const [params, setParams] = useState<any>(filterState?.diFrom && filterState?.diTo ? [moment(filterState?.diFrom), moment(filterState?.diTo)] : []);
  const [process, setProcess] = useState(filterState?.diProcess);
  const { TabPane } = Tabs;

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
    createdAt: string;
    updatedAt: string;
    description: string;
    type: string;
  }

  const onTabChange = (key: any) => {
    setSelectedTab(key);
    setSelectedCheckbox([])
    setTagId([]);
    dispatch(resetFilterState());
    setPagination({
      ...params.pagination,
      locale: { items_per_page: "" },
      total,
    });
  };


  const startDate = params.length ? moment(params[0]).format("YYYY-MM-DD") : "";
  const endDate = params.length ? moment(params[1]).format("YYYY-MM-DD") : "";

  let queryParams: any = {
    page: pagination.current ?? 1,
    limit: pagination.pageSize ?? 10,
    tenantId: tenantId,
    ...sort,
    type: selectedTab,
    processId: process,
    ...(startDate && { from: startDate }),
    ...(endDate && { to: endDate }),
    ...((search?.field && search?.value) && search),
  };

  //API integration
  const [fetchDigitilizeTag, digitilizeTagInfo] =
    useGetAllDigitizedTagMutation();
  const [updateDeenableTag, deenableTag] = useDeEnableTagMutation();
  const [getExportChunks, exportChunksInfo] = useGetDiExportChunksMutation();
  const processQuery:any = useGetAllTenantProcessQuery({
    tenantId: tenantId,
    processType: "Digitization",
  });

  const _processName = processName ?? processQuery?.data?.result?.rows
      .find((x:any) => x?.id == filterState?.diProcess)?.name; 

 // useEffect : fetching export chunks
  useEffect(() => {
    if (exportChunksInfo?.isSuccess) {
      const totalCount = exportChunksInfo?.data?.result?.totalCount;
      const chunkSize = exportChunksInfo?.data?.result?.chunkSize;
      const qs = new URLSearchParams(getExportFilters()).toString();
      const url = `${baseURL + apiRoutes.EXPORT_TAGS}?${qs}`;
      const filename = `Process-${_processName}-tag-data-%s.xlsx`
      if(totalCount <= chunkSize){
        downloadWithAxios(url, filename, setLoading);
      }else{
      setTimeout(()=>{
        setLoading(false);
        setIsModalVisible(true);
      }, 500)
    }
    }
  }, [exportChunksInfo?.isSuccess]);

  // useEffect : fetching tag data
  useEffect(() => {
    if (process) {
      setLoading(true);
      fetchDigitilizeTag(queryParams);
      //save difilters data into state
      dispatch(setFilterState({
        diType: queryParams?.type,
        diProcess: queryParams?.processId,
        diFrom: queryParams?.from,
        diTo: queryParams?.to,
        diField: queryParams?.field,
        diValue: queryParams?.value,
      }));
    } else {
      dispatch(resetFilterState());
      setSearch(null);
      setSearchValue(null);
      setSelectedTab("enabled");
      setParams([]);

    }



  }, [
    queryParams?.page,
    queryParams?.limit,
    queryParams?.sortBy,
    queryParams?.sortOrder,
    queryParams?.type,
    queryParams?.processId,
    queryParams?.from,
    queryParams?.to,
    queryParams?.field,
    queryParams?.value,
  ]);

  // useEffect : while user tab changes
  useEffect(() => {
    setPagination({
      ...pagination,
      current: 1,
      pageSize: 10,
    });
  }, [selectedTab]);


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

  // useEffect : preparing tag reponse
  useEffect(() => {
    if (digitilizeTagInfo?.isSuccess) {
      const tableData = digitilizeTagInfo?.data?.result?.data.map((x: any) => {
        return { ...x, key: x?._id, additionalData: isJsonString(x?.additionalData) ? JSON.parse(x?.additionalData) : x?.additionalData };
      });
      setTagData({
        tagCount: digitilizeTagInfo?.data?.result?.totalCount,
        tableData: tableData,
      });

      setTotal(digitilizeTagInfo?.data?.result?.count);
      setLoading(false);
    }
  }, [digitilizeTagInfo?.isSuccess, digitilizeTagInfo?.fulfilledTimeStamp]);

  useEffect(() => {
    if (digitilizeTagInfo?.error?.status === 500) {
      message.error("Something went wrong")
      setLoading(false)
    }
  }, [digitilizeTagInfo?.isError])

  const onFilterSelect = (val: any) => {
    setSearch({
      field: val,
    });
    setSearchValue("")
  };

  useEffect(() => {
    setSearch({ ...search, value: searchValue });
  }, [searchValue]);

  const handleProcessChange = (val: any, x: any) => {
    setProcess(val);
    setProcessName(x?.label);
    setSearch(null);
    setSearchValue(null);
    setSelectedTab("enabled")
  };

  useEffect(() => {
    setPagination({
      ...pagination,
      locale: { items_per_page: "" },
      total,
    });
  }, [total]);

  const fetchData = (params: Params = {}) => {
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

  const handleChange = (e: any, x: any) => {
    setParams(e);
  };
  const handleDeenableTag = () => {
    updateDeenableTag({ tags: tagId })
  }
  useEffect(() => {
    if (deenableTag?.isSuccess) {
      message.success("Tags are de-enabled succesfully")
      fetchDigitilizeTag(queryParams);
    }
  }, [deenableTag?.isSuccess])

  const MAXMARKERHEADER = 6
  const MAXINPUTHEADER = 6
  const MAXENCODEHEADER = 6


  const createAdditionalHeader = () => {
    let additionalHeader = Array();

    for (let i = 0; i < MAXMARKERHEADER; i++) {

      const temp = [
        {

          title: `Marker code ${i + 1}`,
          dataIndex: "code",
          width: 150,
          minWidth: 150,
          // sorter: true,
          render: (_: any, row: any) => {
            return (
              <div>
                <p className="tableData slice paragraph">{row?.additionalData?.association ? row?.additionalData?.association.map((x: any) => { return x?.code })[i] : ""}</p>
              </div>
            );
          },
        },
        {
          title: `Marker Type ${i + 1}`,
          dataIndex: "type",
          width: 150,
          minWidth: 150,
          // sorter: true,
          render: (_: any, row: any) => {
            return (
              <div>
                <p className="tableData slice paragraph">{row?.additionalData?.association ? row?.additionalData?.association.map((x: any) => { return x?.type })[i] : ""}</p>
              </div>
            );
          },
        },
        {
          title: `Marker Meta Info ${i + 1}`,
          dataIndex: "meta",
          width: 200,
          minWidth: 200,
          // sorter: true,
          render: (_: any, row: any) => {
            let x = row?.additionalData?.association.map((x: any) => { return x?.metaInfo && Object.keys(x?.metaInfo) })[i]
            let y = row?.additionalData?.association.map((x: any) => { return x?.metaInfo && Object.values(x?.metaInfo) })[i]
            let z: any = ""
            if (x !== undefined && y !== undefined) {
              for (let i = 0; i < x.length; i++) {
                z += x[i] + ':' + y[i] + ','
              }
            }
            return (
              <div>
                <p className="tableData slice paragraph">{z}</p>
              </div>
            );
          },
        }
      ];
      additionalHeader = [...additionalHeader, ...temp];

    }

    for (let i = 0; i < MAXINPUTHEADER; i++) {

      const temp = [
        {

          title: `Add inputkey ${i + 1}`,
          dataIndex: "code",
          width: 150,
          minWidth: 150,
          // sorter: true,
          render: (_: any, row: any) => {
            return (
              <div>
                <p className="tableData slice paragraph">{row?.additionalData?.addInput ? row?.additionalData?.addInput.map((x: any) => { return x?.key })[i] : ""}</p>
              </div>
            );
          },
        },
        {
          title: `Add inputvalue ${i + 1}`,
          dataIndex: "type",
          width: 200,
          minWidth: 200,
          // sorter: true,
          render: (_: any, row: any) => {
            return (
              <div>
                <p className="tableData slice paragraph">{row?.additionalData?.addInput ? row?.additionalData?.addInput.map((x: any) => { return x?.value })[i] : ""}</p>
              </div>
            );
          },
        },

      ];
      additionalHeader = [...additionalHeader, ...temp];

    }

    for (let i = 0; i < MAXENCODEHEADER; i++) {

      const temp = [
        {
          title: `Encoded URL ${i + 1}`,
          dataIndex: "encodedUrl",
          width: 150,
          minWidth: 150,
          // sorter: true,
          render: (_: any, row: any) => {

            return (
              <div>
                <p className="tableData slice paragraph">{row?.additionalData?.encode ? row?.additionalData?.encode.map((x: any) => { return x?.url })[i] : ""}</p>
              </div>
            );
          },
        },
        {
          title: `Encoded CompanyPrefix ${i + 1}`,
          dataIndex: "encodedCp",
          width: 230,
          minWidth: 230,
          // sorter: true,
          render: (_: any, row: any) => {

            return (
              <div>
                <p className="tableData slice paragraph">{row?.additionalData?.encode ? row?.additionalData?.encode.map((x: any) => { return x?.companyPrefix ? x?.companyPrefix : x?.tagId })[i] : ""}</p>
              </div>
            );
          },
        },
        {
          title: `Encoded ItemReference ${i + 1}`,
          dataIndex: "EncodedIr",
          width: 230,
          minWidth: 230,
          // sorter: true,
          render: (_: any, row: any) => {

            return (
              <div>
                <p className="tableData slice paragraph">{row?.additionalData?.encode ? row?.additionalData?.encode.map((x: any) => { return x?.itemReference })[i] : ""}</p>
              </div>
            );
          },
        },

      ];
      additionalHeader = [...additionalHeader, ...temp];

    }

    return additionalHeader
  }


  const UITableColumns: any = [
    {
      title: "Create Date",
      dataIndex: "createdAt",
      sorter: true,
      ...(sort?.sortBy == "createdAt" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 130,
      minWidth: 130,
      render: (field: any) =>
        <p className="tableData slice paragraph">{moment(field).format("DD MMM YY hh.mm A")}</p>
    },
    {
      title: "Tag Id",
      dataIndex: "diId",
      sorter: true,
      ...(sort?.sortBy == "diId" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.diId} placement="top">
              <p className="tableData slice paragraph">{row?.diId}</p>
            </UITooltip>
          </div>
        );
      },
    },
    {
      title: "NFC url",
      dataIndex: "primaryURL",
      sorter: true,
      ...(sort?.sortBy == "primaryURL" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.primaryURL} placement="top">
              <p className="tableData slice paragraph">{row?.primaryURL}</p>
            </UITooltip>
          </div>
        );
      },
    },
    {
      title: "UPC/SKU",
      dataIndex: "productUPC",
      sorter: true,
      ...(sort?.sortBy == "productUPC" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),

      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.productUPC} placement="top">
              <p className="tableData slice paragraph">{row?.productUPC}</p>
            </UITooltip>
          </div>
        );
      },

    },
    {
      title: "Product Description",
      dataIndex: "productDescription",
      sorter: true,
      ...(sort?.sortBy == "productDescription" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 200,
      minWidth: 200,
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.productDescription} placement="top">
              <p className="tableData slice paragraph">{row?.productDescription}</p>
            </UITooltip>
          </div>
        );
      },

    },
    {
      title: "Experience Id",
      dataIndex: "productExperienceId",
      width: 160,
      minWidth: 160,
      sorter: true,
      ...(sort?.sortBy == "productExperienceId" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.productExperienceId} placement="top">
              <p className="tableData slice paragraph">{row?.productExperienceId}</p>
            </UITooltip>
          </div>
        );
      },
    },
    {
      title: "Experience Studio Id",
      dataIndex: "productExperienceStudioId",
      width: 200,
      minWidth: 200,
      sorter: true,
      ...(sort?.sortBy == "productExperienceStudioId" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.productExperienceStudioId} placement="top">
              <p className="tableData slice paragraph">{row?.productExperienceStudioId}</p>
            </UITooltip>
          </div>
        );
      },
    },
    {
      title: "Experience Tenant Id",
      dataIndex: "productExperienceTenantId",
      width: 200,
      minWidth: 200,
      sorter: true,
      ...(sort?.sortBy == "productExperienceTenantId" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.productExperienceTenantId} placement="top">
              <p className="tableData slice paragraph">{row?.productExperienceTenantId}</p>
            </UITooltip>
          </div>
        );
      },
    },
    {
      title: "Site",
      dataIndex: "siteName",
      sorter: true,
      ...(sort?.sortBy == "siteName" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.siteName} placement="top">
              <p className="tableData slice paragraph">{row?.siteName}</p>
            </UITooltip>
          </div>
        );
      },
    },
    {
      title: "Zone",
      dataIndex: "zoneName",
      sorter: true,
      ...(sort?.sortBy == "zoneName" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.zoneName} placement="top">
              <p className="tableData slice paragraph">{row?.zoneName}</p>
            </UITooltip>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      minWidth: 80,
      sorter: true,
      ...(sort?.sortBy == "status" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.status} placement="top">
              <p className="tableData slice paragraph">{row?.status}</p>
            </UITooltip>
          </div>
        );
      },
    },
    {
      title: "User Name",
      dataIndex: "userName",
      width: 100,
      minWidth: 100,
      sorter: true,
      ...(sort?.sortBy == "userName" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.userName} placement="top">
              <p className="tableData slice paragraph">{row?.userName}</p>
            </UITooltip>
          </div>
        );
      },
    },
    {
      title: "Device Name",
      dataIndex: "deviceName",
      width: 130,
      minWidth: 130,
      sorter: true,
      ...(sort?.sortBy == "deviceName" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      render: (_: any, row: any) => {
        return (
          <div>
            <UITooltip title={row?.deviceName} placement="top">
              <p className="tableData slice paragraph">{row?.deviceName}</p>
            </UITooltip>
          </div>
        );
      },
    },
    {
      title: "Operation Timestamp",
      dataIndex: "operationTime",
      width: 200,
      minWidth: 200,
      sorter: true,
      ...(sort?.sortBy == "operationTime" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      render: (field: any) =>
        <p className="tableData slice paragraph">{moment(field).format("DD MMM YY hh.mm A")}</p>
    },
    ...createAdditionalHeader(),
  ];


  const options = [
    { text: "Tag Id", value: "diId" },
    { text: "UPC/SKU", value: "productUPC" },
    { text: "Product Description", value: "productDescription" },
    { text: "Experience Id", value: "productExperienceId" },
    { text: "Experience Studio Id", value: "productExperienceStudioId" },
    { text: "Experience Tenant Id", value: "productExperienceTenantId" },
    { text: "Site", value: "siteName" },
    { text: "Zone", value: "zoneName" },
  ]
  const [columns, setColumns] = useState(UITableColumns);
  const rowSelection = {
    onChange: (selectedRowKeys: any, field: any) => {
      const tag = field.map((x: any) => { return x?.diId })
      setTagId(tag)
      setSelectedCheckbox(selectedRowKeys);
    },
  };


  const getExportFilters = () => {
   return removeEmptyKeys({
      tenantId,
      type: selectedTab,
      field: search?.field,
      value: search?.value,
      processId: process,
      timeZone: TIMEZONE,
      ...(selectedCheckbox.length && {tags: selectedCheckbox}),
      ...((startDate && endDate) && {from: startDate, to: endDate})
    })
  } 

  const ActionButtons = () => {
    return (
      <Row className="diTabs">
        <>
          <Col span={7} md={7} lg={7} xl={7} xxl={7}>
            <UISelectInput
              label="Filter By"
              className="identitiesFilterBy"
              placeholder="Select"
              defaultValue={search?.field}
              name="type"
              optionValue={options}
              onChange={onFilterSelect}
              showSearch
            />
          </Col>
          <Col span={7} md={7} lg={7} xl={7} xxl={7}>
            <Row>
              <Col
                span={7}
                style={{ alignSelf: "center", textAlign: "center" }}
              >
                <span className="valueLabel"> Value:</span>
              </Col>
              <Col span={17}>
                <UISearchInput
                  placeholder="Enter search value"
                  className="custom diInput"
                  search={searchValue}
                  setSearch={setSearchValue}
                />
              </Col>
            </Row>
          </Col>
          <Col span={4} md={5} lg={5} xl={4} xxl={4}>
            <div className="actions align-items-center" data-testid="export-id">
              <div className="actionBtns">
                <Space>
                  <UIIconbutton
                    icon="export"
                    className="uiBtn"
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
                </Space>
              </div>
            </div>
          </Col>
          {selectedTab === "enabled" ?
            <Col span={4}>
              <UIIconbutton
                className="uiBtn"
                type="info"
                size="sm"
                onPress={handleDeenableTag}
                disableBtn={selectedCheckbox?.length == 0}
              >De-enable</UIIconbutton>
            </Col>
            : <></>}
        </>
      </Row>
    );
  };

  return (
    <>
      <section className="title-section">
        <Card className="uicard detailed-top-card" data-testid="cardd-id">
          <Row>
            <Col span={24} style={{ marginBottom: "5px" }}>
              <div className="backButton">
                <Link className="link" to={`${Page.ORGANISATION}/${tenantId}`}>
                  <LeftOutlined className="left-back-button" />
                  <b className="top-back-text">BACK</b>
                </Link>
              </div>
            </Col>
            <Col xl={10} lg={10} md={8} sm={24} xs={24}>
              <div className="d-flex align-items-center">
                <div className="icon">
                  <UIImage src={digitalIcon} text="icon" />
                </div>
                <div className="title">{PageTitle.DIGITTAL_IDENTITIES}</div>
              </div>
            </Col>

            <Col xl={14} lg={14} md={16} sm={24} xs={24}>
              <Row justify="end" gutter={20} className="diProcess">
                <Col>
                  <div className="filter-input DI-filter-input">
                    <UIFilterSelectInput
                      options={processQuery?.data?.result?.rows
                        .filter((x: any) => x?.isFinalized)
                        .map((x: any) => {
                          return {
                            label: x?.name,
                            value: x?.id,
                          };
                        })}
                      defaultValue={process}
                      className="diProcessSelect"
                      prefixIcon={identityIcon}
                      placeholder="Select Process"
                      allowClear={true}
                      onChange={handleProcessChange}
                    />
                  </div>
                </Col>

                <Col>
                  <div className="identityCalendar">
                    <UICalendar
                      params={params}
                      setParams={setParams}
                      handleChange={handleChange}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </section>
      <section className="listing-section">
        <Card className="uicard table diInfo" data-testid="card-id">
          <div className="summary">Enablement summary</div>

          {process ? (
            <section className="enablementSummary">
              {/* Tabs ui starts */}
              <Tabs
                data-testid="tab-id"
                tabBarExtraContent={<ActionButtons />}
                className="identities-tabs tab-container"
                activeKey={selectedTab}
                type="card"
                onChange={onTabChange}
              >
                {/* Enabled Tab UI */}
                <TabPane
                  tab={
                    <span className="image">
                      <img className="tabIcon" src={duplicates} />
                      Enabled(
                      {tagData?.tagCount?.enabled
                        ? tagData?.tagCount?.enabled
                        : "0"}
                      )
                    </span>
                  }
                  key="enabled"
                >
                  <div className="card-body">
                    <EnableTab
                      tableData={tagData?.tableData}
                      handleTableChange={handleTableChange}
                      columns={columns}
                      setColumns={setColumns}
                      pagination={pagination}
                      setPagination={setPagination}
                      loading={loading}
                      rowSelection={rowSelection}
                    />
                  </div>
                </TabPane>

                {/* Enabled Tab UI */}

                {/* Duplicate Tab UI */}

                <TabPane
                  tab={
                    <span className="image">
                      <img className="tabIcon" src={duplicates} />
                      Duplicates(
                      {tagData?.tagCount?.duplicate
                        ? tagData?.tagCount?.duplicate
                        : "0"}
                      )
                    </span>
                  }
                  key="duplicate"
                >
                  <div className="card-body">
                    <EnableTab
                      data-testid="enabled-id"
                      tableData={tagData?.tableData}
                      handleTableChange={handleTableChange}
                      columns={columns}
                      setColumns={setColumns}
                      pagination={pagination}
                      setPagination={setPagination}
                      loading={loading}
                      rowSelection={rowSelection}
                    />
                  </div>
                </TabPane>
                {/* Duplicate Tab UI */}

                {/* De-Enable Tab UI */}

                <TabPane
                  tab={
                    <span className="image">
                      <img className="tabIcon" src={deenable} />
                      De-Enable(
                      {tagData?.tagCount?.deEnabled
                        ? tagData?.tagCount?.deEnabled
                        : "0"}
                      )
                    </span>
                  }
                  key="de-enabled"
                >
                  <div className="card-body">
                    <EnableTab
                      tableData={tagData?.tableData}
                      handleTableChange={handleTableChange}
                      columns={columns}
                      setColumns={setColumns}
                      pagination={pagination}
                      setPagination={setPagination}
                      loading={loading}
                      rowSelection={rowSelection}
                    />
                  </div>
                </TabPane>
                {/* De-Enable Tab UI */}
              </Tabs>
            </section>
          ) : (
            <div className="tablePlaceholder">
              <div className="icon">
                <UIImage src={tableIcon} />
              </div>
              <div className="text">
                Please Choose Process to view Enablement summary
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Export UI modal */}

      <UIExportModal 
      total={exportChunksInfo?.data?.result?.totalCount}
      chunkSize={exportChunksInfo?.data?.result?.chunkSize}
      isModalVisible={isModalVisible}
      filters={getExportFilters()}
      apiEndPoint={apiRoutes.EXPORT_TAGS}
      filename={`Process-${_processName}-tag-data-%s.xlsx`}
      setIsModalVisible={setIsModalVisible}
      title={ModalTitle.EXPORT_ENABLEMENTS}
      />

      {/* Export UI modal */}
    </>
  );
};
export default Identities;