import React, {
  useMemo,
  useState,
  useEffect,
  ReactNode,
  Fragment,
} from "react";
import { Pagination } from "../pagination";
import { getValueByPath } from "./utils/getValueByPath";
import { defaultCompare } from "./utils/defaultCompare";
import { cn } from "./utils/cn";
import { defaultStyles } from "./utils/defaultStyles";
import { getHoverClass } from "./utils/getHoverClass";
import {
  ColumnType,
  ExpandableConfig,
  PaginationConfig,
  RowSelection,
  TableOnChangeArgs,
  TableStyleSlots,
} from "./tableTypes";

/* ============ Scroll config (Antd-like) ============ */
type ScrollConfig = {
  /** horizontal scroll: number (px), string (e.g. '100vw' or 'max-content'), or true */
  x?: number | string | true;
  /** vertical scroll: number (px) or string (e.g. '60vh') */
  y?: number | string;
};

export type TableProps<T> = {
  columns: ColumnType<T>[];
  dataSource: T[];
  rowKey?: keyof T | ((record: T) => React.Key);

  /** Behavior */
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  hoverColor?: "gray" | "cyan" | "blue" | "green" | "purple" | "pink";
  hoverClassName?: string;
  stickyHeader?: boolean;
  loading?: boolean;
  loadingText?: ReactNode;
  emptyText?: string;
  pagination?: PaginationConfig | false;
  rowSelection?: RowSelection<T>;
  expandable?: ExpandableConfig<T>;
  size?: "sm" | "md" | "lg";
  scroll?: ScrollConfig; // 🔥 NEW

  /** Callbacks */
  onChange?: (args: TableOnChangeArgs) => void;

  /** ClassName slots for full control */
  styles?: TableStyleSlots;
};

