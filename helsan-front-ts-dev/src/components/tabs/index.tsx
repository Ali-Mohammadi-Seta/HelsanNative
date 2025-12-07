import {
  FC,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";

type TabItem = {
  title: ReactNode;
  key: string;
  children: ReactNode;
  icon?: ReactNode;
};

interface ICustomTabsProps {
  wrapperClassname?: string;
  tabBarClassName?: string;
  contentClassName?: string;
  activeTabClassName?: string;
  titleClassName?: string;
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  position?: "top" | "left" | "right";
}

const MORE_BUTTON_KEY = "custom-tabs-more-button";

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

// --- Dropdown Portal Component ---
const DropdownPortal: FC<{
  buttonRef: React.RefObject<HTMLElement | null>;
  position: "top" | "left" | "right";
  onClose: () => void;
  children: ReactNode;
}> = ({ buttonRef, position, onClose, children }) => {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    let newStyle: React.CSSProperties = { position: "fixed" };

    if (position === "top") {
      newStyle.top = `${rect.bottom + 8}px`;
      newStyle.right = `${window.innerWidth - rect.right - 100}px`;
    } else if (position === "right") {
      newStyle.top = `${rect.top}px`;
      newStyle.right = `${window.innerWidth - rect.left + 8}px`;
    } else {
      // 'left'
      newStyle.top = `${rect.top}px`;
      newStyle.left = `${rect.right + 8}px`;
    }

    setStyle(newStyle);
  }, [buttonRef, position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, buttonRef]);

  return createPortal(
    <ul
      ref={dropdownRef}
      style={style}
      className="z-50 min-w-[160px] max-h-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 overflow-y-auto hover-scrollbar"
      role="menu"
    >
      {children}
    </ul>,
    document.body
  );
};

