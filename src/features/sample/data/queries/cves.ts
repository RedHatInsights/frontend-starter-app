import { useQuery } from '@tanstack/react-query';
import { useAppServices } from '../../../../shared/ServiceContext';

export function useCVEs(perPage = 10) {
  const { fetchCVEs } = useAppServices();
  return useQuery({
    queryKey: ['cves', perPage],
    queryFn: () => fetchCVEs({ per_page: perPage }),
  });
}
