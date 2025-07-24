// hooks/useUser.ts
import { useState, useEffect } from "react";
import { getUser } from "../services/User/user";
import { useAxios } from "../api/axios";
import type { UserProfile } from "../types/app"; // adjust the import to your project structure
// adjust the import to your project structure

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null); // or array if it's a list
  const [userLoading, setUserLoading] = useState(false);
  const axios = useAxios();

  const loadProfile = async () => {
    try {
      setUserLoading(true);
      const data = await getUser(axios);
      console.log("user1aa:", data);
   if (data?.user_id) {
  setUser({
    user_id: data.user_id,
    email: data.email,
    username: data.username,
    profile_image: data.profile_image,
    profile_image_url: data.profile_image_url,
  });
} else {
  console.warn("No valid user data found.");
  setUser(null);
}

    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return { user, userLoading };
};
