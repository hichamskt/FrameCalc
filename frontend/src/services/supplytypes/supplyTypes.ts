

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSupplieType = async (axios: any) => {
  const response = await axios.get("/supply-types/");
  return response.data;
};
    