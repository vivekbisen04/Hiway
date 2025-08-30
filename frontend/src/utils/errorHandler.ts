import type { AxiosError } from '../types';

export const getErrorMessage = (error: unknown, defaultMessage = 'An error occurred'): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.data?.error || axiosError.message || defaultMessage;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return defaultMessage;
};