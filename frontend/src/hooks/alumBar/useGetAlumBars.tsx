import { useEffect, useState } from 'react';
import type { AlumBar } from '../../types/app';
import { useAxios } from '../../api/axios';
import { getAlumBr } from '../../services/alumBrs/alumbarService';

export function useGetAlumBars() {
  const [alumBars, setalumBars] = useState<AlumBar[]>([]);
  const [alumbarLoading, setAlumbarLoading] = useState(true);
  const [next, setNext] = useState<string | null>(
    `${import.meta.env.VITE_API_URL}/profile-aluminums/?page=1`
  );
  const [refresh, setRefresh] = useState<boolean>(true);
  const axios = useAxios();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!next) return;

      setAlumbarLoading(true);
      try {
        const data = await getAlumBr(axios, next);
        setalumBars((prev) => [...prev, ...data.results]);
        setNext(data.next);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setAlumbarLoading(false);
        setRefresh(false); 
      }
    };

     fetchPosts();
  }, [refresh, next, axios]);

  return { alumBars, alumbarLoading, next, setRefresh };
}
