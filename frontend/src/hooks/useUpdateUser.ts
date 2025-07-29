// hooks/useUpdateUser.ts
import { useState } from 'react';


import { UpdateUserProfile } from '../services/Settings/settingsService';
import type { SettingsUser } from '../types/app';
import { useAxios } from '../api/axios';

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();

  const handleUpdate = async ( data: SettingsUser): Promise<SettingsUser | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await UpdateUserProfile(axios,data);
      console.log("data");
      return updatedUser;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdate, loading, error };
};
