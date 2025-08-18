// client/src/queryClient.ts

import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const errorJson = await res.json();
      errorMessage = errorJson.message || res.statusText;
    } catch (e) {
      const text = await res.text();
      errorMessage = text || res.statusText;
    }
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // 1. Get the authentication token from localStorage
  const token = localStorage.getItem('authToken'); // ❗ Ensure 'authToken' is the correct key!

  const headers: HeadersInit = {};

  if (data) {
    headers["Content-Type"] = "application/json";
  }

  // 2. Add Authorization header if a token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // <-- THIS IS THE CRUCIAL LINE!
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  // 3. Add global 401 Unauthorized handling
  if (res.status === 401) {
    localStorage.removeItem('authToken');
    // window.location.href = '/admin/login'; // Recommended redirect
    throw new Error("401: Unauthorized. Please log in again.");
  }

  await throwIfResNotOk(res);
  return res;
}

// This part also needs the token!
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(queryKey.join("/") as string, {
        headers,
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        localStorage.removeItem('authToken');
        // window.location.href = '/admin/login';
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };
  
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }), // This means 401s from react-query will throw
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

