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
  const { data: userData, isLoading, error } = useQuery<{ user: User } | null>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log('🔐 useAuth: Estado actual - user:', userData?.user, 'isLoading:', isLoading, 'error:', error);
  console.log('🔐 useAuth: isAuthenticated:', !!userData?.user && !error);

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

  const isAuthenticated = !!userData?.user && !error;
  const isAdmin = userData?.user?.role === 'admin' || userData?.user?.role === 'operator';
  const isClient = userData?.user?.role === 'client';

  return {
    user: userData?.user as User | undefined,
    isLoading,
    isAuthenticated,
    isAdmin,
    isClient,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}