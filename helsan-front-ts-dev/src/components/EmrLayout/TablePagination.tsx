import React from 'react';
import { Table, TableProps } from 'antd';

interface TablePaginationProps<T> {
  columns: TableProps<T>['columns'];
  dataSource: T[];
}

function TablePagination<T extends { key?: React.Key }>({
  columns,
  dataSource,
}: TablePaginationProps<T>) {
  return (
    <Table<T>
      className="overflow"
      bordered={false}
      pagination={false}
      columns={columns}
      dataSource={dataSource}
    />
  );
}

export default TablePagination;
