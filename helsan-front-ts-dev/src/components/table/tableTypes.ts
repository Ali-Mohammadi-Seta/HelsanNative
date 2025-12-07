import { Key, ReactNode } from "react";

export type ColumnType<T> = {
  key: string;
  title: React.ReactNode;
  dataIndex?: keyof T | string; // supports nested via dot-path (e.g., "user.email")
  width?: number | string;
  align?: "left" | "center" | "right";
  className?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  defaultSortOrder?: "ascend" | "descend";
  filters?: { text: string; value: string }[];
  onFilter?: (value: string, record: T) => boolean;
};

export type PaginationConfig = {
  current?: number; // 1-based
  pageSize?: number;
  total?: number; // optional; computed from dataSource if missing
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showGoTo?: boolean;
};

export type RowSelection<T> = {
  selectedRowKeys: React.Key[];
  onChange: (selectedKeys: React.Key[], selectedRows: T[]) => void;
  getCheckboxProps?: (record: T) => { disabled?: boolean };
};

export type TableOnChangeArgs = {
  pagination: Required<PaginationConfig>;
  sorter: { columnKey?: string; order?: "ascend" | "descend" };
  filters: Record<string, string | undefined>;
};

export type TableStyleSlots = {
  /** Outer wrapper around everything */
  wrapper?: string;
  /** Scroll container that wraps the table */
  scrollContainer?: string;
  /** <table> element */
  table?: string;

  /** THEAD */
  thead?: string;
  headerRow?: string;
  th?: string;
  thInner?: string; // wrapper inside TH that holds title/sort/filter
  sortButton?: string;
  filterSelect?: string;

  /** TBODY */
  tbody?: string;
  tr?: string;
  td?: string;
  rowCheckbox?: string;

  /** States */
  loadingCell?: string;
  emptyCell?: string;

  /** Pagination wrapper */
  pagination?: string;
  expandButton?: string; // Style for the expand/collapse button
  expandIcon?: string; // Style for the icon within the button
  expandedCell?: string; // Style for the cell containing expanded content
};

export type ExpandableConfig<T> = {
  expandedRowRender: (record: T, index: number) => ReactNode;
  rowExpandable?: (record: T) => boolean;
  expandedRowKeys?: readonly Key[];
  onExpandedRowsChange?: (expandedKeys: readonly Key[]) => void;
  onExpand?: (expanded: boolean, record: T) => void;
  expandIcon?: ReactNode;
};
