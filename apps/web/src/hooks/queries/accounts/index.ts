import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '@/lib/actions/account';

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const result = await getAccounts();
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};
