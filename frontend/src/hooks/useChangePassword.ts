import { useState } from 'react';
import { useAxios } from '../api/axios';
import { changePassword } from '../services/Settings/settingsService';
import toast from 'react-hot-toast';


export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const axios = useAxios();

  const submit = async (old_password: string, new_password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await changePassword(axios, {old_password , new_password });
      toast.success("password upadted successduly")
      setSuccess(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data.error || 'Password change failed');
  
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, success };
};
