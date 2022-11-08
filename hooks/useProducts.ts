
import useSWR, { type SWRConfiguration } from 'swr';
import type { IProduct } from '@interfaces';


export const useProducts = (url: string, config: SWRConfiguration = {}) => {
    const { data, error } = useSWR<IProduct[]>(`/api/${url}`, config);

    return {
        products: data || [],
        isLoading: !error && !data,
        isError: error,
    };
}