import { useState } from 'react';

export function useAsyncFetch<T>() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (apiCall: () => Promise<T>) => {
        try {
            setLoading(true);
            setError(null);

            const result = await apiCall();

            setData(result);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Something went wrong!';
            setError(message);

            console.error('Async fetch error:', error);
            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        data,
        loading,
        error,
        execute,
    }
}