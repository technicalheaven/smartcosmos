import { useEffect, useState } from "react";
import "./style.css";
import {
  Card,
  Row,
  Col,
  Space,
  TablePaginationConfig,
  Form,
  message,
  UploadFile,
} from "antd";
import {
  editDarkIcon,
  // ellipsisIcon,
  productDarkIcon,
  tableIcon,
  addDarkIcon,
} from "../../../assets/icons";
import { UIImage } from "../../common/image";
import { UISearchBar } from "../../common/searchBar";
import { UIbutton, UIIconbutton, UIsecondaryButton } from "../../common/button";
import { ModalTitle, PageTitle, Permission } from "../../../config/enum";
import UploadProductModal from "./uploadProductModal";
import { Link, useParams } from "react-router-dom";
import {
  useGetAllTenantProductsQuery,
  useGetProductExportChunksMutation,
  useUpdateProductByUPCMutation,
} from "../../../redux/services/productApiSlice";
import { UITable } from "../../common/table";
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from "antd/lib/table/interface";
import { UIDropdown } from "../../common/dropdown";
import { UIModal } from "../../common/modal";
import { ProductForm } from "./form";
import { UILoader } from "../../common/loader";
import { apiRoutes, baseURL } from "../../../config/api";
import * as util from "util";
import axios from "axios";
import moment, { duration } from "moment";
import { useSelector } from "react-redux";
import { ViewMetaData } from "./metaData";
import { Page } from "../../../routes/config";
import { EllipsisOutlined, LeftOutlined } from "@ant-design/icons";
import {
  ArrayToPlainObject,
  downloadWithAxios,
  GetPermissions,
  isJsonString,
  removeEmptyKeys,
} from "../../../utils";
import { ReactComponent as EllipsisIcon } from "../../../assets/images/ellipsis.svg";
import UITooltip from "../../common/tooltip";
import { getFilterInfo, setFilterState } from "../../../redux/features/filter/filterSlice";
import { page } from "../../../config/constants";
import { useDispatch } from "react-redux";
import UIExportModal from "../../common/exportModal";

