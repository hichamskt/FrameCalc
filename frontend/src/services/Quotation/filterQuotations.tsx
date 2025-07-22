/* eslint-disable @typescript-eslint/no-explicit-any */
// filterQuotations.ts
import type { FilterQuotationsResult, QuotationApiResponse, QuotationFilters } from "../../types/app";

export const filterQuotations = async (
  axios: any, // You can also type it more strictly if needed
  filters: QuotationFilters = {}
): Promise<FilterQuotationsResult> => {

  try {
    const params = new URLSearchParams();
    
    if (filters.subtype) params.append('subtype', filters.subtype);
    if (filters.priceMin !== undefined) params.append('price_min', filters.priceMin.toString());
    if (filters.priceMax !== undefined) params.append('price_max', filters.priceMax.toString());
    if (filters.widthMin !== undefined) params.append('width_min', filters.widthMin.toString());
    if (filters.widthMax !== undefined) params.append('width_max', filters.widthMax.toString());
    if (filters.heightMin !== undefined) params.append('height_min', filters.heightMin.toString());
    if (filters.heightMax !== undefined) params.append('height_max', filters.heightMax.toString());
    if (filters.dateFrom) params.append('date_from', filters.dateFrom);
    if (filters.dateTo) params.append('date_to', filters.dateTo);
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.pageSize !== undefined) params.append('page_size', filters.pageSize.toString());
    if (filters.ordering) params.append('ordering', filters.ordering);

    const response = await axios.get(`/quotations/filter/?${params.toString()}`) as { data: QuotationApiResponse };


    return {
      success: true,
      data: response.data,
      quotations: response.data.results,
      pagination: {
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        totalResults: response.data.total_results
      },
      filtersApplied: response.data.filters_applied
    };

  } catch (error: any) {
    console.error('Error filtering quotations:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      quotations: [],
      pagination: null
    };
  }
};

export default filterQuotations;
