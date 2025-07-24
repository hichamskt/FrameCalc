// hooks/useSubtypes.ts
import { useState, useEffect } from "react";
import { getSubtypes as fetchSubtypes } from "../services/Subtype/Subtype";
import { useAxios } from "../api/axios";

export const useSubtypes = () => {
  const [subtypes, setSubtypes] = useState([]);
  const [loading, setLoading] = useState(false);
 const axios = useAxios();

  const loadSubtypes = async () => {
    setLoading(true);
    const data = await fetchSubtypes(axios);
    console.log("subtype:",data)
    setSubtypes(data.results);
    setLoading(false);
  };

  useEffect(() => {
    loadSubtypes();
  }, []);

  return { subtypes, loading };
};
