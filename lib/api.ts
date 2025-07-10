// API utility functions for making requests to our backend

const API_BASE = '/api';

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Company API functions
export const companyApi = {
  getAll: () => apiCall<any[]>('/companies'),

  getById: (id: string) => apiCall<any>(`/companies/${id}`),

  create: (data: any) =>
    apiCall<any>('/companies', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id: string, data: any) =>
    apiCall<any>(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id: string) =>
    apiCall<{ message: string }>(`/companies/${id}`, {
      method: 'DELETE'
    })
};

// Task API functions
export const taskApi = {
  getByCompany: (companyId: string, status?: string) => {
    const params = new URLSearchParams({ companyId });
    if (status) params.append('status', status);
    return apiCall<any[]>(`/tasks?${params.toString()}`);
  },

  getById: (id: string) => apiCall<any>(`/tasks/${id}`),

  create: (data: any) =>
    apiCall<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id: string, data: any) =>
    apiCall<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id: string) =>
    apiCall<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE'
    })
};

// Financial API functions
export const financialApi = {
  getByCompany: (companyId: string) => {
    const params = new URLSearchParams({ companyId });
    return apiCall<any[]>(`/financial?${params.toString()}`);
  },

  getSummary: (companyId: string) => {
    const params = new URLSearchParams({ companyId, summary: 'true' });
    return apiCall<any>(`/financial?${params.toString()}`);
  },

  create: (data: any) =>
    apiCall<any>('/financial', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};

// Document API functions (placeholder - will be implemented with file upload)
export const documentApi = {
  getByCompany: (companyId: string) => {
    const params = new URLSearchParams({ companyId });
    return apiCall<any[]>(`/documents?${params.toString()}`);
  },

  upload: (data: FormData) =>
    fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: data
    }).then((res) => res.json()),

  delete: (id: string) =>
    apiCall<{ message: string }>(`/documents/${id}`, {
      method: 'DELETE'
    })
};

// Message API functions (placeholder - will be implemented)
export const messageApi = {
  getByCompany: (companyId: string) => {
    const params = new URLSearchParams({ companyId });
    return apiCall<any[]>(`/messages?${params.toString()}`);
  },

  send: (data: any) =>
    apiCall<any>('/messages', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  markAsRead: (id: string) =>
    apiCall<any>(`/messages/${id}/read`, {
      method: 'PUT'
    })
};

// Dashboard API functions for aggregated data
export const dashboardApi = {
  getOverview: (companyId: string) => {
    const params = new URLSearchParams({ companyId });
    return apiCall<any>(`/dashboard/overview?${params.toString()}`);
  },

  getStats: (companyId: string) => {
    const params = new URLSearchParams({ companyId });
    return apiCall<any>(`/dashboard/stats?${params.toString()}`);
  }
};

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Enhanced API call with better error handling
export async function apiCallWithErrorHandling<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    return await apiCall<T>(endpoint, options);
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(error.message, 500);
    }
    throw new ApiError('Unknown error occurred', 500);
  }
}
