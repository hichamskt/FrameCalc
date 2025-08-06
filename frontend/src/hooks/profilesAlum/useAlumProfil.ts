import { useEffect, useState } from 'react';

import type {  ProfileAlum } from '../../types/app';
import { useAxios } from '../../api/axios';
import { getProfiles } from '../../services/Profiles/profileService';

export function useAlumProfil() {
  const [allprofiles, setAllprofiles] = useState<ProfileAlum[]>([]);
  const [ProfileLoading, setProfileLoading] = useState(true);
  const [next, setNext] = useState<string | null>(
    `${import.meta.env.VITE_API_URL}/profiles/?page=1`
  );
  const [previous,setPrevious]= useState<string | null >();
  const axios = useAxios();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!next) return;

      setProfileLoading(true);
      try {
        const data = await getProfiles(axios, next);
        setAllprofiles((prev) => {
  const existingIds = new Set(prev.map((profile) => profile.profile_id));
  const newProfiles = data.results.filter((profile) => !existingIds.has(profile.profile_id));
  return [...prev, ...newProfiles];
});

        setNext(data.next);
        setPrevious(data.previous)
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setProfileLoading(false);
       
      }
    };
fetchPosts();
   
  }, [axios, next]);

  return { allprofiles, ProfileLoading, next , previous };
}
