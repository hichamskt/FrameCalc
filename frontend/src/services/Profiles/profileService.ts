import type { ProfileAlum } from "../../types/app";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getProfiles = async (axios: any, url: string): Promise<{ results: ProfileAlum[]; next: string | null  ; previous : string | null}> => {
  const response = await axios.get(url);
  return response.data;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateProfile = async (axios: any, id: number , profile : ProfileAlum): Promise<{ results: ProfileAlum;}> => {
  const response = await axios.put(`/profiles/${id}/` , profile);
  return response.data;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deletProfile = async (axios: any, id: number ): Promise<{ results: ProfileAlum;}> => {
  const response = await axios.delete(`/profiles/${id}/` );
  return response.data;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createProfile = async (axios: any, data:{ 
    name: string,
    quality: string

} ): Promise<{ results: ProfileAlum;}> => {
  const response = await axios.delete(`/profiles/` , data);
  return response.data;
};