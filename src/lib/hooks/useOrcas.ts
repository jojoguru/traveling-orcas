'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Orca } from '@/lib/supabase/types';
import { useStore } from '@/lib/store/useStore';

async function fetchOrcas(): Promise<Orca[]> {
  const response = await fetch('/api/orcas');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch orcas');
  }
  return response.json();
}

async function createOrca(name: string): Promise<Orca> {
  const response = await fetch('/api/orcas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create orca');
  }

  return response.json();
}

export function useOrcas() {
  const queryClient = useQueryClient();
  const setIsSubmitting = useStore((state) => state.setIsSubmitting);

  // Query for fetching orcas
  const { data, isLoading, error } = useQuery<Orca[]>({
    queryKey: ['orcas'],
    queryFn: fetchOrcas,
  });

  // Mutation for creating a new orca
  const createOrcaMutation = useMutation({
    mutationFn: createOrca,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
    onSuccess: () => {
      // Invalidate and refetch orcas query
      queryClient.invalidateQueries({ queryKey: ['orcas'] });
    },
  });

  return {
    orcas: data ?? [],
    isLoading,
    error,
    createOrca: createOrcaMutation.mutateAsync,
    isCreating: createOrcaMutation.isPending,
    createError: createOrcaMutation.error,
  };
} 