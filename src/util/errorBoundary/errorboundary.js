import { useEffect, useState } from "react";

export function useErrorBoundary() {
    const [hasError, setHasError] = useState(false);
  
    useEffect(() => {
      const handleError = () => setHasError(true);
  
      window.addEventListener('error', handleError);
  
      return () => {
        window.removeEventListener('error', handleError);
      };
    }, []);
  
    return hasError;
  }