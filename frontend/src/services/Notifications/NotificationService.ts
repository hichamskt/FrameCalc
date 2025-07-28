import type { AppNotification } from "../../types/app";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNotification = async (axios: any, url: string): Promise<{ results:  AppNotification[]; next: string | null }> => {
  const response = await axios.get(url);
  return response.data;
};



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clearNotification = async (axios: any): Promise<void> => {
  await axios.delete("/notifications/delete-all/");
};
