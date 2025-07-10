import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError } from '../../lib/api';
import { isSupabaseConfigured } from '../../lib/supabase';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  dependencies?: any[];
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & {
  execute: () => Promise<void>;
  refetch: () => Promise<void>;
  clearError: () => void;
} {
  const { immediate = true, dependencies = [] } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  // Use useRef to store the latest apiCall function
  const apiCallRef = useRef(apiCall);
  apiCallRef.current = apiCall;

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiCallRef.current();
      setState({ data, loading: false, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'An unknown error occurred';

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  }, []);

  const refetch = useCallback(async () => {
    await execute();
  }, [execute]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute, ...dependencies]);

  return {
    ...state,
    execute,
    refetch,
    clearError
  };
}

// Specialized hooks for common API patterns
export function useCompany(companyId: string | null) {
  return useApi(
    async () => {
      if (!companyId) throw new Error('Company ID is required');
      const response = await fetch(`/api/companies/${companyId}`);
      if (!response.ok) throw new Error('Failed to fetch company');
      return response.json();
    },
    { immediate: !!companyId, dependencies: [companyId] }
  );
}

export function useTasks(companyId: string | null, status?: string) {
  return useApi(
    async () => {
      if (!companyId) throw new Error('Company ID is required');
      const params = new URLSearchParams({ companyId });
      if (status) params.append('status', status);
      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    },
    { immediate: !!companyId, dependencies: [companyId, status] }
  );
}

export function useFinancialRecords(companyId: string | null) {
  return useApi(
    async () => {
      if (!companyId) throw new Error('Company ID is required');
      const params = new URLSearchParams({ companyId });
      const response = await fetch(`/api/financial?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch financial records');
      return response.json();
    },
    { immediate: !!companyId, dependencies: [companyId] }
  );
}

export function useDashboardOverview(companyId: string | null) {
  return useApi(
    async () => {
      if (!companyId) throw new Error('Company ID is required');
      const params = new URLSearchParams({ companyId });
      const response = await fetch(
        `/api/dashboard/overview?${params.toString()}`
      );
      if (!response.ok) throw new Error('Failed to fetch dashboard overview');
      return response.json();
    },
    { immediate: !!companyId, dependencies: [companyId] }
  );
}

// Mutation hooks for data updates
export function useCreateTask() {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false
  });

  const createTask = useCallback(async (taskData: any) => {
    setState({ loading: true, error: null, success: false });

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create task');
      }

      setState({ loading: false, error: null, success: true });
      return await response.json();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setState({ loading: false, error: errorMessage, success: false });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return { ...state, createTask, reset };
}

export function useUpdateTask() {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false
  });

  const updateTask = useCallback(async (taskId: string, updates: any) => {
    setState({ loading: true, error: null, success: false });

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update task');
      }

      setState({ loading: false, error: null, success: true });
      return await response.json();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setState({ loading: false, error: errorMessage, success: false });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return { ...state, updateTask, reset };
}

export function useUpdateCompany() {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false
  });

  const updateCompany = useCallback(async (companyId: string, updates: any) => {
    setState({ loading: true, error: null, success: false });

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update company');
      }

      setState({ loading: false, error: null, success: true });
      return await response.json();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setState({ loading: false, error: errorMessage, success: false });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return { ...state, updateCompany, reset };
}
