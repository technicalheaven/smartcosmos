import { Card } from "antd";
import {
  ColumnsType,
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from "antd/lib/table/interface";
import { useEffect, useState } from "react";
import { Params, useNavigate, useParams } from "react-router-dom";
import { editDarkIcon, ellipsisIcon } from "../../../assets/icons";
import { Roles } from "../../../config/enum";
import { useGetRoleListQuery } from "../../../redux/services/roleApiSlice";
import { UIDropdown } from "../../common/dropdown";

import { UITable } from "../../common/table";

const UserRoles = () => {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });
  const [sort, setSort] = useState<any>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  let navigate = useNavigate();
  let queryParams: any = {
    page: pagination.current,
    limit: pagination.pageSize,
    ...sort,
  };

  const { data, isSuccess, refetch } = useGetRoleListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log("data", data);

  const [tableData, setTableData] = useState([]);
  interface DataType {
    role: string;
    permissionDescription: string;
  }
  const onRowClick = (row: any) => {
    setSelectedRow(row);

    navigate(`../roles/info/${row?.id}`);
  };
  useEffect(() => {
    if (isSuccess) {
      setTableData(data?.result?.rows);
      setTotal(data?.result?.count);
    }
  }, [isSuccess]);
  interface Params {
    pagination?: TablePaginationConfig;
    sorter?: SorterResult<any> | SorterResult<any>[];
    total?: number;
    sortField?: string;
    sortOrder?: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Role",
      dataIndex: "name",
      width: 15,
      render: (_: any, row: any) => {
        return (
          <div className="clickable" onClick={() => onRowClick(row)}>
            <span className="tableData">{row?.name}</span>
          </div>
        );
      },
    },
    {
      title: "Permission Description",
      dataIndex: "description",
      width: 50,
      render: (_: any, row: any) => {
        return (
          <div className="clickable" onClick={() => onRowClick(row)}>
            <span className="tableData">{row?.description}</span>
          </div>
        );
      },
    },
  ];

  const fetchData = (params: Params = {}) => {
    setLoading(true);
    // refetch();
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
      // pagination: newPagination,
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

  return (
    <section className="listing-section">
      <Card className="uicard table">
        <div className="card-body">
          <UITable
            columns={columns}
            data={tableData}
            pagination={pagination}
            setPagination={setPagination}
            loading={loading}
            handleTableChange={handleTableChange}
            scroll={{ x: 350, y: 500 }}
          ></UITable>
        </div>
      </Card>
    </section>
  );
};

export default UserRoles;
