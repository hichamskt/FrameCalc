// hooks/useUpdateCompany.ts
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAxios } from '../../api/axios';
import { UpdateCompany } from '../../services/company/companyService';
import type { SettingsCompany } from '../../types/app';

interface UpdateCompanyData {
  name: string;
  supply_type_ids: number[];
  user:string
}

export const useUpdateCompany = (url: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ [key: string]: string } | null>(null);
  const axios = useAxios();

  const handleUpdate = async (
    data: UpdateCompanyData
  ): Promise<SettingsCompany | null> => {
    try {
      setLoading(true);
      setError(null);

      const updatedUser = await UpdateCompany(axios, url, data);
      toast.success('Updated successfully');
      console.log("up",updatedUser)
      return updatedUser;
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
