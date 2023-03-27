import { Table } from 'antd';
import './style.css';
import { Resizable } from 'react-resizable';
import type { ResizeCallbackData } from 'react-resizable';

const ResizableTitle = (
  props: React.HTMLAttributes<any> & {
    onResize: (e: React.SyntheticEvent<Element>, data: ResizeCallbackData) => void;
    width: number;
    minWidth: number;
  },
) => {
  const { onResize, width, minWidth, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      minConstraints={[minWidth, 0]}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};



const UITable = ({columns, setColumns, data, pagination, loading, scroll, handleTableChange, className,checkbox=false}:any) => {

  const handleResize: Function =
    (index: number) => (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
      const newColumns = [...columns];
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      };
      setColumns(newColumns);
    };

  const mergeColumns: any = columns.map((col:any, index:any) => ({
    ...col,
    onHeaderCell: (column: any) => ({
      width: column.width,
      minWidth: column.minWidth,
      onResize: handleResize(index) as React.ReactEventHandler<any>,
    }),
  }));

 
  return (
    <Table
      // bordered
      components={{
        header: {
          cell: ResizableTitle,
        },
      }}
      rowSelection={checkbox}
      columns={mergeColumns}
      dataSource={data}
      pagination={{...pagination,  showSizeChanger: true}}
      loading={loading}
      onChange={handleTableChange}
      className={className?`uitable ${className}`:"uitable"}
      scroll={scroll}
    />

  );
};

export { UITable };
