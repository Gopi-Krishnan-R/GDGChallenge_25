import { useState } from 'react';

export const useRouter = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [params, setParams] = useState({});

  const navigate = (page, newParams = {}) => {
    setCurrentPage(page);
    setParams(newParams);
  };

  return { currentPage, params, navigate };
};
