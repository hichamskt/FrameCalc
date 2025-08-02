import { useState, useEffect } from 'react';

import type {ResultItem } from '../../types/app';
import { getUserCompany } from '../../services/company/companyService';
import { useAxios } from '../../api/axios';

export const useUserCompany = () => {
  const [data, setData] = useState<ResultItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasCompany,setHasCompany]=useState<boolean>(false);

const axios = useAxios();
  

  useEffect(() => {
    const fetchUserCompany = async () => {
      try {
        setLoading(true);
        const response = await getUserCompany(axios);
        setData(response?.results[0]);
        console.log(response)
        if(response.count)setHasCompany(response.count>0)
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCompany();
  }, [axios]);

  return { data, loading, error , hasCompany };
};