const Products = () => {
  // state variables
  const [search, setSearch] = useState("");
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  const [updateProductModal, setUpdateProductModal] = useState(false);
  const [appendProductModal, setAppendProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [productMetaDataModal, setProductMetaDataModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
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
  const productPermissions = GetPermissions(Permission.Product);
  const [total, setTotal] = useState(0);
  const { tenantId } = useParams();
  const [selectedRow, setSelectedRow] = useState({
    upc: null,
    otherAttributes: null,
  });
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  let queryParams: any = {
    page: pagination.current,
    limit: pagination.pageSize,
    tenantId,
    ...sort,
  };

  if (search?.trim() !== "") queryParams = { ...queryParams, upc: search };

  const { data, isSuccess, refetch, isError } = useGetAllTenantProductsQuery(
    queryParams,
    { refetchOnMountOrArgChange: true }
  );

  const [updateProductByUPC, updateProductInfo] =
    useUpdateProductByUPCMutation();

  const [getExportChunks, exportChunksInfo] = useGetProductExportChunksMutation();


  const onProductEditFormSubmit = (data: any) => {
    setLoader(true);
    console.log(data?.otherAttributes, "#88");

    const otherAttributes = JSON.stringify(
      ArrayToPlainObject(data?.otherAttributes)
    );


    updateProductByUPC({
      ...data,
      tenantId: tenantId,
      upc: selectedRow?.upc,
      otherAttributes,
    });
  };


  const tenantState = useSelector((state: any) => state.tenant);
  const tenantName = tenantState?.name;
  const dateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  const getExportFilters = () => {
    return removeEmptyKeys({
      tenantId,
      search,
    })
  }

  // useEffect : fetching export chunks
  useEffect(() => {
    if (exportChunksInfo?.isSuccess) {
      const totalCount = exportChunksInfo?.data?.result?.totalCount;
      const chunkSize = exportChunksInfo?.data?.result?.chunkSize;
      const qs = new URLSearchParams(getExportFilters()).toString();
      let url = `${baseURL + util.format(apiRoutes.EXPORT_PRODUCTS, tenantId)}`;
      if (qs) url += `?${qs}`;
      const filename = `${tenantName}-products-${dateTime}.xlsx`;
      if (totalCount <= chunkSize) {
        downloadWithAxios(url, filename, setLoading);
      } else {
        setTimeout(() => {
          setLoading(false);
          setIsExportModalVisible(true);
        }, 500)
      }
    }
  }, [exportChunksInfo?.isSuccess]);

  useEffect(() => {
    if (updateProductInfo?.data?.statusCode) {
      const upc = updateProductInfo?.data?.result?.upc;
      message.success(`Product updated successfully for UPC ${upc}`);
      setEditProductModal(false);
      refetch();
      setLoader(false);
    }
  }, [updateProductInfo?.isSuccess, updateProductInfo?.isError]);

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
  const onEditClick = (row: any) => {
    let otherAttributes = isJsonString(row?.otherAttributes)
      ? JSON.parse(row?.otherAttributes)
      : row?.otherAttributes;
    otherAttributes = Object.keys(otherAttributes).map((key) => ({
      key,
      value: otherAttributes[key],
    }));

    if (productPermissions?.isEdit) {
      const formdata = {
        ...row,
        otherAttributes,
      };


      form.setFieldsValue(formdata);
      setSelectedRow(row);
      setEditProductModal(true);
    } else {
      message.error("Permission denied");
    }
  };
  const dispatch = useDispatch();

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

  //table
  const UITableColumns: any = [
    {
      title: "UPC",
      dataIndex: "upc",
      ...(sort?.sortBy == "upc" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      sorter: true,
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.upc}</p></div>
        )
      }
    },
    {
      title: "NAME",
      dataIndex: "name",
      ...(sort?.sortBy == "name" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      sorter: true,
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.name}</p></div>
        )
      }
    },
    {
      title: "SKU",
      dataIndex: "sku",
      ...(sort?.sortBy == "sku" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      sorter: true,
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.sku}</p></div>
        )
      }
    },
    {
      title: "DESCRIPTION",
      sorter: true,
      dataIndex: "description",
      ...(sort?.sortBy == "description" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
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
      title: "EXPERIENCEID",
      sorter: true,
      dataIndex: "experienceId",
      ...(sort?.sortBy == "experienceId" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.experienceId}</p></div>
        )
      }
    },
    {
      title: "EXPERIENCETENANTID",
      sorter: true,
      dataIndex: "experienceTenantId",
      ...(sort?.sortBy == "experienceTenantId" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 170,
      minWidth: 150,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.experienceTenantId}</p></div>
        )
      }
    },
    {
      title: "EXPERIENCESTUIDIOID",
      sorter: true,
      dataIndex: "experienceStudioId",
      ...(sort?.sortBy == "experienceStudioId" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 170,
      minWidth: 150,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.experienceStudioId}</p></div>
        )
      }
    },
    {
      title: "MANUFACTURER",
      sorter: true,
      dataIndex: "manufacturer",
      ...(sort?.sortBy == "manufacturer" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 130,
      minWidth: 110,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.manufacturer}</p></div>
        )
      }
    },
    {
      title: "TYPE",
      sorter: true,
      dataIndex: "type",
      ...(sort?.sortBy == "type" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.type}</p></div>
        )
      }
    },
    {
      title: "CATEGORIES",
      sorter: true,
      dataIndex: "categories",
      ...(sort?.sortBy == "categories" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.categories}</p></div>
        )
      }
    },
    {
      title: "SUBCATEGORIES",
      sorter: true,
      dataIndex: "subCategories",
      ...(sort?.sortBy == "subCategories" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.subCategories}</p></div>
        )
      }
    },
    {
      title: "PRICE",
      sorter: true,
      dataIndex: "price",
      ...(sort?.sortBy == "price" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.price}</p></div>
        )
      }
    },
    {
      title: "COLOR",
      sorter: true,
      dataIndex: "color",
      ...(sort?.sortBy == "color" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.color}</p></div>
        )
      }
    },
    {
      title: "SIZE",
      sorter: true,
      dataIndex: "size",
      ...(sort?.sortBy == "size" && { defaultSortOrder: sort?.sortOrder == 'ASC' ? 'ascend' : sort?.sortOrder == 'DESC' ? 'descend' : "" }),
      width: 100,
      minWidth: 80,
      render: (_: any, row: any) => {
        return (
          <div> <p className="tableData slice paragraph">{row?.size}</p></div>
        )
      }
    },
    {
      width: 30,
      minWidth: 30,
      fixed: "right",
      className: tenantState.status === "Inactive" ? `hideCol` : ``,
      render: (login: any, row: any) => (
        <UIDropdown
          items={[
            {
              label: "Edit",
              key: "1",
              icon: <img src={editDarkIcon} alt="icon" />,
              onClick: () => onEditClick(row),
            },
            {
              type: "divider",
            },
            {
              label: "More",
              key: "2",
              icon: <img src={addDarkIcon} alt="icon" />,
              onClick: () => {
                setSelectedRow(row);
                setProductMetaDataModal(true);
              },
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
    setLoading(false);
  };

  const onUpdateClick = () => {
    if (productPermissions?.isEdit) {
      setFileList([]);
      setUpdateProductModal(true);
    } else {
      message.error("Permisssion denied");
    }
  };
  const onAppendClick = () => {
    if (productPermissions?.isEdit) {
      setFileList([]);
      setAppendProductModal(true);
    } else {
      message.error({
        content: "Permission denied",
        className: "errorMessage",
      });
    }
  };
  const onAddClick = () => {
    if (productPermissions?.isEdit) {
      setFileList([]);
      setAddProductModal(true);
    } else {
      message.error("Permission denied");
    }
  };
  const userInfo = useSelector((state: any) => state.auth)?.user;

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
            <Col xxl={4} xl={5} lg={4} md={24} sm={24} xs={24}>
              <div className="d-flex align-items-center">
                <div className="icon">
                  <UIImage src={productDarkIcon} text="icon" />
                </div>
                <div className="title">
                  {PageTitle.PRODUCTS} ({total})
                </div>
              </div>
            </Col>
            <Col xl={20} lg={20} md={24} sm={24} xs={24}>
              <div className="actions align-items-center">
                <Row className="productRow">
                  <Col className="search-icon-align margin-bottom">
                    {total == 0 && search == "" ? (
                      <></>
                    ) : (
                      <div className="search">
                        <UISearchBar
                          placeholder="Search by upc id"
                          pagination={pagination}
                          setPagination={setPagination}
                          setSearch={setSearch}
                          search={search}
                        />
                      </div>
                    )}
                  </Col>
                  <Col>
                    <div className="actionBtns">
                      <Space>
                        {total != 0 && (
                          <UIIconbutton
                            icon="export"
                            type="info"
                            size="sm"
                            onPress={() => {
                              setLoading(true);
                              getExportChunks(getExportFilters());
                            }}
                            data-testid="addbutton"
                          >
                            EXPORT
                          </UIIconbutton>
                        )}

                        <a
                          href={require("../../../assets/downloads/product_template.xlsx")}
                          download="products.xlsx"
                        >
                          <UIIconbutton
                            icon="download"
                            type="info"
                            size="sm"
                            data-testid="addbutton"
                            disableBtn={tenantState.status === "Inactive"}
                          >
                            PRODUCT TEMPLATE
                          </UIIconbutton>
                        </a>

                        {total == 0 && search == "" ? (
                          <UIIconbutton
                            onPress={() => onAddClick()}
                            icon="plus"
                            type="info"
                            size="sm"
                            data-testid="addbutton"
                            disableBtn={tenantState.status === "Inactive"}
                          >
                            ADD PRODUCTS
                          </UIIconbutton>
                        ) : (
                          <>
                            <UIIconbutton
                              onPress={() => onUpdateClick()}
                              icon="update"
                              type="info"
                              size="sm"
                              data-testid="addbutton"
                              disableBtn={tenantState.status === "Inactive"}
                            >
                              UPDATE PRODUCTS
                            </UIIconbutton>
                            <UIIconbutton
                              onPress={() => onAppendClick()}
                              icon="plus"
                              type="info"
                              size="sm"
                              data-testid="addbutton"
                              disableBtn={tenantState.status === "Inactive"}
                            >
                              APPEND PRODUCTS
                            </UIIconbutton>
                          </>
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
                className="productTable"
                columns={columns}
                setColumns={setColumns}
                data={tableData}
                pagination={pagination}
                setPagination={setPagination}
                loading={loading}
                handleTableChange={handleTableChange}
                scroll={{ x: 3500, y: 500 }}
              />
              :
              !loader ?
                <div className="tablePlaceholder">
                  <div className="icon">
                    <UIImage src={tableIcon} />
                  </div>
                  <div className="text">No Product Data Available</div>
                </div>
                : <></>
            }
          </div>
        </Card>
      </section>
      <UploadProductModal
        title="Add Products"
        visible={addProductModal}
        actionType="ADD"
        page={PageTitle.PRODUCTS}
        refetch={refetch}
        handleCancel={() => {
          setAddProductModal(false);
        }}
        setProductUploadModal={setAddProductModal}
        tenantId={tenantId}
        userId={userInfo?.id}
        fileList={fileList}
        setFileList={setFileList}
      />

      <UploadProductModal
        title="Update Products"
        visible={updateProductModal}
        page={PageTitle.PRODUCTS}
        actionType="UPDATE"
        refetch={refetch}
        handleCancel={() => {
          setUpdateProductModal(false);
        }}
        setProductUploadModal={setUpdateProductModal}
        tenantId={tenantId}
        fileList={fileList}
        setFileList={setFileList}
      />

      <UploadProductModal
        title="Append Products"
        visible={appendProductModal}
        page={PageTitle.PRODUCTS}
        actionType="APPEND"
        refetch={refetch}
        handleCancel={() => {
          setAppendProductModal(false);
        }}
        setProductUploadModal={setAppendProductModal}
        tenantId={tenantId}
        fileList={fileList}
        setFileList={setFileList}
      />

      <UIModal
        // title='Edit Product'
        visible={editProductModal}
        width={600}
        className="editProductModal"
        footer={[
          <Space size={20}>
            <UIsecondaryButton
              onPress={() => {
                setEditProductModal(false);
              }}
              size="sm"
            >
              CANCEL
            </UIsecondaryButton>
            <UIbutton
              onPress={() => {
                form.submit();
              }}
              type="info"
              btnType="submit"
              size="sm"
            >
              SAVE
            </UIbutton>
          </Space>,
        ]}
      >
        {loader && <UILoader />}
        <div className="ant-modal-custom-header">
          <div className="ant-modal-title">Edit Product</div>
          <div className="secondary-text">
            UPC : {form.getFieldValue("upc")}
          </div>
        </div>

        <ProductForm
          onModalSubmit={onProductEditFormSubmit}
          form={form}
          error={error}
          formId="editProduct"
        />
      </UIModal>

      <UIModal
        title="Product MetaData"
        key="productMetadata"
        visible={productMetaDataModal}
        handleCancel={() => {
          setProductMetaDataModal(false);
        }}
        width={600}
        className="productMetaData"
        closable={true}
        footer={[]}
      >
        <ViewMetaData
          json={
            isJsonString(selectedRow?.otherAttributes)
              ? JSON.parse(selectedRow?.otherAttributes ?? "{}")
              : selectedRow?.otherAttributes
          }
        />
      </UIModal>

      {/* Export UI modal */}

      <UIExportModal
        total={exportChunksInfo?.data?.result?.totalCount}
        chunkSize={exportChunksInfo?.data?.result?.chunkSize}
        isModalVisible={isExportModalVisible}
        filters={getExportFilters()}
        apiEndPoint={util.format(apiRoutes.EXPORT_PRODUCTS, tenantId)}
        filename={`${tenantName}-products-${dateTime}-%s.xlsx`}
        setIsModalVisible={setIsExportModalVisible}
        title={ModalTitle.EXPORT_PRODUCTS}
      />

      {/* Export UI modal */}
    </>
  );
};

export default Products;
