interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoffMultiplier?: number;
  exponentialBackoff?: boolean;
  retryableErrors?: string[];
  onRetry?: (attempt: number, error: Error, delay: number) => void;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoffMultiplier = 2,
    exponentialBackoff = false,
    retryableErrors = [],
    onRetry
  } = options;

  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      const isRetryable = retryableErrors.length === 0 || 
        retryableErrors.some(err => lastError.message.includes(err));
      
      // If this was the last attempt or error is not retryable, throw the error
      if (attempt === maxRetries || !isRetryable) {
        throw lastError;
      }
      
      // Calculate delay for next attempt
      const nextDelay = exponentialBackoff 
        ? delay * Math.pow(backoffMultiplier, attempt)
        : delay;
      
      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt + 1, lastError, nextDelay);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, nextDelay));
    }
  }
  
  throw lastError!;
}

// Specialized retry function for database operations
export async function withDatabaseRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const dbRetryOptions: RetryOptions = {
    maxRetries: 3,
    delay: 1000,
    backoffMultiplier: 2,
    exponentialBackoff: true,
    retryableErrors: [
      "Connection terminated",
      "Connection refused",
      "timeout",
      "ENOTFOUND",
      "ECONNREFUSED",
      "ECONNRESET"
    ],
    ...options
  };
  
  return withRetry(fn, dbRetryOptions);
}

// Specialized retry function for network operations
export async function withNetworkRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const networkRetryOptions: RetryOptions = {
    maxRetries: 3,
    delay: 1000,
    backoffMultiplier: 2,
    exponentialBackoff: true,
    retryableErrors: [
      "Network Error",
      "timeout",
      "ECONNREFUSED",
      "ECONNRESET",
      "ENOTFOUND",
      "Failed to fetch",
      "Network response was not ok"
    ],
    ...options
  };
  
  return withRetry(fn, networkRetryOptions);
}
