import { useState } from 'react';
import { useAxios } from '../../api/axios';
import { deleteAlumBr } from '../../services/alumBrs/alumbarService';
import toast from 'react-hot-toast';
// adjust path

interface UseDeleteProfileResult {
  deleteAlumBarById: (id: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useDeleteAlumBar = (): UseDeleteProfileResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();
  const deleteAlumBarById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
       await deleteAlumBr(axios, id);
     
toast.success("Deleted successfully", {
 
  duration: 3000,
});    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error deleting profile:', err);
      setError(err?.message || 'Failed to delete profile');
    } finally {
      setLoading(false);
    }
  };

  return { deleteAlumBarById, loading, error };
};
