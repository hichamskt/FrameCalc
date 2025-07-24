

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUser = async (axios: any) => {
  const response = await axios.get("/profile/");
  return response.data;
};
