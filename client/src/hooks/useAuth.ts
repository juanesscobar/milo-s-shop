import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  isGuest: boolean;
  createdAt: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  // Get current authenticated user
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/auth/logout", "POST");
    },
    onSuccess: () => {
      queryClient.clear();
      queryClient.invalidateQueries();
    },
  });

  const isAuthenticated = !!user && !error;
  const isAdmin = user?.user?.role === 'admin' || user?.user?.role === 'operator';
  const isClient = user?.user?.role === 'client';

  return {
    user: user?.user as User | undefined,
    isLoading,
    isAuthenticated,
    isAdmin,
    isClient,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}