import type { ApiResponse, SettingsCompany } from "../../types/app";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserCompany = async (axios: any): Promise<ApiResponse> => {
  const response = await axios.get('/companies/');
  return response.data;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UpdateCompany = async (axios: any, id:number,companyInfo: {
  name:string,
  supply_type_ids:number[],
}): Promise<SettingsCompany> => {
  const response = await axios.patch(`/companies/${id}/`,companyInfo);
  return response.data;
};