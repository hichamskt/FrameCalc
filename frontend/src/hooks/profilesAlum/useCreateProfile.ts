/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef } from "react";

import { useAxios } from "../../api/axios";
import { createProfile } from "../../services/Profiles/profileService";
import type { ProfileAlum } from "../../types/app";

export const useCreateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newProfile, setNewProfile] = useState<ProfileAlum>();

  const isMounted = useRef(true);
const axios = useAxios();
 

  const createNewProfile = async (data: {
     name: string,
    quality:string
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createProfile(axios,data);
      console.log('resopnde',response)
    
        setNewProfile(response.data);
   
      return response;
    } catch (err: any) {
      if (isMounted.current) {
        setError(err.response?.data?.message || err.message || "Error creating profile");
      }
      throw err;
    } finally {
      
        setLoading(false);
      
    }
  };

  return { createNewProfile, loading, error, newProfile };
};
