import { useEffect, useState } from 'react';

const useFetch = (url: string, opts?: any): Array<any> => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch(url, opts)
      .then(async (res) => {
        const result = await res.json();
        setResponse(result);
        setLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setLoading(false);
      });
  }, [opts, url]);
  return [response, loading, hasError];
};

export default useFetch;
