import { useState, useCallback } from 'react';
import { useAxios } from '../api/axios';
import filterQuotations from '../services/Quotation/filterQuotations';
import type { QuotationFilters } from '../types/app';

export const useQuotations = () => {
  const axios = useAxios(); // ✅ Now safe
  const [loading, setLoading] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const filter = useCallback(async (filters: QuotationFilters) => {
    setLoading(true);
    try {
      const result = await filterQuotations(axios, filters); // Pass axios here
      if (result.success) {
        setQuotations(result.quotations);
        setError(null);
        console.log('filterddata:',result.quotations)
      } else {
        setError(result.error || 'Failed to filter quotations');
      }
      return result;
    } catch (err) {
      setError('An unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axios]);

  return {
    quotations,
    loading,
    error,
    filter
  };
};