const CustomTabs: FC<ICustomTabsProps> = ({
  wrapperClassname,
  items,
  activeKey,
  onChange,
  tabBarClassName,
  contentClassName,
  activeTabClassName,
  titleClassName,
  position = "top",
}) => {
  const isHorizontal = position === "top";

  const [visibleItems, setVisibleItems] = useState<TabItem[]>(items);
  const [overflowItems, setOverflowItems] = useState<TabItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tabBarRef = useRef<HTMLDivElement | null>(null);
  const moreButtonRef = useRef<HTMLElement | null>(null);
  const measureMoreButtonRef = useRef<HTMLLIElement | null>(null);

  const measurementItemRefs = useRef(new Map<string, HTMLLIElement>());
  const visibleTabRefs = useRef(new Map<string, HTMLButtonElement>());

  const selectedTab = useMemo(
    () => items.find((i) => i.key === activeKey),
    [items, activeKey]
  );

  const calculateOverflow = useCallback(() => {
    const tabBar = tabBarRef.current;
    if (!tabBar) return;

    const containerSize = isHorizontal
      ? tabBar.clientWidth
      : tabBar.clientHeight;
    const moreButtonSize = isHorizontal
      ? measureMoreButtonRef.current?.offsetWidth || 50
      : measureMoreButtonRef.current?.offsetHeight || 40;

    let accumulatedSize = 0;
    let splitIndex = items.length;

    const totalSize = items.reduce((acc, item) => {
      const itemElement = measurementItemRefs.current.get(item.key);
      return (
        acc +
        (itemElement
          ? isHorizontal
            ? itemElement.offsetWidth
            : itemElement.offsetHeight
          : 0)
      );
    }, 0);

    if (totalSize > containerSize) {
      const availableSize = containerSize - moreButtonSize;
      for (let i = 0; i < items.length; i++) {
        const itemElement = measurementItemRefs.current.get(items[i].key);
        if (!itemElement) continue;

        accumulatedSize += isHorizontal
          ? itemElement.offsetWidth
          : itemElement.offsetHeight;
        if (accumulatedSize > availableSize) {
          splitIndex = i - 1;
          break;
        }
      }
    }

    setVisibleItems(items.slice(0, splitIndex));
    setOverflowItems(items.slice(splitIndex));
  }, [items, isHorizontal]);

  useLayoutEffect(() => {
    calculateOverflow();
    const observer = new ResizeObserver(calculateOverflow);
    if (tabBarRef.current) observer.observe(tabBarRef.current);
    return () => observer.disconnect();
  }, [items, position, calculateOverflow]);

  useEffect(() => {
    const el = visibleTabRefs.current.get(activeKey);
    if (!el) return;
    el.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [activeKey, visibleItems]);

  const isMoreButtonActive = useMemo(
    () => overflowItems.some((item) => item.key === activeKey),
    [overflowItems, activeKey]
  );

  const wrapperLayout =
    position === "top"
      ? "flex flex-col"
      : position === "left"
      ? "flex flex-row-reverse"
      : "flex flex-row";
  const listAxis =
    position === "top"
      ? "flex-row items-center gap-3"
      : "flex-col items-stretch gap-2";

  const renderTabButton = (item: TabItem, isDropdownItem = false) => {
    const isActive = item.key === activeKey;
    return (
      <button
        ref={(node) => {
          if (node && !isDropdownItem)
            visibleTabRefs.current.set(item.key, node);
        }}
        role="tab"
        aria-selected={isActive}
        onClick={() => {
          onChange(item.key);
          if (isDropdownItem) setIsDropdownOpen(false);
        }}
        className={cn(
          "flex items-center gap-2 w-full justify-between",
          position === "top"
            ? "px-3 py-2"
            : position === "right"
            ? "px-3 py-2 justify-start"
            : "justify-end px-3 py-2",
          isDropdownItem ? "text-left px-4 py-2" : "rounded-xl cursor-pointer",
          titleClassName,
          isActive
            ? `bg-slate-200 shadow-inner ${activeTabClassName || ""}`
            : "hover:bg-gray-50"
        )}
      >
        {item.icon && <span className="inline-flex">{item.icon}</span>}
        {item.title}
      </button>
    );
  };

  const moreButtonComponent = (
    <div
      ref={moreButtonRef as React.Ref<HTMLDivElement>}
      className="relative"
      data-key={MORE_BUTTON_KEY}
    >
      <button
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2 w-full",
          position === "top"
            ? "px-3 py-2"
            : position === "right"
            ? "px-3 py-2 justify-start"
            : "justify-end px-3 py-2",
          "rounded-xl cursor-pointer",
          titleClassName,
          isMoreButtonActive || isDropdownOpen
            ? `bg-slate-200 shadow-inner ${activeTabClassName || ""}`
            : "hover:bg-gray-50"
        )}
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        More
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );

  return (
    <>
      <div className={cn(wrapperLayout, wrapperClassname)}>
        {/* Hidden container for measurement ONLY */}
        <div
          className="absolute top-0 left-0 -z-10 opacity-0 pointer-events-none"
          aria-hidden="true"
        >
          <ul className={cn("flex", listAxis)}>
            {items.map((item) => (
              <li
                key={item.key}
                ref={(node) => {
                  if (node) measurementItemRefs.current.set(item.key, node);
                }}
                className={cn(
                  "select-none rounded-xl",
                  position === "top" && "whitespace-nowrap"
                )}
              >
                <button
                  className={cn(
                    "flex items-center gap-2 w-full",
                    position === "top" ? "px-3 py-2" : "px-3 py-2"
                  )}
                >
                  {item.icon && <span>ICON</span>}
                  <span>{item.title}</span>
                </button>
              </li>
            ))}
            <li
              ref={measureMoreButtonRef}
              className={cn(
                "relative select-none rounded-xl",
                position === "top" ? "whitespace-nowrap" : "w-full"
              )}
            >
              <button
                className={cn("flex items-center gap-2 w-full px-3 py-2")}
              >
                More
              </button>
            </li>
          </ul>
        </div>

        {/* VISIBLE tab bar */}
        <div
          ref={tabBarRef}
          className={cn(
            "relative bg-white shadow-2xl rounded-xl",
            isHorizontal ? "w-full p-2" : "shrink-0 p-2 flex flex-col",
            tabBarClassName
          )}
          role="tablist"
          aria-orientation={isHorizontal ? "horizontal" : "vertical"}
        >
          {isHorizontal ? (
            <ul
              className={cn("flex overflow-x-auto hover-scrollbar", listAxis)}
            >
              {visibleItems.map((item) => (
                <li
                  key={item.key}
                  className="select-none rounded-xl whitespace-nowrap"
                  title={
                    typeof item.title === "string" ? item.title : undefined
                  }
                >
                  {renderTabButton(item)}
                </li>
              ))}
              {overflowItems.length > 0 && (
                <li
                  ref={moreButtonRef as React.Ref<HTMLLIElement>}
                  className="relative select-none rounded-xl whitespace-nowrap"
                >
                  {moreButtonComponent}
                </li>
              )}
            </ul>
          ) : (
            <>
              <ul
                className={cn(
                  "flex flex-1 overflow-y-auto hover-scrollbar",
                  listAxis
                )}
              >
                {visibleItems.map((item) => (
                  <li
                    key={item.key}
                    className="select-none rounded-xl"
                    title={
                      typeof item.title === "string" ? item.title : undefined
                    }
                  >
                    {renderTabButton(item)}
                  </li>
                ))}
              </ul>
              {overflowItems.length > 0 && (
                <div className="pt-2 shrink-0">{moreButtonComponent}</div>
              )}
            </>
          )}
        </div>

        {/* CONTENT */}
        <div
          className={cn(
            contentClassName,
            position === "top" ? "mt-3" : position === "left" ? "me-3" : "ms-3"
          )}
          role="tabpanel"
        >
          {selectedTab?.children}
        </div>
      </div>

      {isDropdownOpen && overflowItems.length > 0 && (
        <DropdownPortal
          buttonRef={moreButtonRef}
          position={position}
          onClose={() => setIsDropdownOpen(false)}
        >
          {overflowItems.map((item) => (
            <li
              key={item.key}
              title={typeof item.title === "string" ? item.title : undefined}
            >
              {renderTabButton(item, true)}
            </li>
          ))}
        </DropdownPortal>
      )}
    </>
  );
};

export default CustomTabs;
