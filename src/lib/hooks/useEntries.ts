import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Entry, entrySchema } from '../supabase/types';
import { useStore } from '../store/useStore';

export function useEntries() {
  return useQuery<Entry[]>({
    queryKey: ['entries'],
    queryFn: async () => {
      const response = await fetch('/api/entries');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch entries');
      }
      const data = await response.json();
      return data.map((entry: unknown) => entrySchema.parse(entry));
    },
  });
}

export function useEntriesByOrca(orcaId: string) {
  return useQuery<Entry[]>({
    queryKey: ['entries', 'orca', orcaId],
    queryFn: async () => {
      const response = await fetch(`/api/entries?orca=${encodeURIComponent(orcaId)}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch entries');
      }
      const data = await response.json();
      return data.map((entry: unknown) => entrySchema.parse(entry));
    },
    enabled: Boolean(orcaId), // Only run the query if orcaId is provided
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();
  const setIsSubmitting = useStore((state) => state.setIsSubmitting);

  return useMutation({
    mutationFn: async (entry: {
      name: string;
      company: string;
      orcaId: string;
      location: string;
      message: string;
      photo: File;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    }) => {
      const formData = new FormData();
      formData.append('name', entry.name);
      formData.append('company', entry.company);
      formData.append('orcaId', entry.orcaId);
      formData.append('location', entry.location);
      formData.append('message', entry.message);
      formData.append('photo', entry.photo);
      formData.append('latitude', entry.coordinates.latitude.toString());
      formData.append('longitude', entry.coordinates.longitude.toString());

      const response = await fetch('/api/entries', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create entry');
      }

      const data = await response.json();
      return entrySchema.parse(data);
    },
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ['entries'] });
    },
  });
}

export function useEntryCountByOrca(orcaId: string) {
  return useQuery<number>({
    queryKey: ['entries', 'count', 'orca', orcaId],
    queryFn: async () => {
      const response = await fetch(`/api/entries/count?orca=${encodeURIComponent(orcaId)}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch entry count');
      }
      const data = await response.json();
      return data.count;
    },
    enabled: Boolean(orcaId), // Only run the query if orcaId is provided
  });
} 