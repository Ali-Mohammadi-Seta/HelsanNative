import React, { useMemo, useState } from "react";

type Placement = "left" | "center" | "right";

type PaginationProps = {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showGoTo?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
  className?: string;
  pageButtonClassName?: string;
  activePageButtonClassName?: string;
  navButtonClassName?: string;
  placement?: Placement;
  labels?: {
    itemsPerPage?: string;
    page?: string;
    go?: string;
    goPlaceholder?: string;
    prevAria?: string;
    nextAria?: string;
    dots?: string;
  };
};

const defaultLabels = () => ({
  itemsPerPage: "Items / page",
  go: "Go",
  goPlaceholder: "pg #",
  prev: "‹",
  next: "›",
  prevAria: "Previous page",
  nextAria: "Next page",
  dots: "…",
});

function range(start: number, end: number) {
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function usePageRange(
  totalPages: number,
  currentPage: number,
  siblingCount: number,
  boundaryCount: number,
  dotsSymbol: string
) {
  return useMemo<(number | string)[]>(() => {
    if (totalPages <= 0) return [];

    // If all pages fit without dots, show everything.
    // total buttons we can show without dots = boundaries(2*B) + siblings(2*S) + current(1)
    const maxWithoutDots = boundaryCount * 2 + siblingCount * 2 + 1;
    if (totalPages <= maxWithoutDots) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPages = range(1, Math.min(boundaryCount, totalPages));
    const endPages = range(
      Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
      totalPages
    );

    // Clamp the middle window
    const leftSibling = Math.max(currentPage - siblingCount, boundaryCount + 2);
    const rightSibling = Math.min(
      currentPage + siblingCount,
      totalPages - boundaryCount - 1
    );

    const showLeftDots = leftSibling > boundaryCount + 2;
    const showRightDots = rightSibling < totalPages - boundaryCount - 1;

    const middlePages =
      leftSibling <= rightSibling ? range(leftSibling, rightSibling) : [];

    const pages: (number | string)[] = [
      ...startPages,
      showLeftDots
        ? dotsSymbol
        : // if there is exactly one gap, fill it (avoid duplicate or missing page)
        leftSibling === boundaryCount + 2
        ? boundaryCount + 1
        : null,
      ...middlePages,
      showRightDots
        ? dotsSymbol
        : rightSibling === totalPages - boundaryCount - 1
        ? totalPages - boundaryCount
        : null,
      ...endPages,
    ].filter(Boolean) as (number | string)[];

    // De-dup in case boundaries touch middles
    return pages.filter((v, i, arr) => i === 0 || v !== arr[i - 1]);
  }, [totalPages, currentPage, siblingCount, boundaryCount, dotsSymbol]);
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50, 100],
  showPageSize = true,
  showGoTo = true,
  siblingCount = 1,
  boundaryCount = 1,
  className = "",
  pageButtonClassName,
  activePageButtonClassName,
  navButtonClassName,
  labels: labelsProp,
  placement = "left",
}) => {
  const L = { ...defaultLabels(), ...(labelsProp || {}) };
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pages = usePageRange(
    totalPages,
    currentPage,
    siblingCount,
    boundaryCount,
    L.dots!
  );
  const [gotoValue, setGotoValue] = useState<string>("");

  const go = (p: number) => {
    const page = Math.min(Math.max(1, p), totalPages);
    if (page !== currentPage) onPageChange(page);
  };

  const disabledPrev = currentPage <= 1;
  const disabledNext = currentPage >= totalPages;

  const paginationPalcement: Record<Placement, string> = {
    left: "justify-start",
    right: "justify-end",
    center: "justify-center",
  };

  return (
    <div
      dir="ltr"
      className={`flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between mt-4 ${className}`}
    >
      <div
        className={`w-full flex flex-col sm:flex-row items-center gap-3 ${paginationPalcement[placement]}`}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(currentPage - 1)}
            disabled={disabledPrev}
            className={`min-w-[2.25rem] rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer ${
              navButtonClassName || ""
            } ${
              disabledPrev
                ? "text-gray-400 cursor-not-allowed hover:bg-transparent"
                : ""
            }`}
            aria-label={L.prevAria}
          >
            {L.prev}
          </button>

          <div className="flex items-center gap-1">
            {pages.map((p, idx) =>
              p === L.dots ? (
                <span
                  key={`dots-${idx}`}
                  className="px-2 text-gray-500 select-none"
                >
                  {L.dots}
                </span>
              ) : (
                <button
                  key={p as number}
                  type="button"
                  onClick={() => go(p as number)}
                  className={
                    p === currentPage
                      ? `min-w-[2.25rem] rounded px-2 py-1 text-sm bg-indigo-600 text-white shadow transition cursor-pointer ${
                          activePageButtonClassName || ""
                        }`
                      : `min-w-[2.25rem] rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer ${
                          pageButtonClassName || ""
                        }`
                  }
                  aria-current={p === currentPage ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() => go(currentPage + 1)}
            disabled={disabledNext}
            className={`min-w-[2.25rem] rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer ${
              navButtonClassName || ""
            } ${
              disabledNext
                ? "text-gray-400 cursor-not-allowed hover:bg-transparent"
                : ""
            }`}
            aria-label={L.nextAria}
          >
            {L.next}
          </button>
        </div>

        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <select
              className="rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {`${opt}/${L.itemsPerPage}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {showGoTo && (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const n = parseInt(gotoValue, 10);
              if (!isNaN(n)) go(n);
              setGotoValue("");
            }}
          >
            <input
              type="number"
              min={1}
              max={totalPages}
              value={gotoValue}
              onChange={(e) => setGotoValue(e.target.value)}
              className="w-28 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={L.goPlaceholder}
            />
            <button
              type="submit"
              className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700 transition"
            >
              {L.go}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
