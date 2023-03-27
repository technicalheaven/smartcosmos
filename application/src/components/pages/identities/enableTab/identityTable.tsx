import { TablePaginationConfig } from "antd";
import {
  ColumnsType,
  FilterValue,
  SorterResult,
} from "antd/lib/table/interface";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { UITable } from "../../../common/table";

export const EnableTab = (props: any) => {
  const {
    tableData,
    handleTableChange,
    // getSiteById,
    // getZoneById,
    columns,
    setColumns,
    pagination,
    setPagination,
    loading,
    rowSelection,
  } = props;
  const [sort, setSort] = useState<any>({});
  const [total, setTotal] = useState(0);
  return (
    <>
      <UITable
        checkbox={{
          ...rowSelection,
        }}
        data-testid="table-id"
        columns={columns}
        setColumns={setColumns}
        data={tableData}
        pagination={pagination}
        setPagination={setPagination}
        loading={loading}
        handleTableChange={handleTableChange}
        scroll={{ x: 1400, y: 500 }}
        className="DITable"
      ></UITable>
    </>
  );
};
