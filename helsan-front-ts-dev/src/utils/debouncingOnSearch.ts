let filterTimeOut: ReturnType<typeof setTimeout>;

interface DebouncingOnSearchParams {
  value: string;
  dispatch: (action: unknown) => void;
  api: (params: { q: string } & Record<string, unknown>) => unknown;
  otherFilters?: Record<string, unknown>;
}

export const debouncingOnSearchs = ({
  value,
  dispatch,
  api,
  otherFilters = {},
}: DebouncingOnSearchParams): void => {
  clearTimeout(filterTimeOut);
  filterTimeOut = setTimeout(async () => {
    dispatch(api({ q: value, ...otherFilters }));
  }, 1000);
};
