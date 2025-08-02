import type { SettingsUser } from "../../types/app";




export const UpdateUserProfile = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axios: any,
  data: SettingsUser
): Promise<SettingsUser> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as Blob | string);
    }
  });

 
 

  const response = await axios.patch("/profile/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
export const changePassword = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axios: any,
  data:{
    old_password:string;
    new_password: string
  }
): Promise<string> => {
  const response = await axios.post("/change-password/", data
  );

  return response.data;
};

