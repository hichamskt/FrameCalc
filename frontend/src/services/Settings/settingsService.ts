import type {  SettingsUser } from "../../types/app";




export const UpdateUserProfile = async (
  axios: any,
  data: SettingsUser
): Promise<SettingsUser> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  const response = await axios.patch("/profile/", formData);
  return response.data;
};
