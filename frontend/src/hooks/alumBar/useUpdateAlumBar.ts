// hooks/useUpdateCompany.ts
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAxios } from '../../api/axios';
import type { AlumBar} from '../../types/app';
import { updateAlumBr } from '../../services/alumBrs/alumbarService';



export const useUpdateAlumBar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ [key: string]: string } | null>(null);
  const axios = useAxios();

  const handleUpdate = async (
    data: AlumBar , id :number
  ): Promise<AlumBar | null> => {
    try {
      setLoading(true);
      setError(null);

      const updatedAlumBar = await updateAlumBr(axios, id, data);
      toast.success('Updated successfully');
      console.log("up",updatedAlumBar)
      return updatedAlumBar.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const apiError = err.response?.data ?? { message: 'Something went wrong' };
      setError(apiError);
      console.error(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdate, loading, error };
};
