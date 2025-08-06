import { useState } from 'react';
import type { ProfileAlum } from '../../types/app'; // adjust path as needed
import { deletProfile } from '../../services/Profiles/profileService';
import { useAxios } from '../../api/axios';
// adjust path

interface UseDeleteProfileResult {
  deleteProfileById: (id: number) => Promise<void>;
  deletedProfile: ProfileAlum | null;
  loading: boolean;
  error: string | null;
}

export const useDeleteProfile = (): UseDeleteProfileResult => {
  const [deletedProfile, setDeletedProfile] = useState<ProfileAlum | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();
  const deleteProfileById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await deletProfile(axios, id);
     
      setDeletedProfile(response.results);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error deleting profile:', err);
      setError(err?.message || 'Failed to delete profile');
    } finally {
      setLoading(false);
    }
  };

  return { deleteProfileById, deletedProfile, loading, error };
};