/* ======================== Component ======================== */
export default function Table<T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey,
  bordered = true,
  striped = false,
  hoverable = true,
  hoverColor = "cyan",
  hoverClassName,
  stickyHeader = false,
  loading = false,
  loadingText,
  emptyText,
  pagination = {
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: [5, 10, 20, 50],
  },
  rowSelection,
  expandable,
  size = "md",
  onChange,
  styles = {},
  scroll,
}: TableProps<T>) {
  const S = { ...defaultStyles, ...styles };

  // ... (filters, sorter, pagination states remain the same)
  const [filters, setFilters] = useState<Record<string, string | undefined>>(
    {}
  );

  const defaultSort = useMemo(() => {
    const col = columns.find((c) => c.defaultSortOrder);
    return {
      columnKey: col?.key,
      order: col?.defaultSortOrder as "ascend" | "descend" | undefined,
    };
  }, [columns]);

  const [sorter, setSorter] = useState<{
    columnKey?: string;
    order?: "ascend" | "descend";
  }>(defaultSort);

  const initialPg: Required<PaginationConfig> = {
    current: pagination && (pagination.current || 1),
    pageSize: pagination && (pagination.pageSize || 10),
    total: pagination && (pagination.total || dataSource.length),
    showSizeChanger: !!(pagination && pagination.showSizeChanger !== false),
    showGoTo: !!(pagination && pagination.showGoTo !== false),
    pageSizeOptions:
      pagination && (pagination.pageSizeOptions || [5, 10, 20, 50]),
  } as Required<PaginationConfig>;

  const [page, setPage] = useState(initialPg.current);
  const [pageSize, setPageSize] = useState(initialPg.pageSize);

  const [internalExpandedKeys, setInternalExpandedKeys] = useState<React.Key[]>(
    []
  );

  const isExpansionControlled = expandable?.expandedRowKeys !== undefined;
  const expandedRowKeys = isExpansionControlled
    ? expandable.expandedRowKeys!
    : internalExpandedKeys;

  useEffect(() => {
    if (pagination !== false) {
      setPage((p) =>
        Math.min(p, Math.max(1, Math.ceil(dataSource.length / pageSize)))
      );
    }
  }, [dataSource.length, pageSize, pagination]);

  const processed = useMemo(() => {
    // ... (filtering and sorting logic remains the same)
    let rows = [...dataSource];
    for (const col of columns) {
      const val = filters[col.key];
      if (val && (col.onFilter || col.dataIndex)) {
        const predicate = col.onFilter
          ? (r: T) => col.onFilter!(val, r)
          : (r: T) =>
              String(getValueByPath(r, col.dataIndex as any)) === String(val);
        rows = rows.filter(predicate);
      }
    }
    if (sorter.columnKey && sorter.order) {
      const col = columns.find((c) => c.key === sorter.columnKey);
      if (col) {
        const cmp: (a: T, b: T) => number =
          typeof col.sorter === "function"
            ? (col.sorter as (a: T, b: T) => number)
            : (a: T, b: T) =>
                defaultCompare(
                  getValueByPath(a, col.dataIndex as any),
                  getValueByPath(b, col.dataIndex as any)
                );
        rows.sort((a, b) =>
          sorter.order === "ascend" ? cmp(a, b) : -cmp(a, b)
        );
      }
    }
    return rows;
  }, [dataSource, columns, filters, sorter]);

  const total = processed.length;

  const paged = useMemo(() => {
    if (pagination === false) return processed;
    const start = (page - 1) * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, pagination, page, pageSize]);

  useEffect(() => {
    onChange?.({
      pagination: {
        current: page,
        pageSize,
        total,
        showGoTo: !!(pagination && initialPg.showGoTo),
        showSizeChanger: !!(pagination && initialPg.showSizeChanger),
        pageSizeOptions: initialPg.pageSizeOptions,
      },
      sorter,
      filters,
    });
  }, [page, pageSize, total, sorter, filters, onChange, initialPg, pagination]);

  const getKey = (record: T, idx: number): React.Key => {
    if (typeof rowKey === "function") return rowKey(record);
    if (rowKey) return record[rowKey as keyof T] as React.Key;
    return (record as any).id ?? (record as any)._id ?? idx;
  };

  // ✅ NEW: Handle row expansion toggle
  const handleExpand = (record: T) => {
    const key = getKey(record, -1); // index doesn't matter here
    const isExpanded = expandedRowKeys.includes(key);
    const nextKeys = isExpanded
      ? expandedRowKeys.filter((k) => k !== key)
      : [...expandedRowKeys, key];

    expandable?.onExpand?.(!isExpanded, record);

    if (isExpansionControlled) {
      expandable.onExpandedRowsChange?.(nextKeys);
    } else {
      setInternalExpandedKeys(nextKeys);
    }
  };

  const sizePad =
    size === "sm"
      ? "py-2 px-3 text-sm"
      : size === "lg"
      ? "py-4 px-5 text-base"
      : "py-3 px-4 text-sm";

  const totalColSpan =
    columns.length + (rowSelection ? 1 : 0) + (expandable ? 1 : 0);

  /* ======================== Scroll handling (Antd-like) ======================== */
  const scrollX = scroll?.x;
  const scrollY = scroll?.y;

  const scrollContainerStyle: React.CSSProperties = {};

  if (scrollX) {
    scrollContainerStyle.overflowX = "auto";
  }
  if (scrollY) {
    scrollContainerStyle.overflowY = "auto";
    scrollContainerStyle.maxHeight =
      typeof scrollY === "number" ? `${scrollY}px` : scrollY;
  } else if (stickyHeader) {
    // existing stickyHeader behavior if no explicit scroll.y
    scrollContainerStyle.maxHeight = "60vh";
    scrollContainerStyle.overflowY = "auto";
  }

  const tableStyle: React.CSSProperties = {};
  if (scrollX) {
    if (scrollX === true) {
      // let content define width but allow horizontal scroll
      tableStyle.minWidth = "100%";
    } else {
      const v = typeof scrollX === "number" ? `${scrollX}px` : scrollX;
      tableStyle.width = v;
    }
  }

  /* ======================== Render ======================== */
  return (
    <div className={S.wrapper}>
      <div
        className={cn(
          S.scrollContainer,
          bordered && "ring-1",
          "relative"
          // stickyHeader && "max-h-[60vh]" // now handled in style when no scroll.y
        )}
        style={scrollContainerStyle}
      >
        <table className={S.table} style={tableStyle}>
          <thead
            className={cn(
              S.thead,
              stickyHeader ? "sticky top-0 z-10" : undefined
            )}
          >
            <tr className={S.headerRow}>
              {expandable && <th className={cn(sizePad, S.th, "w-12")} />}

              {rowSelection && (
                <th className={cn(sizePad, S.th, "text-right")}>
                  <input
                    type="checkbox"
                    className={S.rowCheckbox}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const keys = paged.map((r, i) => getKey(r, i));
                        const rows = paged;
                        rowSelection.onChange(keys, rows);
                      } else {
                        rowSelection.onChange([], []);
                      }
                    }}
                    checked={
                      rowSelection.selectedRowKeys.length > 0 &&
                      paged.length > 0 &&
                      paged.every((r, i) =>
                        rowSelection.selectedRowKeys.includes(getKey(r, i))
                      )
                    }
                    aria-label="Select page rows"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sorter.columnKey === col.key;
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={cn(
                      sizePad,
                      S.th,
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      col.className
                    )}
                    scope="col"
                  >
                    <div className={S.thInner}>
                      <span>{col.title}</span>
                      {col.filters && (
                        <select
                          className={S.filterSelect}
                          value={filters[col.key] || ""}
                          onChange={(e) => {
                            const v = e.target.value || undefined;
                            setFilters((prev) => ({ ...prev, [col.key]: v }));
                            setPage(1);
                          }}
                          aria-label={`Filter ${col.key}`}
                        >
                          <option value="">All</option>
                          {col.filters.map((f) => (
                            <option key={f.value} value={f.value}>
                              {f.text}
                            </option>
                          ))}
                        </select>
                      )}
                      {col.sorter && (
                        <button
                          type="button"
                          className={S.sortButton}
                          onClick={() => {
                            setPage(1);
                            setSorter((prev) => {
                              if (prev.columnKey !== col.key)
                                return { columnKey: col.key, order: "ascend" };
                              if (prev.order === "ascend")
                                return { columnKey: col.key, order: "descend" };
                              return { columnKey: undefined, order: undefined };
                            });
                          }}
                          aria-label={`Sort ${col.key}`}
                          title={
                            !isSorted || !sorter.order
                              ? "Sort ascending"
                              : sorter.order === "ascend"
                              ? "Sort descending"
                              : "Clear sort"
                          }
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className={cn(
                              "h-4 w-4 transition-opacity duration-200",
                              isSorted && sorter.order === "ascend"
                                ? "opacity-100"
                                : "opacity-40"
                            )}
                            aria-hidden
                          >
                            <path
                              d="M7 14l5-5 5 5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <svg
                            viewBox="0 0 24 24"
                            className={cn(
                              "h-4 w-4 -mt-1 transition-opacity duration-200",
                              isSorted && sorter.order === "descend"
                                ? "opacity-100"
                                : "opacity-40"
                            )}
                            aria-hidden
                          >
                            <path
                              d="M7 10l5 5 5-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className={S.tbody}>
            {loading ? (
              <tr>
                <td
                  colSpan={totalColSpan}
                  className={cn(sizePad, S.loadingCell)}
                >
                  {loadingText ? (
                    loadingText
                  ) : (
                    <span className="flex justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="status"
                        aria-live="polite"
                        className="animate-spin text-blue-400"
                      >
                        <title>Loading...</title>
                        <path
                          d="M12 2.75C17.108 2.75 21.25 6.892 21.25 12C21.25 17.108 17.108 21.25 12 21.25C6.892 21.25 2.75 17.108 2.75 12C2.75 9.15228 3.94935 6.59383 5.75 4.75"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={totalColSpan} className={cn(sizePad, S.emptyCell)}>
                  {emptyText ? emptyText : "No Data"}
                </td>
              </tr>
            ) : (
              paged.map((record, rowIndex) => {
                const key = getKey(record, rowIndex);
                const isSelected =
                  rowSelection?.selectedRowKeys.includes(key) ?? false;

                const isExpanded = expandedRowKeys.includes(key);
                const isExpandable =
                  expandable?.rowExpandable?.(record) ?? true;

                return (
                  <Fragment key={String(key)}>
                    <tr
                      className={cn(
                        S.tr,
                        "transition-colors duration-200 ease-in-out",
                        getHoverClass(hoverable, hoverClassName!, hoverColor),
                        striped && rowIndex % 2 === 1
                          ? "bg-zinc-50/40 dark:bg-zinc-900/40"
                          : "bg-transparent",
                        isSelected && "bg-indigo-50/60 dark:bg-indigo-900/20",
                        isExpanded && "border-b-0"
                      )}
                    >
                      {expandable && (
                        <td className={cn(sizePad, S.td)}>
                          {isExpandable && (
                            <button
                              type="button"
                              onClick={() => handleExpand(record)}
                              className={S.expandButton}
                              aria-expanded={isExpanded}
                              aria-label={
                                isExpanded ? "Collapse row" : "Expand row"
                              }
                            >
                              {expandable.expandIcon ? (
                                expandable.expandIcon
                              ) : (
                                <svg
                                  viewBox="0 0 24 24"
                                  className={cn(
                                    S.expandIcon,
                                    isExpanded && "rotate-90"
                                  )}
                                >
                                  <path
                                    d="m9 18 6-6-6-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </button>
                          )}
                        </td>
                      )}

                      {rowSelection && (
                        <td className={cn(sizePad, S.td)}>
                          <input
                            type="checkbox"
                            className={S.rowCheckbox}
                            checked={isSelected}
                            onChange={(e) => {
                              const next = new Set(
                                rowSelection.selectedRowKeys
                              );
                              if (e.target.checked) next.add(key);
                              else next.delete(key);
                              const nextKeys = Array.from(next);
                              const selectedRows = processed.filter((r, i) =>
                                nextKeys.includes(getKey(r, i))
                              );
                              rowSelection.onChange(
                                nextKeys,
                                selectedRows as T[]
                              );
                            }}
                            aria-label="Select row"
                          />
                        </td>
                      )}

                      {columns.map((col, colIndex) => {
                        const raw = getValueByPath(
                          record,
                          col.dataIndex as any
                        );
                        const content = col.render
                          ? col.render(raw, record, rowIndex)
                          : raw ?? "-";
                        return (
                          <td
                            key={`${String(key)}-${col.key}-${colIndex}`}
                            style={{ width: col.width }}
                            className={cn(
                              sizePad,
                              S.td,
                              col.align === "center" && "text-center",
                              col.align === "right" && "text-right"
                            )}
                          >
                            {content}
                          </td>
                        );
                      })}
                    </tr>

                    {isExpanded && expandable && (
                      <tr className="transition-all duration-300">
                        <td
                          colSpan={totalColSpan}
                          className={cn(S.expandedCell)}
                        >
                          {expandable.expandedRowRender(record, rowIndex)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination !== false && (
        <div className={S.pagination}>
          <Pagination
            totalItems={total}
            currentPage={page}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
            pageSizeOptions={initialPg.pageSizeOptions}
            showPageSize={initialPg.showSizeChanger}
            showGoTo={initialPg.showGoTo}
            placement="right"
          />
        </div>
      )}
    </div>
  );
}
