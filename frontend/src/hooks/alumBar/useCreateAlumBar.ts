/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef } from "react";

import { useAxios } from "../../api/axios";
import type { AlumBar } from "../../types/app";
import { createAlumBr } from "../../services/alumBrs/alumbarService";

export const useCreateAlumBar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newAlumBar, setNewAlumBar] = useState<AlumBar>();

  const isMounted = useRef(true);
  const axios = useAxios();

  const createAlumBar = async (data: AlumBar) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createAlumBr(axios, data);
      console.log("resopnde", response);
    console.log('dtat:',response.data)
      setNewAlumBar(response.data);

      return response;
    } catch (err: any) {
      if (isMounted.current) {
        setError(
          err.response?.data?.message || err.message || "Error creating profile"
        );
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createAlumBar, loading, error, newAlumBar };
};
