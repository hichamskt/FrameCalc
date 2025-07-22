

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSubtypes = async (axios: any) => {
  const response = await axios.get("/structure-subtypes/");
  return response.data;
};
