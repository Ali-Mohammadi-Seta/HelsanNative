export const getValueByPath = (obj: any, path?: string | number | symbol) => {
  if (!path && path !== 0) return undefined;
  if (typeof path !== "string") return obj?.[path as any];
  return path.split(".").reduce((acc: any, key: string) => acc?.[key], obj);
};