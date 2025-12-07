import _ from "lodash";

export const IsEmptyObj = (
  obj: Record<string, any> | null | undefined
): boolean => {
  if (obj === undefined || obj === null || _.isEmpty(obj)) return true;

  return false;
};
