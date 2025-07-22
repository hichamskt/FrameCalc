import { useState, useCallback } from 'react';
import { useAxios } from '../api/axios';
import filterQuotations from '../services/Quotation/filterQuotations';
import type { Quotation, QuotationFilters } from '../types/app';

export const useQuotations = () => {
  const axios = useAxios(); 
  const [loading, setLoading] = useState(false);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const [error, setError] = useState<string | null>(null);

  const filter = useCallback(async (filters: QuotationFilters) => {
    setLoading(true);
    try {
      const result = await filterQuotations(axios, filters); 

      
      if (result.success) {
        setQuotations([...result.quotations]); // forces React to treat it as new

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
