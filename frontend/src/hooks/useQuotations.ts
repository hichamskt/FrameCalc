// hooks/useQuotations.ts
import { useState, useCallback } from 'react';
import { useAxios } from '../api/axios';
import filterQuotations from '../services/Quotation/filterQuotations';
import type { Quotation, QuotationFilters } from '../types/app';

interface PaginationInfo {
  count: number;
  next: string | null;
  previous: string | null;
  totalResults: number;
}

export const useQuotations = () => {
  const axios = useAxios(); 
  const [loading, setLoading] = useState(false);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentFilters, setCurrentFilters] = useState<QuotationFilters>({});
  const [error, setError] = useState<string | null>(null);

  const filter = useCallback(async (filters: QuotationFilters) => {
    setLoading(true);
    try {
      
      const newFilters = { ...filters };
      setCurrentFilters(newFilters);
      
      const result = await filterQuotations(axios, newFilters); 

      if (result.success) {
        setQuotations([...result.quotations]);
        setPagination(result.pagination);
        setError(null);
       
      } else {
        setError(result.error || 'Failed to filter quotations');
        setPagination(null);
      }
      return result;
    } catch (err) {
      setError('An unexpected error occurred');
      setPagination(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

 
  const changePage = useCallback(async (page: number) => {
    const filtersWithPage = {
      ...currentFilters,
      page
    };
    return filter(filtersWithPage);
  }, [currentFilters, filter]);

  
  const changePageSize = useCallback(async (pageSize: number) => {
    const filtersWithPageSize = {
      ...currentFilters,
      page: 1, 
      pageSize
    };
    return filter(filtersWithPageSize);
  }, [currentFilters, filter]);

  return {
    quotations,
    loading,
    error,
    pagination,
    currentFilters,
    filter,
    changePage,
    changePageSize
  };
};