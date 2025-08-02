import type { ApiResponse } from "../../types/app";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserCompany = async (axios: any): Promise<ApiResponse> => {
  const response = await axios.get('/companies/');
  return response.data;
};