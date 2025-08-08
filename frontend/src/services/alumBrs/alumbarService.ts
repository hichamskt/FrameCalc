import type { AlumBar } from "../../types/app";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAlumBr = async (axios: any, url: string): Promise<{ results: AlumBar[]; next: string | null }> => {
  const response = await axios.get(url);
  return response.data;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateAlumBr = async (axios: any ,id:number  , data:AlumBar): Promise<{ data: AlumBar }> => {
  const response = await axios.put(`profile-aluminums/${id}/`,data);
  return response;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const daleteAlumBr = async (axios: any ,id:number  ): Promise<{ results: AlumBar[] }> => {
  const response = await axios.delete(`profile-aluminums/${id}/`);
  return response;
};

