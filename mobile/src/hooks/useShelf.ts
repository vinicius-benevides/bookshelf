import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shelfApi } from '../services/endpoints';
import { BookStatus, ShelfEntry } from '../types/api';

export const useShelf = () => {
  const fetchShelf = async (): Promise<ShelfEntry[]> => {
    const { data } = await shelfApi.list();
    return data;
  };

  return useQuery({ queryKey: ['shelf'], queryFn: fetchShelf });
};

export const useShelfStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, status }: { bookId: string; status: BookStatus }) => shelfApi.updateStatus(bookId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['shelf'] });
    },
  });
};

export const useShelfRemove = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => shelfApi.remove(bookId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['shelf'] });
    },
  });
};
