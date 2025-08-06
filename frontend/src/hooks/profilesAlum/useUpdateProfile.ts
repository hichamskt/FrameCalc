// hooks/useUpdateUser.ts
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAxios } from '../../api/axios';
import type { ProfileAlum } from '../../types/app';
import { updateProfile } from '../../services/Profiles/profileService';



export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ [key: string]: string }>();
  const axios = useAxios();

  const handleUpdate = async (data: ProfileAlum , userid:number): Promise<ProfileAlum | null> => {
    try {
      setLoading(true);
      setError({});
      const updatedUser = await updateProfile(axios, userid, data);
      console.log("Updated data:", updatedUser);
      toast.success('Updated successfully');
      return updatedUser.results;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const responseError = err.response?.data;
      setError(responseError);
      console.error("Update error:", responseError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdate, loading, error };
};
