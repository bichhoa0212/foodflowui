'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchResults from '@/components/SearchResults';
import { publicAPI } from '@/lib/publicApi';

interface Product {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  purchaseCount?: number;
  reviewCount?: number;
  discountType?: string;
  discountValue?: number;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    } else {
      setProducts([]);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await publicAPI.searchProducts(searchTerm);
      if (response.data && response.data.data) {
        setProducts(response.data.data);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <SearchResults
      products={products}
      searchTerm={query}
      loading={loading}
      onBackToHome={handleBackToHome}
    />
  );
};

export default SearchPage; 