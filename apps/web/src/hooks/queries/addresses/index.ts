import { useQuery } from '@tanstack/react-query';
import { getAddresses } from '@/lib/actions/address';

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const result = await getAddresses();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};
