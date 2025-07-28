import { useEffect, useState } from 'react';

import { useAxios } from '../../api/axios';
import { getNotification } from '../../services/Notifications/NotificationService';
import type {   AppNotification } from '../../types/app';

export function UseNotification() {
  const [notif, setnotif] = useState< AppNotification[]>([]);
  const [Loading, setLoading] = useState(true);
  const [next, setNext] = useState<string | null>(
    `${import.meta.env.VITE_API_URL}/notifications/?page=1`
  );
  const [refresh, setRefresh] = useState<boolean>(true); 
  const axios = useAxios();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!next) return;

      setLoading(true);
      try {
        const data = await getNotification(axios, next);
        const newNotifications:  AppNotification[] = data.results;
        setnotif(prev => [...prev ,...newNotifications]);

        setNext(data.next);

      } catch (error) {
        console.error('Failed to load notif:', error);
      } finally {
        setLoading(false);
        setRefresh(false); 
      }
    };

     fetchNotifications();
  }, [refresh]);

  return { notif, Loading, next, setRefresh , setLoading};
}
