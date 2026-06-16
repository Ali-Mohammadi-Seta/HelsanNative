import { useDirection } from './useDirection';

export const useRTL = () => {
  const { isRTL, dir } = useDirection();
  return { isRTL, dir };
};
