export const IsEmptyList = (list: any[] | null | undefined): boolean =>
  !Array.isArray(list) || list.length === 0;
