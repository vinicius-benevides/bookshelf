import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { booksApi, shelfApi } from '../services/endpoints';
import { Book } from '../types/api';

export const useBooks = (search?: string, sort?: 'date' | 'title' | 'rating') => {
  const fetchBooks = async (): Promise<Book[]> => {
    const { data } = await booksApi.list(search, sort);
    return data;
  };

  const query = useQuery({ queryKey: ['books', search, sort], queryFn: fetchBooks });
  return query;
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: booksApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useAddToShelf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: string) => shelfApi.add(bookId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['shelf'] });
      void queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
