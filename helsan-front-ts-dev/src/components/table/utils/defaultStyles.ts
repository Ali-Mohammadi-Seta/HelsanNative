import { TableStyleSlots } from "../tableTypes";

export const defaultStyles: Required<TableStyleSlots> = {
  /* Layout */
  wrapper: "w-full",
  scrollContainer: "overflow-auto rounded-xl ring-1 ring-gray-200 bg-white",
  table: "min-w-full border-collapse",

  /* Header */
  thead: "bg-white",
  headerRow: "divide-x divide-gray-200",
  th: "whitespace-nowrap font-semibold text-gray-700 border-b border-gray-200",
  thInner: "flex items-center gap-2",
  sortButton:
    "ml-0.5 inline-flex flex-col rounded-md p-1 hover:bg-gray-100 transition",
  filterSelect:
    "ml-auto rounded-md border border-gray-300 bg-white text-sm px-2 py-1",

  /* Body */
  tbody: "divide-y divide-gray-200",
  tr: "",
  td: "text-gray-800",
  rowCheckbox: "h-4 w-4 rounded border-gray-300",

  /* States */
  loadingCell: "text-center text-gray-500",
  emptyCell: "text-center text-gray-500",

  /* Footer */
  pagination: "mt-4",
  expandButton:
    "flex items-center justify-center rounded-full p-1 text-zinc-500 dark:text-zinc-400 cursor-pointer",
  expandIcon: "h-4 w-4 transition-transform duration-200",
  expandedCell: "bg-zinc-50 dark:bg-zinc-900/50 p-4",
};
