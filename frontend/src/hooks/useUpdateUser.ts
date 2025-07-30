// hooks/useUpdateUser.ts
import { useState } from 'react';


import { UpdateUserProfile } from '../services/Settings/settingsService';
import type { SettingsUser } from '../types/app';
import { useAxios } from '../api/axios';
import toast from 'react-hot-toast';

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ [key: string]: string }>();
  const axios = useAxios();
  

  const handleUpdate = async ( data: SettingsUser): Promise<SettingsUser | null> => {
    try {
      setLoading(true);
      setError({});
      const updatedUser = await UpdateUserProfile(axios,data);
      console.log("data1",data);
      toast.success('Updated successfuly')
      return updatedUser;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data);
      console.log(err.response?.data)
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdate, loading, error };
};
