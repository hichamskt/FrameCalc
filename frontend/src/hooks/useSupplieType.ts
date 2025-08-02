// hooks/useSubtypes.ts
import { useState, useEffect } from "react";

import { useAxios } from "../api/axios";
import { getSupplieType } from "../services/supplytypes/supplyTypes";

export const useSupplieType = () => {
  const [supplieType, setSupplieType] = useState([]);
  const [loading, setLoading] = useState(false);
 const axios = useAxios();

 

  useEffect(() => {
     const loadSubtypes = async () => {
    setLoading(true);
    const data = await getSupplieType(axios);
    
    setSupplieType(data);
    setLoading(false);
  };

    loadSubtypes();
  }, [axios]);

  return { supplieType, loading };
};
