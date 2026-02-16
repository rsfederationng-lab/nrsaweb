import { QueryClient } from "@tanstack/react-query";

const API_BASE = "";

function buildUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  const base = API_BASE.replace(/\/$/, "");
  return base + (url.startsWith("/") ? url : "/" + url);
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("adminToken");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const authHeaders = getAuthHeaders();
  const headers = {
    "Content-Type": "application/json",
    ...authHeaders,
  };

  const fullUrl = buildUrl(url);

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    cache: "no-store", // Prevent browser caching of API requests
  });

  return res;
}

const defaultQueryFn = async ({ queryKey }: { queryKey: readonly unknown[] }): Promise<any> => {
  let url = buildUrl(queryKey[0] as string);
  const params = queryKey[1];

  if (params && typeof params === "object") {
    const searchParams = new URLSearchParams();
    Object.entries(params as Record<string, any>).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    if (searchParams.toString()) {
      url += (url.includes("?") ? "&" : "?") + searchParams.toString();
    }
  }

  const authHeaders = getAuthHeaders();
  const res = await fetch(url, {
    headers: authHeaders,
    credentials: "include",
    cache: "no-store", // Prevent browser caching of query requests
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      // Optional: redirect to login or handle auth error
    }
    throw new Error(`${res.status}: ${res.statusText}`);
  }
  return res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function forceRefresh(queryKeys?: string[], client?: QueryClient) {
  const targetClient = client || queryClient;
  if (queryKeys && queryKeys.length > 0) {
    queryKeys.forEach(key => {
      targetClient.invalidateQueries({ queryKey: [key] });
      targetClient.refetchQueries({ queryKey: [key] });
    });
  } else {
    targetClient.invalidateQueries();
    targetClient.refetchQueries();
  }
}